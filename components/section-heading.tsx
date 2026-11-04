import type { ReactNode } from "react";

export default function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="border-b border-white/25 pb-2 text-xs uppercase tracking-[1px] text-white/50"
    >
      {children}
    </h2>
  );
}
