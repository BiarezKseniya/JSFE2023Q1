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
      this.controller.getNews(e, (data: Partial<ResponseData>) => {
        this.view.drawNews(data);
        console.log(e);
      }),
    );
    this.controller.getSources((data: Partial<ResponseData>) => {
      this.view.drawSources(data);
      sources.firstElementChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  }
}

export default App;
