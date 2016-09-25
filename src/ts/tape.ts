export enum Direction {
  LEFT=1,
  RIGHT,
  STATIONARY
};

export class TapeNode {
    public left : TapeNode | null;
    public right : TapeNode | null;
    public value : string;

    constructor(left : TapeNode | null, value : string, right : TapeNode | null){
        this.left = left;
        this.value = value;
        this.right = right;
    }

    setLeft(node : TapeNode){
        this.left = node;
        node.right = this;
    }

    setRight(node : TapeNode){
        this.right = node;
        node.left = this;
    }

    toString(){
      return this.value;
    }
}

export class TapeHead {
    public blank_symbol : string;
    public tape_head : TapeNode;

    constructor(blank_symbol : string, initial_tape_contents=""){
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

    write(tape_symbol : string){
      this.tape_head.value = tape_symbol;
    }

    goLeft(){
        if(this.tape_head.left === null){
            this.tape_head.setLeft(new TapeNode(null, this.blank_symbol, this.tape_head));
        }

        this.tape_head = <TapeNode>this.tape_head.left;
    }

    goRight(){
        if(this.tape_head.right === null){
            this.tape_head.setRight(new TapeNode(this.tape_head, this.blank_symbol, null));
        }

        this.tape_head = <TapeNode>this.tape_head.right;
    }

    getElementsWithRadius(radius : number){
      if(radius <= 0){
        return [];
      }

      const orig_head = this.tape_head;
      const ret : string[] = [];
      ret.push(orig_head.value);


      for(let i = 1; i < radius; ++i){
        this.goRight();
        ret.push(this.read());
      }

      this.tape_head = orig_head;

      for(let i = 1; i < radius; ++i){
        this.goLeft();
        ret.unshift(this.read());
      }

      this.tape_head = orig_head;

      return ret;

    }

}
