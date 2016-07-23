import {TerminalStateType} from '../state-machine';

const StateColours = {
  [TerminalStateType.NONTERMINAL]:'#058',
  [TerminalStateType.SUCCESS]:'#43d93c',
  [TerminalStateType.FAILURE]:'#fb5022'
}

class GUIState extends createjs.Container {
  constructor(state, canvas, radius=20, colour='#058'){
    super();

    this.state = state;
    this.canvas = canvas;
    this.colour = colour;
    this.radius = radius;
    this.dragging = false;

    this.init();
  }

  init(){
    this.node = new createjs.Shape();
    this.node.graphics.beginFill(this.colour).drawCircle(0, 0, this.radius);
    this.addChild(this.node);

    const text = new createjs.Text(this.state.id);
    this.addChild(text);
    text.x = text.getMeasuredWidth()/2 * -1;
    text.y = text.getMeasuredHeight()/2 * -1;

    this.addEventListener("mousedown", (event) => this.dragging = false);

    this.addEventListener("pressmove", (event) => {
      this.dragging = true;
      this.x = event.stageX;
      this.y = event.stageY;
      this.stage.update();
    });

  }

  updateColour(){
    const state_type = this.state.terminalState;
    const colour = StateColours[state_type];
    this.node.graphics.clear();
    this.node.graphics.beginFill(colour).drawCircle(0, 0, this.radius);
    this.stage.update();
  }
}

export default createjs.promote(GUIState, "Container");
