import { View } from '../view';
import { GarageView } from './garage-view/garage-view';
import { WinnersView } from './winners-view/winners-view';
import { Configuration } from '../../util/configuration';

export class MainView extends View {
  constructor() {
    super(Configuration.viewParams.mainParams);
  }

  public setContent<T extends GarageView | WinnersView>(content: T): void {
    const htmlElement = this.viewElementCreator.getElement();
    htmlElement.innerHTML = '';
    this.viewElementCreator.addInnerElement(content.getHtmlElement());
  }
}
