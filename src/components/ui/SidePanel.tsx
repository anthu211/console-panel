import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface SidePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

/** ds-side-panel — right-edge slide-over for controls pulled out of the main toolbar (e.g. filters). Sticky, no overlay: page content behind it stays visible and interactive. */
export function SidePanel({ open, onOpenChange, title, children, footer }: SidePanelProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed right-0 top-0 z-50 flex h-full w-[340px] flex-col border-l border-card-border bg-card-bg shadow-[-8px_0_24px_rgba(0,0,0,0.12)] focus:outline-none data-[state=open]:animate-slide-in-right"
        >
          <div className="flex items-center justify-between border-b border-shell-border px-5 py-4">
            <Dialog.Title className="text-[14px] font-semibold text-shell-text">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full text-shell-muted hover:bg-shell-hover hover:text-shell-text"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="border-t border-shell-border px-5 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
