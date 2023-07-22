import { ElementCreator } from '../../../../util/element-creator';
import { View } from '../../../view';
import { CarParams } from '../../../../types/types';
import { Configuration } from '../../../../util/configuration';

export class ControlsSectionView extends View {
  public carCreateBtn: ElementCreator | null = null;

  public carCreateNameInput: ElementCreator | null = null;

  public carCreateColorInput: ElementCreator | null = null;

  public carUpdateBtn: ElementCreator | null = null;

  public carUpdateNameInput: ElementCreator | null = null;

  public carUpdateColorInput: ElementCreator | null = null;

  public carRaceBtn: ElementCreator | null = null;

  public carResetBtn: ElementCreator | null = null;

  public carGenerateBtn: ElementCreator | null = null;

  constructor() {
    super(Configuration.viewParams.controlsSectionParams);

    this.configureView();
  }

  public configureView(): void {
    const carControls = new ElementCreator(Configuration.elementParams.carControlsParams);
    const carCreate = new ElementCreator(Configuration.elementParams.carCreateParams);
    const carUpdate = new ElementCreator(Configuration.elementParams.carUpdateParams);
    const raceControls = new ElementCreator(Configuration.elementParams.raceControlsParams);

    this.carCreateNameInput = new ElementCreator(Configuration.elementParams.inputNameParams);
    this.carCreateNameInput.getElement().setAttribute('placeholder', CarParams.placeholderName);
    this.carUpdateNameInput = new ElementCreator(Configuration.elementParams.inputNameParams);
    this.carCreateColorInput = new ElementCreator(Configuration.elementParams.inputColorParams);
    this.carUpdateColorInput = new ElementCreator(Configuration.elementParams.inputColorParams);
    this.carCreateBtn = new ElementCreator(Configuration.elementParams.buttonCarCreateParams);
    this.carUpdateBtn = new ElementCreator(Configuration.elementParams.buttonCarUpdateParams);

    this.carRaceBtn = new ElementCreator(Configuration.elementParams.buttonRaceRaceParams);
    this.carResetBtn = new ElementCreator(Configuration.elementParams.buttonRaceResetParams);
    this.carGenerateBtn = new ElementCreator(Configuration.elementParams.buttonRaceGenerateParams);

    carCreate.addInnerElement(this.carCreateNameInput);
    carCreate.addInnerElement(this.carCreateColorInput);
    carCreate.addInnerElement(this.carCreateBtn);

    carUpdate.addInnerElement(this.carUpdateNameInput);
    carUpdate.addInnerElement(this.carUpdateColorInput);
    carUpdate.addInnerElement(this.carUpdateBtn);

    carControls.addInnerElement(carCreate);
    carControls.addInnerElement(carUpdate);

    raceControls.addInnerElement(this.carRaceBtn);
    raceControls.addInnerElement(this.carResetBtn);
    raceControls.addInnerElement(this.carGenerateBtn);

    this.viewElementCreator.addInnerElement(carControls);
    this.viewElementCreator.addInnerElement(raceControls);

    this.toggleUpdateElements(true);
  }

  public setCarName(name: string): void {
    if (this.carUpdateNameInput) {
      const input = this.carUpdateNameInput.getElement();
      if (input instanceof HTMLInputElement) {
        input.value = name;
      }
    }
  }

  public setCarColor(color: string): void {
    if (this.carUpdateColorInput) {
      const input = this.carUpdateColorInput.getElement();
      if (input instanceof HTMLInputElement) {
        input.value = color;
      }
    }
  }

  public toggleUpdateElements(flag: boolean): void {
    this.carUpdateBtn?.setDisableElement(flag);
    this.carUpdateColorInput?.setDisableElement(flag);
    this.carUpdateNameInput?.setDisableElement(flag);
  }
}
