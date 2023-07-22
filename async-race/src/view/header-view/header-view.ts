import { ElementCreator } from '../../util/element-creator';
import { View } from '../view';
import { Page } from '../../types/types';
import { Configuration } from '../../util/configuration';

export class HeaderView extends View {
  private headerButtons: ElementCreator[];

  private pages: Page[];

  constructor(pages: Page[]) {
    super(Configuration.viewParams.headerParams);

    this.pages = pages;
    this.headerButtons = [];
    this.configureView();
  }

  public configureView(): void {
    const creatorNav = new ElementCreator(Configuration.elementParams.navParams);
    this.viewElementCreator.addInnerElement(creatorNav);

    this.pages.forEach((page) => {
      const creatorButton = new ElementCreator(Configuration.elementParams.headerBtnParams);
      creatorButton.setTextContent(page.name.toUpperCase());
      creatorButton.setCallback(page.onPress);

      creatorNav.addInnerElement(creatorButton);
      this.headerButtons.push(creatorButton);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }
}
