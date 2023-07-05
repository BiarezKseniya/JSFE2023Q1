import { View } from '../src/components/view/view';

beforeEach(() => {
  document.body.innerHTML = '<div class="gameplay__table"></div>';
});

test('should return attribute string for an element', () => {
  const mockGetHTMLElement = jest.fn().mockReturnValue(document.createElement('div') as HTMLElement);
  jest.spyOn(View.prototype, 'getHTMLElement').mockImplementation(mockGetHTMLElement);

  const view = new View();

  const element1 = document.createElement('div');
  element1.setAttribute('id', 'myId');
  element1.setAttribute('class', 'myClass');

  const element2 = document.createElement('plate');
  element2.setAttribute('class', 'myClass');
  element2.setAttribute('class', 'alsoMyClass');

  const result1 = view['getAttributString'](element1);
  const result2 = view['getAttributString'](element2);

  expect(result1).toBe(
    ' <span class="attribute-name">id</span><span class=\'attribute-assignment\'>=</span><span class="attribute-value">"myId"</span> <span class="attribute-name">class</span><span class=\'attribute-assignment\'>=</span><span class="attribute-value">"myClass"</span>',
  );
  expect(result2).toBe(
    ' <span class="attribute-name">class</span><span class=\'attribute-assignment\'>=</span><span class="attribute-value">"alsoMyClass"</span>',
  );

  expect(mockGetHTMLElement).toHaveBeenCalledTimes(2);
  expect(mockGetHTMLElement).toHaveBeenCalledWith('.gameplay__table');
});
