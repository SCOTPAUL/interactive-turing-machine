import {State, Transition} from "../state-machine";
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

    for(let transition of this.machine.getTransitions()){
      elements.push(new UITransition(transition).render());
    }

    const rendering = {
      container: container,
      elements: elements,

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
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

  render(){
    return { data:{ id: this.state.id } }
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
