import { Levels } from './levels';
import { View } from '../view/view';
import { TechnicalClasses, Buttons, Styles, Level } from '../types/types';

export class Controller {
  public levels: Levels;
  public view: View;

  constructor() {
    this.levels = new Levels();
    this.view = new View();
  }

  public async start(): Promise<void> {
    await this.levels.fetchLevels();
    this.handleLevelSaving();
    this.loadLevel();
    this.setResponseHandler();
    this.toggleLevelsTable();
    this.getHelp();
    this.handleRefresh();
  }

  private loadLevel(): void {
    this.view.render(this.levels);
    this.handleHighlight(Styles.enablePointerEvents, Boolean(Styles.enableButton));
    this.handleButtonStyles();
    this.handleLevelSwitch();
    this.handleLevelChoice();
  }

  private setResponseHandler(): void {
    const submitBtn: HTMLButtonElement | null = document.querySelector('.codebox__button_submit');

    submitBtn?.addEventListener('click', (): void => {
      const response: string = this.view.getResponseInput();

      if (response === '' || !this.checkResponse(response)) {
        const editors: HTMLElement = this.view.getHTMLElement('.editors');
        editors.classList.add('shake');
        setTimeout(() => {
          editors?.classList.remove('shake');
        }, 500);
      } else {
        this.view.setTargetAnimation(this.levels, TechnicalClasses.exit);
        setTimeout(() => {
          this.levels.setLevelCompleted();
          this.view.setResponseInput('');
          if (this.levels.levels.every((level) => level.passed === true)) {
            this.handleLastLevel("Congrats, you're a CSS master chief now :)");
          } else if (this.levels.getCurrentLevel() !== this.levels.countLevels()) {
            this.levels.setCurrentLevel(this.levels.getCurrentLevel() + 1);
            this.loadLevel();
          } else {
            this.handleLastLevel("Well done, but you've got still other levels to complete!");
          }
        }, 1000);
      }
    });

    const editorContainer: HTMLDivElement | null = document.querySelector('#codemirror-container');

    if (!editorContainer) {
      throw new Error('Editor container is not found');
    }

    editorContainer.addEventListener('keydown', (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitBtn?.click();
      }
    });
  }

  private checkResponse(response: string): boolean {
    const expected = this.view.table.querySelectorAll(this.levels.getTargetSelector());
    let assertion: NodeListOf<Element>;

    try {
      assertion = this.view.table.querySelectorAll(response);
    } catch (error: unknown) {
      return false;
    }

    if (!expected || !assertion) {
      throw new Error('There is nothing to compare');
    }

    if (expected.length !== assertion.length) {
      return false;
    }

    for (let i = 0; i < expected.length; i++) {
      if (expected[i] !== assertion[i]) {
        return false;
      }
    }

    return true;
  }

  private handleLastLevel(message: string): void {
    this.view.renderLevels(this.levels);
    this.handleLevelChoice();
    this.handleHighlight(Styles.disablePointerEvents, Boolean(Styles.disableButton));
    this.view.drawMessage(message);
  }

  private handleHighlight(mouseoverStyle: string, buttonStyle: boolean): void {
    const HTMLViewer: HTMLElement = this.view.getHTMLElement('#html-viewer .codebox__code');
    HTMLViewer.style.pointerEvents = mouseoverStyle;
    const codeboxBtns: NodeListOf<HTMLButtonElement> = this.view.getAllElements<HTMLButtonElement>('.codebox__button');
    codeboxBtns.forEach((button: HTMLButtonElement) => {
      this.handleButtonEvents(button, buttonStyle);
    });
  }

  private handleButtonEvents(button: HTMLButtonElement, style: boolean): void {
    button.disabled = style;
  }

  private handleLevelSwitch(): void {
    this.view
      .getAllElements<HTMLButtonElement>('.header__levels-switch')
      .forEach((button: Element, buttonIndex: number) => {
        button.addEventListener('click', (event: Event): void => {
          event.stopImmediatePropagation();
          let newLevel: number;
          buttonIndex === Buttons.left
            ? (newLevel = this.levels.decrementLevel())
            : (newLevel = this.levels.incrementLevel());
          if (this.levels.checkIfLevel(newLevel)) {
            this.levels.setCurrentLevel(newLevel);
            this.loadLevel();
            this.closeLevelsTable();
          }
        });
      });
  }

  private handleButtonStyles(level: number = this.levels.getCurrentLevel()): void {
    const buttons: NodeListOf<HTMLButtonElement> =
      this.view.getAllElements<HTMLButtonElement>('.header__levels-switch');

    if (level === 1) {
      this.handleButtonEvents(buttons[Buttons.left], Boolean(Styles.disableButton));
    } else {
      this.handleButtonEvents(buttons[Buttons.left], Boolean(Styles.enableButton));
    }
    if (level === this.levels.countLevels()) {
      this.handleButtonEvents(buttons[Buttons.right], Boolean(Styles.disableButton));
    } else {
      this.handleButtonEvents(buttons[Buttons.right], Boolean(Styles.enableButton));
    }
  }

  private toggleLevelsTable(): void {
    const openLevelsBtn: HTMLElement = this.view.getHTMLElement('.header__level');
    const levelsTable: HTMLElement = this.view.getHTMLElement('.header__levels-window');

    openLevelsBtn.addEventListener('click', (event: Event): void => {
      if (event.target instanceof Node && !levelsTable.classList.contains('open')) {
        event.stopImmediatePropagation();
        levelsTable.classList.add('open');
        openLevelsBtn.classList.add('open');
      }
    });
    document.addEventListener('click', (event: Event): void => {
      if (event.target instanceof Node && levelsTable !== event.target && levelsTable.classList.contains('open')) {
        this.closeLevelsTable();
      }
    });
  }

  private closeLevelsTable(): void {
    this.view.getHTMLElement('.header__levels-window').classList.remove('open');
    this.view.getHTMLElement('.header__level').classList.remove('open');
  }

  private handleLevelChoice(): void {
    const levelItems: NodeListOf<HTMLButtonElement> =
      this.view.getAllElements<HTMLButtonElement>('.header__level-item');

    levelItems.forEach((levelItem: HTMLButtonElement) => {
      levelItem.addEventListener('click', (): void => {
        const newLevel: number = +levelItem.innerText;

        levelItems.forEach((levelItem: HTMLButtonElement) => {
          levelItem.classList.remove('active');
        });

        this.levels.setCurrentLevel(newLevel);
        levelItem.classList.add('active');
        this.loadLevel();
      });
    });
  }

  private getHelp(): void {
    this.view.getHTMLElement('.codebox__button_help').addEventListener('click', (): void => {
      const currentLevelObj: Level = this.levels.levels[this.levels.getCurrentLevel() - 1];
      const answer: string = currentLevelObj.selector;
      let counter: number = 0;
      let value: string = '';

      const type = (): void => {
        if (counter < answer.length) {
          value += answer.charAt(counter);
          this.view.setResponseInput(value);
          counter++;
          setTimeout(type, 100);
        }
      };

      type();
      this.view.cssEditor.focus();
      this.view.cssEditor.dispatch(
        this.view.cssEditor.state.update({
          selection: {
            anchor: this.view.cssEditor.state.doc.length,
            head: this.view.cssEditor.state.doc.length,
          },
        }),
      );
      currentLevelObj.helperUsed = true;
    });
  }

  private handleRefresh(): void {
    this.view.getHTMLElement('.header__refresh-img').addEventListener('click', (): void => {
      this.levels.clearProgress();
      this.loadLevel();
    });
  }

  private handleLevelSaving(): void {
    window.addEventListener('beforeunload', (): void => {
      localStorage.setItem('levels', JSON.stringify(this.levels.levels));
      localStorage.setItem('currentLevel', JSON.stringify(this.levels.getCurrentLevel()));
    });
    window.addEventListener('load', (): void => {
      const levels: string | null = localStorage.getItem('levels');
      const currentLevel: string | null = localStorage.getItem('currentLevel');

      if (levels !== null && currentLevel !== null) {
        this.levels.levels = JSON.parse(levels);
        this.levels.setCurrentLevel(+JSON.parse(currentLevel));
      }

      this.loadLevel();
    });
  }
}
