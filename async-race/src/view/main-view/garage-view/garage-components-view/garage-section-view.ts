import { ElementCreator, ElementParams } from '../../../../util/element-creator';
import { View, ViewParams } from '../../../view';

enum CssClasses {
  garage = 'garage',
  garageHeader = 'garage__header',
  garagePage = 'garage__page',
  garagePaginator = 'garage__paginator',
  garagePaginatorBtn = 'garage__paginator-button',
  carsWrap = 'garage__cars',
}

enum PaginationBtns {
  prev = 'prev',
  next = 'next',
}

export class GarageSectionView extends View {
  public paginatorButtons: ElementCreator[];

  public carsWrap: ElementCreator | null;

  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClasses.garage],
    };
    super(params);

    this.paginatorButtons = [];
    this.carsWrap = null;
    this.configureView();
  }

  public configureView(): void {
    const garageHeaderParams: ElementParams = {
      tag: 'h1',
      classNames: [CssClasses.garageHeader],
      textContent: `Garage (${1})`,
    };

    this.viewElementCreator.addInnerElement(new ElementCreator(garageHeaderParams));

    const pageParams: ElementParams = {
      tag: 'h3',
      classNames: [CssClasses.garagePage],
      textContent: `Page #${1}`,
    };

    this.viewElementCreator.addInnerElement(new ElementCreator(pageParams));

    const carsWrapParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carsWrap],
    };

    this.carsWrap = new ElementCreator(carsWrapParams);
    this.viewElementCreator.addInnerElement(this.carsWrap);

    const paginatorParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.garagePaginator],
    };

    const paginator = new ElementCreator(paginatorParams);

    Object.keys(PaginationBtns).forEach((key) => {
      const btnParams: ElementParams = {
        tag: 'button',
        classNames: [CssClasses.garagePaginatorBtn],
        textContent: key.toUpperCase(),
        type: 'button',
        callback: null,
      };
      const creatorButton = new ElementCreator(btnParams);

      paginator.addInnerElement(creatorButton);
      this.paginatorButtons.push(creatorButton);
    });

    this.viewElementCreator.addInnerElement(paginator);
  }
}
