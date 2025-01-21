type EventKey = string | symbol;
type EventHandler<T = any> = (...args: T[]) => void;
type EventMap = Record<EventKey, EventHandler<any>>;
type Emitter<E> = {
  [K in keyof E]?: E[K][];
};

class EventEmitter<E extends EventMap> {
  private emitter: Partial<Emitter<E>> = {};
  
  on<Key extends keyof E>(key: Key, handler: E[Key]): () => void {
    if (this.emitter[key] === undefined) {
      this.emitter[key] = [];
    }
    this.emitter[key]?.push(handler);
    
    return () => {
      this.off(key, handler);
    };
  }
  
  off<Key extends keyof E>(key: Key, handler: E[Key]): void {
    const index = this.emitter[key]?.indexOf(handler) ?? -1;
    if (index >= 0) {
      this.emitter[key]?.splice(index, 1);
    }
  }
  
  emit<Key extends keyof E>(key: Key, ...payload: Parameters<E[Key]>): void {
    this.emitter[key]?.forEach((fn) => {
      (fn as any)(...payload);
    });
  }
}


const emitter = new EventEmitter()

const logData = (data: any) => console.log(data)
emitter.on('data', logData)

emitter.emit('data', { message: 'Hello World!' });

emitter.off('data', logData);
