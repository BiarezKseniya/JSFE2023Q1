import { ElementCreator } from './element-creator';
import { Configuration } from './configuration';

export abstract class Popup {
  private static popup: ElementCreator;

  public static init(): ElementCreator {
    this.popup = new ElementCreator(Configuration.elementParams.popupParams);
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
