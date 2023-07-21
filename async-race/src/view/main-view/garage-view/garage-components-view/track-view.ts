import { View, ViewParams } from '../../../view';
import { ElementCreator, ElementParams } from '../../../../util/element-creator';
import carSvg from '../../../../assets/car.svg';
import finishSvg from '../../../../assets/finish.svg';
import { ApiHandler } from '../../../../api-handler/api-handler';
import { Popup } from '../../../../util/popup';

export interface WinnerData {
  id: number;
  name: string;
  bestTime: number;
  winsCount: number;
  color: string;
}

enum CssClasses {
  carParams = 'car-params',
  carControls = 'car-params__controls',
  carButton = 'car-params__button',
  carName = 'car-params__name',
  track = 'track',
  trackControls = 'track__controls',
  trackButton = 'track__button',
  trackCar = 'track__car',
  trackFinish = 'track__finish',
}

export class TrackView extends View {
  public static instances: TrackView[] = [];

  public static onRemove: (() => void) | null = null;

  public id: number = 0;

  public name: string;

  public color: string;

  private run: boolean;

  private runTime: number | null = null;

  public carImg: HTMLElement | null = null;

  public finishImg: HTMLElement | null = null;

  public nameEl: ElementCreator | null = null;

  public trackButtonA: ElementCreator | null = null;

  public trackButtonB: ElementCreator | null = null;

  public removeBtn: ElementCreator | null = null;

  public selectBtn: ElementCreator | null = null;

