import { ElementCreator } from './element-creator';
import { CssClasses, ElementParams } from '../types/types';

export abstract class Popup {
  private static popup: ElementCreator;

  public static init(): ElementCreator {
    const params: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.popUp],
    };
    this.popup = new ElementCreator(params);
    return this.popup;
  }

  public static displayMessage(message: string): void {
    this.popup.setTextContent(message);
    this.popup.element.style.display = 'block';
    setTimeout(() => {
      this.popup.element.style.display = 'none';
    }, 5000);
  }
}
