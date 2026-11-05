import type { PrototypeDefinition } from "@/components/prototype/types";

export const hyperMeetingConfig = {
  id: "hyper-meeting",
  src: "/prototypes/hyper-meeting",
  title: "Hyper meeting interface",
  label: "Hyper Meeting UI Prototype",
  sections: 3,
} as const satisfies Omit<PrototypeDefinition, "logo" | "loading">;
