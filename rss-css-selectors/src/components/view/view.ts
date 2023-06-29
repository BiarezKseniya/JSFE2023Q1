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
    this.highlight();
    this.setTarget(levels);
  }

  public getTableElement(): Element {
    const table = document.querySelector('.gameplay__table');
    if (!table) {
      throw new Error('There is no table element');
    }
    return table
  }

  public getLevelButtons(): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll('.header__levels-switch');
  }

  private renderTable(levels: Levels): void {
    const table = this.getTableElement();
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
    const table = this.getTableElement();
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
    table.querySelectorAll(levels.getTargetSelector()).forEach((element) => {
      element.classList.add('target');
    });
  }

  public highlight(): void {
    const editorElements = document.querySelectorAll('#html-viewer .codebox__line-code *');
    const tableElements = document.querySelectorAll('.gameplay__table *');

    tableElements.forEach((tableElement, index) => {
      const editorElement = editorElements[index];

      this.setHoverHandler(tableElement, editorElement, true);
      this.setHoverHandler(editorElement, tableElement, false);

    });
  }

  private setHoverHandler(main: Element, dependent: Element, tooltipFromMain: boolean): void {
    main.addEventListener('mouseover', (event: Event) => {
      event.stopImmediatePropagation();
      main.classList.add('hover');
      dependent.classList.add('hover');
      this.showTooltip(tooltipFromMain ? main : dependent);
    });
    main.addEventListener('mouseout', () => {
      main.classList.remove('hover');
      dependent.classList.remove('hover');
      this.hideTooltip();
    });
  }

  private showTooltip(element: Element): void {
    const tooltip = document.querySelector('.gameplay__tooltip');

    if (!(tooltip instanceof HTMLElement)) {
      throw new Error('Tooltip is not found');
    };

    const elName: string = element.tagName.toLowerCase();
    const attributeString: string = this.getAttributString(element);
    const attributeSpace: CodeParser.attributeSpace | "" = attributeString.length > 0 ? CodeParser.attributeSpace : '';

    tooltip.innerHTML =
      CodeParser.openTag +
      elName +
      attributeSpace +
      attributeString +
      CodeParser.closeTag +
      CodeParser.openClosingTag +
      elName +
      CodeParser.closeTag;

    if (!(element instanceof HTMLElement)) {
      throw new Error('HTML element was not found');
    }
    const pos: DOMRect = element.getBoundingClientRect();
    tooltip.style.top = pos.top - tooltip.offsetHeight * 1.15 + window.scrollY + "px";
    tooltip.style.left = pos.left + element.offsetWidth / 2 + window.scrollX + "px";

    tooltip.classList.add('hover');
  }

  private hideTooltip(): void {
    const tooltip = document.querySelector('.gameplay__tooltip');

    if (!tooltip) {
      throw new Error('Tooltip is not found');
    };

    tooltip.classList.remove('hover');
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
      if (level.passed === true) {
        levelItem.classList.add('passed');
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
    const elName: string = element.tagName.toLowerCase();
    const attributeString: string = this.getAttributString(element);
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
    return result;
  }

  private getAttributString(element: Element): string {
    let attributeString: string = '';
    for (let i = 0; i < element.attributes.length; i++) {
      const atr = element.attributes[i].name;
      let val = element.attributes[i].value;

      if (atr === 'class') {
        val = val.split(' ').filter(element => element !== 'target' && element !== 'hover').join(' ');
      }

      if (val) {
        attributeString +=
          CodeParser.attributeSpace +
          atr +
          CodeParser.attributeAssignment +
          CodeParser.quotes +
          val +
          CodeParser.quotes;
      }
    }
    return attributeString;
  }
}
