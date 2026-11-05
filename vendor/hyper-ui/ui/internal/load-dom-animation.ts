// Stable loader: request Motion features only when the surface mounts.
export const loadDomAnimation = () =>
  import("./motion-dom-animation").then((module) => module.default);
