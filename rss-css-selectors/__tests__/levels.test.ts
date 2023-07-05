import { enableFetchMocks } from 'jest-fetch-mock';
import { Levels } from '../src/controller/levels';
import { Level } from '../src/types/types';

describe('Levels', () => {
  let levels: Levels;

  beforeEach(() => {
    levels = new Levels();
    enableFetchMocks();
  });

  test('should return table markup for the current level', () => {
    const mockLevels = [
      {
        task: 'Task 1',
        selector: 'Selector 1',
        tableMarkup: '<plate></plate><bento></bento>',
      },
      {
        task: 'Task 2',
        selector: 'Selector 2',
        tableMarkup: "<plate class='green'></plate><plate id='awesome'></plate>",
      },
    ];
    levels.levels = mockLevels;

    const resultForLevel1 = levels.getTableContent();
    levels.setCurrentLevel(2);
    const resultForLevel2 = levels.getTableContent();

    expect(resultForLevel1).toBe('<plate></plate><bento></bento>');
    expect(resultForLevel2).toBe("<plate class='green'></plate><plate id='awesome'></plate>");
  });

  test('should set the current level', () => {
    levels.setCurrentLevel(1);
    expect(levels['levelIndex']).toBe(0);

    levels.setCurrentLevel(3);
    expect(levels['levelIndex']).toBe(2);
  });

  test('should return true if the level exists', () => {
    levels.levels = [
      { task: 'Task 1', selector: '.selector1', tableMarkup: 'Markup 1' },
      { task: 'Task 2', selector: '.selector2', tableMarkup: 'Markup 2' },
      { task: 'Task 3', selector: '.selector3', tableMarkup: 'Markup 3' },
    ];

    expect(levels.checkIfLevel(2)).toBe(true);
    expect(levels.checkIfLevel(5)).toBe(false);
  });

  test('should return the correct number of levels', () => {
    expect(levels.countLevels()).toBe(0);

    levels.levels = [
      { task: 'Task 1', selector: '.selector1', tableMarkup: 'Markup 1' },
      { task: 'Task 2', selector: '.selector2', tableMarkup: 'Markup 2' },
      { task: 'Task 3', selector: '.selector3', tableMarkup: 'Markup 3' },
    ];

    expect(levels.countLevels()).toBe(3);
  });

  test('should clear progress for all levels', () => {
    levels.levels = [
      { task: 'Task 1', selector: '.selector1', tableMarkup: 'Markup 1', passed: true, helperUsed: true },
      { task: 'Task 2', selector: '.selector2', tableMarkup: 'Markup 2', passed: false, helperUsed: false },
      { task: 'Task 3', selector: '.selector3', tableMarkup: 'Markup 3', passed: true, helperUsed: false },
    ];

    levels.clearProgress();

    levels.levels.forEach((level: Level) => {
      expect(level.passed).toBeUndefined();
      expect(level.helperUsed).toBeUndefined();
    });
  });

  test('should set the current level as completed', () => {
    levels.levels = [
      { task: 'Task 1', selector: '.selector1', tableMarkup: 'Markup 1' },
      { task: 'Task 2', selector: '.selector2', tableMarkup: 'Markup 2' },
      { task: 'Task 3', selector: '.selector3', tableMarkup: 'Markup 3' },
    ];
    levels.setCurrentLevel(2);

    levels.setLevelCompleted();

    expect(levels.levels[1].passed).toBe(true);
  });

  test('should return the target selector of the current level', () => {
    levels.levels = [
      { task: 'Task 1', selector: '.selector1', tableMarkup: 'Markup 1' },
      { task: 'Task 2', selector: '.selector2', tableMarkup: 'Markup 2' },
      { task: 'Task 3', selector: '.selector3', tableMarkup: 'Markup 3' },
    ];
    levels.setCurrentLevel(2);

    const targetSelector = levels.getTargetSelector();

    expect(targetSelector).toBe('.selector2');
  });

  test('should return the current level', () => {
    levels.setCurrentLevel(3);

    const currentLevel = levels.getCurrentLevel();

    expect(currentLevel).toBe(3);
  });
});
