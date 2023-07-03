import { Levels } from '../controller/levels';
import { TechnicalClasses, CodeParser, Level } from '../types/types';

import { EditorView, placeholder } from '@codemirror/view';
import { EditorState } from "@codemirror/state";
import { minimalSetup } from "codemirror";
import { css } from '@codemirror/lang-css';

export class View {
  public cssEditor: EditorView;
  public table: HTMLElement;

  public constructor() {
    this.cssEditor = this.setupInput();
    this.table = this.getHTMLElement('.gameplay__table');
  }

  public render(levels: Levels): void {
    this.renderTable(levels);
    this.renderTask(levels);
    this.renderHTML();
    this.alignEditors();
    this.renderLevels(levels);
    this.updateLevel(levels);
    this.highlight();
    this.setTargetAnimation(levels, TechnicalClasses.strobe);
  }

  public getHTMLElement(selector: string): HTMLElement {
    const element = document.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
      throw new Error('There is no imstance of element');
    };
    return element;
  }

  public getButtons(selector: string): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll(selector);
  }

  public getResponseInput(): string {
    return this.cssEditor.state.doc.toString() || '';
  }

  public setResponseInput(value: string): void {
    if (!this.cssEditor) return;

    this.cssEditor.dispatch({
      changes: { from: 0, to: this.cssEditor.state.doc.length, insert: value },
    });
  }

  public drawMessage(message: string): void {
    this.table.innerHTML = message;
  }

  private renderTable(levels: Levels): void {
    this.table.innerHTML = levels.getTableContent();
    const elements = this.table.querySelectorAll('*');
    elements.forEach((element: Element) => {
      element.classList.add(TechnicalClasses.entrance);
      setTimeout(() => {
        element.classList.remove(TechnicalClasses.entrance);
      }, 1000)
    });
  }

  private renderTask(levels: Levels): void {
    const task = document.querySelector('.gameplay__task');
    if (!task) {
      throw new Error('There is no task element');
    }
    task.innerHTML = levels.getTask();
  }

  private renderHTML(): void {
    const HTMLViewer = document.querySelector('#html-viewer .codebox__code');
    if (!HTMLViewer) {
      throw new Error('There is no element with id HTMLViewer');
    }
    const codeLine = HTMLViewer.querySelector('.codebox__line-code');
    let HTMLContent: string = '';

    for (let i: number = 0; i < this.table.children.length; i++) {
      HTMLContent += this.parseCode(this.table.children[i]);
    }
    if (!codeLine) {
      throw new Error("Codeline doesn't exist");
    }
    codeLine.innerHTML = `<span class="tag">&lt;</span><span class="tagname">div</span> 
    <span class="attribute-name">class</span><span class="attribute-assignment">=</span><span class="attribute-value">"table"</span><span class="tag">&gt;</span>
    ${HTMLContent}\n
    <span class="tag">&lt;/</span><span class="tagname">div</span><span class="tag">&gt;</span>`;
    HTMLViewer.appendChild(codeLine);
  }

  public setTargetAnimation(levels: Levels, animation: string): void {
    this.table.querySelectorAll(levels.getTargetSelector()).forEach((element: Element) => {
      element.classList.add(animation);
    });
  }

  public highlight(): void {
    const editorElements = document.querySelectorAll('#html-viewer .codebox__line-code div');
    const tableElements = this.table.querySelectorAll('*');

    tableElements.forEach((tableElement: Element, index: number) => {
      const editorElement: Element = editorElements[index];

      this.setHoverHandler(tableElement, editorElement, true);
      this.setHoverHandler(editorElement, tableElement, false);

    });
  }

  private setHoverHandler(main: Element, dependent: Element, tooltipFromMain: boolean): void {
    main.addEventListener('mouseover', (event: Event) => {
      event.stopImmediatePropagation();
      main.classList.add(TechnicalClasses.hover);
      dependent.classList.add(TechnicalClasses.hover);
      this.showTooltip(tooltipFromMain ? main : dependent);
    });
    main.addEventListener('mouseout', () => {
      main.classList.remove(TechnicalClasses.hover);
      dependent.classList.remove(TechnicalClasses.hover);
      this.hideTooltip();
    });
  }

  private showTooltip(element: Element): void {
    const tooltip: HTMLElement = this.getHTMLElement('.gameplay__tooltip');
    const elName: string = this.getElementName(element);
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

    tooltip.classList.add(TechnicalClasses.hover);
  }

  private hideTooltip(): void {
    this.getHTMLElement('.gameplay__tooltip').classList.remove(TechnicalClasses.hover);
  }

  private setupInput(): EditorView {
    const parent: HTMLElement = this.getHTMLElement('#codemirror-container');

    const startState: EditorState = EditorState.create({
      extensions: [
        placeholder('Type your selector here...'),
        minimalSetup,
        css(),
        EditorState.transactionFilter.of(tr => {
          return tr.newDoc.lines > 1 ? [] : [tr]
        }),
      ]
    });

    return new EditorView({
      state: startState,
      parent: parent
    });
  }

  public updateLevel(levels: Levels) {
    this.getHTMLElement('.header__current-level').innerHTML = levels.getCurrentLevel().toString();
  }

  public renderLevels(levels: Levels): void {
    const levelsDiv: HTMLElement = this.getHTMLElement('.header__levels-window');

    const fragment: DocumentFragment = document.createDocumentFragment();
    const levelTemplate: HTMLTemplateElement | null = document.querySelector('#level-item-template');
    levels.levels.forEach((level: Level, index: number): void => {
      const cloneLevel: Node | undefined = levelTemplate?.content.cloneNode(true);
      if (!(cloneLevel instanceof DocumentFragment)) {
        throw new Error('cloneLevel is not instance of Document Fragment');
      }
      const levelItem: Element | null = cloneLevel.querySelector('.header__level-item');
      const levelItemText: Element | null = cloneLevel.querySelector('.header__level-item-text');
      if (!levelItem || !levelItemText) {
        throw new Error('There is no levelItem or levelItemText');
      }
      const levelNumber: number = index + 1;
      levelItemText.innerHTML = levelNumber.toString();
      if (index + 1 === levels.getCurrentLevel()) {
        levelItem.classList.add('active');
      }
      if (level.passed === true) {
        levelItem.classList.add('passed');
      }
      if (level.helperUsed === true) {
        levelItemText.classList.add('help');
      }
      fragment.append(cloneLevel);
    });
    levelsDiv.innerHTML = '';
    levelsDiv.appendChild(fragment);
    this.getHTMLElement('.header__level-number').innerHTML = levels.countLevels().toString();
  }

  private parseCode(element: Element, indent: string = CodeParser.indent): string {
    let result: string = '';
    const elName: string = this.getElementName(element);
    const attributeString: string = this.getAttributString(element);
    const attributeSpace: CodeParser.attributeSpace | "" = attributeString.length > 0 ? CodeParser.attributeSpace : '';
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
      for (let j: number = 0; j < element.children.length; j++) {
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
    for (let i: number = 0; i < element.attributes.length; i++) {
      const atr: string = element.attributes[i].name;
      let val: string = element.attributes[i].value;

      if (atr === CodeParser.class) {
        val = val.split(' ').filter(element => !Object.values(TechnicalClasses).includes(element as TechnicalClasses)).join(' ');
      }

      if (val) {
        attributeString +=
          CodeParser.attributeSpace +
          CodeParser.openSpan +
          CodeParser.class +
          CodeParser.assignment +
          CodeParser.quotes +
          CodeParser.attributeName +
          CodeParser.quotes +
          CodeParser.closeOpenSpan +
          atr +
          CodeParser.closeSpan +
          CodeParser.attributeAssignment +
          CodeParser.openSpan +
          CodeParser.class +
          CodeParser.assignment +
          CodeParser.quotes +
          CodeParser.attributeValue +
          CodeParser.quotes +
          CodeParser.closeOpenSpan +
          CodeParser.quotes +
          val +
          CodeParser.quotes +
          CodeParser.closeSpan;
      }
    }
    return attributeString;
  }

  private getElementName(element: Element): string {
    return CodeParser.openSpan +
      CodeParser.class +
      CodeParser.assignment +
      CodeParser.quotes +
      CodeParser.tagName +
      CodeParser.quotes +
      CodeParser.closeOpenSpan +
      element.tagName.toLowerCase() +
      CodeParser.closeSpan;
  }

  private alignEditors(): void {
    const lineNumbersArr: NodeListOf<HTMLElement> = document.querySelectorAll('.codebox__line-numbers');
    const codeArr: NodeListOf<HTMLElement> = document.querySelectorAll('.codebox__main');

    lineNumbersArr.forEach((element: HTMLElement, index: number) => {
      element.style.cssText = '';
      const paddingTop: number = parseFloat(getComputedStyle(element).paddingTop);
      element.style.height = `${codeArr[index].scrollHeight - paddingTop}px`;
    });
  }
}
