import { View, ViewParams } from '../../../view';
import { ElementCreator, ElementParams } from '../../../../util/element-creator';
import carSvg from '../../../../assets/car.svg';
import finishSvg from '../../../../assets/finish.svg';

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

  public name: string;

  public color: string;

  constructor(name: string, color: string) {
    const params: ViewParams = {
      tag: 'div',
      classNames: [],
    };
    super(params);

    this.name = name;
    this.color = color;
    this.configureView();
    TrackView.instances.push(this);
  }

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
    const carButtonSelect = new ElementCreator(carButtonSelectParams);
    carControls.addInnerElement(carButtonSelect);

    const carButtonRemoveParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.carButton],
      textContent: 'Remove',
      type: 'button',
    };
    const carButtonRemove = new ElementCreator(carButtonRemoveParams);
    carButtonRemove.setCallback(this.removeCar.bind(this));
    carControls.addInnerElement(carButtonRemove);

    const carNameParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carName],
      textContent: this.name,
    };
    const carName = new ElementCreator(carNameParams);
    carParams.addInnerElement(carName);

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
    const trackButtonA = new ElementCreator(trackButtonAParams);
    trackControls.addInnerElement(trackButtonA);

    const trackButtonBParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.trackButton],
      textContent: 'B',
      type: 'button',
    };
    const trackButtonB = new ElementCreator(trackButtonBParams);
    trackControls.addInnerElement(trackButtonB);

    const car = this.getSVGElement(carSvg, CssClasses.trackCar);
    car.style.color = this.color;

    track.addInnerElement(car);
    track.addInnerElement(this.getSVGElement(finishSvg, CssClasses.trackFinish));
  }

  public static getInstances(): TrackView[] {
    return TrackView.instances;
  }

  private getSVGElement(svg: string, className: string): HTMLElement {
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgElement.classList.add(className);
    return svgElement;
  }

  private removeCar(): void {
    const index = TrackView.instances.indexOf(this);
    if (index !== -1) {
      TrackView.instances.splice(index, 1);
    }
    this.viewElementCreator.getElement().remove();
    if (TrackView.onRemove) {
      TrackView.onRemove();
    }
  }
}
