import { Level } from "../types/types";

export class Levels {
  private levelIndex: number;
  public levels: Level[];

  constructor() {
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

  public setLevelCompleted(): void {
    this.levels[this.levelIndex].passed = true;
  }

  public clearProgress(): void {
    this.setCurrentLevel(1);
    this.levels.forEach((level: Level) => {
      delete level.passed;
      delete level.helperUsed;
    })
  }
}