  constructor(name: string, color: string, id?: number) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [],
    };
    super(params);

    if (id) {
      this.id = id;
    } else {
      ApiHandler.createCar(name, color).then((data) => {
        this.id = data;
      });
    }

    this.run = false;
    this.name = name;
    this.color = color;
    this.configureView();
    TrackView.instances.push(this);
  }

  private onSelectCallback: ((name: string, color: string) => void) | null = null;

  public configureView(): void {
    const carParamsParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carParams],
    };
    const carParams = new ElementCreator(carParamsParams);
    this.viewElementCreator.addInnerElement(carParams);

    const carControlsParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carControls],
    };
    const carControls = new ElementCreator(carControlsParams);
    carParams.addInnerElement(carControls);

    const carButtonSelectParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.carButton],
      textContent: 'Select',
      type: 'button',
    };
    this.selectBtn = new ElementCreator(carButtonSelectParams);
    this.selectBtn.setCallback(() => {
      if (this.onSelectCallback) {
        this.onSelectCallback(this.name, this.color);
      }
    });
    carControls.addInnerElement(this.selectBtn);

    const carButtonRemoveParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.carButton],
      textContent: 'Remove',
      type: 'button',
    };
    this.removeBtn = new ElementCreator(carButtonRemoveParams);
    this.removeBtn.setCallback(this.removeCar.bind(this));
    carControls.addInnerElement(this.removeBtn);

    const carNameParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carName],
      textContent: this.name,
    };
    this.nameEl = new ElementCreator(carNameParams);
    carParams.addInnerElement(this.nameEl);

    const trackParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.track],
    };
    const track = new ElementCreator(trackParams);
    this.viewElementCreator.addInnerElement(track);

    const trackControlsParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.trackControls],
    };
    const trackControls = new ElementCreator(trackControlsParams);
    track.addInnerElement(trackControls);

    const trackButtonAParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.trackButton],
      textContent: 'A',
      type: 'button',
    };
    this.trackButtonA = new ElementCreator(trackButtonAParams);
    this.trackButtonA.setCallback(async () => {
      try {
        this.trackButtonA?.toggleDisableElement(true);
        await this.go();
      } catch {
        console.log('Car stopped or broken');
      }
    });
    trackControls.addInnerElement(this.trackButtonA);

    const trackButtonBParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.trackButton],
      textContent: 'B',
      type: 'button',
    };
    this.trackButtonB = new ElementCreator(trackButtonBParams);
    this.trackButtonB.setCallback(async () => {
      try {
        await this.resetPosition();
      } finally {
        this.trackButtonA?.toggleDisableElement(false);
      }
    });
    this.trackButtonB.toggleDisableElement(true);
    trackControls.addInnerElement(this.trackButtonB);

    this.carImg = this.getSVGElement(carSvg, CssClasses.trackCar);
    this.carImg.style.color = this.color;
    track.addInnerElement(this.carImg);

    this.finishImg = this.getSVGElement(finishSvg, CssClasses.trackFinish);
    track.addInnerElement(this.finishImg);
  }

  public static getInstances(): TrackView[] {
    return TrackView.instances;
  }

  public setOnSelectCallback(callback: (name: string, color: string) => void): void {
    this.onSelectCallback = callback;
  }

  public updateCar(name: string, color: string): void {
    ApiHandler.updateCar(this.id, name, color).then((ok) => {
      if (!ok) return;

      this.setName(name);
      this.setColor(color);
    });
  }

  private setName(name: string): void {
    this.name = name;
    this.nameEl?.setTextContent(this.name);
  }

  private setColor(color: string): void {
    this.color = color;
    if (!this.carImg) {
      throw new Error('Car image not found');
    }
    this.carImg.style.color = this.color;
  }

  private getSVGElement(svg: string, className: string): HTMLElement {
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgElement.classList.add(className);
    return svgElement;
  }

  private removeCar(): void {
    ApiHandler.deleteCar(this.id).then((ok) => {
      if (!ok) return;

      const index = TrackView.instances.indexOf(this);
      if (index !== -1) {
        TrackView.instances.splice(index, 1);
      }
      this.viewElementCreator.getElement().remove();

      ApiHandler.deleteWinner(this.id);

      if (TrackView.onRemove) {
        TrackView.onRemove();
      }
    });
  }

  public async go(): Promise<number> {
    const raceParams = await ApiHandler.startEngine(this.id);

    this.runTime = raceParams.distance / raceParams.velocity;
    this.run = true;
    this.animateCar(this.runTime);

    try {
      this.trackButtonB?.toggleDisableElement(false);
      await ApiHandler.go(this.id);
    } catch (error) {
      this.run = false;
      throw new Error();
    }
    try {
      if (!this.run) {
        throw new Error();
      }
    } catch {
      throw new Error();
    }

    return this.id;
  }

  private async resetPosition(): Promise<void> {
    if (this.run === true) {
      const ok = await ApiHandler.stopEngine(this.id);
      if (!ok) return;
    }

    this.run = false;
    if (!this.carImg) {
      throw new Error('Images were not found');
    }
    this.carImg.style.transform = 'scale(-1, 1)';
    this.trackButtonB?.toggleDisableElement(true);
  }

  public static race(currentPage: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const cars: Promise<number>[] = [];
      ApiHandler.getCarsOnPage(currentPage)
        .then((carsForRaceFromApi) => {
          const carsForRace = TrackView.instances.filter((trackView) =>
            carsForRaceFromApi.find((carFromApi) => carFromApi.id === trackView.id),
          );

          carsForRace.forEach((car) => {
            cars.push(car.go());
            car.trackButtonB?.toggleDisableElement(false);
          });

          Promise.any(cars)
            .then((id) => {
              const winner = TrackView.instances.find((car) => car.id === id);
              if (winner && winner.runTime) {
                Popup.displayMessage(`${winner.name} went first (${Math.round(winner.runTime / 10) / 100}s)`);
                ApiHandler.modifyWinner(winner.id, Math.round(winner.runTime / 10) / 100)
                  .then(() => resolve())
                  .catch(() => reject());
              } else {
                Popup.displayMessage('All cars were are either broken or stopped. Try again!');
                reject();
              }
            })
            .catch(() => {
              Popup.displayMessage('All cars were are either broken or stopped. Try again!');
              reject();
            });
        })
        .catch(() => reject());
    });
  }

  public static async resetAll(): Promise<void[]> {
    const cars: Promise<void>[] = [];
    TrackView.instances.forEach((car) => {
      cars.push(car.resetPosition());
    });
    return Promise.all(cars);
  }

  private animateCar(time: number): void {
    let startTime: number | null = null;

    if (!this.carImg || !this.finishImg) {
      throw new Error('Images were not found');
    }

    const distance: number = this.finishImg.getBoundingClientRect().right - this.carImg.getBoundingClientRect().left;
    const speed = distance / time;

    const step = (timestamp: number): void => {
      if (!this.run) return;
      if (!startTime) startTime = timestamp;

      const progress: number = timestamp - startTime;

      if (!this.carImg) {
        throw new Error('Images were not found');
      }
      this.carImg.style.transform = `translateX(${Math.min(speed * progress, distance)}px) scale(-1, 1)`;

      if (progress < time) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  private static async excludeFromRace(id: number): Promise<void> {
    const car = TrackView.instances.find((trackView) => trackView.id === id);
    if (car) {
      car.run = false;
    }
  }
}
