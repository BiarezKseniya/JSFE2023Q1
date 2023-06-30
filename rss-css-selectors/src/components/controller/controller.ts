import Typed from 'typed.js';
import { Level, Levels } from './levels';
import { View } from '../view/view';

export enum Buttons {
  left = 0,
  right = 1,
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
    this.loadLevel();
    this.setResponseHandler();
    this.toggleLevelsTable();
    this.getHelp();
  }

  private loadLevel(): void {
    this.view.render(this.levels);
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
        this.levels.setLevelCompleted();
        response.value = '';
        if (this.levels.levels.every((level) => level.passed === true)) {
          this.loadLevel();
          this.view.drawMessage("Congrats, you're a CSS master chief now :)");
        } else if (this.levels.getCurrentLevel() !== this.levels.countLevels()) {
          this.levels.setCurrentLevel(this.levels.getCurrentLevel() + 1);
          this.loadLevel();
        } else {
          this.loadLevel();
          this.view.drawMessage("Well done, but you've got still other levels to complete!");
          }
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
      this.disableButton(buttons[Buttons.left]);
    } else {
      this.enableButton(buttons[Buttons.left]);
    }
    if (level === this.levels.countLevels()) {
      this.disableButton(buttons[Buttons.right]);
    } else {
      this.enableButton(buttons[Buttons.right]);
    }
  }

  private disableButton(button: HTMLButtonElement): void {
    button.setAttribute('disabled', 'true');
  }

  private enableButton(button: HTMLButtonElement): void {
    button.removeAttribute('disabled');
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

      const typed = new Typed(response, {
        strings: [currentLevelObj.selector],
        typeSpeed: 50,
        loop: false,
      });

      currentLevelObj.helperUsed = true;
    })
  }
}
