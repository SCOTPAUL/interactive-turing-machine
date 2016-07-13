import * as state_machine from './state-machine';
import * as tape from './tape';

export class TuringMachine {
    constructor(){
      this.tapehead = new tape.TapeHead("");
      this.states = new Map();
      this.transitions = [];
    }

    addState(id){
      states.set(id, new state_machine.State(id));
    }

    addTransition(from_id, to_id, direction, put_char, tape_symbol){
      from_state = states.get(from_id);
      to_state = states.get(to_id);

      transitions += new state_machine.Transition(from_state, to_state, direction, put_char, tape_symbol);

    }

    run(start_id){
      start_state = states.get(start_state);
    }


    toString(){
        console.log("hello");
    }
}
