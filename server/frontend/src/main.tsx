import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

createInertiaApp({
  title: (title) => `${title} - My App`,
  resolve: async (name) => {
    const module = await import(`./Pages/${name}.tsx`);
    return module.default;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: "#9333ea",
  },
});
