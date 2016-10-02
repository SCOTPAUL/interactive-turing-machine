import {State, Transition, TerminalStateType} from "../state-machine";
import {TuringMachine} from "../machine";

interface Renderable {
  render() : Object
}

export class UIRenderer implements Renderable {
  private machine : TuringMachine;

  constructor(machine : TuringMachine){
    this.machine = machine;
  }

  render(){
    console.log("Rendering...");

    const elements : Object[] = [];
    const container = document.getElementById("cy");

    for(let state of this.machine.getStates()){
      elements.push(new UIState(state).render());
    }

    console.log(this.machine.getTransitions());
    for(let transition of this.machine.getTransitions()){
      console.log("Rendering transition");
      elements.push(new UITransition(transition).render());
    }

    const rendering = {
      container: container,
      elements: elements,

      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)'
          }
        },

        {
        selector: 'node.nonterminal',
          style: {
            'background-color': '#356AC3'
          }
        },

        {
        selector: 'node.failure',
          style: {
            'background-color': '#800000'
          }
        },

        {
        selector: 'node.success',
          style: {
            'background-color': '#4BC51D'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#4BC51D',
            'mid-target-arrow-color': '#4BC51D',
            'mid-target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }
    }

    console.log(rendering);
    return rendering;

  }
}


class UIState implements Renderable {
  private state : State;

  constructor(state : State){
    this.state = state;
  }

  getClass(){
    const terminal_state_type = this.state.terminalState;

    if(terminal_state_type == TerminalStateType.NONTERMINAL){
      return "nonterminal";
    }
    else if(terminal_state_type == TerminalStateType.SUCCESS){
      return "success"
    }
    else {
      return "failure";
    }
  }

  render(){
    return { data:{ id: this.state.id }, classes: this.getClass() }
  }

}

class UITransition implements Renderable {
  private transition : Transition;

  constructor(transition : Transition){
    this.transition = transition;
  }

  render(){
    const transition_id = this.transition.from_state.id.toString() +
                          this.transition.to_state.id.toString();

    return {
      data:{ id: transition_id,
            source: this.transition.from_state.id.toString(),
            target: this.transition.to_state.id.toString()
          }
        }
  }
}
