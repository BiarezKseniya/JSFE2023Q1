import { ElementCreator } from '../../util/element-creator';
import { View } from '../view';
import { CssClasses, Page, ViewParams, ElementParams } from '../../types/types';

export class HeaderView extends View {
  private headerButtons: ElementCreator[];

  private pages: Page[];

  constructor(pages: Page[]) {
    const params: ViewParams = {
      tag: 'header',
      classNames: [CssClasses.header],
    };
    super(params);

    this.pages = pages;
    this.headerButtons = [];
    this.configureView();
  }

  public configureView(): void {
    const navParams: ElementParams = {
      tag: 'nav',
      classNames: [CssClasses.nav],
    };
    const creatorNav = new ElementCreator(navParams);
    this.viewElementCreator.addInnerElement(creatorNav);

    this.pages.forEach((page) => {
      const btnParams: ElementParams = {
        tag: 'button',
        classNames: [CssClasses.button],
        textContent: page.name.toUpperCase(),
        type: 'button',
      };
      const creatorButton = new ElementCreator(btnParams);
      creatorButton.setCallback(page.onPress);

      creatorNav.addInnerElement(creatorButton);
      this.headerButtons.push(creatorButton);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }
}
