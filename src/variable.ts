import bind from "./bind";
import hook from "./hook";

export let createEventID: () => string = (function () {
  let count = 1;
  return function () {
    return (++count).toString();
  };
})();

export type OnChangeEventHandler = (
  newVal: any,
  oldVal: any,
  name: string
) => void;

export class OnChangeEvent {
  public readonly id: string;
  public handler: OnChangeEventHandler;
  constructor(handler: OnChangeEventHandler) {
    this.id = createEventID();
    this.handler = handler;
  }
}

type VariableOptions = {};

type VariableHookOptions = {
  el: any;
  template: string;
};

export default class Variable<T> {
  public value: T;
  public name: string | undefined;

  private onChangeEvents: OnChangeEvent[];

  constructor(initValue: T, opt?: VariableOptions) {
    this.value = initValue;
    this.onChangeEvents = [];
    this.name = undefined;

    if (Array.isArray(initValue)) {
      ["push", "pop", "splice"].forEach((v: string) => {
        // @ts-ignore
        initValue[v] = (...args: any[]): any => {
          // @ts-ignore
          let res = initValue.__proto__[v].call(this.value, ...args);
          this.react(this.value);
          return res;
        };
      });
    }
  }

  set(v: T) {
    let oldVal = this.value;
    this.value = v;
    this.react(oldVal);
  }

  react(oldVal: any) {
    this.onChangeEvents.forEach((e) =>
      e.handler(this.value, oldVal, this.name)
    );
  }

  get() {
    return this.value;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  addOnChangeEvent(e: OnChangeEvent) {
    this.onChangeEvents.push(e);
    return this;
  }

  removeOnChangeEvent(e: OnChangeEvent) {
    let id: string = e.id;
    this.onChangeEvents = this.onChangeEvents.filter((ev) => ev.id != id);
    return this;
  }

  bind(el: any): () => void {
    return bind(this, el);
  }

  hook(opts: VariableHookOptions) {
    hook({
      el: opts.el,
      template: opts.template,
      variables: { value: this },
    });
    return this;
  }

  seat(obj: Object = window) {
    if (!this.name) {
      throw new Error("Name is not defined");
    }
    if (typeof this.name != "string") {
      throw new Error("Name must be string");
    }
    let self = this;
    Object.defineProperty(obj, this.name, {
      get: function () {
        return self.get();
      },
      set: function (v) {
        self.set(v);
      },
    });
  }
}
