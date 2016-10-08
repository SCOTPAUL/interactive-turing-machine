import * as state_machine from './state-machine';
import * as tape from './tape';
import {JSEvent} from "./ui/uievent";

export class TuringMachine {
    private tapehead : tape.TapeHead;
    private states : state_machine.State[];
    private transitions : state_machine.Transition[];
    private state_added_event : JSEvent<number>;
    private tape_changed_event : JSEvent<string[]>;
    private transition_added_event : JSEvent<number>;
    private current_state_changed_event : JSEvent<state_machine.Transition>;

    constructor(tape_contents : string){
      this.tapehead = new tape.TapeHead('_', tape_contents);

      this.states = [];
      this.transitions = [];
      this.state_added_event = new JSEvent();
      this.tape_changed_event = new JSEvent();
      this.current_state_changed_event = new JSEvent();
      this.transition_added_event = new JSEvent();

    }

    getTransitions(){
      return this.transitions;
    }

    getStates(){
      return this.states;
    }

    ready(){
      this.state_added_event.fire(this.states.length);
      this.tape_changed_event.fire(this.getTapeElementsWithRadius(3));
      console.log("Turing machine is now ready");
    }

    getTapeElementsWithRadius(radius : number){
      return this.tapehead.getElementsWithRadius(radius);
    }

    moveTapeLeft(){
      this.tapehead.goLeft();
      this.tape_changed_event.fire(this.tapehead.getElementsWithRadius(3));
    }

    moveTapeRight(){
      this.tapehead.goRight();
      this.tape_changed_event.fire(this.tapehead.getElementsWithRadius(3));
    }

    addCurrentStateChangeListener(handler : (data : state_machine.Transition) => void){
      this.current_state_changed_event.addEventListener(handler);
    }

    addTapeChangeListener(handler : (data? : string[]) => void){
      this.tape_changed_event.addEventListener(handler);
    }

    addStateListener(handler : (data? : number) => void){
      this.state_added_event.addEventListener(handler);
    }

    addTransitionsListener(handler : (data? : number) => void){
      this.transition_added_event.addEventListener(handler);
    }

    addState(id = this.states.length) {
      const new_state = new state_machine.State(id);
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
          break;
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

    addTerminalState(termination_type : state_machine.TerminalStateType) : state_machine.State;
    addTerminalState(id : number, termination_type : state_machine.TerminalStateType) : state_machine.State;
    addTerminalState(termination_type : state_machine.TerminalStateType, id? : number){
      if(id === undefined){
        id = this.states.length;
      }

      const new_state = new state_machine.State(id, termination_type);
      this.states.push(new_state);
      console.log("Set terminal state with id " + id);
      this.state_added_event.fire(this.states.length);
      return new_state;
    }

    addTransition(from_id : number, to_id : number, direction : tape.Direction, put_char : string, tape_symbol : string){
      var from_state = this.getState(from_id);
      var to_state = this.getState(to_id);

      if(from_state === null || to_state === null){
        return null;
      }

      const new_transition = new state_machine.Transition(from_state, to_state, direction, put_char, tape_symbol);
      console.log("Set transition " + new_transition);
      this.transitions.push(new_transition);
      this.transition_added_event.fire(this.transitions.length);
      return new_transition;
    }

    run(start_id = 0){
      var start_state = this.getState(start_id);
      var current_state = start_state;

      if(current_state === null){
        return;
      }

      this.step(current_state, function(finish_state : state_machine.State | null){
        console.log(finish_state);

        if(finish_state === null){
          console.log("Error, invalid state transition");
        }
        else {
          let str_termtype : string;

          if(finish_state.terminalState == state_machine.TerminalStateType.SUCCESS){
            str_termtype = "success";
          }
          else {
            str_termtype = "failure";
          }

          console.log("Terminated with state " + str_termtype);
        }
      });


    }

    step(start_state : state_machine.State, finish_callback: (final_state : state_machine.State | null) => void){
      console.log("Starting step");

      const tape_symbol = this.tapehead.read();
      const transition = this.getOutTransition(start_state.id, tape_symbol);

      if(transition === null){
        return null;
      }

      if(transition.tape_move === tape.Direction.LEFT){
        this.tapehead.goLeft();
      }
      else if(transition.tape_move === tape.Direction.RIGHT){
        this.tapehead.goRight();
      }
      this.tapehead.write(transition.put_char);

      this.tape_changed_event.fire(this.tapehead.getElementsWithRadius(3));

      console.log("Stepping to " + transition.to_state);
      this.current_state_changed_event.fire(transition);

      if(transition.to_state !== null && !transition.to_state.isTerminal()){
        window.setTimeout(() => this.step(transition.to_state, finish_callback), 1000);
      }
      else {
        console.log("Finishing up with state " + transition.to_state)
        finish_callback.call(this, transition.to_state);
      }
    }

    toString(){
        console.log(this.states.toString() + " " + this.transitions.toString());
    }

}
