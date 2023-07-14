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

  constructor() {
    const params: ViewParams = {
      tag: 'header',
      classNames: [CssClasses.header],
    };
    super(params);

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

    Object.keys(NamePages).forEach((key) => {
      const btnParams: ElementParams = {
        tag: 'button',
        classNames: [CssClasses.button],
        textContent: key.toUpperCase(),
        type: 'button',
        callback: null,
      };
      const creatorButton = new ElementCreator(btnParams);

      creatorNav.addInnerElement(creatorButton);
      this.headerButtons.push(creatorButton);
    });

    this.viewElementCreator.addInnerElement(creatorNav);
  }
}
