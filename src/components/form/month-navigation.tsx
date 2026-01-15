import { useState, useEffect } from "react"
import { IconChevronLeft, IconChevronRight, IconCheck, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MonthNavigationProps {
  periodoAtual: string
  anos: number[]
  onPeriodoChange: (periodo: string) => void
  temDadosSalvos: (periodo: string) => boolean
  onLimparRelatorio: (periodo: string) => void
  onLimparAno: (ano: number) => void
}

const mesesAbrev = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
]

export function MonthNavigation({
  periodoAtual,
  anos,
  onPeriodoChange,
  temDadosSalvos,
  onLimparRelatorio,
  onLimparAno,
}: MonthNavigationProps) {
  const [anoSelecionado, setAnoSelecionado] = useState<number>(() => {
    const [ano] = periodoAtual.split("-")
    return parseInt(ano)
  })
  
  const [startYearIndex, setStartYearIndex] = useState(0)
  // Menos anos visíveis em mobile para caber na tela
  const [maxVisibleYears, setMaxVisibleYears] = useState(6)

  // Ajustar quantidade de anos visíveis baseado no tamanho da tela
  useEffect(() => {
    const updateVisibleYears = () => {
      const width = window.innerWidth
      if (width < 360) {
        setMaxVisibleYears(4)
      } else if (width < 480) {
        setMaxVisibleYears(5)
      } else if (width < 640) {
        setMaxVisibleYears(6)
      } else {
        setMaxVisibleYears(10)
      }
    }
    updateVisibleYears()
    window.addEventListener('resize', updateVisibleYears)
    return () => window.removeEventListener('resize', updateVisibleYears)
  }, [])

  // State for delete confirmations
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [confirmDeleteMonth, setConfirmDeleteMonth] = useState<string | null>(null)
  const [confirmDeleteYear, setConfirmDeleteYear] = useState<number | null>(null)
  
  // State for fade animation
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Sync anoSelecionado when periodoAtual changes
  useEffect(() => {
    const [ano] = periodoAtual.split("-")
    setAnoSelecionado(parseInt(ano))
  }, [periodoAtual])

  const mesSelecionado = parseInt(periodoAtual.split("-")[1])

  const handleMesClick = (mes: number) => {
    const periodo = `${anoSelecionado}-${String(mes).padStart(2, "0")}`
    onPeriodoChange(periodo)
  }

  const handleAnoClick = (ano: number) => {
    if (ano === anoSelecionado) return // Skip if same year
    
    // Start fade out
    setIsTransitioning(true)
    
    // After fade out, change year and fade in
    setTimeout(() => {
      setAnoSelecionado(ano)
      const periodo = `${ano}-${String(mesSelecionado).padStart(2, "0")}`
      onPeriodoChange(periodo)
      
      // End transition after fade in
      setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
    }, 150)
  }

  const handleLimparMes = (periodo: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDeleteMonth(periodo)
  }

  const handleLimparAno = (ano: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmDeleteYear(ano)
  }

  const confirmarLimparMes = () => {
    if (confirmDeleteMonth) {
      onLimparRelatorio(confirmDeleteMonth)
      setConfirmDeleteMonth(null)
    }
  }

  const confirmarLimparAno = () => {
    if (confirmDeleteYear) {
      onLimparAno(confirmDeleteYear)
      setConfirmDeleteYear(null)
    }
  }

  // Count filled months for a year
  const contarMesesPreenchidos = (ano: number): number => {
    let count = 0
    for (let mes = 1; mes <= 12; mes++) {
      const periodo = `${ano}-${String(mes).padStart(2, "0")}`
      if (temDadosSalvos(periodo)) count++
    }
    return count
  }

  const visibleYears = anos.slice(startYearIndex, startYearIndex + maxVisibleYears)
  const canScrollLeft = startYearIndex > 0
  const canScrollRight = startYearIndex + maxVisibleYears < anos.length

  const scrollYearsLeft = () => {
    setStartYearIndex((prev) => Math.max(0, prev - 1))
  }

  const scrollYearsRight = () => {
    setStartYearIndex((prev) => Math.min(anos.length - maxVisibleYears, prev + 1))
  }

  return (
    <div className="mb-6 print:hidden overflow-hidden">
      {/* Year Navigation - Tab Style */}
      <div className="flex items-end w-full">
        <Button
          variant="ghost"
          size="icon"
          className="h-[42px] w-8 shrink-0 border-b border-muted-foreground/40 rounded-none"
          onClick={scrollYearsLeft}
          disabled={!canScrollLeft}
        >
          <IconChevronLeft size={16} className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex">
          {visibleYears.map((ano) => {
            const mesesPreenchidos = contarMesesPreenchidos(ano)
            const isHovered = hoveredYear === ano
            const isSelected = ano === anoSelecionado
            
            return (
              <div
                key={ano}
                className="relative flex-1 pt-3"
                onMouseEnter={() => setHoveredYear(ano)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <button
                  className={cn(
                    "w-full px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-150",
                    isSelected
                      ? "border border-muted-foreground/40 border-b-background bg-background text-foreground rounded-t-md -mb-px relative z-10"
                      : "border-b border-muted-foreground/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                    mesesPreenchidos > 0 && !isSelected && "text-foreground"
                  )}
                  onClick={() => handleAnoClick(ano)}
                >
                  {ano}
                </button>
                {mesesPreenchidos > 0 && (
                  <span
                    className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shadow-sm z-20",
                      isHovered
                        ? "bg-destructive text-white hover:bg-destructive/90"
                        : isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary text-primary-foreground"
                    )}
                    onClick={isHovered ? (e) => handleLimparAno(ano, e) : undefined}
                    title={isHovered ? `Limpar ${ano} (${mesesPreenchidos} ${mesesPreenchidos === 1 ? 'mês' : 'meses'})` : `${mesesPreenchidos} ${mesesPreenchidos === 1 ? 'mês' : 'meses'} preenchido${mesesPreenchidos === 1 ? '' : 's'}`}
                  >
                    {isHovered ? (
                      <IconX size={12} strokeWidth={3} />
                    ) : (
                      <IconCheck size={12} strokeWidth={3} />
                    )}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-[42px] w-8 shrink-0 border-b border-muted-foreground/40 rounded-none"
          onClick={scrollYearsRight}
          disabled={!canScrollRight}
        >
          <IconChevronRight size={16} className="h-4 w-4" />
        </Button>
      </div>

      {/* Month Navigation with Fade Animation */}
      <div 
        className={cn(
          "grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 sm:gap-2 mt-4 transition-opacity duration-150",
          isTransitioning && "opacity-0"
        )}
      >
        {mesesAbrev.map((mes, index) => {
          const mesNum = index + 1
          const periodo = `${anoSelecionado}-${String(mesNum).padStart(2, "0")}`
          const temDados = temDadosSalvos(periodo)
          const isSelected = anoSelecionado === parseInt(periodoAtual.split("-")[0]) && mesNum === mesSelecionado
          const isHovered = hoveredMonth === mesNum

          return (
            <div
              key={mes}
              className="relative"
              onMouseEnter={() => setHoveredMonth(mesNum)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-full h-9 sm:h-10 min-w-0 px-1 sm:px-2 text-xs sm:text-sm",
                  temDados && !isSelected && "border-primary/50 bg-primary/5"
                )}
                onClick={() => handleMesClick(mesNum)}
              >
                {mes}
              </Button>
              {temDados && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150",
                    isHovered
                      ? "bg-destructive text-white hover:bg-destructive/90"
                      : isSelected
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary text-primary-foreground"
                  )}
                  onClick={isHovered ? (e) => handleLimparMes(periodo, e) : undefined}
                  title={isHovered ? `Limpar dados de ${mes}/${anoSelecionado}` : undefined}
                >
                  {isHovered ? (
                    <IconX size={10} strokeWidth={3} />
                  ) : (
                    <IconCheck size={10} strokeWidth={3} />
                  )}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirmation Dialog for Month */}
      <AlertDialog open={!!confirmDeleteMonth} onOpenChange={() => setConfirmDeleteMonth(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar dados do mês?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeleteMonth && (
                <>
                  Tem certeza que deseja limpar os dados de{" "}
                  <strong>
                    {mesesAbrev[parseInt(confirmDeleteMonth.split("-")[1]) - 1]}/{confirmDeleteMonth.split("-")[0]}
                  </strong>
                  ? Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarLimparMes} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Year */}
      <AlertDialog open={!!confirmDeleteYear} onOpenChange={() => setConfirmDeleteYear(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar dados do ano?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDeleteYear && (
                <>
                  Tem certeza que deseja limpar todos os dados de <strong>{confirmDeleteYear}</strong>?{" "}
                  Isso removerá os dados de <strong>{contarMesesPreenchidos(confirmDeleteYear)}</strong>{" "}
                  {contarMesesPreenchidos(confirmDeleteYear) === 1 ? "mês preenchido" : "meses preenchidos"}.
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarLimparAno} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Limpar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
