"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { useState } from "react";

import { LucideChevronUp, LucideSearch } from "../../../../icons/index";

import { Button } from "../../../button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../collapsible";
import { Input } from "../../../input";
import { ScrollArea } from "../../../scroll-area";
import * as Predicate from "../../../../lib/predicate";
import { cn } from "../../../../lib/utils";

import {
  MeetingParticipantItemProvider,
  MeetingParticipantsProvider,
  useMeetingParticipantsPanel,
} from "./participant-context";
import { MeetingParticipantPanelItemRow } from "./participant-row";
import type {
  MeetingParticipantPanelItem,
  MeetingParticipantsPanelProps,
} from "./participant-types";

export const meetingParticipantsPanelRootVariants = cva(
  "flex h-full flex-col",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingParticipantsPanelSearchVariants = cva("px-4 py-3", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const meetingParticipantsPanelSectionVariants = cva(
  "flex flex-col gap-4",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingParticipantsPanelScrollAreaVariants = cva("flex-1", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function MeetingParticipantsPanel({
  children,
  defaultSearchQuery,
  onSearchQueryChange,
  searchPlaceholder,
  searchQuery,
  sections,
}: MeetingParticipantsPanelProps) {
  return (
    <MeetingParticipantsProvider
      defaultSearchQuery={defaultSearchQuery}
      onSearchQueryChange={onSearchQueryChange}
      searchPlaceholder={searchPlaceholder}
      searchQuery={searchQuery}
      sections={sections}
    >
      <MeetingParticipantsPanelRoot>
        <MeetingParticipantsPanelSearchSlot />
        <MeetingParticipantsPanelList>{children}</MeetingParticipantsPanelList>
      </MeetingParticipantsPanelRoot>
    </MeetingParticipantsProvider>
  );
}

export function MeetingParticipantsPanelSearchSlot() {
  const { onSearchQueryChange, searchPlaceholder, searchQuery } =
    useMeetingParticipantsPanel("MeetingParticipantsPanelSearchSlot");

  return (
    <MeetingParticipantsPanelSearch
      onChange={onSearchQueryChange}
      placeholder={searchPlaceholder}
      value={searchQuery}
    />
  );
}

function participantMatchesPanelSearch(
  item: MeetingParticipantPanelItem,
  query: string
) {
  return item.name.toLowerCase().includes(query.trim().toLowerCase());
}

export type MeetingParticipantsPanelItemRender = (
  item: MeetingParticipantPanelItem,
  section: MeetingParticipantsPanelProps["sections"][number]
) => React.ReactNode;

export type MeetingParticipantsPanelListProps =
  React.ComponentPropsWithoutRef<"div"> & {
    readonly children?: React.ReactNode | MeetingParticipantsPanelItemRender;
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingParticipantsPanelList({
  children,
  ...props
}: MeetingParticipantsPanelListProps) {
  const { searchQuery, sections } = useMeetingParticipantsPanel(
    "MeetingParticipantsPanelList"
  );
  const visibleSections = sections.flatMap((section) => {
    const participants = section.participants.filter((participant) =>
      participantMatchesPanelSearch(participant, searchQuery)
    );
    return participants.length > 0 || section.hideWhenEmpty !== true
      ? [{ participants, section }]
      : [];
  });

  return (
    <MeetingParticipantsPanelScrollArea {...props}>
      {visibleSections.map(({ participants, section }) => (
        <MeetingParticipantsPanelSection
          actionLabel={section.actionLabel}
          count={participants.length}
          defaultOpen={section.defaultOpen}
          key={section.id}
          label={section.label}
          onAction={section.onAction}
        >
          {participants.length > 0
            ? participants.map((item) => (
                <MeetingParticipantItemProvider
                  item={item}
                  key={item.id}
                  section={section}
                >
                  {Predicate.isFunction(children)
                    ? children(item, section)
                    : (children ?? <MeetingParticipantPanelItemRow />)}
                </MeetingParticipantItemProvider>
              ))
            : section.emptyContent}
        </MeetingParticipantsPanelSection>
      ))}
    </MeetingParticipantsPanelScrollArea>
  );
}

export type MeetingParticipantsPanelRootProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof meetingParticipantsPanelRootVariants> & {
      readonly ref?: React.Ref<HTMLDivElement>;
    };

export function MeetingParticipantsPanelRoot({
  className,
  ref,
  variant,
  ...props
}: MeetingParticipantsPanelRootProps) {
  return (
    <div
      className={cn(
        meetingParticipantsPanelRootVariants({ variant }),
        className
      )}
      data-slot="participants-panel"
      ref={ref}
      {...props}
    />
  );
}

export type MeetingParticipantsPanelSearchProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onChange"
> &
  VariantProps<typeof meetingParticipantsPanelSearchVariants> & {
    readonly onChange: (value: string) => void;
    readonly placeholder?: string;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly value: string;
  };

export function MeetingParticipantsPanelSearch({
  className,
  onChange,
  placeholder = "Search for participants",
  ref,
  value,
  variant,
  ...props
}: MeetingParticipantsPanelSearchProps) {
  return (
    <div
      className={cn(
        meetingParticipantsPanelSearchVariants({ variant }),
        className
      )}
      data-slot="participants-panel-search"
      ref={ref}
      {...props}
    >
      <div className="relative">
        <LucideSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9 text-sm"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </div>
    </div>
  );
}

export type MeetingParticipantsPanelSectionProps =
  React.ComponentPropsWithoutRef<"div"> &
    VariantProps<typeof meetingParticipantsPanelSectionVariants> & {
      readonly actionLabel?: string;
      readonly count: number;
      readonly defaultOpen?: boolean;
      readonly label: string;
      readonly onAction?: () => void;
      readonly onOpenChange?: (open: boolean) => void;
      readonly open?: boolean;
      readonly ref?: React.Ref<HTMLDivElement>;
    };

export function MeetingParticipantsPanelSection({
  actionLabel,
  children,
  className,
  count,
  defaultOpen = true,
  label,
  onAction,
  onOpenChange,
  open,
  ref,
  variant,
  ...props
}: MeetingParticipantsPanelSectionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <Collapsible
      className={cn(
        meetingParticipantsPanelSectionVariants({ variant }),
        className
      )}
      data-slot="participants-panel-section"
      onOpenChange={handleOpenChange}
      open={isOpen}
      ref={ref}
      {...props}
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-popover-foreground text-sm">{label}</span>
          <span className="rounded bg-input px-1 text-popover-foreground text-xs">
            {count}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onAction && actionLabel ? (
            <button
              className="text-popover-foreground text-xs hover:underline"
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </button>
          ) : null}
          <CollapsibleTrigger asChild>
            <Button
              aria-label="Toggle section"
              className="size-5 p-0"
              size="icon"
              type="button"
              variant="ghost"
            >
              <LucideChevronUp
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  !isOpen && "rotate-180"
                )}
              />
              <span className="sr-only">Toggle section</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <div className="flex flex-col gap-4 px-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export type MeetingParticipantsPanelScrollAreaProps =
  React.ComponentPropsWithoutRef<typeof ScrollArea> &
    VariantProps<typeof meetingParticipantsPanelScrollAreaVariants> & {};

export function MeetingParticipantsPanelScrollArea({
  children,
  className,
  variant,
  ...props
}: MeetingParticipantsPanelScrollAreaProps) {
  return (
    <ScrollArea
      className={cn(
        meetingParticipantsPanelScrollAreaVariants({ variant }),
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-8 pb-4">{children}</div>
    </ScrollArea>
  );
}
