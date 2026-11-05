import type { ReactNode } from "react";

/** Lightweight case-study presentation. Never import the interactive runtime here. */
export type PrototypeDefinition = {
  id: string;
  src: `/prototypes/${string}`;
  title: string;
  label: string;
  sections: number;
  logo?: ReactNode;
  loading: ReactNode;
};
