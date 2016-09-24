import * as state_machine from './state-machine';
import * as tape from './tape';
import {JSEvent} from "./ui/uievent";

export class TuringMachine {
    private tapehead : tape.TapeHead;
    private states : state_machine.State[];
    private transitions : state_machine.Transition[];
    private state_added_event : JSEvent<number>;

    constructor(tape_contents : string){
      this.tapehead = new tape.TapeHead('', tape_contents);
      this.states = [];
      this.transitions = [];
      this.state_added_event = new JSEvent();
    }

    addStateListener(handler : (data? : number) => void){
      this.state_added_event.addEventListener(handler);
    }

    addState(id : number){
      var new_state = new state_machine.State(id);
      this.states.push(new_state);
      console.log("Set state with id " + id);
      this.state_added_event.fire(this.states.length);
      return new_state;
    }

    getOutTransition(id : number, tape_symbol : string){
      var result : state_machine.Transition | null = null;

      for(let tmp of this.transitions){
        if(tmp.from_state.id === id && tmp.tape_symbol === tape_symbol){
          result = tmp;
        }
      }

      return result;
    }

    getState(id : number) {
      for(let tmp of this.states){
        if(tmp.id === id){
          return tmp;
        }
      }

      return null;
    }

    addTerminalState(id : number, termination_type : state_machine.TerminalStateType){
      this.states.push(new state_machine.State(id, termination_type));
      console.log("Set terminal state with id " + id);
      this.state_added_event.fire(this.states.length);
    }

    addTransition(from_id : number, to_id : number, direction : tape.Direction, put_char : string, tape_symbol : string){
      var from_state = this.getState(from_id);
      var to_state = this.getState(to_id);

      if(from_state === null || to_state === null){
        return null;
      }

      var new_transition = new state_machine.Transition(from_state, to_state, direction, put_char, tape_symbol);
      console.log("Set transition " + new_transition);
      return new_transition;
    }

    run(start_id : number){
      var start_state = this.getState(start_id);
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

    step(start_state : state_machine.State){
      const tape_symbol = this.tapehead.read();
      const transition = this.getOutTransition(start_state.id, tape_symbol);

      if(transition === null){
        return null;
      }

      this.tapehead.write(transition.put_char);
      if(transition.tape_move === tape.Direction.LEFT){
        this.tapehead.goLeft();
      }
      else if(transition.tape_move === tape.Direction.RIGHT){
        this.tapehead.goRight();
      }

      return transition.to_state;
    }

    toString(){
        console.log(this.states.toString() + " " + this.transitions.toString());
    }

}
