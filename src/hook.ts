import Variable, { OnChangeEvent } from "./variable";
import { KVPairs } from "./types";
import * as hogan from "hogan.js";
import { preRenderPlugins } from "./plugin";

export type HookOptions = {
  el: any;
  template: string;
  variables: KVPairs<Variable<any>>;
  renderers?: KVPairs<Function>;
  events?: {
    created(): void;
    mounted(): void;
  };
};

export default function hook(opts: HookOptions) {
  if (typeof opts.el == "string") {
    opts.el = document.querySelector(opts.el);
  }
  let compiledTemplate = hogan.compile(opts.template);
  let reloadElement = () => {
    let v: KVPairs<any> = {};
    for (let key in opts.variables || []) {
      v[key] = opts.variables[key].get();
    }
    v = Object.assign(v, opts.renderers || []);
    v = preRenderPlugins.reduce((acc, f) => f(acc), v);
    opts.el.innerHTML = compiledTemplate.render(v);
  };

  let ev = new OnChangeEvent((n) => {
    reloadElement();
    if (!!opts.events && !!opts.events.mounted) opts.events.mounted();
  });

  for (let key in opts.variables || []) {
    opts.variables[key].addOnChangeEvent(ev);
  }
  if (!!opts.events && !!opts.events.created) opts.events.created();
  reloadElement();
  return function () {
    for (let key in opts.variables) {
      opts.variables[key].removeOnChangeEvent(ev);
    }
  };
}
