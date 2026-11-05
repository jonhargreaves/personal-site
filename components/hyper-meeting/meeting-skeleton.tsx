import type { ComponentProps } from "react";
import { Skeleton } from "@/vendor/hyper-ui/ui/components/skeleton";
import styles from "./meeting-loading.module.css";

export default function MeetingSkeleton({ className = "", ...props }: ComponentProps<typeof Skeleton>) {
  return <Skeleton aria-hidden="true" {...props} className={`${styles.skeleton} ${className}`} />;
}
