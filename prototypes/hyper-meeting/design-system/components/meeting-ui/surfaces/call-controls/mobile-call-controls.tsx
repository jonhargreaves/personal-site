import { Drawer } from "../../../drawer";

import { MobileCallControlsProvider } from "./mobile-call-controls-context";
import {
  type MobileCallControlsProps,
  useMobileCallControlsController,
} from "./mobile-call-controls-controller";

function MobileCallControls({
  children,
  defaultOpen,
  onOpenChange,
  open,
  prefersReducedMotion,
  size,
  variant,
}: MobileCallControlsProps) {
  const controller = useMobileCallControlsController({
    defaultOpen,
    onOpenChange,
    open,
    prefersReducedMotion,
    size,
  });

  return (
    <Drawer
      onOpenChange={controller.handleDrawerChange}
      open={controller.drawerOpen}
    >
      <MobileCallControlsProvider
        value={{
          controller,
          prefersReducedMotion,
          size,
          variant,
        }}
      >
        {children}
      </MobileCallControlsProvider>
    </Drawer>
  );
}

export { MobileCallControls };
export type { MobileCallControlsProps };
