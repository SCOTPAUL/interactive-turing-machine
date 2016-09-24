export interface IJSEvent<T> {
  addEventListener(handler : (data? : T) => void) : void;
}

export class JSEvent<T> implements IJSEvent<T> {
  private handlers : ((data? : T) => void)[];

  constructor(){
    this.handlers = [];
  }

  addEventListener(handler : (data? : T) => void){
    this.handlers.push(handler)
  }

  fire(data? : T){
    this.handlers.forEach(h => h(data));
  }

}
