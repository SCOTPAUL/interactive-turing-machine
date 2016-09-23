class GUITransition extends createjs.Container {
  constructor(transition, canvas){
    super();

    this.transition = transition;
    this.canvas = canvas;
    this.colour = '#058';
    this.fromGUI = this.transition.from_state.guiElement;
    this.toGUI = this.transition.to_state.guiElement;

    this.init();
    this.transition.guiElement = this;
  }

  init(){
    this.node = new createjs.Shape();

    this.x1 = this.fromGUI.x;
    this.x2 = this.toGUI.x;
    this.y1 = this.fromGUI.y;
    this.y2 = this.toGUI.y;


    this.node.graphics.setStrokeStyle(8)
                      .beginStroke(this.colour)
                      .moveTo(this.x1, this.y1)
                      .lineTo(this.x2, this.y2)
                      .endStroke();

    this.addChild(this.node);

    const text = new createjs.Text(this.transition.toString());
    this.addChild(text);
    text.x = (this.x1 + this.x2) / 2;
    text.y = (this.y1 + this.y2) / 2;

    const updateOnMove = (event) => {

      if(event.currentTarget === this.toGUI){
        this.x2 = event.stageX;
        this.y2 = event.stageY;
      }
      else if(event.currentTarget === this.fromGUI){
        this.x1 = event.stageX;
        this.y1 = event.stageY;
      }

      text.x = (this.x1 + this.x2) / 2;
      text.y = (this.y1 + this.y2) / 2;

      this.update();
    };

    this.toGUI.addEventListener("pressmove", updateOnMove);
    this.fromGUI.addEventListener("pressmove", updateOnMove);

  }

  update(){
    this.node.graphics.clear();


    this.node.graphics.setStrokeStyle(8)
                      .beginStroke(this.colour)
                      .moveTo(this.x1, this.y1)
                      .lineTo(this.x2, this.y2)
                      .endStroke();

    this.stage.update();
  }

}

export default createjs.promote(GUITransition, "Container");
