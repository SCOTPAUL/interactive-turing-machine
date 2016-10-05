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
        let direction_symbol : string;

        if(this.tape_move === Direction.LEFT){
          direction_symbol = "L";
        }
        else if(this.tape_move === Direction.RIGHT){
          direction_symbol = "R";
        }
        else {
          direction_symbol = "S";
        }

        return this.tape_symbol + "/" + this.put_char + "," + direction_symbol;
      }
}
