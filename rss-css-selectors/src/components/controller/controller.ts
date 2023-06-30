import { Level, Levels } from './levels';
import { View, TechnicalClasses } from '../view/view';

export enum Buttons {
  left = 0,
  right = 1,
}

export enum Styles {
  disablePointerEvents = 'none',
  enablePointerEvents = 'auto',
  disableButton = 1,
  enableButton = 0,
}

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
    const response: HTMLInputElement = this.view.getResponseInput();

    submitBtn?.addEventListener('click', (event) => {
      if (response.value === '' || !this.checkResponse(response.value)) {
        const editors = document.querySelector('.editors');
        editors?.classList.add('shake');
        setTimeout(() => {
          editors?.classList.remove('shake');
        }, 500)
      } else {
        this.view.setTargetAnimation(this.levels, TechnicalClasses.exit);
        setTimeout(() => {
          this.levels.setLevelCompleted();
          response.value = '';
          if (this.levels.levels.every((level) => level.passed === true)) {
            this.handleLastLevel("Congrats, you're a CSS master chief now :)");
          } else if (this.levels.getCurrentLevel() !== this.levels.countLevels()) {
            this.levels.setCurrentLevel(this.levels.getCurrentLevel() + 1);
            this.loadLevel();
          } else {
            this.handleLastLevel("Well done, but you've got still other levels to complete!");
          }
        }, 1000)
      }
    });

    response?.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitBtn?.click();
      }
    });
  }

  private checkResponse(response: string): boolean {
    const table = this.view.getTableElement();
    const expected = table?.querySelectorAll(this.levels.getTargetSelector());
    const assertion = table?.querySelectorAll(response);

    if (!expected || !assertion) {
      throw new Error('There is nothing to compare');
    }

    if (expected?.length !== assertion?.length) {
      return false;
    }

    for (let i: number = 0; i < expected.length; i += 1) {
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
    const HTMLViewer: HTMLElement | null = document.querySelector('#html-viewer');
    if (!HTMLViewer) {
      throw new Error('HTMLViewer was not found');
    }
    HTMLViewer.style.pointerEvents = mouseoverStyle;
    const codeboxBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.codebox__button');
    codeboxBtns.forEach((button) => {
      this.handleButtonEvents(button, buttonStyle);
    })
  }

  private handleButtonEvents(button: HTMLButtonElement, style: boolean) {
    button.disabled = style;
  }

  private handleLevelSwitch(): void {
    const buttons: NodeListOf<HTMLButtonElement> = this.view.getLevelButtons();

    buttons.forEach((button: Element, buttonIndex: number) => {
      button.addEventListener('click', (event: Event) => {
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
    const buttons: NodeListOf<HTMLButtonElement> = this.view.getLevelButtons();

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
    const openLevelsBtn = document.querySelector('.header__level');
    const levelsTable = document.querySelector('.header__levels-window');

    openLevelsBtn?.addEventListener('click', (event: Event) => {
      if (event.target instanceof Node && !levelsTable?.classList.contains('open')) {
        event.stopImmediatePropagation();
        document.querySelector('.header__levels-window')?.classList.add('open');
        openLevelsBtn?.classList.add('open');
      }
    });
    document.addEventListener('click', (event: Event) => {
      if (event.target instanceof Node && levelsTable !== event.target && levelsTable?.classList.contains('open')) {
        this.closeLevelsTable();
      }
    });
  }

  private closeLevelsTable(): void {
    document.querySelector('.header__levels-window')?.classList.remove('open');
    document.querySelector('.header__level')?.classList.remove('open');
  }

  private handleLevelChoice(): void {
    const levelItems: NodeListOf<HTMLElement> = document.querySelectorAll('.header__level-item');

    levelItems.forEach((levelItem) => {
      levelItem.addEventListener('click', () => {
        const newLevel: number = +levelItem.innerText;
        const levelDiv = document.querySelector('.header__current-level');

        levelItems.forEach((levelItem) => {
          levelItem.classList.remove('active')
        });

        this.levels.setCurrentLevel(newLevel);
        levelItem.classList.add('active');
        this.loadLevel();
      })
    })
  }

  private getHelp(): void {
    const response: HTMLInputElement = this.view.getResponseInput();

    document.querySelector('.codebox__button_help')?.addEventListener('click', () => {
      const currentLevelObj: Level = this.levels.levels[this.levels.getCurrentLevel() - 1];
      const answer: string = currentLevelObj.selector;
      let counter: number = 0;
      const type = (): void => {
        if (counter < answer.length) {
          response.value += answer.charAt(counter);
          counter++;
          setTimeout(type, 100);
        }
      }

      type();
      currentLevelObj.helperUsed = true;
    })
  }

  private handleRefresh(): void {
    document.querySelector('.header__refresh-img')?.addEventListener('click', () => {
      this.levels.clearProgress();
      this.loadLevel();
    })
  }

  private handleLevelSaving(): void {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('levels', JSON.stringify(this.levels.levels));
      localStorage.setItem('currentLevel', JSON.stringify(this.levels.getCurrentLevel()));
    });
    window.addEventListener('load', () => {
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
