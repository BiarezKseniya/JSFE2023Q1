import './news.css';
import { Article } from '../../controller/loader';

export class News {
  public draw(data: Article[]): void {
    const news: Article[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;
    const fragment: DocumentFragment = document.createDocumentFragment();
    const newsItemTemp: HTMLElement = this.getElement(document, '#newsItemTemp');
    if (!(newsItemTemp instanceof HTMLTemplateElement)) {
      throw new Error('There is no instance of template element.');
    }
    this.checkIfEmpty(news, fragment);
    news.forEach((item: Article, idx: number) => {
      const newsClone: Node = newsItemTemp.content.cloneNode(true);
      if (!(newsClone instanceof DocumentFragment)) {
        throw new Error('There is no instance of document fragment.');
      }

      const newsItem = this.getElement(newsClone, '.news__item');
      if (idx % 2) newsItem.classList.add('alt');

      const newsMetaPhoto: HTMLElement = this.getElement(newsClone, '.news__meta-photo');
      newsMetaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
      const newsMetaAuthor: HTMLElement = this.getElement(newsClone, '.news__meta-author');
      newsMetaAuthor.textContent = item.author || item.source.name;
      const newsMetaDate: HTMLElement = this.getElement(newsClone, '.news__meta-date');
      newsMetaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

      const newsDescTitle: HTMLElement = this.getElement(newsClone, '.news__description-title');
      newsDescTitle.textContent = item.title;
      const newsDescSource: HTMLElement = this.getElement(newsClone, '.news__description-source');
      newsDescSource.textContent = item.source.name;
      const newsDescContent: HTMLElement = this.getElement(newsClone, '.news__description-content');
      newsDescContent.textContent = item.description;
      const newsReadMore: HTMLElement = this.getElement(newsClone, '.news__read-more a');
      newsReadMore.setAttribute('href', item.url);

      fragment.append(newsClone);
    });

    const newsDiv: HTMLElement = this.getElement(document, '.news');
    newsDiv.innerHTML = '';
    newsDiv.appendChild(fragment);
  }

  private getElement<T extends Document | DocumentFragment>(root: T, selector: string): HTMLElement {
    const element: HTMLElement | null = root.querySelector(selector);
    if (!element) {
      throw new Error(`Element with selector ${selector} was not found`);
    }
    return element;
  }

  private checkIfEmpty(news: Article[], fragment: DocumentFragment): void {
    if (news.length === 0) {
      const notFoundTemp: HTMLElement = this.getElement(document, '#notFound');
      if (!(notFoundTemp instanceof HTMLTemplateElement)) {
        throw new Error('There is no instance of template element.');
      }
      const newsClone: Node = notFoundTemp.content.cloneNode(true);
      if (!(newsClone instanceof DocumentFragment)) {
        throw new Error('There is no instance of document fragment.');
      }

      const newsItem = this.getElement(newsClone, '.news__not-found');
      newsItem.innerText = 'Nothing was found, try to check another source';
      fragment.append(newsClone);
    }
  }
}
