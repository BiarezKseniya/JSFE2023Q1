import { View, ViewParams } from '../../view';
import { ElementCreator, ElementParams } from '../../../util/element-creator';
import { WinnerData } from '../garage-view/garage-components-view/track-view';
import carSvg from '../../../assets/car.svg';

enum CssClasses {
  winnerTableItem = 'winners__score-item',
  winnerCar = 'winner__car-img',
}

export class WinnerView extends View {
  public static instances: WinnerView[] = [];

  public name: string;

  public color: string;

  public id: number;

  private winsCount: number | null = 0;

  private bestTime: number | null = 0;

  private carImg: HTMLElement | null = null;

  constructor(winner: WinnerData) {
    const params: ViewParams = {
      tag: 'tr',
      classNames: [],
    };
    super(params);

    // if (id) {
    this.id = winner.id;
    // } else {
    //   ApiHandler.createCar(name, color).then((data) => {
    //     this.id = data;
    //   });
    // }
    this.name = winner.name;
    this.color = winner.color;
    this.id = winner.id;

    WinnerView.instances.push(this);
    this.configureView();
  }

  public configureView(): void {
    const numberParams: ElementParams = {
      tag: 'td',
      classNames: [CssClasses.winnerTableItem],
      textContent: (WinnerView.instances.indexOf(this) + 1).toString(),
    };
    this.viewElementCreator.addInnerElement(new ElementCreator(numberParams));

    const imgParams: ElementParams = {
      tag: 'td',
      classNames: [CssClasses.winnerTableItem],
    };
    const imgItem = new ElementCreator(imgParams);

    this.carImg = this.getSVGElement(carSvg, CssClasses.winnerCar);
    this.carImg.style.color = this.color;
    imgItem.addInnerElement(this.carImg);
    this.viewElementCreator.addInnerElement(imgItem);

    const nameParams: ElementParams = {
      tag: 'td',
      classNames: [CssClasses.winnerTableItem],
      textContent: this.name,
    };
    this.viewElementCreator.addInnerElement(new ElementCreator(nameParams));

    const winsCountParams: ElementParams = {
      tag: 'td',
      classNames: [CssClasses.winnerTableItem],
      textContent: this.winsCount?.toString(),
    };
    this.viewElementCreator.addInnerElement(new ElementCreator(winsCountParams));

    const bestTimeParams: ElementParams = {
      tag: 'td',
      classNames: [CssClasses.winnerTableItem],
      textContent: this.bestTime?.toString(),
    };
    this.viewElementCreator.addInnerElement(new ElementCreator(bestTimeParams));
  }

  private getSVGElement(svg: string, className: string): HTMLElement {
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgElement.classList.add(className);
    return svgElement;
  }
}
