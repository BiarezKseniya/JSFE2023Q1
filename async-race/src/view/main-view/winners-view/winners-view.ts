import { ElementCreator } from '../../../util/element-creator';
import { View } from '../../view';
import { TrackView } from '../garage-view/garage-components-view/track-view';
import { WinnerView } from './winner-view';
import { ApiHandler } from '../../../api-handler/api-handler';
import { WinnerData, CssClasses, TableHeaderNames, SortTypes, SortValues, Winner } from '../../../types/types';
import { Configuration } from '../../../util/configuration';

export class WinnersView extends View {
  public paginatorButtons: Record<string, ElementCreator> = {};

  public winnersTable: ElementCreator | null = null;

  public winnersTableBody: ElementCreator | null = null;

  public winnersHeader: ElementCreator | null = null;

  public pageHeader: ElementCreator | null = null;

  public winnersSort: ElementCreator[] = [];

  public winners: Winner[] | null = null;

  public currentPage: number = 1;

  public itemsPerPage: number = Configuration.itemsPerPage.winners;

  public winnersCount: number = 0;

  public winSort: number = 0;

  public timeSort: number = 0;

  public sortType: string = '';

  constructor() {
    super(Configuration.viewParams.winnersSection);

    this.configureView();
    this.drawWinners();
  }

  public configureView(): void {
    this.winnersHeader = new ElementCreator(Configuration.elementParams.winnersHeaderParams);
    this.pageHeader = new ElementCreator(Configuration.elementParams.winnersPageParams);
    this.winnersTable = new ElementCreator(Configuration.elementParams.winnerTableParams);
    this.winnersTableBody = new ElementCreator(Configuration.elementParams.winnersTableBodyParams);

    const winnersTableHead = new ElementCreator(Configuration.elementParams.winnersTableHeadParams);
    this.fillTableHeader(winnersTableHead);

    const paginator = new ElementCreator(Configuration.elementParams.winnersPaginatorParams);
    const buttonPrev = new ElementCreator(Configuration.elementParams.winnersPaginatorPrevParams);
    buttonPrev.setCallback(() => {
      this.currentPage -= 1;
      this.handlePaginator();
    });
    this.paginatorButtons.prev = buttonPrev;
    const buttonNext = new ElementCreator(Configuration.elementParams.winnersPaginatorNextParams);
    buttonNext.setCallback(() => {
      this.currentPage += 1;
      this.handlePaginator();
    });
    this.paginatorButtons.next = buttonNext;

    paginator.addInnerElement(buttonPrev);
    paginator.addInnerElement(buttonNext);
    this.winnersTable.addInnerElement(winnersTableHead);
    this.winnersTable.addInnerElement(this.winnersTableBody);
    this.viewElementCreator.addInnerElement(this.winnersHeader);
    this.viewElementCreator.addInnerElement(this.pageHeader);
    this.viewElementCreator.addInnerElement(this.winnersTable);
    this.viewElementCreator.addInnerElement(paginator);
  }

  public fillTableHeader(winnersTableHead: ElementCreator): void {
    Object.values(TableHeaderNames).forEach((th) => {
      const thItem = new ElementCreator(Configuration.elementParams.winnersTableHeadItemParams);
      thItem.setTextContent(th);

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
  }

  public handlePaginator(): void {
    this.drawWinners();
    this.pageHeader?.setTextContent(`Page #${this.currentPage}`);
    this.setBtnStyles();
  }

  public setBtnStyles(): void {
    const totalPages = Math.ceil(this.winnersCount / this.itemsPerPage);

    if (this.currentPage + 1 > totalPages) {
      this.paginatorButtons.next.setDisableElement(true);
    } else {
      this.paginatorButtons.next.setDisableElement(false);
    }

    if (this.currentPage === 1) {
      this.paginatorButtons.prev.setDisableElement(true);
    } else {
      this.paginatorButtons.prev.setDisableElement(false);
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
      sortParam.removeCssClass([CssClasses.asc, CssClasses.desc]);
    });

    switch (newSort) {
      case SortValues.asc: {
        sortItem.setCssClasses([CssClasses.asc]);
        break;
      }
      case SortValues.desc: {
        sortItem.setCssClasses([CssClasses.desc]);
        break;
      }
      default: {
        this.sortType = '';
        break;
      }
    }

    return newSort;
  }
}
