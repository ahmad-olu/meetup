import {
  __commonJS,
  __glob,
  __toESM,
  createInertiaApp,
  require_jsx_runtime,
  require_react_dom
} from "./chunk-DSUFJHXM.js";

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";
    var m = require_react_dom();
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function(c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function(c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// src/main.tsx
var import_client = __toESM(require_client(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);

// import("./Pages/**/*.tsx") in src/main.tsx
var globImport_Pages_tsx = __glob({
  "./Pages/About.tsx": () => import("./About-2AIDEEXA.js"),
  "./Pages/Home.tsx": () => import("./Home-TMFMZCMK.js")
});

// src/main.tsx
createInertiaApp({
  title: (title) => `${title} - My App`,
  resolve: async (name) => {
    const module = await globImport_Pages_tsx(`./Pages/${name}.tsx`);
    return module.default;
  },
  setup({ el, App, props }) {
    const root = (0, import_client.createRoot)(el);
    root.render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, { ...props }));
  },
  progress: {
    color: "#9333ea"
  }
});
