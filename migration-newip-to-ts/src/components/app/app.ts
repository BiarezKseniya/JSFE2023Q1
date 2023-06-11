import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { ResponseData } from '../controller/loader';

class App {
  private readonly controller: AppController;
  private readonly view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    const sources: Element | null = document.querySelector('.sources');
    if (sources === null) {
      throw new Error('Sources are null');
    }
    sources.addEventListener('click', (e: Event) =>
      this.controller.getNews(e, (data: ResponseData) => this.view.drawNews(data)),
    );
    this.controller.getSources((data: ResponseData) => this.view.drawSources(data));
  }
}

export default App;
