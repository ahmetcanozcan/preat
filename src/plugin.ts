import { KVPairs } from "./types";

export enum PluginType {
  PreRender,
}

export type PluginDef<T> = {
  type: PluginType;
  plugin: T;
};

export type PreRenderPlugin = (ctx: KVPairs<any>) => KVPairs<any>;
export let preRenderPlugins: PreRenderPlugin[] = [];

export function use(def: PluginDef<any>) {
  switch (def.type) {
    case PluginType.PreRender:
      preRenderPlugins.push(def.plugin);
  }
}
