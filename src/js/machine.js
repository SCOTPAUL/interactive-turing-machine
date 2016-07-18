import * as state_machine from './state-machine';
import * as tape from './tape';
import State from './graphics/state'
import Canvas from './graphics/canvas'

export class TuringMachine {
    constructor(tape_contents){
      this.tapehead = new tape.TapeHead('', tape_contents);
      this.states = new Map();
      this.transitions = {};
      this.gui = new Canvas(this);
    }

    addState(id){
      var new_state = new state_machine.State(id);
      this.states.set(id, new_state);
      console.log("Set state with id " + id);
    }

    addTerminalState(id, termination_type){
      this.states.set(id, new state_machine.State(id, termination_type));
      console.log("Set terminal state with id " + id);
    }

    addTransition(from_id, to_id, direction, put_char, tape_symbol){
      var from_state = this.states.get(from_id);
      var to_state = this.states.get(to_id);

      var new_transition = new state_machine.Transition(to_state, direction, put_char, tape_symbol);
      from_state.addOutTransition(new_transition);
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
        console.log("Terminated with state " + current_state.terminalState);
      }
    }

    step(start_state){
      const tape_symbol = this.tapehead.read();
      const transition = start_state.findOutTransition(tape_symbol);

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
