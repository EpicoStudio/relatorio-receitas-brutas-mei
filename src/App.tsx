import { useState, useRef, useCallback } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { MonthNavigation } from "@/components/form/month-navigation"
import { RevenueForm, RevenueFormRef } from "@/components/form/revenue-form"
import { useReportsStorage } from "@/hooks/use-reports-storage"

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const formRef = useRef<RevenueFormRef>(null)

  const {
    periodoAtual,
    setPeriodoAtual,
    getPerfil,
    setPerfil,
    getRelatorio,
    setRelatorio,
    temDadosSalvos,
    getAnos,
    limparRelatorio,
    limparAno,
    getTodosRelatorios,
  } = useReportsStorage()

  const perfil = getPerfil()
  const relatorio = getRelatorio(periodoAtual)
  const anos = getAnos()

  const handlePerfilChange = useCallback((changes: Parameters<typeof setPerfil>[0]) => {
    setPerfil(changes)
  }, [setPerfil])

  const handleRelatorioChange = useCallback((changes: Parameters<typeof setRelatorio>[1]) => {
    setRelatorio(periodoAtual, changes)
  }, [setRelatorio, periodoAtual])

  return (
    <div className="min-h-screen bg-background print:bg-white flex flex-col">
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        onGerarExemplo={() => formRef.current?.gerarDadosAleatorios()}
        onLembreteMensal={() => formRef.current?.adicionarLembreteGoogleAgenda()}
        onImprimir={() => formRef.current?.imprimirRelatorio()}
        onExportarCSV={() => formRef.current?.exportarCSV()}
        onExportarGoogleSheets={() => formRef.current?.exportarGoogleSheets()}
      />

      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <main className="flex-1 p-4 pb-8 md:p-6 md:pb-10 print:p-0">
          <div className="max-w-4xl mx-auto">
            <MonthNavigation
              periodoAtual={periodoAtual}
              anos={anos}
              onPeriodoChange={setPeriodoAtual}
              temDadosSalvos={temDadosSalvos}
              onLimparRelatorio={limparRelatorio}
              onLimparAno={limparAno}
            />
            <RevenueForm
              ref={formRef}
              periodo={periodoAtual}
              perfil={perfil}
              relatorio={relatorio}
              onPerfilChange={handlePerfilChange}
              onRelatorioChange={handleRelatorioChange}
              getTodosRelatorios={getTodosRelatorios}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="relatorio-mei-theme">
      <AppContent />
    </ThemeProvider>
  )
}
