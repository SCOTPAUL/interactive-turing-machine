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

    const add_transition_form = document.getElementById("add_transition");
    add_transition_form.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.target;
      var from_transition = form.children[0].value;
      var to_transition = form.children[1].value;
      const if_symbol = form.children[2].value;
      const tape_move = form.children[3].value;
      const put_symbol = form.children[4].value;

      var tape_move_direction;
      if(tape_move === "left"){
        tape_move_direction = Direction.LEFT;
      }
      else {
        tape_move_direction = Direction.RIGHT;
      }

      from_transition = Number(from_transition);
      to_transition = Number(to_transition);


      this.addTransition(from_transition, to_transition, tape_move_direction, put_symbol, if_symbol);

      add_transition_form.reset();
    }, false);
  }

  addTransition(from_id, to_id, tape_move, put_char, tape_symbol){
    const transition = this.turingMachine.addTransition(from_id, to_id, tape_move, put_char, tape_symbol);
    const guitransition = new GUITransition(transition, this);

    this.stage.addChildAt(guitransition, 0);
    this.stage.update();
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

    const from_select = document.getElementById("from_transition");
    const to_select = document.getElementById("to_transition");

    const option = document.createElement('option');

    option.value = id;
    option.text = id;

    const option_clone = option.cloneNode(true);

    from_select.appendChild(option);
    to_select.appendChild(option_clone);

    this.stage.update();
  }
}
