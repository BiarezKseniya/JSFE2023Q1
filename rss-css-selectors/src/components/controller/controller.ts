import { Levels } from './levels';
import { View } from '../view/view';

export class Controller {
  public levels: Levels;
  public view: View;

  constructor() {
    this.levels = new Levels();
    this.view = new View();
  }

  public async start(): Promise<void> {
    await this.levels.fetchLevels();
    this.view.render(this.levels);
    this.setResponseHandler();
  }

  private setResponseHandler(): void {
    const submitBtn: HTMLButtonElement | null = document.querySelector('.codebox__button_submit');
    const response: HTMLInputElement | null = document.querySelector('.codebox__input');

    submitBtn?.addEventListener('click', () => {
      if (!response) {
        throw new Error('There is no response to handle');
      }
      console.log(this.checkResponse(response.value));
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
}
