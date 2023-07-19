import { ElementCreator, ElementParams } from '../../../util/element-creator';
import { View, ViewParams } from '../../view';
import { TrackView, WinnerData } from '../garage-view/garage-components-view/track-view';
import { WinnerView } from './winner-view';
import { ApiHandler, Winner } from '../../../api-handler/api-handler';

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

  public winnersTableBody: ElementCreator | null;

  public winnersHeader: ElementCreator | null;

  public pageHeader: ElementCreator | null;

  public winners: Winner[] | null;

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
    this.winnersTableBody = null;
    this.winnersHeader = null;
    this.pageHeader = null;
    this.winners = null;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.configureView();
    this.drawWinners();

    // TrackView.addWinnersListener(() => {
    //   this.drawWinners();
    // });
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

    const tableBodyParams: ElementParams = {
      tag: 'tbody',
      classNames: [],
    };
    this.winnersTableBody = new ElementCreator(tableBodyParams);
    this.winnersTable.addInnerElement(this.winnersTableBody);

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
    // if (this.winnersTableBody) {
    //   this.winnersTableBody.getElement().innerHTML = '';
    // }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    const winnerPage = this.winners?.slice(startIndex, endIndex);

    // winnerPage.forEach((winnerOnPage) => {
    //   if (this.winnersTableBody) {
    //     this.winnersTableBody.addInnerElement(winnerOnPage.getHtmlElement());
    //   }
    // });

    this.pageHeader?.setTextContent(`Page #${this.currentPage}`);
    this.setBtnStyles();
  }

  public setBtnStyles(): void {
    const nextButton = this.paginatorButtons[1].getElement();
    const prevButton = this.paginatorButtons[0].getElement();
    const totalWinners = 10; // WinnerView.instances.length;
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

  private updateWinnersView(number: number): void {
    this.winnersHeader?.setTextContent(`Winners (${number})`);
    this.updatePaginator();
  }

  public async drawWinners(): Promise<void> {
    const winnersApi = await ApiHandler.getWinners();

    if (!this.winnersTableBody) {
      return;
    }
    this.winnersTableBody.getElement().innerHTML = '';

    winnersApi.forEach((winner, index) => {
      const car = TrackView.instances.find((trackCar) => trackCar.id === winner.id);
      if (!car) {
        throw new Error('No car has been found');
      }
      const winnerData: WinnerData = {
        id: winner.id,
        name: car.name,
        bestTime: winner.time,
        winsCount: winner.wins,
        color: car.color,
      };
      const newWinner = new WinnerView(winnerData, index);
      this.winnersTableBody?.addInnerElement(newWinner.getHtmlElement());
    });
    this.updateWinnersView(winnersApi.length);
  }
}
