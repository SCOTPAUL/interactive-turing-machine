import {TuringMachine} from './machine';
import * as tape from './tape';
import * as state_machine from './state-machine'
import Canvas from './graphics/canvas'

function init(){
  var machine = new TuringMachine("1");

  machine.addTerminalState(0, state_machine.TerminalStateType.FAILURE);
  machine.addState(1);
  machine.addTerminalState(2, state_machine.TerminalStateType.SUCCESS);

  machine.addTransition(1, 0, tape.Direction.STATIONARY, '', '0');
  machine.addTransition(1, 2, tape.Direction.STATIONARY, '', '1');

  machine.run(1);

  var can = new Canvas();

  can.addState(1, 5, 10);
  can.addState(2, 20, 50);
  can.addState(0, 80, 90);

}

document.addEventListener("DOMContentLoaded", function(event){
  init();
});
