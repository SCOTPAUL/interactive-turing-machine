import {TuringMachine} from "../machine"
import {TerminalStateType, State, Transition} from "../state-machine";
import {Direction} from "../tape"
import {UITapeManager} from "./tape";
import {UIRenderer} from "./renderers";

declare var cytoscape : any;

export class GraphManager {
  private machine : TuringMachine;
  private cyInstance : any;
  private renderer : UIRenderer;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.renderer = new UIRenderer(machine);
    this.cyInstance = cytoscape(this.renderer.render());

    this.machine.addStateListener(() => this.addElems());
    this.machine.addTransitionsListener(() => this.cyInstance.add(this.renderer.render()));
    this.machine.addCurrentStateChangeListener((t) => this.updateCurrentState(t));
  }

  updateCurrentState(trans : Transition){
    const old_id = trans.from_state.id;
    const new_id = trans.to_state.id;

    const from_elem = this.cyInstance.getElementById(old_id);
    const to_elem = this.cyInstance.getElementById(new_id);

    from_elem.removeClass('current');
    to_elem.addClass('current');
  }

  addElems(){
    const new_elems = this.renderer.render();
    this.cyInstance.add(new_elems);
    this.cyInstance.layout({name: 'grid'});
  }
}

export class UIHandler {
  private machine : TuringMachine;
  private trans_handler : TransformUIHandler;
  private tape_manager : UITapeManager;
  private graph_manager : GraphManager;
  private state_adding_manager : UIStateHandler;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.trans_handler = new TransformUIHandler(machine);
    this.tape_manager = new UITapeManager(machine);
    this.graph_manager = new GraphManager(machine);
    this.state_adding_manager = new UIStateHandler(machine);

    const delay_slider = <HTMLInputElement>document.getElementById("delay");
    const delay_ui = <HTMLElement>document.getElementById("delay-show");
    delay_ui.innerText = (Number(delay_slider.value) / 1000).toString() + "s";

    delay_slider.oninput = (e) => {
      delay_ui.innerText = (Number(delay_slider.value) / 1000).toString() + "s";
    };
  }

}

class UIStateHandler{
  private machine : TuringMachine;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.init();
  }

  init(){
    const add_nonterm_state = <HTMLButtonElement> document.getElementById("add-nonterm-state");
    const add_success_state = <HTMLButtonElement> document.getElementById("add-success-state");
    const add_fail_state = <HTMLButtonElement> document.getElementById("add-failure-state");
    const run = <HTMLButtonElement> document.getElementById("run");

    add_nonterm_state.onclick = (e) => this.machine.addState();
    add_success_state.onclick = (e) => this.machine.addTerminalState(TerminalStateType.SUCCESS);
    add_fail_state.onclick = (e) => this.machine.addTerminalState(TerminalStateType.FAILURE);
    run.onclick = (e) => this.machine.run();
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

    let prev_highest_id = -1;
    this.machine.addStateListener((length) => {
      const id = length - 1;

      if(id > prev_highest_id){
        prev_highest_id = id;
      }
      else if(prev_highest_id >= id){
        return;
      }

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
