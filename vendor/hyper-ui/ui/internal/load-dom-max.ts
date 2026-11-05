// Stable loader: request Motion features only when the surface mounts.
export const loadDomMax = () =>
  import("./motion-dom-max").then((module) => module.default);
