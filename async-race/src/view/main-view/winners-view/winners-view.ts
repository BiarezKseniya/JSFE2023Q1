import { ElementCreator, ElementParams } from '../../../util/element-creator';
import { View, ViewParams } from '../../view';

export class WinnersView extends View {
  constructor() {
    const params: ViewParams = {
      tag: 'div',
      classNames: [],
    };
    super(params);
  }
}
