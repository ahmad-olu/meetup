import {
  Link_default,
  __toESM,
  require_jsx_runtime
} from "./chunk-DSUFJHXM.js";

// src/Pages/Home.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function Home({
  message,
  user,
  count
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
      "Welcome ",
      user,
      "!"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
      "Count: ",
      count
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link_default, { href: "/about", children: "Go to About Now" })
  ] });
}
export {
  Home as default
};
