import { ElementCreator, ElementParams } from '../../../util/element-creator';
import { View, ViewParams } from '../../view';
import { TrackView, WinnerData } from '../garage-view/garage-components-view/track-view';
import { WinnerView } from './winner-view';

enum CssClasses {
  winners = 'winners',
  winnersHeader = 'winners__header',
  winnersPage = 'winners__page',
  winnersPaginator = 'winners__paginator',
  winnersPaginatorBtn = 'winners__paginator-button',
  winnersTable = 'winners__score',
  winnersTableHead = 'winners__score-head',
}

export class WinnersView extends View {
  public paginatorButtons: ElementCreator[];

  public winnersTable: ElementCreator | null;

  public winnersHeader: ElementCreator | null;

  public pageHeader: ElementCreator | null;

  public currentPage: number;

  public itemsPerPage: number;

  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClasses.winners],
    };
    super(params);

    this.paginatorButtons = [];
    this.winnersTable = null;
    this.winnersHeader = null;
    this.pageHeader = null;
    this.currentPage = 1;
    this.itemsPerPage = 7;
    this.configureView();

    TrackView.addWinnersListener((winner) => {
      this.createWinner(winner);
    });
  }

  public configureView(): void {
    const winnersHeaderParams: ElementParams = {
      tag: 'h1',
      classNames: [CssClasses.winnersHeader],
    };

    this.winnersHeader = new ElementCreator(winnersHeaderParams);
    this.viewElementCreator.addInnerElement(this.winnersHeader);

    const pageParams: ElementParams = {
      tag: 'h3',
      classNames: [CssClasses.winnersPage],
    };

    this.pageHeader = new ElementCreator(pageParams);
    this.viewElementCreator.addInnerElement(this.pageHeader);

    const tableParams: ElementParams = {
      tag: 'table',
      classNames: [CssClasses.winnersTable],
    };

    this.winnersTable = new ElementCreator(tableParams);
    this.viewElementCreator.addInnerElement(this.winnersTable);

    const tableHeadParams: ElementParams = {
      tag: 'thead',
      classNames: [CssClasses.winnersTableHead],
    };
    const winnersTableHead = new ElementCreator(tableHeadParams);
    this.winnersTable.addInnerElement(winnersTableHead);

    const theadContent = ['Number', 'Car', 'Name', 'Wins', 'Best time (sec)'];
    theadContent.forEach((th) => {
      const tableHeadItemParams: ElementParams = {
        tag: 'th',
        classNames: [CssClasses.winnersTableHead],
        textContent: th,
      };
      winnersTableHead.addInnerElement(new ElementCreator(tableHeadItemParams));
    });

    const paginatorParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.winnersPaginator],
    };

    const paginator = new ElementCreator(paginatorParams);

    const paginatorPrevParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.winnersPaginatorBtn],
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
      classNames: [CssClasses.winnersPaginatorBtn],
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
    if (this.winnersTable) {
      this.winnersTable.getElement().innerHTML = '';
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // const cars = TrackView.instances.slice(startIndex, endIndex);

    // cars.forEach((car) => {
    //   if (this.carsWrap) {
    //     this.carsWrap.addInnerElement(car.getHtmlElement());
    //   }
    // });

    this.pageHeader?.setTextContent(`Page #${this.currentPage}`);
    // this.setBtnStyles();
  }

  public setBtnStyles(): void {
    const nextButton = this.paginatorButtons[1].getElement();
    const prevButton = this.paginatorButtons[0].getElement();
    const totalWinners = WinnerView.instances.length;
    const totalPages = Math.ceil(totalWinners / this.itemsPerPage);

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

  private updateWinnersView(): void {
    this.winnersHeader?.setTextContent(`Winners (${0})`);
    this.updatePaginator();
  }

  public createWinner(winner: WinnerData): void {
    const newWinner = new WinnerView(winner);
    this.winnersTable?.addInnerElement(newWinner.getHtmlElement());
  }
}
