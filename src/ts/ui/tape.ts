import {TuringMachine} from "../machine"

export class UITapeManager {
  private machine : TuringMachine;
  private tape_nodes : NodeList;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.tape_nodes = document.querySelectorAll(".tape-box");

    this.machine.addTapeChangeListener((tape_contents) => {

      if(tape_contents === undefined){
        return;
      }

      for(let i = 0; i < tape_contents.length; ++i){
        const curr_str = tape_contents[i];
        const curr_node = this.tape_nodes[i];

        (<HTMLTableCellElement>curr_node).innerText = curr_str;

      }
    });

  }
}
