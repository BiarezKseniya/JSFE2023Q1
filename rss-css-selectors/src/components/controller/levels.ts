export interface Level {
  task: string;
  selector: string;
  tableMarkup: string;
  passed?: boolean;
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

  public getTask(): string {
    return this.levels[this.levelIndex].task;
  }

  public getTargetSelector(): string {
    return this.levels[this.levelIndex].selector;
  }

  public getCurrentLevel(): number {
    return this.levelIndex + 1;
  }

  public setCurrentLevel(value: number): void {
    this.levelIndex = value - 1;
  }

  public countLevels(): number {
    return this.levels.length;
  }

  public incrementLevel(): number {
    return this.levelIndex + 2;
  }

  public decrementLevel(): number {
    return this.levelIndex;
  }

  public checkIfLevel(value: number): boolean {
    if (value <= this.countLevels() && value > 0) {
      return true;
    }
    return false;
  }
}
