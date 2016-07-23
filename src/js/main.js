import 'babel-polyfill';
import {TuringMachine} from './machine';
import * as tape from './tape';
import * as state_machine from './state-machine'
import Canvas from './graphics/canvas'

function init(){
  var machine = new TuringMachine("1");
}

document.addEventListener("DOMContentLoaded", function(event){
  init();
});
