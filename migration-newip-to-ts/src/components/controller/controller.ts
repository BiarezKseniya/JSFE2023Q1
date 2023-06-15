import AppLoader from './appLoader';
import { Callback } from './types';

class AppController extends AppLoader {
  public getSources(callback: Callback): void {
    super.getResp(
      {
        endpoint: 'sources',
      },
      callback,
    );
  }

  public getNews(e: Event, callback: Callback): void {
    let target: EventTarget | null = e.target;
    const newsContainer: EventTarget | null = e.currentTarget;

    while (target !== newsContainer) {
      if (target === null || newsContainer === null) {
        throw new Error('Either target or newsContainer does not exist.');
      }
      if (!(target instanceof HTMLElement) || !(newsContainer instanceof HTMLElement)) {
        throw new Error('Either target or newsComtainer is not instance of HTMLElement');
      }

      if (target.classList.contains('source__item')) {
        const sourceId: string | null = target.getAttribute('data-source-id');
        if (sourceId === null) {
          throw new Error("SourceId doesn't exist");
        }
        if (newsContainer.getAttribute('data-source') !== sourceId) {
          newsContainer.setAttribute('data-source', sourceId);
          super.getResp(
            {
              endpoint: 'everything',
              options: {
                sources: sourceId,
              },
            },
            callback,
          );
        }
        return;
      }
      target = target.parentNode;
    }
  }
}

export default AppController;
