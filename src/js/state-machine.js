export var TerminalStateType = {
  state_types:[1,2,3],
  str_state_types:['nonterminal', 'success', 'failure'],
  get NONTERMINAL(){
    return this.state_types[0]
  },
  get SUCCESS(){
    return this.state_types[1]
  },
  get FAILURE(){
    return this.state_types[2]
  },
  nextState: function(current_state){
    return this.state_types[current_state % this.state_types.length]
  },
  toString: function(current_state){
    return this.str_state_types[current_state - 1];
  }
};


export class State {
    constructor(id, terminalState=TerminalStateType.NONTERMINAL){
        this.id = id;
        this.outTransitions = [];
        this.terminalState = terminalState;
    }

    isTerminal(){
      return this.terminalState !== TerminalStateType.NONTERMINAL;
    }

    addOutTransition(transition){
      if(!this.isTerminal()){
        this.outTransitions.push(transition);
      }
    }

    nextState(tape_symbol){
      if(this.isTerminal()){
        return null;
      }

      for(let transition of this.outTransitions){
        if(transition.tape_symbol === tape_symbol){
          return transition;
        }
      }
    }

    findOutTransition(tape_symbol){
      return this.outTransitions.find((elem) => elem.tape_symbol === tape_symbol);
    }

    toString(){
      return this.id;
    }
}

export class Transition {
    constructor(to_state, tape_move, put_char, tape_symbol){
        this.to_state = to_state;
        this.put_char = put_char;
        this.tape_move = tape_move;
        this.tape_symbol = tape_symbol;
      }

      toString(){
        return " -> " + this.to_state + ", put " + this.put_char + " if " + this.tape_symbol
      }
}
