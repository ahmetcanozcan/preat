import { PreRenderPlugin, PluginDef, PluginType } from "./plugin";

export const ArrayIndexer: PluginDef<PreRenderPlugin> = {
  type: PluginType.PreRender,
  plugin: (ctx) => {
    for (let key in ctx) {
      let v = ctx[key];
      if (Array.isArray(v)) {
        let i = 0;
        ctx[key] = v.map((vi) => ({ index: i++, value: vi }));
      }
    }
    return ctx;
  },
};
