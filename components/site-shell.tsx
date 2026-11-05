import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex justify-center bg-black">
      <div className="flex h-full w-full max-w-[632px] min-w-0 flex-col gap-18 px-4 py-8 font-mono text-base text-white/75 lg:pt-18">
        {children}
      </div>
    </main>
  );
}
