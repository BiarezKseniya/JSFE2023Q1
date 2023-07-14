import { GarageSectionView } from './garage-components-view/garage-section-view';
import { ControlsSectionView, CarParams } from './garage-components-view/controls-section-view';
import { TrackView } from './garage-components-view/track-view';
import { View, ViewParams } from '../../view';

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

  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [],
    };
    super(params);

    this.controlsSection = new ControlsSectionView();
    this.garageSection = new GarageSectionView();
    this.cars = TrackView.instances;

    this.createCar({ name: CarParams.defaultName, color: CarParams.defaultColor });
    this.configureView();
    TrackView.onRemove = this.updateCarsView.bind(this);
  }

  public configureView(): void {
    this.controlsSection.carCreateBtn?.setCallback(() => {
      const { name, color } = this.getNameColor();
      this.createCar({ name, color });
    });
    this.controlsSection.carGenerateBtn?.setCallback(this.GenerateCars.bind(this));

    this.updateCarsView();

    this.viewElementCreator.addInnerElement(this.controlsSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(this.garageSection.getHtmlElement());
  }

  private createCar({ name, color }: { name: string; color: string } = this.getNameColor()): void {
    const newCar = new TrackView(name, color);
    this.garageSection.carsWrap?.addInnerElement(newCar.getHtmlElement());
    this.updateCarsView();
  }

  private getNameColor(): { name: string; color: string } {
    const inputName = this.controlsSection.carCreateNameInput?.getElement();
    const inputColor = this.controlsSection.carCreateColorInput?.getElement();

    if (!(inputName instanceof HTMLInputElement) || !(inputColor instanceof HTMLInputElement)) {
      throw new Error('There is no instance of HTMLInputElement');
    }

    let name = inputName.value;
    if (name === '') {
      name = CarParams.placeholderName;
    }

    return { name, color: inputColor.value };
  }

  private updateCarsView(): void {
    this.garageSection.garageHeader?.setTextContent(`Garage (${this.cars.length})`);
    this.garageSection.updatePaginator();
  }

  private GenerateCars(): void {
    for (let i = 0; i < 100; i += 1) {
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
}
