class State extends createjs.Container {
  constructor(id, radius=20, colour='#058'){
    super();

    this.id = id;
    this.colour = colour;
    this.radius = radius;
    this.dragging = false;

    this.init();
  }

  init(){
    this.node = new createjs.Shape();
    this.node.graphics.beginFill(this.colour).drawCircle(0, 0, this.radius);
    this.addChild(this.node);

    const text = new createjs.Text(this.id);
    this.addChild(text);
    text.x = text.getMeasuredWidth()/2 * -1;
    text.y = text.getMeasuredHeight()/2 * -1;

    this.addEventListener("mousedown", (event) => this.dragging = false);

    this.addEventListener("click", (event) => {

      if(!this.dragging){
        this.colour = "#43d93c";
        this.node.graphics.clear();
        this.node.graphics.beginFill(this.colour).drawCircle(0, 0, this.radius);
        this.stage.update();
      }

      this.dragging = false;
    });

    this.addEventListener("pressmove", (event) => {
      this.dragging = true;
      this.x = event.stageX;
      this.y = event.stageY;
      this.stage.update();
    });

  }
}

export default createjs.promote(State, "Container");
