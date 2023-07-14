import { GarageSectionView } from './garage-components-view/garage-section-view';
import { ControlsSectionView, CarParams } from './garage-components-view/controls-section-view';
import { TrackView } from './garage-components-view/track-view';
import { View, ViewParams } from '../../view';

export class GarageView extends View {
  public controlsSection: ControlsSectionView;

  public garageSection: GarageSectionView;

  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [],
    };
    super(params);

    this.controlsSection = new ControlsSectionView();
    this.garageSection = new GarageSectionView();

    this.configureView();
    this.createCar({ name: CarParams.defaultName, color: CarParams.defaultColor });
  }

  public configureView(): void {
    this.controlsSection.carCreateBtn?.setCallback(() => {
      const { name, color } = this.getNameColor();
      this.createCar({ name, color });
    });

    this.viewElementCreator.addInnerElement(this.controlsSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(this.garageSection.getHtmlElement());
  }

  private createCar({ name, color }: { name: string; color: string } = this.getNameColor()): void {
    const newCar = new TrackView(name, color);
    this.garageSection.carsWrap?.addInnerElement(newCar.getHtmlElement());
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
}
