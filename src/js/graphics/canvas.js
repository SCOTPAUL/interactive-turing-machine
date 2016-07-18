import State from './state'

export default class Canvas {

  constructor(turingMachine=null){
    this.id = 0;
    this.stage = new createjs.Stage("canvas");
    this.turingMachine = turingMachine;
    this.stage.on("stagemousedown", (event) => {
      if(!event.relatedTarget){
        this.addState(this.id++, event.stageX, event.stageY);
      }
    });
  }

  addState(id, x, y){
    if(this.turingMachine){
      this.turingMachine.addState(id);
    }

    const state = new State(id, this);

    state.x = x;
    state.y = y;

    this.stage.addChild(state);
    this.stage.update();
  }
}
