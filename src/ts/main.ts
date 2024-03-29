import {TuringMachine} from './machine';
import * as tape from './tape';
import * as state_machine from './state-machine';
import {UIHandler} from "./ui/managers";


function init(){
  var machine = new TuringMachine();
  var ui_handler = new UIHandler(machine);
  var initial_node = machine.addState(0);

  machine.ready();

  machine.addTerminalState(state_machine.TerminalStateType.SUCCESS);
}

document.addEventListener("DOMContentLoaded", function(event){
  console.log("Initialising Turing Machine");
  init();
});
