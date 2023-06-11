import { News } from './news/news';
import { Sources } from './sources/sources';
import { ResponseData } from '../controller/loader';
import { Source } from '../controller/loader';
import { Article } from '../controller/loader';

export class AppView {
  private news: News;
  private sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: ResponseData): void {
    const values: Article[] = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  public drawSources(data: ResponseData): void {
    const values: Source[] = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }
}

export default AppView;
