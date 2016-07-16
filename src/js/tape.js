export var Direction = {
  LEFT:1,
  RIGHT:2,
  STATIONARY:3
};

export class TapeNode {
    constructor(left, value, right){
        this.left = left;
        this.value = value;
        this.right = right;
    }

    setLeft(node){
        this.left = node;
        node.right = this;
    }

    setRight(node){
        this.right = node;
        node.left = this;
    }

    toString(){
      return value;
    }
}

export class TapeHead {
    constructor(blank_symbol, initial_tape_contents=""){
        this.blank_symbol = blank_symbol;
        this.tape_head = new TapeNode(null, blank_symbol, null);

        var temp = this.tape_head;
        for(let char of initial_tape_contents){
          this.write(char);
          this.goRight();
        }

        this.tape_head = temp;
    }

    read(){
      return this.tape_head.value;
    }

    write(tape_symbol){
      this.tape_head.value = tape_symbol;
    }

    goLeft(){
        if(this.tape_head.left === null){
            this.tape_head.setLeft(new TapeNode(null, this.blank_symbol, this));
        }

        this.tape_head = this.tape_head.left;
    }

    goRight(){
        if(this.tape_head.right === null){
            this.tape_head.setRight(new TapeNode(this, this.blank_symbol, null));
        }

        this.tape_head = this.tape_head.right;
    }

}
