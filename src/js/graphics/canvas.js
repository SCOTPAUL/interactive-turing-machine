import GUIState from './state';
import GUITransition from './transition';
import {TerminalStateType} from '../state-machine';
import {Direction} from '../tape';

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

  addTransition(from_id, to_id, tape_move, put_char, tape_symbol){
    const transition = this.turingMachine.addTransition(from_id, to_id, tape_move, put_char, tape_symbol);
    const guitransition = new GUITransition(transition, this);

    this.stage.addChildAt(guitransition, 0);
  }

  addState(id, x, y){
    const state = this.turingMachine.addState(id);

    const guistate = new GUIState(state, this);

    guistate.addEventListener("click", (event) => {
      if(!guistate.dragging){

        const prev_state_str = TerminalStateType.toString(state.terminalState);
        state.terminalState = TerminalStateType.nextState(state.terminalState);
        const new_state_str = TerminalStateType.toString(state.terminalState);

        console.log("Changed State with id " + id + " from terminal type " + prev_state_str + " to " + new_state_str);

        guistate.updateColour();
      }


      guistate.dragging = false;
    });

    guistate.x = x;
    guistate.y = y;

    this.stage.addChild(guistate);

    if(id == 2){
      this.addTransition(0, 1, Direction.LEFT, "b", "c");
    }

    this.stage.update();
  }
}
