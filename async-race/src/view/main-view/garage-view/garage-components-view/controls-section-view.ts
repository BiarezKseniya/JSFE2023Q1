import { ElementCreator, ElementParams } from '../../../../util/element-creator';
import { View, ViewParams } from '../../../view';

export enum CarParams {
  defaultName = 'Aston Martin',
  defaultColor = '#C50D0D',
  placeholderName = 'Lexus Nexus',
  placeholderColor = '#D1D1D1',
}

enum CssClasses {
  controls = 'controls',
  carControls = 'controls__car',
  raceControls = 'controls__race',
  carCreate = 'controls__car-create',
  carUpdate = 'controls__car-update',
  inputName = 'controls__input-name',
  inputColor = 'controls__input-color',
  buttonCar = 'controls__car-button',
  buttonRace = 'controls__race-button',
}

export class ControlsSectionView extends View {
  public carCreateBtn: ElementCreator | null;

  public carCreateNameInput: ElementCreator | null;

  public carCreateColorInput: ElementCreator | null;

  // public carUpdateNameINput: ElementCreator | null;

  // public carUpdateColorInput: ElementCreator | null;

  public carGenerateBtn: ElementCreator | null;

  constructor() {
    const params: ViewParams = {
      tag: 'section',
      classNames: [CssClasses.controls],
    };
    super(params);

    this.carCreateBtn = null;
    this.carCreateNameInput = null;
    this.carCreateColorInput = null;
    // this.carUpdateNameINput = null;
    // this.carUpdateColorInput = null;
    this.carGenerateBtn = null;

    this.configureView();
  }

  public configureView(): void {
    const carControlsParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carControls],
    };
    const carControls = new ElementCreator(carControlsParams);
    this.viewElementCreator.addInnerElement(carControls);

    const carCreateParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carCreate],
    };
    const carCreate = new ElementCreator(carCreateParams);
    carControls.addInnerElement(carCreate);

    const carUpdateParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.carUpdate],
    };
    const carUpdate = new ElementCreator(carUpdateParams);
    carControls.addInnerElement(carUpdate);

    const inputNameParams: ElementParams = {
      tag: 'input',
      classNames: [CssClasses.inputName],
      type: 'text',
    };

    this.carCreateNameInput = new ElementCreator(inputNameParams);
    this.carCreateNameInput.getElement().setAttribute('placeholder', CarParams.placeholderName);
    carCreate.addInnerElement(this.carCreateNameInput);
    carUpdate.addInnerElement(new ElementCreator(inputNameParams));

    const inputColorParams: ElementParams = {
      tag: 'input',
      classNames: [CssClasses.inputColor],
      type: 'color',
      value: CarParams.placeholderColor,
    };

    this.carCreateColorInput = new ElementCreator(inputColorParams);
    carCreate.addInnerElement(this.carCreateColorInput);
    carUpdate.addInnerElement(new ElementCreator(inputColorParams));

    const buttonCarCreateParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.buttonCar],
      textContent: 'Create',
      type: 'button',
      callback: null,
    };

    this.carCreateBtn = new ElementCreator(buttonCarCreateParams);
    carCreate.addInnerElement(this.carCreateBtn);

    const buttonCarUpdateParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.buttonCar],
      textContent: 'Update',
      type: 'button',
      callback: null,
    };
    carUpdate.addInnerElement(new ElementCreator(buttonCarUpdateParams));

    const raceControlsParams: ElementParams = {
      tag: 'div',
      classNames: [CssClasses.raceControls],
    };
    const raceControls = new ElementCreator(raceControlsParams);
    this.viewElementCreator.addInnerElement(raceControls);

    const buttonRaceRaceParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.buttonRace],
      textContent: 'Race',
      type: 'button',
      callback: null,
    };

    const buttonRaceResetParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.buttonRace],
      textContent: 'Reset',
      type: 'button',
      callback: null,
    };

    const buttonRaceGenerateParams: ElementParams = {
      tag: 'button',
      classNames: [CssClasses.buttonRace],
      textContent: 'Generate cars',
      type: 'button',
      callback: null,
    };
    raceControls.addInnerElement(new ElementCreator(buttonRaceRaceParams));
    raceControls.addInnerElement(new ElementCreator(buttonRaceResetParams));
    this.carGenerateBtn = new ElementCreator(buttonRaceGenerateParams);
    raceControls.addInnerElement(this.carGenerateBtn);
  }
}
