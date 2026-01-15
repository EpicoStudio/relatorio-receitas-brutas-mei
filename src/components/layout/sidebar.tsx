import { IconX } from "@tabler/icons-react"
import { AboutBox } from "@/components/sidebar/about-box"
import { FAQAccordion } from "@/components/sidebar/faq-accordion"
import { OfficialLinks } from "@/components/sidebar/official-links"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const sidebarContent = (
    <div className="space-y-4 overflow-y-auto">
      <AboutBox />
      <FAQAccordion />
      <OfficialLinks />
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:block w-80 shrink-0 print:hidden">
        <div className="sticky top-[calc(3.5rem+1px)] h-[calc(100vh-3.5rem-1px)] overflow-y-auto p-4">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar - Sheet/Drawer */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base">Menu</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <IconX className="h-4 w-4" />
                <span className="sr-only">Fechar menu</span>
              </Button>
            </div>
          </SheetHeader>
          <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            {/* Mobile Navigation Links */}
            <nav className="mb-6 lg:hidden">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="block py-2 px-3 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    Início
                  </a>
                </li>
                <li>
                  <a
                    href="#ajuda"
                    className="block py-2 px-3 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    Ajuda
                  </a>
                </li>
                <li>
                  <a
                    href="#sobre"
                    className="block py-2 px-3 rounded-md text-sm font-medium hover:bg-accent transition-colors"
                    onClick={() => onOpenChange(false)}
                  >
                    Sobre
                  </a>
                </li>
              </ul>
            </nav>
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
