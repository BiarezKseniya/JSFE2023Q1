import { News } from './news/news';
import { Sources } from './sources/sources';
import { ResponseData } from '../controller/types';
import { Source } from '../controller/types';
import { Article } from '../controller/types';

export class AppView {
  private news: News;
  private sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: Partial<ResponseData>): void {
    const values: Article[] = data?.articles || [];
    this.news.draw(values);
  }

  public drawSources(data: Partial<ResponseData>): void {
    const values: Source[] = data?.sources || [];
    this.sources.draw(values);
  }
}

export default AppView;
