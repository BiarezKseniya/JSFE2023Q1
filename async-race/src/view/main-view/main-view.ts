import { View, ViewParams } from '../view';
import { GarageSectionView } from './garage-view/garage-components-view/garage-section-view';
import { WinnersView } from './winners-view/winners-view';

enum CssClasses {
  main = 'main',
}

export class MainView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'main',
      classNames: [CssClasses.main],
    };
    super(params);
  }

  public setContent<T extends GarageSectionView | WinnersView>(content: T): void {
    const htmlElement = this.viewElementCreator.getElement();
    htmlElement.innerHTML = '';
    this.viewElementCreator.addInnerElement(content.getHtmlElement());
  }
}
