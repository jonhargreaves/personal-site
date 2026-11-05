import type { PrototypeDefinition } from "@/components/prototype/types";
import { Logo } from "../design-system/components/brand/logo";
import { hyperMeetingConfig } from "../config";
import MeetingLoading from "./meeting-loading";

export const hyperMeetingDefinition = {
  ...hyperMeetingConfig,
  logo: (
    <span role="img" aria-label="Hyper" className="flex size-8 items-center justify-center">
      <Logo className="size-6 text-white/25 [&_path]:fill-current" />
    </span>
  ),
  loading: <MeetingLoading />,
} satisfies PrototypeDefinition;
