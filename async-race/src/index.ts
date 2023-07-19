import { HeaderView } from './view/header-view/header-view';
import { MainView } from './view/main-view/main-view';
import './global.css';
import { GarageView } from './view/main-view/garage-view/garage-view';
import { WinnersView } from './view/main-view/winners-view/winners-view';

class App {
  public header: HeaderView;

  public main: MainView;

  public garageView: GarageView;

  public winnersView: WinnersView;

  constructor() {
    this.main = new MainView();
    this.garageView = new GarageView();
    this.winnersView = new WinnersView();

    this.header = new HeaderView([
      {
        name: 'Garage',
        onPress: (): void => {
          this.main.setContent(this.garageView);
        },
      },
      {
        name: 'Winners',
        onPress: (): void => {
          this.main.setContent(this.winnersView);
          this.winnersView.drawWinners();
        },
      },
    ]);
  }

  public createView(): void {
    this.main.setContent(this.garageView);
    document.body.append(this.header.getHtmlElement(), this.main.getHtmlElement());
  }
}

const app: App = new App();
app.createView();
