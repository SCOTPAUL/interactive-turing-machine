import {Direction} from './tape';

export enum TerminalStateType {
  NONTERMINAL=1,
  SUCCESS,
  FAILURE
}

export class State {
    public id : number;
    public terminalState : TerminalStateType;

    constructor(id : number, terminalState=TerminalStateType.NONTERMINAL){
        this.id = id;
        this.terminalState = terminalState;
    }

    isTerminal(){
      return this.terminalState !== TerminalStateType.NONTERMINAL;
    }


    toString(){
      return this.id;
    }
}

export class Transition {
    public from_state : State;
    public to_state : State;
    public put_char : string;
    public tape_move : Direction;
    public tape_symbol : string;

    constructor(from_state : State, to_state : State, tape_move : Direction, put_char : string, tape_symbol : string){
        this.from_state = from_state;
        this.to_state = to_state;
        this.put_char = put_char;
        this.tape_move = tape_move;
        this.tape_symbol = tape_symbol;
      }

      toString(){
        return this.from_state + " -> " + this.to_state + ", put " + this.put_char + " if " + this.tape_symbol;
      }
}
