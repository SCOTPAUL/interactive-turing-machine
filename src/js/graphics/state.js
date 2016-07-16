class State extends createjs.Container {
  constructor(id, radius=20, colour='#058'){
    super();

    this.id = id;
    this.colour = colour;
    this.radius = radius;

    this.init();
  }

  init(){
    const node = new createjs.Shape();
    node.graphics.beginFill(this.colour).drawCircle(0, 0, this.radius);
    this.addChild(node);

    const text = new createjs.Text(this.id);
    this.addChild(text);
    text.x = text.getMeasuredWidth()/2 * -1;
    text.y = text.getMeasuredHeight()/2 * -1;
  }
}

export default createjs.promote(State, "Container");
