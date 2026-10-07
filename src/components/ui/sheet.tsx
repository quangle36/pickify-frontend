import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;
const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/15 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:duration-500 data-[state=closed]:duration-[350ms] motion-reduce:animate-none" />
      <SheetPrimitive.Content ref={ref} className={cn('fixed inset-y-0 left-0 z-50 flex h-dvh w-[260px] max-w-[calc(100vw-56px)] flex-col bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left data-[state=open]:duration-500 data-[state=closed]:duration-[350ms] [animation-timing-function:cubic-bezier(0.32,0.72,0,1)] motion-reduce:animate-none', className)} {...props}>
        <SheetClose className="sr-only">Đóng menu quản trị</SheetClose>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  ),
);
SheetContent.displayName = 'SheetContent';
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
