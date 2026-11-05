import MeetingSkeleton from "./meeting-skeleton";
import styles from "./meeting-loading.module.css";

export function MeetingTopBarLoading() {
  return (
    <div className={styles.topBar} aria-label="Loading meeting top bar" aria-busy="true">
      <div className={styles.topBarGrid} aria-hidden="true">
        <div className="flex min-w-0 items-center gap-2">
          <MeetingSkeleton className={`${styles.mobile} size-6 shrink-0 rounded-[8px]`} />
          <MeetingSkeleton className={`${styles.desktop} h-6 w-[70px] shrink-0 rounded-[8px]`} />
          <MeetingSkeleton className={styles.layoutButton} />
        </div>
        <MeetingSkeleton className={styles.recording} />
        <div className="flex items-center justify-self-end gap-2">
          <MeetingSkeleton className={`${styles.desktop} h-6 w-20 rounded-full`} />
          <MeetingSkeleton className={styles.invite} />
          <MeetingSkeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function MeetingStageLoading() {
  return (
    <div className={styles.stage} aria-label="Loading participant tiles" aria-busy="true">
      <div className={styles.tileGrid} aria-hidden="true">
        {[0, 1, 2, 3].map((tile) => (
          <div key={tile} className={styles.tile}>
            <MeetingSkeleton className={styles.avatar} />
            <MeetingSkeleton className={styles.tileLabel} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingControl({ media = false }: { media?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <MeetingSkeleton className={`${media ? "w-[72px]" : "w-10"} h-10 rounded-full`} />
      <MeetingSkeleton className="h-3 w-9 rounded" />
    </div>
  );
}

export function MeetingControlsLoading() {
  return (
    <div className={styles.controls} aria-label="Loading call controls" aria-busy="true">
      <div className={styles.mobileControls} aria-hidden="true">
        <MeetingSkeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((control) => <MeetingSkeleton key={control} className="size-10 rounded-full" />)}
        </div>
        <MeetingSkeleton className="size-10 shrink-0 rounded-full" />
      </div>
      <div className={styles.desktopControls} aria-hidden="true">
        <div className="flex gap-6"><LoadingControl /><LoadingControl /></div>
        <div className="flex gap-8"><LoadingControl media /><LoadingControl media /><LoadingControl /><LoadingControl /><LoadingControl /></div>
        <div className="flex justify-self-end gap-6"><LoadingControl /><LoadingControl /></div>
      </div>
    </div>
  );
}

export default function MeetingLoading() {
  return (
    <div className="flex size-full min-h-0 flex-col bg-neutral-950" aria-hidden="true">
      <MeetingTopBarLoading />
      <div className="min-h-0 flex-1 px-4"><MeetingStageLoading /></div>
      <MeetingControlsLoading />
    </div>
  );
}
