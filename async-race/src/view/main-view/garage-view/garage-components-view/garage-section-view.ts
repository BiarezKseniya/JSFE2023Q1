import { ElementCreator } from '../../../../util/element-creator';
import { View } from '../../../view';
import { TrackView } from './track-view';
import { Configuration } from '../../../../util/configuration';

export class GarageSectionView extends View {
  public paginatorButtons: {
    [key: string]: ElementCreator;
  } = {};

  public carsWrap: ElementCreator | null = null;

  public garageHeader: ElementCreator | null = null;

  public pageHeader: ElementCreator | null = null;

  public currentPage: number = 1;

  public itemsPerPage: number = 7;

  constructor() {
    super(Configuration.viewParams.garageSectionParams);

    this.configureView();
  }

  public configureView(): void {
    this.garageHeader = new ElementCreator(Configuration.elementParams.garageHeaderParams);
    this.pageHeader = new ElementCreator(Configuration.elementParams.garagePageParams);
    this.carsWrap = new ElementCreator(Configuration.elementParams.carsWrapParams);

    const paginator = new ElementCreator(Configuration.elementParams.garagePaginatorParams);
    const buttonPrev = new ElementCreator(Configuration.elementParams.garagePaginatorPrevParams);
    buttonPrev.setCallback(() => {
      this.currentPage -= 1;
      this.updatePaginator();
    });
    const buttonNext = new ElementCreator(Configuration.elementParams.garagePaginatorNextParams);
    buttonNext.setCallback(() => {
      this.currentPage += 1;
      this.updatePaginator();
    });
    this.paginatorButtons.prev = buttonPrev;
    this.paginatorButtons.next = buttonNext;

    paginator.addInnerElement(buttonPrev);
    paginator.addInnerElement(buttonNext);

    this.viewElementCreator.addInnerElement(this.garageHeader);
    this.viewElementCreator.addInnerElement(this.pageHeader);
    this.viewElementCreator.addInnerElement(this.carsWrap);
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
    const totalCars = TrackView.instances.length;
    const totalPages = Math.ceil(totalCars / this.itemsPerPage);

    if (this.currentPage + 1 > totalPages) {
      this.paginatorButtons.next.toggleDisableElement(true);
    } else {
      this.paginatorButtons.next.toggleDisableElement(false);
    }

    if (this.currentPage === 1) {
      this.paginatorButtons.prev.toggleDisableElement(true);
    } else {
      this.paginatorButtons.prev.toggleDisableElement(false);
    }
  }
}
