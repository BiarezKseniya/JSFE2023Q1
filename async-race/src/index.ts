import { HeaderView } from './view/header-view/header-view';
import { MainView } from './view/main-view/main-view';
import './global.css';
import { GarageView } from './view/main-view/garage-view/garage-view';

class App {
  public header: null | HeaderView;

  public main: null | MainView;

  public garageView: null | GarageView;

  constructor() {
    this.header = null;
    this.main = null;
    this.garageView = null;
    this.createView();
  }

  private createView(): void {
    this.header = new HeaderView();
    this.main = new MainView();
    this.garageView = new GarageView();
    this.main.setContent(this.garageView);
    document.body.append(this.header.getHtmlElement(), this.main.getHtmlElement());
  }
}

const app: App = new App();
