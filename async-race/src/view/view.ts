import { ElementCreator, ElementParams } from '../util/element-creator';

export interface ViewParams {
  tag: string;
  classNames: string[];
}

export class View {
  public viewElementCreator: ElementCreator;

  constructor(params: ViewParams) {
    this.viewElementCreator = this.createView(params);
  }

  public getHtmlElement(): HTMLElement {
    return this.viewElementCreator.getElement();
  }

  private createView(params: ViewParams): ElementCreator {
    const elementParams: ElementParams = {
      tag: params.tag,
      classNames: params.classNames,
      textContent: '',
      callback: null,
    };
    this.viewElementCreator = new ElementCreator(elementParams);
    return this.viewElementCreator;
  }
}
