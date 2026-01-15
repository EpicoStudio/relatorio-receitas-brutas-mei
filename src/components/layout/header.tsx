import { IconMenu2, IconRefresh, IconCalendar, IconDownload, IconFileSpreadsheet, IconBrandGoogleDrive } from "@tabler/icons-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface HeaderProps {
  onMenuClick: () => void
  onGerarExemplo: () => void
  onLembreteMensal: () => void
  onImprimir: () => void
  onExportarCSV: () => void
  onExportarGoogleSheets: () => void
}

export function Header({ onMenuClick, onGerarExemplo, onLembreteMensal, onImprimir, onExportarCSV, onExportarGoogleSheets }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <Logo className="h-7 text-foreground" />
          </a>
        </div>

        <TooltipProvider>
          <div className="hidden md:flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onGerarExemplo} variant="outline" size="sm" className="gap-1.5">
                  <IconRefresh size={16} />
                  <span className="hidden lg:inline">Gerar Exemplo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Gerar Exemplo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onLembreteMensal} variant="outline" size="sm" className="gap-1.5">
                  <IconCalendar size={16} />
                  <span className="hidden lg:inline">Lembrete Mensal</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Lembrete Mensal</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onExportarCSV} variant="outline" size="sm" className="gap-1.5">
                  <IconFileSpreadsheet size={16} />
                  <span className="hidden lg:inline">Salvar CSV</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Salvar CSV</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onExportarGoogleSheets} variant="outline" size="sm" className="gap-1.5">
                  <IconBrandGoogleDrive size={16} />
                  <span className="hidden lg:inline">Google Sheets</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Google Sheets</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onImprimir} size="sm" className="gap-1.5">
                  <IconDownload size={16} />
                  <span className="hidden lg:inline">Imprimir / Salvar PDF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">
                <p>Imprimir / Salvar PDF</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

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
