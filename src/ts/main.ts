import {TuringMachine} from './machine';
import * as tape from './tape';
import * as state_machine from './state-machine';

function init(){
  var machine = new TuringMachine("1");
  var initial_node = machine.addState(0);
}

document.addEventListener("DOMContentLoaded", function(event){
  console.log("Initialising Turing Machine");
  init();
});
