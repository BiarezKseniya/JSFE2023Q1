import { View } from '../../view';
import { ElementCreator } from '../../../util/element-creator';
import { WinnerData, CssClasses, TableHeaderNames } from '../../../types/types';
import { Configuration } from '../../../util/configuration';
import carSvg from '../../../assets/car.svg';

export class WinnerView extends View {
  public name: string;

  public color: string;

  public id: number;

  private winsCount: number;

  private bestTime: number;

  private carImg: HTMLElement | null = null;

  constructor(winner: WinnerData, index: number) {
    super(Configuration.viewParams.winnerView);

    this.id = winner.id;
    this.name = winner.name;
    this.bestTime = winner.bestTime;
    this.winsCount = winner.winsCount;
    this.color = winner.color;
    this.id = winner.id;

    this.configureView(index);
  }

  public configureView(index: number): void {
    const tableRow: {
      [key: string]: ElementCreator;
    } = {};
    Object.keys(TableHeaderNames).forEach((column) => {
      tableRow[column] = new ElementCreator(Configuration.elementParams.winnerTableCellParams);
    });

    tableRow.number.setTextContent((index + 1).toString());

    this.carImg = Configuration.getSVGElement(carSvg, CssClasses.winnerCar);
    this.carImg.style.color = this.color;
    tableRow.car.addInnerElement(this.carImg);

    tableRow.name.setTextContent(this.name);
    tableRow.wins.setTextContent(this.winsCount.toString());
    tableRow.bestTime.setTextContent(this.bestTime.toString());

    Object.values(tableRow).forEach((cell) => {
      this.viewElementCreator.addInnerElement(cell);
    });
  }
}
