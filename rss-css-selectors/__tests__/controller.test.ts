import { Controller } from '../src/controller/controller';
import { Levels } from '../src/controller/levels';
import { View } from '../src/view/view';

beforeEach(() => {
  document.body.innerHTML = '<div class="gameplay__table"></div>';
});

test('should return true for matching response', () => {
  const mockGetHTMLElement = jest.fn().mockReturnValue(document.createElement('div') as HTMLElement);
  jest.spyOn(View.prototype, 'getHTMLElement').mockImplementation(mockGetHTMLElement);
  jest.spyOn(Levels.prototype, 'getTargetSelector').mockReturnValue('.custom-selector');

  const levels = new Levels();
  const view = new View();
  const controller = new Controller();

  levels.levels.push({
    task: 'Some task',
    selector: '.custom-selector',
    tableMarkup: "<plate class='custom-selector'></plate><bento></bento>",
  });

  view.table.innerHTML = "<plate class='custom-selector'></plate><bento></bento>";

  levels.setCurrentLevel(1);

  const response1 = '.custom-selector';
  const result1 = controller['checkResponse'](response1);

  const response2 = '.non-matching-selector';
  const result2 = controller['checkResponse'](response2);

  const response3 = '';
  const result3 = controller['checkResponse'](response3);

  expect(result1).toBeTruthy();
  expect(result2).toBe(false);
  expect(result3).toBe(false);
});
