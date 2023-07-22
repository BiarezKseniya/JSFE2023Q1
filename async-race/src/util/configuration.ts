import { CssClasses, CarParams, ElementParamsObject, ViewParamsObject } from '../types/types';

export abstract class Configuration {
  public static elementParams: ElementParamsObject = {
    popupParams: {
      tag: 'div',
      classNames: [CssClasses.popUp],
    },
    navParams: {
      tag: 'nav',
      classNames: [CssClasses.nav],
    },
    carParams: {
      tag: 'div',
      classNames: [CssClasses.carParams],
    },
    carControls: {
      tag: 'div',
      classNames: [CssClasses.carParamsControls],
    },
    carButtonSelect: {
      tag: 'button',
      classNames: [CssClasses.carButton],
      textContent: 'Select',
      type: 'button',
    },
    headerBtnParams: {
      tag: 'button',
      classNames: [CssClasses.button],
      type: 'button',
    },
    carControlsParams: {
      tag: 'div',
      classNames: [CssClasses.carControls],
    },
    carCreateParams: {
      tag: 'div',
      classNames: [CssClasses.carCreate],
    },
    carUpdateParams: {
      tag: 'div',
      classNames: [CssClasses.carUpdate],
    },
    inputNameParams: {
      tag: 'input',
      classNames: [CssClasses.inputName],
      type: 'text',
    },
    inputColorParams: {
      tag: 'input',
      classNames: [CssClasses.inputColor],
      type: 'color',
      value: CarParams.placeholderColor,
    },
    buttonCarCreateParams: {
      tag: 'button',
      classNames: [CssClasses.buttonCar],
      textContent: 'Create',
      type: 'button',
    },
    buttonCarUpdateParams: {
      tag: 'button',
      classNames: [CssClasses.buttonCar],
      textContent: 'Update',
      type: 'button',
    },
    raceControlsParams: {
      tag: 'div',
      classNames: [CssClasses.raceControls],
    },
    buttonRaceRaceParams: {
      tag: 'button',
      classNames: [CssClasses.buttonRace],
      textContent: 'Race',
      type: 'button',
    },
    buttonRaceResetParams: {
      tag: 'button',
      classNames: [CssClasses.buttonRace],
      textContent: 'Reset',
      type: 'button',
    },
    buttonRaceGenerateParams: {
      tag: 'button',
      classNames: [CssClasses.buttonRace],
      textContent: 'Generate cars',
      type: 'button',
    },
    garageHeaderParams: {
      tag: 'h1',
      classNames: [CssClasses.garageHeader],
    },
    garagePageParams: {
      tag: 'h3',
      classNames: [CssClasses.garagePage],
    },
    carsWrapParams: {
      tag: 'div',
      classNames: [CssClasses.carsWrap],
    },
    garagePaginatorParams: {
      tag: 'div',
      classNames: [CssClasses.garagePaginator],
    },
    garagePaginatorPrevParams: {
      tag: 'button',
      classNames: [CssClasses.garagePaginatorBtn],
      textContent: 'PREV',
      type: 'button',
    },
    garagePaginatorNextParams: {
      tag: 'button',
      classNames: [CssClasses.garagePaginatorBtn],
      textContent: 'NEXT',
      type: 'button',
    },
    carParamsParams: {
      tag: 'div',
      classNames: [CssClasses.carParams],
    },
    carTrackControlsParams: {
      tag: 'div',
      classNames: [CssClasses.carParamsControls],
    },
    carButtonSelectParams: {
      tag: 'button',
      classNames: [CssClasses.carButton],
      textContent: 'Select',
      type: 'button',
    },
    carButtonRemoveParams: {
      tag: 'button',
      classNames: [CssClasses.carButton],
      textContent: 'Remove',
      type: 'button',
    },
    carNameParams: {
      tag: 'div',
      classNames: [CssClasses.carName],
    },
    trackParams: {
      tag: 'div',
      classNames: [CssClasses.track],
    },
    trackControlsParams: {
      tag: 'div',
      classNames: [CssClasses.trackControls],
    },
    trackButtonAParams: {
      tag: 'button',
      classNames: [CssClasses.trackButton],
      textContent: 'A',
      type: 'button',
    },
    trackButtonBParams: {
      tag: 'button',
      classNames: [CssClasses.trackButton],
      textContent: 'B',
      type: 'button',
    },
    winnersHeaderParams: {
      tag: 'h1',
      classNames: [CssClasses.winnersHeader],
    },
    winnersPageParams: {
      tag: 'h3',
      classNames: [CssClasses.winnersPage],
    },
    winnersPaginatorParams: {
      tag: 'div',
      classNames: [CssClasses.winnersPaginator],
    },
    winnersPaginatorPrevParams: {
      tag: 'button',
      classNames: [CssClasses.winnersPaginatorBtn],
      textContent: 'PREV',
      type: 'button',
    },
    winnersPaginatorNextParams: {
      tag: 'button',
      classNames: [CssClasses.winnersPaginatorBtn],
      textContent: 'NEXT',
      type: 'button',
    },
    winnerTableParams: {
      tag: 'table',
      classNames: [CssClasses.winnersTable],
    },
    winnersTableHeadParams: {
      tag: 'thead',
      classNames: [CssClasses.winnersTableHead],
    },
    winnersTableHeadItemParams: {
      tag: 'th',
      classNames: [CssClasses.winnersTableHead],
    },
    winnersTableBodyParams: {
      tag: 'tbody',
      classNames: [],
    },
    winnerTableCellParams: {
      tag: 'td',
      classNames: [CssClasses.winnerTableItem],
    },
  };

  public static viewParams: ViewParamsObject = {
    headerParams: {
      tag: 'header',
      classNames: [CssClasses.header],
    },
    mainParams: {
      tag: 'main',
      classNames: [CssClasses.main],
    },
    controlsSectionParams: {
      tag: 'section',
      classNames: [CssClasses.controls],
    },
    garageSectionParams: {
      tag: 'section',
      classNames: [CssClasses.garage],
    },
    trackView: {
      tag: 'div',
      classNames: [],
    },
    garageView: {
      tag: 'div',
      classNames: [],
    },
    winnersSection: {
      tag: 'section',
      classNames: [CssClasses.winners],
    },
    winnerView: {
      tag: 'tr',
      classNames: [],
    },
  };

  private static carModel: Map<string, string> = new Map([
    ['Lexus', 'RX'],
    ['BMW', 'X6'],
    ['Cadillac', 'Escalade'],
    ['Toyota', 'Corolla'],
    ['Mercedez', 'McLaren'],
    ['Porshe', 'Carrera'],
    ['Jaguar', 'F-Type SVR'],
    ['Genezis', 'G80'],
    ['Chevrolet', 'Impala'],
    ['Lamborghini', 'Veneno'],
    ['Ferrari', 'Dino'],
  ]);

  public static getSVGElement(svg: string, className: string): HTMLElement {
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgElement.classList.add(className);
    return svgElement;
  }

  public static getRandomName(): string {
    const arrayKeys = [...Configuration.carModel.keys()];
    const arrayValues = [...Configuration.carModel.values()];

    const numberKey = Math.floor(Math.random() * arrayKeys.length);
    const numberValue = Math.floor(Math.random() * arrayValues.length);
    return `${arrayKeys[numberKey]} ${arrayValues[numberValue]}`;
  }

  public static getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }
}
