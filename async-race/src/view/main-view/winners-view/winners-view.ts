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
  winnersSort = 'winners__sort-param',
}

enum SortValues {
  noSort = 0,
  asc = 1,
  desc = 2,
}

enum SortTypes {
  wins = 'wins',
  time = 'time',
}

enum TableHeaderNames {
  number = 'Number',
  car = 'Car',
  name = 'Name',
  wins = 'Wins',
  bestTime = 'Best time (sec)',
}

export class WinnersView extends View {
  public paginatorButtons: Record<string, ElementCreator> = {};

  public winnersTable: ElementCreator | null;

  public winnersTableBody: ElementCreator | null;

  public winnersHeader: ElementCreator | null;

  public pageHeader: ElementCreator | null;

  public winnersSort: ElementCreator[];

  public winners: Winner[] | null;

  public currentPage: number;

  public itemsPerPage: number;

  public winnersCount: number;

  public winSort: number;

  public timeSort: number;

  public sortType: string;

  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClasses.winners],
    };
    super(params);

    this.paginatorButtons = {};
    this.winnersTable = null;
    this.winnersTableBody = null;
    this.winnersHeader = null;
    this.pageHeader = null;
    this.winnersHeader = null;
    this.winnersSort = [];
    this.winners = null;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.winnersCount = 0;
    this.sortType = '';
    this.winSort = 0;
    this.timeSort = 0;
    this.configureView();
    this.drawWinners();
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

    Object.values(TableHeaderNames).forEach((th) => {
      const tableHeadItemParams: ElementParams = {
        tag: 'th',
        classNames: [CssClasses.winnersTableHead],
        textContent: th,
      };

      const thItem = new ElementCreator(tableHeadItemParams);

      switch (th) {
        case TableHeaderNames.wins: {
          thItem.setCssClasses([CssClasses.winnersSort]);
          this.winnersSort.push(thItem);
          thItem.setCallback(() => {
            this.sortType = SortTypes.wins;
            this.timeSort = 0;
            this.winSort = this.setSort(this.winSort, thItem);
            this.drawWinners();
          });
          break;
        }
        case TableHeaderNames.bestTime: {
          thItem.setCssClasses([CssClasses.winnersSort]);
          this.winnersSort.push(thItem);
          thItem.setCallback(() => {
            this.sortType = SortTypes.time;
            this.winSort = 0;
            this.timeSort = this.setSort(this.timeSort, thItem);
            this.drawWinners();
          });
          break;
        }
        default:
          break;
      }

      winnersTableHead.addInnerElement(thItem);
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
      this.handlePaginator();
    });
    paginator.addInnerElement(buttonPrev);
    this.paginatorButtons.prev = buttonPrev;

    const paginatorNextParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.winnersPaginatorBtn],
      textContent: 'NEXT',
      type: 'button',
    };
    const buttonNext = new ElementCreator(paginatorNextParams);

    buttonNext.setCallback(() => {
      this.currentPage += 1;
      this.handlePaginator();
    });
    paginator.addInnerElement(buttonNext);
    this.paginatorButtons.next = buttonNext;

    this.viewElementCreator.addInnerElement(paginator);
  }

  public handlePaginator(): void {
    this.drawWinners();
    this.pageHeader?.setTextContent(`Page #${this.currentPage}`);
    this.setBtnStyles();
  }

  public setBtnStyles(): void {
    const totalPages = Math.ceil(this.winnersCount / this.itemsPerPage);

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

  public async drawWinners(): Promise<void> {
    const winnersApi = await ApiHandler.getWinnersPage(
      this.currentPage,
      this.itemsPerPage,
      this.sortType,
      SortValues[this.winSort || this.timeSort],
    );

    if (!this.winnersTableBody) {
      return;
    }
    this.winnersTableBody.getElement().innerHTML = '';

    winnersApi.winnersPage.forEach((winner, index) => {
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

    this.winnersCount = winnersApi.winnersTotalCount;
    this.winnersHeader?.setTextContent(`Winners (${this.winnersCount})`);
    this.setBtnStyles();
  }

  public setSort(sort: number, sortItem: ElementCreator): number {
    const newSort = sort === SortValues.desc ? SortValues.noSort : sort + 1;

    this.winnersSort.forEach((sortParam) => {
      sortParam.removeCssClass(['asc', 'desc']);
    });

    switch (newSort) {
      case SortValues.asc: {
        sortItem.setCssClasses(['asc']);
        console.log('asc sort');
        break;
      }
      case SortValues.desc: {
        sortItem.setCssClasses(['desc']);
        console.log('desc sort');
        break;
      }
      default: {
        this.sortType = '';
        console.log('no-sort');
        break;
      }
    }

    return newSort;
  }
}
