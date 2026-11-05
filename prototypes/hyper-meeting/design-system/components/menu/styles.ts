/** Shared row geometry. Components add their own indicator gutter or multiline layout. */
export const menuItemClassName =
  "relative flex cursor-pointer select-none items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm outline-hidden";

/** Base UI menus, selects, and comboboxes use the same highlighted attribute. */
export const menuItemHighlightClassName =
  "not-data-[variant=destructive]:data-[highlighted]:bg-primary not-data-[variant=destructive]:data-[highlighted]:text-primary-foreground not-data-[variant=destructive]:data-[highlighted]:**:text-primary-foreground";

export const menuItemSubmenuClassName =
  "data-[popup-open]:bg-primary data-[popup-open]:text-primary-foreground data-[popup-open]:**:text-primary-foreground";

/** Ariakit's active item is keyboard focus, independent of its checked value. */
export const menuItemActiveClassName =
  "data-[active-item]:bg-primary data-[active-item]:text-primary-foreground data-[active-item]:**:text-primary-foreground";

/** cmdk's selected item is its active row; native selectable lists opt in too. */
export const menuItemSelectedClassName =
  "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:**:text-primary-foreground";

/** Native rows and virtual-focus lists need explicit pointer/focus feedback. */
export const menuItemPointerClassName =
  "not-disabled:not-aria-disabled:hover:bg-primary not-disabled:not-aria-disabled:hover:text-primary-foreground not-disabled:not-aria-disabled:hover:**:text-primary-foreground not-disabled:not-aria-disabled:focus-visible:bg-primary not-disabled:not-aria-disabled:focus-visible:text-primary-foreground not-disabled:not-aria-disabled:focus-visible:**:text-primary-foreground";
