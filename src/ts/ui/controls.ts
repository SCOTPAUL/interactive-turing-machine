import {TuringMachine} from "../machine"
import {Direction} from "../tape"

export class UIHandler {
  private machine : TuringMachine;
  private trans_handler : TransformUIHandler;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.trans_handler = new TransformUIHandler(machine);
  }

}

class TransformUIHandler {
  private machine : TuringMachine;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.init();
  }

  init(){
    const add_transition_form = <HTMLFormElement>document.getElementById("add_transition");

    if(add_transition_form === null){
      return;
    }

    add_transition_form.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = add_transition_form;
      const from_transition = (<HTMLSelectElement>form.children[0]).value;
      const to_transition = (<HTMLSelectElement>form.children[1]).value;
      const if_symbol = (<HTMLInputElement>form.children[2]).value;
      const tape_move = (<HTMLInputElement>form.children[3]).value;
      const put_symbol = (<HTMLInputElement>form.children[4]).value;

      var tape_move_direction : Direction;
      if(tape_move === "left"){
        tape_move_direction = Direction.LEFT;
      }
      else {
        tape_move_direction = Direction.RIGHT;
      }

      const from_transition_num = Number(from_transition);
      const to_transition_num = Number(to_transition);


      this.machine.addTransition(from_transition_num, to_transition_num, tape_move_direction, put_symbol, if_symbol);

      add_transition_form.reset();
    }, false);


    this.machine.addStateListener((length) => {
      const id = length - 1;

      const from_select = document.getElementById("from_transition");
      const to_select = document.getElementById("to_transition");

      if(from_select === null || to_select === null){
        return;
      }

      const option = document.createElement('option');

      option.value = String(id);
      option.text = String(id);

      const option_clone = option.cloneNode(true);

      from_select.appendChild(option);
      to_select.appendChild(option_clone);
    });
  }

}
