import {TuringMachine} from './machine';
import * as tape from './tape';
import * as state_machine from './state-machine';
import {UIHandler} from "./ui/managers";


function init(){
  var machine = new TuringMachine("1");
  var ui_handler = new UIHandler(machine);
  machine.fireAllEvents();

  var initial_node = machine.addState(0);



}

document.addEventListener("DOMContentLoaded", function(event){
  console.log("Initialising Turing Machine");
  init();
});
