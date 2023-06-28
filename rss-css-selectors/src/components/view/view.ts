import { Levels } from '../controller/levels';

export enum CodeParser {
  indent = '&nbsp;&nbsp;',
  openTag = '&lt;',
  closeTag = '&gt;',
  openClosingTag = '&lt;/',
  closeOpenClosingTag = ' /&gt;',
  openWrap = '<div>',
  closeWrap = '</div>',
  attributeSpace = ' ',
  attributeAssignment = '=',
  quotes = '"',
}

export class View {
  public render(levels: Levels): void {
    this.renderTable(levels);
    this.renderTask(levels);
    this.renderHTML();
    this.renderLevels(levels);
    this.updateLevel(levels);
    this.setTarget(levels);
    this.highlight();
  }

  public getTableElement(): Element | null {
    return document.querySelector('.gameplay__table');
  }

  public getLevelButtons(): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll('.header__levels-switch');
  }

  private renderTable(levels: Levels): void {
    const table = this.getTableElement();
    if (!table) {
      throw new Error('There is no table element');
    }
    table.innerHTML = levels.getTableContent();
  }

  private renderTask(levels: Levels): void {
    const task = document.querySelector('.gameplay__task');
    if (!task) {
      throw new Error('There is no task element');
    }
    task.innerHTML = levels.getTask();
  }

  private renderHTML(): void {
    const HTMLViewer = document.querySelector('#html-viewer');
    if (!HTMLViewer) {
      throw new Error('There is no element with id HTMLViewer');
    }
    const table = document.querySelector('.gameplay__table');
    if (!table) {
      throw new Error('There is no table element');
    }
    const codeLine = HTMLViewer.querySelector('.codebox__line-code');
    let HTMLContent: string = '';

    for (let i = 0; i < table.children.length; i++) {
      HTMLContent += this.parseCode(table.children[i]);
    }
    if (!codeLine) {
      throw new Error("Codeline doesn't exist");
    }
    codeLine.innerHTML = `&lt;div class="table"&gt;${HTMLContent}\n&lt;/div&gt;`;
    HTMLViewer.appendChild(codeLine);
  }

  public setTarget(levels: Levels): void {
    const table = this.getTableElement();
    table?.querySelectorAll(levels.getTargetSelector())?.forEach((element) => {
      element.classList.add('target');
    });
  }

  public highlight(): void {
    const editorElements = document.querySelectorAll('#html-viewer .codebox__line-code *');
    const tableElements = document.querySelectorAll('.gameplay__table *');
    editorElements?.forEach((element) => {
      const index: number = Array.prototype.indexOf.call(editorElements, element);
      element.addEventListener('mouseover', (event: Event) => {
        event.stopImmediatePropagation();
        element.classList.add('hover');
        tableElements[index].classList.add('hover');
      });
      element.addEventListener('mouseout', () => {
        element.classList.remove('hover');
        tableElements[index].classList.remove('hover');
      });
    });
    tableElements.forEach((element) => {
      const index: number = Array.prototype.indexOf.call(tableElements, element);
      element.addEventListener('mouseover', (event: Event) => {
        event.stopImmediatePropagation();
        element.classList.add('hover');
        editorElements[index].classList.add('hover');
      });
      element.addEventListener('mouseout', () => {
        element.classList.remove('hover');
        editorElements[index].classList.remove('hover');
      });
    });
  }

  public updateLevel(levels: Levels) {
    const levelDiv = document.querySelector('.header__current-level');
    if (!levelDiv) {
      throw new Error("Div doesn't exist");
    }
    levelDiv.innerHTML = levels.getCurrentLevel().toString();
  }

  private renderLevels(levels: Levels): void {
    const levelsDiv = document.querySelector('.header__levels-window');
    if (!levelsDiv) {
      throw new Error('Levels block was not found');
    }
    const fragment: DocumentFragment = document.createDocumentFragment();
    const levelTemplate: HTMLTemplateElement | null = document.querySelector('#level-item-template');
    levels.levels.forEach((level, index): void => {
      const cloneLevel: Node | undefined = levelTemplate?.content.cloneNode(true);
      if (!(cloneLevel instanceof DocumentFragment)) {
        throw new Error('cloneLevel is not instance of Document Fragment');
      }
      const levelItem = cloneLevel?.querySelector('.header__level-item');
      if (!levelItem) {
        throw new Error('There is no levelItem');
      }
      const levelNumber: number = index + 1;
      levelItem.innerHTML = levelNumber.toString();
      if (index + 1 === levels.getCurrentLevel()) {
        levelItem.classList.add('active');
      }
      fragment.append(cloneLevel);
    });
    levelsDiv.innerHTML = '';
    levelsDiv?.appendChild(fragment);
    const numOfLevelsDiv = document.querySelector('.header__level-number');
    if (!numOfLevelsDiv) {
      throw new Error('There is no element to show levels number');
    }
    numOfLevelsDiv.innerHTML = levels.countLevels().toString();
  }

  private parseCode(element: Element, indent: string = CodeParser.indent): string {
    let result: string = '';
    if (element.nodeType === Node.ELEMENT_NODE) {
      const elName: string = element.tagName.toLowerCase();
      let attributeString: string = '';
      for (let i = 0; i < element.attributes.length; i++) {
        attributeString +=
          CodeParser.attributeSpace +
          element.attributes[i].name +
          CodeParser.attributeAssignment +
          CodeParser.quotes +
          element.attributes[i].value +
          CodeParser.quotes;
      }
      const attributeSpace = attributeString.length > 0 ? CodeParser.attributeSpace : '';
      let elementSpace: string = indent;
      if (element.children.length > 0) {
        result +=
          CodeParser.openWrap +
          elementSpace +
          CodeParser.openTag +
          elName +
          attributeSpace +
          attributeString +
          CodeParser.closeTag;
        elementSpace += CodeParser.indent;
        for (let j = 0; j < element.children.length; j++) {
          result += this.parseCode(element.children[j], elementSpace);
        }
        result += indent + CodeParser.openClosingTag + elName + CodeParser.closeTag + CodeParser.closeWrap;
      } else {
        result +=
          CodeParser.openWrap +
          elementSpace +
          CodeParser.openTag +
          elName +
          attributeSpace +
          attributeString +
          CodeParser.closeOpenClosingTag +
          elementSpace +
          CodeParser.closeWrap;
      }
    }
    return result;
  }
}
