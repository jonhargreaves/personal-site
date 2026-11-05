/** Shared iframe contract; each prototype keeps its own sections and runtime. */
export type PrototypeProgress = {
  type: "prototype:progress";
  prototypeId: string;
  completed: number;
  total: number;
};

export function isPrototypeProgress(value: unknown, prototypeId: string, total: number): value is PrototypeProgress {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Partial<PrototypeProgress>;
  return message.type === "prototype:progress" && message.prototypeId === prototypeId &&
    message.total === total && Number.isInteger(message.completed) &&
    typeof message.completed === "number" && message.completed >= 0 && message.completed <= total;
}
