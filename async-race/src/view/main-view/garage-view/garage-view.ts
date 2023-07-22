import { GarageSectionView } from './garage-components-view/garage-section-view';
import { ControlsSectionView } from './garage-components-view/controls-section-view';
import { TrackView } from './garage-components-view/track-view';
import { View } from '../../view';
import { ElementCreator } from '../../../util/element-creator';
import { ApiHandler } from '../../../api-handler/api-handler';
import { Popup } from '../../../util/popup';
import { CarParams } from '../../../types/types';
import { Configuration } from '../../../util/configuration';

export class GarageView extends View {
  public controlsSection: ControlsSectionView;

  public garageSection: GarageSectionView;

  public cars: TrackView[];

  public selectedCar: TrackView | null = null;

  constructor() {
    super(Configuration.viewParams.garageView);

    this.controlsSection = new ControlsSectionView();
    this.garageSection = new GarageSectionView();
    this.cars = TrackView.instances;

    this.initCarView();
    this.configureView();
    TrackView.onRemove = this.updateCarsView.bind(this);
  }

  public configureView(): void {
    this.setCallbacks();
    this.updateCarsView();

    this.viewElementCreator.addInnerElement(this.controlsSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(this.garageSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(Popup.init());
  }

  private setCallbacks(): void {
    this.controlsSection.carCreateBtn?.setCallback(() => {
      const { name, color } = this.getNameColor();
      this.createCar({ name, color });
    });

    this.controlsSection.carUpdateBtn?.setCallback(() => {
      this.updateSelectedCar();
    });

    this.controlsSection.carRaceBtn?.setCallback(async () => {
      this.controlsSection.carRaceBtn?.setDisableElement(true);
      this.handleOnRaceBtnStyles(true);
      await TrackView.resetAll();
      try {
        await TrackView.race(this.garageSection.currentPage);
      } catch {
        // Nothing to do here
      } finally {
        this.handleOnRaceBtnStyles(false);
      }
    });

    this.controlsSection.carResetBtn?.setCallback(async () => {
      await TrackView.resetAll();
      this.controlsSection.carRaceBtn?.setDisableElement(false);
    });

    this.controlsSection.carGenerateBtn?.setCallback(this.GenerateCars.bind(this));
    this.cars.forEach((car) => {
      car.setOnSelectCallback((name, color) => {
        this.selectedCar = car;
        this.fillUpdateCarInputs(name, color);
      });
    });
  }

  private updateCarsView(): void {
    this.garageSection.garageHeader?.setTextContent(`Garage (${this.cars.length})`);
    this.garageSection.updatePaginator();
  }

  private createCar({ name, color, id }: { name: string; color: string; id?: number } = this.getNameColor()): void {
    const newCar = new TrackView(name, color, id);
    newCar.setOnSelectCallback((newName, newColor) => {
      this.selectedCar = newCar;
      this.fillUpdateCarInputs(newName, newColor);
    });
    this.garageSection.carsWrap?.addInnerElement(newCar.getHtmlElement());
    this.updateCarsView();
  }

  private getNameColor(
    inputName: ElementCreator | null = this.controlsSection.carCreateNameInput,
    inputColor: ElementCreator | null = this.controlsSection.carCreateColorInput,
  ): { name: string; color: string } {
    const inputNameEl = inputName?.getElement();
    const inputColorEl = inputColor?.getElement();

    if (!(inputNameEl instanceof HTMLInputElement) || !(inputColorEl instanceof HTMLInputElement)) {
      throw new Error('There is no instance of HTMLInputElement');
    }

    let name = inputNameEl.value;
    if (name === '') {
      name = CarParams.placeholderName;
    }

    return { name, color: inputColorEl.value };
  }

  private GenerateCars(): void {
    for (let i = 0; i < 100; i += 1) {
      this.createCar({ name: Configuration.getRandomName(), color: Configuration.getRandomColor() });
    }
  }

  private fillUpdateCarInputs(name: string, color: string): void {
    this.controlsSection.toggleUpdateElements(false);
    if (this.controlsSection) {
      this.controlsSection.setCarName(name);
      this.controlsSection.setCarColor(color);
    }
  }

  private updateSelectedCar(): void {
    if (this.selectedCar && this.controlsSection) {
      const { name, color } = this.getNameColor(
        this.controlsSection.carUpdateNameInput,
        this.controlsSection.carUpdateColorInput,
      );

      this.selectedCar.updateCar(name, color);
      this.selectedCar = null;
      this.fillUpdateCarInputs('', CarParams.placeholderColor);
      this.controlsSection.toggleUpdateElements(true);
    }
  }

  private handleOnRaceBtnStyles(flag: boolean): void {
    this.controlsSection.carResetBtn?.setDisableElement(flag);
    this.controlsSection.carCreateBtn?.setDisableElement(flag);
    this.controlsSection.carUpdateBtn?.setDisableElement(flag);
    this.controlsSection.carGenerateBtn?.setDisableElement(flag);
    this.cars.forEach((car) => {
      car.removeBtn?.setDisableElement(flag);
      car.selectBtn?.setDisableElement(flag);
    });
  }

  private async initCarView(): Promise<void> {
    const cars = await ApiHandler.getCars();
    cars.forEach((car) => {
      if (!TrackView.instances.some((trackView) => trackView.id === car.id)) {
        this.createCar({ name: car.name, color: car.color, id: car.id });
      }
    });
  }
}
