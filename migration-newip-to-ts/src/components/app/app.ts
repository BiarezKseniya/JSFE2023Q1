import AppController from '../controller/controller';
import { AppView } from '../view/appView';

import { ResponseData } from '../controller/loader';
import { Source } from '../controller/loader';

class App {
  private readonly controller: AppController;
  private readonly view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    const sources = document.querySelector('.sources');
    if (sources === null) {
      throw new Error('Sources are null');
    }
    sources.addEventListener('click', (e: Event) => {
      this.controller.getNews(e, (data: Partial<ResponseData>) => {
        this.view.drawNews(data);
      });
    });
    this.controller.getSources((data: Partial<ResponseData>) => {
      this.view.drawSources(data);
      this.attachEvents(sources);
    });
    document.querySelector('.search__button')?.addEventListener('click', (e: Event) => {
      e.stopImmediatePropagation();
      const searchInput = document.getElementById('searchVal');
      if (!(searchInput instanceof HTMLInputElement)) {
        throw new Error('There is no input field.');
      }
      const searchVal: string = searchInput?.value;
      this.controller.getSources((data: Partial<ResponseData>) => {
        console.log(data, searchVal);
        data.sources = data.sources?.filter((source: Source): boolean =>
          source.name.toLowerCase().includes(searchVal.toLowerCase()),
        );
        if (!data.sources?.length) {
          alert('There is no such source, try a different one or choose from the list below:)');
          searchInput.value = '';
        } else {
          sources.innerHTML = '';
          this.view.drawSources(data);
          this.attachEvents(sources);
          this.attachEvents(sources);
        }
      });
    });
  }

  private attachEvents(sources: Element): void {
    sources.firstElementChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    for (const child of sources.children) {
      child.addEventListener('click', (e: Event) => {
        if (e.currentTarget !== sources) {
          for (const child of sources.children) {
            child.classList.remove('focus');
          }
          if (!(e.currentTarget instanceof HTMLElement)) {
            throw new Error('There is no HTMLElement to highlight');
          }
          e.currentTarget.classList.add('focus');
        }
      });
    }
  }
}

export default App;
