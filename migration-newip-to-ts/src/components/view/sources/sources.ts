import './sources.css';
import { Source } from '../../controller/loader';

export class Sources {
  public draw(data: Source[]): void {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const sourceItemTemp: Element | null = document.querySelector('#sourceItemTemp');
    if (!(sourceItemTemp instanceof HTMLTemplateElement)) {
      throw new Error('There is no instance of template element.');
    }

    data.forEach((item: Source) => {
      const sourceClone: Node = sourceItemTemp.content.cloneNode(true);
      if (!(sourceClone instanceof DocumentFragment)) {
        throw new Error('There is no instance of document fragment.');
      }
      const sourceItemName: HTMLElement | null = sourceClone.querySelector('.source__item-name');
      if (!sourceItemName) {
        throw new Error("Element with selector '.source__item-name' doesn't exist");
      }
      sourceItemName.textContent = item.name;
      const sourceItem: HTMLElement | null = sourceClone.querySelector('.source__item');
      if (!sourceItem) {
        throw new Error("Element with selector '.source__item' doesn't exist");
      }
      sourceItem.setAttribute('data-source-id', item.id);

      fragment.append(sourceClone);
    });

    const sourcesDiv: HTMLElement | null = document.querySelector('.sources');
    if (!sourcesDiv) {
      throw new Error("Element with selector '.sources' doesn't exist");
    }
    sourcesDiv.append(fragment);
  }
}
