import { IconMenu2 } from "@tabler/icons-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <Logo className="h-7 text-foreground" />
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Início
          </a>
          <a
            href="#ajuda"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Ajuda
          </a>
          <a
            href="#sobre"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Sobre
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={onMenuClick}
          >
            <IconMenu2 className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
