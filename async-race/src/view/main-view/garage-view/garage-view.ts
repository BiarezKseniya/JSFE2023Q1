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
    this.viewElementCreator.addInnerElement(this.controlsSection.getHtmlElement());
    this.viewElementCreator.addInnerElement(this.garageSection.getHtmlElement());
  }

  private createCar({ name, color }: { name: string; color: string }): void {
    this.garageSection.carsWrap?.addInnerElement(new TrackView(name, color).getHtmlElement());
  }
}
