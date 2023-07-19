import { GarageSectionView } from './garage-components-view/garage-section-view';
import { ControlsSectionView, CarParams } from './garage-components-view/controls-section-view';
import { TrackView } from './garage-components-view/track-view';
import { View, ViewParams } from '../../view';
import { ElementCreator } from '../../../util/element-creator';
import { ApiHandler } from '../../../api-handler/api-handler';
import { Popup } from '../../../util/popup';

const carModel: Map<string, string> = new Map([
  ['Lexus', 'RX'],
  ['BMW', 'X6'],
  ['Cadillac', 'Escalade'],
  ['Toyota', 'Corolla'],
  ['Mercedez', 'McLaren'],
  ['Porshe', 'Carrera'],
  ['Jaguar', 'F-Type SVR'],
  ['Genezis', 'G80'],
  ['Chevrolet', 'Impala'],
  ['Lamborghini', 'Veneno'],
  ['Ferrari', 'Dino'],
]);

export class GarageView extends View {
  public controlsSection: ControlsSectionView;

  public garageSection: GarageSectionView;

  public cars: TrackView[];

  public selectedCar: TrackView | null = null;

  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [],
    };
    super(params);

    this.controlsSection = new ControlsSectionView();
    this.garageSection = new GarageSectionView();
    this.cars = TrackView.instances;

    this.initCarView();
    this.configureView();
    TrackView.onRemove = this.updateCarsView.bind(this);
  }

  public configureView(): void {
    this.controlsSection.carCreateBtn?.setCallback(() => {
      const { name, color } = this.getNameColor();
      this.createCar({ name, color });
    });

    this.controlsSection.carRaceBtn?.setCallback(async () => {
      this.handleRaceControls(true);
      await TrackView.resetAll();
      TrackView.race(this.garageSection.currentPage);
    });

    this.controlsSection.carResetBtn?.setCallback(() => {
      this.handleRaceControls(false);
      TrackView.resetAll();
    });

    this.controlsSection.carGenerateBtn?.setCallback(this.GenerateCars.bind(this));
    this.cars.forEach((car) => {
      car.setOnSelectCallback((name, color) => {
        this.selectedCar = car;
        this.fillUpdateCarInputs(name, color);
      });
    });

    if (this.controlsSection) {
      this.controlsSection.setOnUpdateCallback(() => {
        this.updateSelectedCar();
      });
    }

    this.updateCarsView();

    this.viewElementCreator.addInnerElement(this.controlsSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(this.garageSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(Popup.init());
  }

  private createCar({ name, color, id }: { name: string; color: string; id?: number } = this.getNameColor()): void {
    const newCar = id ? new TrackView(name, color, id) : new TrackView(name, color);
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

  private updateCarsView(): void {
    this.garageSection.garageHeader?.setTextContent(`Garage (${this.cars.length})`);
    this.garageSection.updatePaginator();
  }

  private GenerateCars(): void {
    for (let i = 0; i < 7; i += 1) {
      this.createCar({ name: this.getRandomName(), color: this.getRandomColor() });
    }
  }

  private getRandomName(): string {
    const arrayKeys = [...carModel.keys()];
    const arrayValues = [...carModel.values()];

    const numberKey = Math.floor(Math.random() * arrayKeys.length);
    const numberValue = Math.floor(Math.random() * arrayValues.length);
    return `${arrayKeys[numberKey]} ${arrayValues[numberValue]}`;
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
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

  private handleRaceControls(flag: boolean): void {
    this.controlsSection.carRaceBtn?.toggleDisableElement(flag);
    this.cars.forEach((car) => car.trackButtonA?.toggleDisableElement(flag));
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
