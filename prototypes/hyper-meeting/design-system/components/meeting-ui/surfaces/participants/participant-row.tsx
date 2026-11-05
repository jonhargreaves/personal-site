"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext, useMemo } from "react";
import type * as React from "react";

import { LucideMoreHorizontal, LucideScreenShare } from "../../../../icons/index";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../avatar";
import { Badge } from "../../../badge";
import { Button } from "../../../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../dropdown-menu";
import { cn } from "../../../../lib/utils";

import { MicToggleIcon, VideoToggleIcon } from "../call-controls/icons";
import { useOptionalMeetingParticipantItem } from "./participant-context";
import type {
  MeetingParticipantActionModel,
  MeetingParticipantPanelItem,
  MeetingParticipantPanelMedia,
  MeetingParticipantPanelStatus,
} from "./participant-types";

export const meetingParticipantRowVariants = cva(
  "flex items-center justify-between",
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

export const meetingParticipantIconButtonVariants = cva(
  "size-8 p-0 opacity-70 hover:opacity-100",
  {
    variants: {
      variant: {
        active: "text-primary opacity-100 hover:text-primary",
        default: "",
        warning:
          "text-destructive opacity-100 hover:bg-destructive/10 hover:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingParticipantStatusIconVariants = cva(
  "flex size-8 items-center justify-center rounded-full opacity-70",
  {
    variants: {
      variant: {
        active: "text-primary opacity-100",
        default: "",
        warning: "text-destructive opacity-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const meetingParticipantMenuTriggerVariants = cva(
  "size-8 p-0 opacity-70 hover:opacity-100",
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

export type MeetingParticipantActionContextValue = {
  readonly action: MeetingParticipantActionModel;
};

const MeetingParticipantActionContext =
  createContext<MeetingParticipantActionContextValue | null>(null);

export type MeetingParticipantActionProviderProps = {
  readonly action: MeetingParticipantActionModel;
  readonly children: React.ReactNode;
};

export function MeetingParticipantActionProvider({
  action,
  children,
}: MeetingParticipantActionProviderProps) {
  const value = useMemo(() => ({ action }), [action]);

  return (
    <MeetingParticipantActionContext.Provider value={value}>
      {children}
    </MeetingParticipantActionContext.Provider>
  );
}

export function useOptionalMeetingParticipantAction() {
  return useContext(MeetingParticipantActionContext);
}

export function useMeetingParticipantAction(
  componentName = "MeetingParticipantAction component"
) {
  const context = useOptionalMeetingParticipantAction();

  if (!context) {
    throw new Error(
      `${componentName} must be rendered inside MeetingParticipantActionProvider.`
    );
  }

  return context;
}

function getMeetingParticipantActionButtonVariant(
  action: MeetingParticipantActionModel
) {
  return action.tone === "destructive" ? "warning" : "active";
}

function getMeetingParticipantActionMenuVariant(
  action: MeetingParticipantActionModel
) {
  return action.tone === "destructive" ? "destructive" : "default";
}

export function shouldRenderMeetingParticipantActionSeparator(
  actions: readonly MeetingParticipantActionModel[],
  index: number
) {
  return index > 0 && actions[index - 1]?.group !== actions[index]?.group;
}

export type MeetingParticipantPanelItemRowProps = {
  readonly children?: React.ReactNode;
  readonly item?: MeetingParticipantPanelItem;
};

export function MeetingParticipantPanelItemRow({
  children,
  item: itemProp,
}: MeetingParticipantPanelItemRowProps) {
  const context = useOptionalMeetingParticipantItem();
  const item = itemProp ?? context?.item;

  if (!item) {
    throw new Error(
      "MeetingParticipantPanelItemRow requires an item prop or MeetingParticipantItemProvider."
    );
  }

  return (
    <MeetingParticipantRow
      avatarColor={item.avatarColor}
      avatarFallback={item.avatarFallback}
      avatarUrl={item.avatarUrl}
      name={item.name}
      subtitle={item.subtitle}
    >
      {item.media ? <MeetingParticipantMediaStatus media={item.media} /> : null}
      <MeetingParticipantStatusIcons icons={item.statusIcons ?? []} />
      {children}
    </MeetingParticipantRow>
  );
}

export function MeetingParticipantStatusIcons({
  icons,
}: {
  readonly icons: readonly MeetingParticipantPanelStatus[];
}) {
  if (icons.length === 0) {
    return null;
  }

  return (
    <>
      {icons.map((icon) => (
        <MeetingParticipantStatusIcon
          key={icon.id}
          label={icon.label}
          variant={icon.variant}
        >
          {icon.icon}
        </MeetingParticipantStatusIcon>
      ))}
    </>
  );
}

export function MeetingParticipantMediaStatus({
  media,
}: {
  readonly media: MeetingParticipantPanelMedia;
}) {
  return (
    <>
      {media.hasScreenShare ? (
        <MeetingParticipantStatusIcon label="Sharing screen" variant="active">
          <LucideScreenShare className="size-4" />
        </MeetingParticipantStatusIcon>
      ) : null}

      <MeetingParticipantStatusIcon
        label={media.hasAudio ? "Audio on" : "Audio off"}
        variant={media.hasAudio ? "active" : "default"}
      >
        <MicToggleIcon className="size-4" muted={!media.hasAudio} />
      </MeetingParticipantStatusIcon>

      <MeetingParticipantStatusIcon
        label={media.hasVideo ? "Video on" : "Video off"}
        variant={media.hasVideo ? "active" : "default"}
      >
        <VideoToggleIcon className="size-4" videoOn={media.hasVideo} />
      </MeetingParticipantStatusIcon>
    </>
  );
}

export type MeetingParticipantRowProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof meetingParticipantRowVariants> & {
    readonly avatarColor?: string;
    readonly avatarFallback: string;
    readonly avatarUrl?: string | null;
    readonly avatarWrapper?: (avatar: React.ReactNode) => React.ReactNode;
    readonly name: string;
    readonly ref?: React.Ref<HTMLDivElement>;
    readonly subtitle?: string;
  };

export function MeetingParticipantRow({
  avatarColor,
  avatarFallback,
  avatarUrl,
  avatarWrapper,
  children,
  className,
  name,
  ref,
  subtitle,
  variant,
  ...props
}: MeetingParticipantRowProps) {
  const avatarElement = (
    <Avatar className="size-8">
      {avatarUrl ? <AvatarImage alt={name} src={avatarUrl} /> : null}
      <AvatarFallback
        className="text-sm text-white"
        style={avatarColor ? { backgroundColor: avatarColor } : undefined}
      >
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div
      className={cn(meetingParticipantRowVariants({ variant }), className)}
      data-hyper-elid="participant-row"
      data-slot="participants-panel-row"
      ref={ref}
      {...props}
    >
      <div className="flex items-center gap-3">
        {avatarWrapper ? avatarWrapper(avatarElement) : avatarElement}
        <div className="flex flex-col">
          <span className="text-popover-foreground text-sm">{name}</span>
          {subtitle ? (
            <span className="text-muted-foreground text-sm">{subtitle}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

export type MeetingParticipantActionProps = React.ComponentPropsWithoutRef<
  typeof Badge
> & {
  readonly ref?: React.Ref<HTMLSpanElement>;
};

export function MeetingParticipantAction({
  className,
  ref,
  variant = "default",
  ...props
}: MeetingParticipantActionProps) {
  return (
    <Badge
      className={cn("cursor-pointer px-2 py-0.5", className)}
      ref={ref}
      variant={variant}
      {...props}
    />
  );
}

export type MeetingParticipantIconButtonProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children"
> &
  VariantProps<typeof meetingParticipantIconButtonVariants> & {
    readonly children: React.ReactNode;
    readonly hyperElId?: string;
    readonly label: string;
    readonly ref?: React.Ref<HTMLButtonElement>;
  };

export function MeetingParticipantIconButton({
  children,
  className,
  hyperElId,
  label,
  ref,
  type = "button",
  variant,
  ...props
}: MeetingParticipantIconButtonProps) {
  return (
    <Button
      aria-label={label}
      className={cn(
        meetingParticipantIconButtonVariants({ variant }),
        className
      )}
      data-hyper-elid={hyperElId}
      ref={ref}
      size="icon"
      type={type}
      variant="ghost"
      {...props}
    >
      {children}
    </Button>
  );
}

export type MeetingParticipantActionIconButtonProps = Omit<
  MeetingParticipantIconButtonProps,
  "children" | "hyperElId" | "label" | "onClick" | "variant"
> & {
  readonly children?: React.ReactNode;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
  readonly variant?: MeetingParticipantIconButtonProps["variant"];
};

export function MeetingParticipantActionIconButton({
  children,
  disabled,
  onClick,
  variant,
  ...props
}: MeetingParticipantActionIconButtonProps) {
  const { action } = useMeetingParticipantAction(
    "MeetingParticipantActionIconButton"
  );

  return (
    <MeetingParticipantIconButton
      {...props}
      disabled={disabled || action.disabled || !action.onSelect}
      hyperElId={action.id}
      label={action.label}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          action.onSelect?.();
        }
      }}
      variant={variant ?? getMeetingParticipantActionButtonVariant(action)}
    >
      {children ?? action.icon}
    </MeetingParticipantIconButton>
  );
}

export type MeetingParticipantInlineActionsProps =
  React.ComponentPropsWithoutRef<"div"> & {
    readonly actions: readonly MeetingParticipantActionModel[];
    readonly children?: React.ReactNode;
    readonly ref?: React.Ref<HTMLDivElement>;
  };

export function MeetingParticipantInlineActions({
  actions,
  children,
  className,
  ref,
  ...props
}: MeetingParticipantInlineActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("contents", className)}
      data-slot="participant-inline-actions"
      ref={ref}
      {...props}
    >
      {actions.map((action) => (
        <MeetingParticipantActionProvider action={action} key={action.id}>
          {children ?? <MeetingParticipantActionIconButton />}
        </MeetingParticipantActionProvider>
      ))}
    </div>
  );
}

export type MeetingParticipantStatusIconProps =
  React.ComponentPropsWithoutRef<"span"> &
    VariantProps<typeof meetingParticipantStatusIconVariants> & {
      readonly label: string;
      readonly ref?: React.Ref<HTMLSpanElement>;
    };

export function MeetingParticipantStatusIcon({
  children,
  className,
  label,
  ref,
  variant,
  ...props
}: MeetingParticipantStatusIconProps) {
  return (
    <span
      aria-label={label}
      className={cn(
        meetingParticipantStatusIconVariants({ variant }),
        className
      )}
      ref={ref}
      role="img"
      {...props}
    >
      {children}
    </span>
  );
}

export type MeetingParticipantMenuProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenu
> & {
  readonly children: React.ReactNode;
};

export function MeetingParticipantMenu({
  children,
  ...props
}: MeetingParticipantMenuProps) {
  return (
    <DropdownMenu {...props}>
      <MeetingParticipantMenuTrigger />
      <MeetingParticipantMenuContent>{children}</MeetingParticipantMenuContent>
    </DropdownMenu>
  );
}

export type MeetingParticipantMenuTriggerProps =
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof meetingParticipantMenuTriggerVariants> & {
      readonly ref?: React.Ref<HTMLButtonElement>;
    };

export function MeetingParticipantMenuTrigger({
  className,
  ref,
  variant,
  ...props
}: MeetingParticipantMenuTriggerProps) {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        className={cn(
          meetingParticipantMenuTriggerVariants({ variant }),
          className
        )}
        data-hyper-elid="participant-menu"
        ref={ref}
        size="icon"
        type="button"
        variant="ghost"
        {...props}
      >
        <LucideMoreHorizontal className="size-[18px] text-muted-foreground" />
        <span className="sr-only">Options</span>
      </Button>
    </DropdownMenuTrigger>
  );
}

export type MeetingParticipantMenuContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuContent
> & {
  readonly ref?: React.Ref<HTMLDivElement>;
};

export function MeetingParticipantMenuContent({
  align = "end",
  ref,
  ...props
}: MeetingParticipantMenuContentProps) {
  return <DropdownMenuContent align={align} ref={ref} {...props} />;
}

export type MeetingParticipantMenuItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuItem
>;

export function MeetingParticipantMenuItem(
  props: MeetingParticipantMenuItemProps
) {
  return <DropdownMenuItem {...props} />;
}

export type MeetingParticipantActionMenuItemProps = Omit<
  MeetingParticipantMenuItemProps,
  "children" | "disabled" | "onSelect" | "variant"
> & {
  readonly children?: React.ReactNode;
  readonly disabled?: boolean;
  readonly onSelect?: MeetingParticipantMenuItemProps["onSelect"];
  readonly variant?: MeetingParticipantMenuItemProps["variant"];
};

export function MeetingParticipantActionMenuItem({
  children,
  disabled,
  onSelect,
  variant,
  ...props
}: MeetingParticipantActionMenuItemProps) {
  const { action } = useMeetingParticipantAction(
    "MeetingParticipantActionMenuItem"
  );

  return (
    <MeetingParticipantMenuItem
      {...props}
      data-hyper-elid={action.id}
      disabled={disabled || action.disabled || !action.onSelect}
      onSelect={(event) => {
        onSelect?.(event);

        if (!event.defaultPrevented) {
          action.onSelect?.();
        }
      }}
      variant={variant ?? getMeetingParticipantActionMenuVariant(action)}
    >
      {children ?? (
        <>
          {action.icon}
          {action.label}
        </>
      )}
    </MeetingParticipantMenuItem>
  );
}

export type MeetingParticipantActionMenuProps = Omit<
  MeetingParticipantMenuProps,
  "children"
> & {
  readonly actions: readonly MeetingParticipantActionModel[];
  readonly children?: React.ReactNode;
};

export function MeetingParticipantActionMenu({
  actions,
  children,
  ...props
}: MeetingParticipantActionMenuProps) {
  return (
    <MeetingParticipantMenu {...props}>
      {actions.length === 0 ? (
        <MeetingParticipantMenuItem disabled>
          No actions available
        </MeetingParticipantMenuItem>
      ) : (
        actions.map((action, index) => (
          <MeetingParticipantActionProvider action={action} key={action.id}>
            {shouldRenderMeetingParticipantActionSeparator(actions, index) ? (
              <MeetingParticipantMenuSeparator />
            ) : null}
            {children ?? <MeetingParticipantActionMenuItem />}
          </MeetingParticipantActionProvider>
        ))
      )}
    </MeetingParticipantMenu>
  );
}

export type MeetingParticipantMenuSeparatorProps =
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>;

export function MeetingParticipantMenuSeparator({
  className,
  ...props
}: MeetingParticipantMenuSeparatorProps) {
  return (
    <DropdownMenuSeparator className={cn("bg-border", className)} {...props} />
  );
}
