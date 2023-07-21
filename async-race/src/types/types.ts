export interface ElementParams {
  tag: string;
  classNames: string[];
  textContent?: string;
  type?: string;
  value?: string;
  callback?: ((arg: MouseEvent) => void) | null;
}

export interface ViewParams {
  tag: string;
  classNames: string[];
}

export interface Page {
  name: string;
  onPress: () => void;
}

export interface WinnerData {
  id: number;
  name: string;
  bestTime: number;
  winsCount: number;
  color: string;
}

export enum CssClasses {
  header = 'header',
  nav = 'header__nav',
  button = 'header__switch-page',
  main = 'main',
  controls = 'controls',
  carControls = 'controls__car',
  raceControls = 'controls__race',
  carCreate = 'controls__car-create',
  carUpdate = 'controls__car-update',
  inputName = 'controls__input-name',
  inputColor = 'controls__input-color',
  buttonCar = 'controls__car-button',
  buttonRace = 'controls__race-button',
  garage = 'garage',
  garageHeader = 'garage__header',
  garagePage = 'garage__page',
  garagePaginator = 'garage__paginator',
  garagePaginatorBtn = 'garage__paginator-button',
  carsWrap = 'garage__cars',
  carParams = 'car-params',
  carParamsControls = 'car-params__controls',
  carButton = 'car-params__button',
  carName = 'car-params__name',
  track = 'track',
  trackControls = 'track__controls',
  trackButton = 'track__button',
  trackCar = 'track__car',
  trackFinish = 'track__finish',
  winners = 'winners',
  winnersHeader = 'winners__header',
  winnersPage = 'winners__page',
  winnersPaginator = 'winners__paginator',
  winnersPaginatorBtn = 'winners__paginator-button',
  winnersTable = 'winners__score',
  winnersTableHead = 'winners__score-head',
  winnersSort = 'winners__sort-param',
  winnerTableItem = 'winners__score-item',
  winnerCar = 'winner__car-img',
  popUp = 'popup',
  asc = 'asc',
  desc = 'desc',
}

export enum CarParams {
  placeholderName = 'Lexus Nexus',
  placeholderColor = '#D1D1D1',
}

export enum SortValues {
  noSort = 0,
  asc = 1,
  desc = 2,
}

export enum SortTypes {
  wins = 'wins',
  time = 'time',
}

export enum TableHeaderNames {
  number = 'Number',
  car = 'Car',
  name = 'Name',
  wins = 'Wins',
  bestTime = 'Best time (sec)',
}
