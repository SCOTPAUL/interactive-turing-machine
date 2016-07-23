import GUIState from './state'
import {TerminalStateType} from '../state-machine'

export default class Canvas {
  constructor(turingMachine){
    this.id = 0;
    this.stage = new createjs.Stage("canvas");
    this.turingMachine = turingMachine;
    this.stage.on("stagemousedown", (event) => {
      if(!event.relatedTarget){
        this.addState(this.id++, event.stageX, event.stageY);
      }
    });
  }

  addState(id, x, y){
    const state = this.turingMachine.addState(id);

    const guistate = new GUIState(state, this);

    guistate.addEventListener("click", (event) => {
      if(!guistate.dragging){
        state.terminalState = TerminalStateType.nextState(state.terminalState);
        guistate.updateColour()
      }

      guistate.dragging = false;
    });

    guistate.x = x;
    guistate.y = y;

    this.stage.addChild(guistate);
    this.stage.update();
  }
}
