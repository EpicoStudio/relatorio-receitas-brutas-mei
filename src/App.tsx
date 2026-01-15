import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { RevenueForm } from "@/components/form/revenue-form"

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 print:p-0">
          <div className="max-w-4xl mx-auto lg:mr-0">
            <RevenueForm />
          </div>
        </main>
      </div>
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
