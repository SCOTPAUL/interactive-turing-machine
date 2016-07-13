export var TerminalStateEnum = {
  SUCCESS:1,
  FAILURE:2
}

export class State {
    constructor(id){
        this.id = id;
        this.outTransitions = [];
    }

    addOutTransition(transition){
      outTransitions += transition;
    }

    nextState(tape_symbol){
      for(var transition of outTransitions){
        if(transition.tape_symbol === tape_symbol){
          return transition;
        }
      }
    }
}

export class TerminalState extends State {
    constructor(id, terminal_state_type){
      super(id);
      this.terminal_state_type = terminal_state_type;
    }

    nextState(tape_symbol){
      return null;
    }
}

export class Transition {
    constructor(from_state, to_state, tape_move, put_char, tape_symbol){
        this.from_state = from_state;
        this.to_state = to_state;
        this.put_char = put_char;
        this.tape_move = tape_move;
        this.tape_symbol = tape_symbol;

        from_state.addOutTransition(this);
      }
}
