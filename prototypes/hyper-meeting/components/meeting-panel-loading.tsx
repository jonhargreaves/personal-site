import { MeetingSidePanelHeader } from "@/prototypes/hyper-meeting/design-system/components/meeting-ui/surfaces/side-panel/side-panel";
import { useLoadingPhase } from "@/components/prototype/use-loading-phase";
import MeetingSkeleton from "../preview/meeting-skeleton";
import MeetingPanelHeader from "./meeting-panel-header";

function MoreLoading() {
  return (
    <div className="space-y-2 p-2" aria-hidden="true">
      <MeetingSkeleton className="mx-2 my-3 h-3 w-16" />
      {[112, 136, 96, 80, 120].map((width) => (
        <div key={width} className="flex min-h-[52px] items-center gap-3 px-2 py-2">
          <MeetingSkeleton className="size-9 shrink-0 rounded-[2px]" />
          <div className="flex flex-1 flex-col gap-2">
            <MeetingSkeleton className="h-3.5 max-w-full" style={{ width }} />
            <MeetingSkeleton className="h-3 w-4/5" />
          </div>
          <MeetingSkeleton className="size-3 rounded" />
        </div>
      ))}
      <MeetingSkeleton className="mx-2 my-3 h-3 w-10" />
      <div className="flex min-h-[52px] items-center gap-3 px-2 py-2">
        <MeetingSkeleton className="size-9 shrink-0 rounded-[2px]" />
        <div className="flex flex-1 flex-col gap-2"><MeetingSkeleton className="h-3.5 w-20" /><MeetingSkeleton className="h-3 w-3/4" /></div>
      </div>
    </div>
  );
}

function PeopleLoading() {
  return (
    <div aria-hidden="true">
      <div className="border-b border-border p-2"><MeetingSkeleton className="h-8 w-full rounded-lg" /></div>
      <div className="flex h-12 items-center px-4"><MeetingSkeleton className="h-3.5 w-20" /></div>
      <div className="flex h-12 items-center px-4"><MeetingSkeleton className="h-3.5 w-28" /></div>
      {[1, 3].map((count) => (
        <div key={count}>
          <div className="flex h-8 items-center px-4"><MeetingSkeleton className={`h-3 ${count === 1 ? "w-8" : "w-14"}`} /></div>
          {Array.from({ length: count }, (_, row) => (
            <div key={row} className="flex h-14 items-center gap-3 px-4">
              <MeetingSkeleton className="size-8 shrink-0 rounded-full" />
              <MeetingSkeleton className="h-3.5 min-w-0 flex-1" />
              <div className="flex gap-3"><MeetingSkeleton className="size-4 rounded" /><MeetingSkeleton className="size-4 rounded" /><MeetingSkeleton className="size-4 rounded" /></div>
            </div>
          ))}
        </div>
      ))}
      <div className="flex h-12 items-center px-4"><MeetingSkeleton className="h-3.5 w-20" /></div>
    </div>
  );
}

function ChatLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col" aria-hidden="true">
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-6 overflow-hidden p-4">
        {[2, 3, 2].map((lines, message) => (
          <div key={message} className="flex gap-3">
            <MeetingSkeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center gap-2"><MeetingSkeleton className="h-3.5 w-24" /><MeetingSkeleton className="h-2.5 w-12" /></div>
              {Array.from({ length: lines }, (_, line) => <MeetingSkeleton key={line} className={`h-3 ${line === lines - 1 ? "w-2/3" : "w-full"}`} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 p-2"><MeetingSkeleton className="h-[116px] w-full rounded-lg" /></div>
    </div>
  );
}

export default function MeetingPanelLoading({ title, onBack, onClose }: {
  title: "More" | "People" | "Chat";
  onBack?: () => void;
  onClose: () => void;
}) {
  const phase = useLoadingPhase(true);
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-prototype-loading={title.toLowerCase()}>
      {onBack ? <MeetingPanelHeader title={title} onBack={onBack} onClose={onClose} /> : <MeetingSidePanelHeader title={title} onClose={onClose} />}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" aria-busy="true" aria-label={`Loading ${title.toLowerCase()}`}>
        {title === "More" ? <MoreLoading /> : title === "People" ? <PeopleLoading /> : <ChatLoading />}
      </div>
      <p role="status" className={phase === "slow" ? "shrink-0 px-4 pb-4 text-xs text-muted-foreground" : "sr-only"}>
        {phase === "initial" ? "" : phase === "slow" ? `Still loading ${title.toLowerCase()}. You can ${onBack ? "go back" : "close this panel"} while it loads.` : `Loading ${title.toLowerCase()}…`}
      </p>
    </div>
  );
}
