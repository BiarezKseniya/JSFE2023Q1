export interface ElementParams {
  tag: string;
  classNames: string[];
  textContent?: string;
  type?: string;
  value?: string;
  callback?: ((arg: MouseEvent) => void) | null;
}

export class ElementCreator {
  public element: HTMLElement;

  constructor(params: ElementParams) {
    this.element = this.createElement(params);
    this.setCssClasses(params.classNames);
    this.setTextContent(params.textContent);
    this.setType(params.type);
    this.setValue(params.value);
    // this.setCallback(params.callback);
  }

  public createElement(params: ElementParams): HTMLElement {
    return document.createElement(params.tag);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public addInnerElement(element: HTMLElement | ElementCreator): void {
    if (element instanceof ElementCreator) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  public setCssClasses(cssClasses: string[] = []): void {
    cssClasses.map((cssClass: string) => this.element.classList.add(cssClass));
  }

  public setTextContent(text: string = ''): void {
    this.element.textContent = text;
  }

  public setType(text: string = ''): void {
    if ('type' in this.element) {
      this.element.setAttribute('type', text);
    }
  }

  public setValue(text: string = ''): void {
    if ('value' in this.element) {
      this.element.value = text;
    }
  }

  public setCallback(callback: ElementParams['callback']): void {
    if (typeof callback === 'function') {
      this.element.addEventListener('click', (event: MouseEvent) => callback(event));
    }
  }

  public toggleDisableElement(flag: boolean): void {
    if (this.element instanceof HTMLButtonElement || this.element instanceof HTMLInputElement) {
      this.element.disabled = flag;
    }
  }
}
