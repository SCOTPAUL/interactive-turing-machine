import State from './state'

export default class Canvas {

  constructor(){
    this.id = 0;
    this.stage = new createjs.Stage("canvas");
    this.stage.on("stagemousedown", (event) =>
      this.addState(this.id++, event.stageX, event.stageY));
  }

  addState(id, x, y){
    const state = new State(id);

    state.x = x;
    state.y = y;

    this.stage.addChild(state);
    this.stage.update();
  }
}
