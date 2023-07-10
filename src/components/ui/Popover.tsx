import React, { FC } from "react";
import * as RadixPopover from "@radix-ui/react-popover";

export type PopoverProps = {
  trigger?: React.ReactElement;
  anchor?: React.ReactElement;
  children: React.ReactNode;
  title?: string;
  align?: "center" | "start" | "end";
  side?: "bottom" | "top" | "right" | "left";
  sideOffset?: number;
  alignOffset?: number;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  modal?: boolean;
};

export const Popover: FC<React.PropsWithChildren<PopoverProps>> = ({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  align,
  sideOffset,
  alignOffset,
  side,
  children,
  className,
  anchor,
  modal,
}) => {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange} modal={modal}>
      {trigger && (
        <RadixPopover.Trigger dir="ltr" asChild>
          {trigger}
        </RadixPopover.Trigger>
      )}
      {anchor && (
        <RadixPopover.Anchor dir="ltr" asChild>
          {anchor}
        </RadixPopover.Anchor>
      )}

      <RadixPopover.Portal>
        <RadixPopover.Content
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          asChild
          aria-label={title}
          aria-describedby={description}
          className={className}
          dir="ltr"
          onFocusOutside={(event) => event.preventDefault()}
        >
          <div>{children}</div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};
