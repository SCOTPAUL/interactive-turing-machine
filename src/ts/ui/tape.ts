import {TuringMachine} from "../machine"

export class UITapeManager {
  private machine : TuringMachine;
  private tape_nodes : NodeList;

  private tape_left_control : HTMLButtonElement;
  private tape_right_control : HTMLButtonElement;

  constructor(machine : TuringMachine){
    this.machine = machine;
    this.tape_nodes = document.querySelectorAll(".tape-box");

    this.tape_left_control = <HTMLButtonElement> document.getElementById("tape-left");
    this.tape_right_control = <HTMLButtonElement> document.getElementById("tape-right");

    this.tape_left_control.onclick = (e) => this.machine.moveTapeLeft();
    this.tape_right_control.onclick = (e) => this.machine.moveTapeRight();

    this.machine.addTapeChangeListener((nodes) => this.render(nodes));
  }

  render(tape_contents : string[] | undefined){
      if(tape_contents === undefined){
        return;
      }

      for(let i = 0; i < tape_contents.length; ++i){
        const curr_str = tape_contents[i];
        const curr_node = this.tape_nodes[i];

        (<HTMLTableCellElement>curr_node).innerText = curr_str;

      }
  }
}
