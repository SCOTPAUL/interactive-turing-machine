export var Direction = {
  LEFT:1,
  RIGHT:2
}

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
        this.node = right;
        node.left = this;
    }
}

export class TapeHead {
    constructor(blank_symbol){
        this.blank_symbol = blank_symbol;
        this.tape_head = new TapeNode(null, blank_symbol, null);
    }

    goLeft(){
        if(tape_head.left == null){
            tape_head.setLeft(new TapeNode(null, blank_symbol, this));
        }

        tape_head = tape_head.left;
    }

    goRight(){
        if(tape_head.right == null){
            tape_head.setRight(new TapeNode(this, blank_symbol, null));
        }

        tape_head = tape_head.right;
    }
}
