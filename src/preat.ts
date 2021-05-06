import Variable, { OnChangeEventHandler } from "./variable";
import { KVPairs } from "./types";
import hook, { HookOptions } from "./hook";

type CreateOptions<T extends KVPairs<any>, M extends KVPairs<Function>> = {
  data?: T;
  methods?: M;
  el: string;
  template: string;
  renderers: KVPairs<Function>;
  created(): void;
  mounted(): void;
  killed(): void;
};

type Seat<T, M> = T &
  M & {
    delete(): void;
    getVar(name: string): Variable<any>;
    bind(variableName: string, el: any): void;
  };

function create<T extends KVPairs<any>, M extends KVPairs<Function>>(
  opts: CreateOptions<T, M>
): Seat<T, M> {
  let instance: Seat<T, M> = {} as Seat<T, M>;

  /* Private fields */
  let toKills: Function[] = [];
  let eventHandlers: OnChangeEventHandler[];
  let vars: KVPairs<Variable<any>> = {};
  /*  */
  instance.bind = function (variableName: string, el: any) {
    let v = vars[variableName];
    if (!v) {
      throw new Error("Variable not found!");
    }
    toKills.push(v.bind(el));
  };

  instance.delete = function () {
    toKills.forEach((f) => f());
    opts.killed();
  };

  instance.getVar = function (name: string): Variable<any> {
    return vars[name];
  };

  /* Initialize */
  for (let key in opts.data || []) {
    let val = opts.data[key];
    let variable = new Variable(val).setName(key);
    vars[key] = variable;
    variable.seat(instance);
  }

  for (let key in opts.methods || []) {
    let val = opts.methods[key];
    // @ts-ignore
    instance[key] = (...args: any[]): any => {
      return val.call(instance, ...args);
    };
  }

  toKills.push(
    hook({
      el: opts.el,
      template: opts.template,
      variables: vars,
      renderers: opts.renderers,
      events: {
        created : opts.created,
        mounted : opts.mounted,
      }
    })
  );
  return instance;
}

export { Seat, create };
