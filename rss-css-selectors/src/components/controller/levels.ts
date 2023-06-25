export interface Level {
  task: string;
  selector: string;
  tableMarkup: string;
}

export class Levels {
  private levelIndex: number;
  public levels: Level[];

  constructor() {
    //Получить текущий уровень
    this.levelIndex = 0;
    this.levels = [];
  }

  public async fetchLevels(): Promise<void> {
    const response = await fetch('./assets/json/levels.json');
    this.levels = await response.json();
  }

  public getTableContent(): string {
    return this.levels[this.levelIndex].tableMarkup;
  }

  public getTargetSelector(): string {
    return this.levels[this.levelIndex].selector;
  }
}
