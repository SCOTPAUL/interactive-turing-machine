import * as state_machine from './state-machine';
import * as tape from './tape';

export class TuringMachine {
    constructor(tape_contents){
      this.tapehead = new tape.TapeHead('', tape_contents);
      this.states = new Map();
      this.transitions = {};
    }

    addState(id){
      var new_state = new state_machine.State(id);
      this.states.set(id, new_state);
      console.log("Set state with id " + id);
      this.transitions[new_state] = {};
    }

    addTerminalState(id, termination_type){
      this.states.set(id, new state_machine.TerminalState(id, termination_type));
      console.log("Set terminal state with id " + id);
    }

    addTransition(from_id, to_id, direction, put_char, tape_symbol){
      var from_state = this.states.get(from_id);
      var to_state = this.states.get(to_id);

      var new_transition = new state_machine.Transition(from_state, to_state, direction, put_char, tape_symbol);
      this.transitions[from_state][tape_symbol] = new_transition;
      console.log("Set transition " + new_transition);
    }

    run(start_id){
      var start_state = this.states.get(start_id);
      var current_state = start_state;

      while(current_state !== null && !current_state.isTerminal()){
        current_state = this.step(current_state);
      }

      if(current_state === null){
        console.log("Error, invalid state transition");
      }
      else {
        console.log("Terminated with state " + current_state.terminal_state_type);
      }
    }

    step(start_state){
      var tape_symbol = this.tapehead.read();
      var transition = this.transitions[start_state][tape_symbol];
      console.log("Got transition [" + transition + "] for from state: " + start_state + ", tape symbol " + tape_symbol);

      if(transition === undefined){
        return null;
      }

      this.tapehead.write(transition.put_char);
      if(transition.direction === tape.Direction.LEFT){
        this.tapehead.goLeft();
      }
      else if(transition.direction === tape.Direction.RIGHT){
        this.tapehead.goRight();
      }

      return transition.to_state;
    }



    toString(){
        console.log(this.states.toString() + " " + this.transitions.toString());
    }
}
