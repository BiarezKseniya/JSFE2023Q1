import { ElementCreator, ElementParams } from '../../util/element-creator';
import { View, ViewParams } from '../view';

export interface Page {
  name: string;
  callback: () => void;
}

enum CssClasses {
  header = 'header',
  nav = 'header__nav',
  button = 'header__switch-page',
}

export enum NamePages {
  garage = 'Garage',
  winners = 'Winners',
}

export class HeaderView extends View {
  private headerButtons: ElementCreator[];

  private pages: {
    name: string;
    onPress: () => void;
  }[];

  constructor(
    pages: {
      name: string;
      onPress: () => void;
    }[],
  ) {
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
        callback: null,
      };
      const creatorButton = new ElementCreator(btnParams);
      creatorButton.setCallback(page.onPress);

      creatorNav.addInnerElement(creatorButton);
      this.headerButtons.push(creatorButton);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }
}
