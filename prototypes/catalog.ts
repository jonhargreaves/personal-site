import type { PrototypeDefinition } from "@/components/prototype/types";
import type { work } from "@/lib/work";
import { hyperMeetingDefinition } from "./hyper-meeting/preview/definition";

/** Server-side catalog: preview metadata only, never a prototype's interactive entry. */
export const caseStudyPrototypes: Partial<Record<(typeof work)[number]["slug"], PrototypeDefinition>> = {
  "hyper-meeting-ui": hyperMeetingDefinition,
};
