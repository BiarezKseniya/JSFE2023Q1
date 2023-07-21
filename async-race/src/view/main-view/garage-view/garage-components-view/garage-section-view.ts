import { ElementCreator } from '../../../../util/element-creator';
import { View } from '../../../view';
import { TrackView } from './track-view';
import { CssClasses, ViewParams, ElementParams } from '../../../../types/types';

export class GarageSectionView extends View {
  public paginatorButtons: ElementCreator[];

  public carsWrap: ElementCreator | null;

  public garageHeader: ElementCreator | null;

  public pageHeader: ElementCreator | null;

  public currentPage: number;

  public itemsPerPage: number;

  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClasses.garage],
    };
    super(params);

    this.paginatorButtons = [];
    this.carsWrap = null;
    this.garageHeader = null;
    this.pageHeader = null;
    this.currentPage = 1;
    this.itemsPerPage = 7;
    this.configureView();
  }

  public configureView(): void {
    const garageHeaderParams: ElementParams = {
      tag: 'h1',
      classNames: [CssClasses.garageHeader],
    };

    this.garageHeader = new ElementCreator(garageHeaderParams);
    this.viewElementCreator.addInnerElement(this.garageHeader);

    const pageParams: ElementParams = {
      tag: 'h3',
      classNames: [CssClasses.garagePage],
    };

    this.pageHeader = new ElementCreator(pageParams);
    this.viewElementCreator.addInnerElement(this.pageHeader);

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

    const paginatorPrevParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.garagePaginatorBtn],
      textContent: 'PREV',
      type: 'button',
    };
    const buttonPrev = new ElementCreator(paginatorPrevParams);

    buttonPrev.setCallback(() => {
      this.currentPage -= 1;
      this.updatePaginator();
    });
    paginator.addInnerElement(buttonPrev);
    this.paginatorButtons.push(buttonPrev);

    const paginatorNextParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.garagePaginatorBtn],
      textContent: 'NEXT',
      type: 'button',
    };
    const buttonNext = new ElementCreator(paginatorNextParams);

    buttonNext.setCallback(() => {
      this.currentPage += 1;
      this.updatePaginator();
    });
    paginator.addInnerElement(buttonNext);
    this.paginatorButtons.push(buttonNext);

    this.viewElementCreator.addInnerElement(paginator);
  }

  public updatePaginator(): void {
    if (this.carsWrap) {
      this.carsWrap.getElement().innerHTML = '';
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const cars = TrackView.instances.slice(startIndex, endIndex);

    cars.forEach((car) => {
      if (this.carsWrap) {
        this.carsWrap.addInnerElement(car.getHtmlElement());
      }
    });

    this.pageHeader?.setTextContent(`Page #${this.currentPage}`);
    this.setBtnStyles();
  }

  public setBtnStyles(): void {
    const nextButton = this.paginatorButtons[1].getElement();
    const prevButton = this.paginatorButtons[0].getElement();
    const totalCars = TrackView.instances.length;
    const totalPages = Math.ceil(totalCars / this.itemsPerPage);

    if (!(nextButton instanceof HTMLButtonElement) || !(prevButton instanceof HTMLButtonElement)) {
      throw new Error('No button element was found');
    }

    if (this.currentPage + 1 > totalPages) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }

    if (this.currentPage === 1) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    }
  }
}
