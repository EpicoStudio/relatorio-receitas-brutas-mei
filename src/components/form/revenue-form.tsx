import { useImperativeHandle, forwardRef, useCallback } from "react"
import { IconRefresh, IconCalendar, IconDownload, IconFileSpreadsheet, IconBrandGoogleDrive, IconCalculator } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { PerfilUsuario, DadosRelatorio } from "@/hooks/use-reports-storage"

interface DadosMEI {
  cnpj: string
  nome: string
  periodo: string
  comercioSemDoc: string
  comercioComDoc: string
  industriaSemDoc: string
  industriaComDoc: string
  servicosSemDoc: string
  servicosComDoc: string
  local: string
  dataAssinatura: string
}

export interface RevenueFormRef {
  gerarDadosAleatorios: () => void
  adicionarLembreteGoogleAgenda: () => void
  imprimirRelatorio: () => void
  exportarCSV: () => void
  exportarGoogleSheets: () => void
}

interface RevenueFormProps {
  periodo: string
  perfil: PerfilUsuario
  relatorio: DadosRelatorio
  onPerfilChange: (perfil: Partial<PerfilUsuario>) => void
  onRelatorioChange: (relatorio: Partial<DadosRelatorio>) => void
  getTodosRelatorios: () => Array<{ periodo: string; relatorio: DadosRelatorio }>
}

export const RevenueForm = forwardRef<RevenueFormRef, RevenueFormProps>(
  function RevenueForm({ periodo, perfil, relatorio, onPerfilChange, onRelatorioChange, getTodosRelatorios }, ref) {
  // Combine perfil and relatorio into dados for internal use
  const dados: DadosMEI = {
    cnpj: perfil.cnpj,
    nome: perfil.nome,
    local: perfil.local,
    periodo,
    comercioSemDoc: relatorio.comercioSemDoc,
    comercioComDoc: relatorio.comercioComDoc,
    industriaSemDoc: relatorio.industriaSemDoc,
    industriaComDoc: relatorio.industriaComDoc,
    servicosSemDoc: relatorio.servicosSemDoc,
    servicosComDoc: relatorio.servicosComDoc,
    dataAssinatura: relatorio.dataAssinatura,
  }

  const formatarCNPJ = (valor: string): string => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, "").slice(0, 14)
    
    // Aplica a máscara ##.###.###/####-##
    if (numeros.length <= 2) return numeros
    if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`
    if (numeros.length <= 8) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`
    if (numeros.length <= 12) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12)}`
  }

  const handleCNPJChange = (valor: string): void => {
    const cnpjFormatado = formatarCNPJ(valor)
    onPerfilChange({ cnpj: cnpjFormatado })
  }

  const meses = [
    { valor: "01", nome: "Janeiro" },
    { valor: "02", nome: "Fevereiro" },
    { valor: "03", nome: "Março" },
    { valor: "04", nome: "Abril" },
    { valor: "05", nome: "Maio" },
    { valor: "06", nome: "Junho" },
    { valor: "07", nome: "Julho" },
    { valor: "08", nome: "Agosto" },
    { valor: "09", nome: "Setembro" },
    { valor: "10", nome: "Outubro" },
    { valor: "11", nome: "Novembro" },
    { valor: "12", nome: "Dezembro" },
  ]

  const anoAtual = new Date().getFullYear()
  const anos = Array.from({ length: 10 }, (_, i) => anoAtual - 5 + i)

  const dias = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"))

  const formatarMoeda = (valor: string | number): string => {
    const numero = parseFloat(String(valor) || "0")
    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const calcularTotal = (val1: string | number, val2: string | number): string => {
    return (parseFloat(String(val1) || "0") + parseFloat(String(val2) || "0")).toFixed(2)
  }

  const handleChange = useCallback((campo: keyof DadosMEI, valor: string): void => {
    // Fields that belong to profile (shared across months)
    if (campo === "cnpj" || campo === "nome" || campo === "local") {
      onPerfilChange({ [campo]: valor })
    } 
    // Fields that belong to the report (per month)
    else if (campo !== "periodo") {
      onRelatorioChange({ [campo]: valor } as Partial<DadosRelatorio>)
    }
  }, [onPerfilChange, onRelatorioChange])

  const totalComercio = calcularTotal(dados.comercioSemDoc, dados.comercioComDoc)
  const totalIndustria = calcularTotal(dados.industriaSemDoc, dados.industriaComDoc)
  const totalServicos = calcularTotal(dados.servicosSemDoc, dados.servicosComDoc)
  const totalGeral = (
    parseFloat(totalComercio) +
    parseFloat(totalIndustria) +
    parseFloat(totalServicos)
  ).toFixed(2)

  const gerarDadosAleatorios = (): void => {
    const nomes = [
      "Maria Oliveira Costa",
      "José Santos Silva",
      "Ana Paula Rodrigues",
      "Carlos Eduardo Souza",
      "Juliana Ferreira Lima",
    ]
    const cnpjs = [
      "23.456.789/0001-45",
      "34.567.890/0001-56",
      "45.678.901/0001-67",
      "56.789.012/0001-78",
      "67.890.123/0001-89",
    ]
    const locais = [
      "São Paulo - SP",
      "Rio de Janeiro - RJ",
      "Belo Horizonte - MG",
      "Brasília - DF",
      "Curitiba - PR",
    ]
    const idx = Math.floor(Math.random() * nomes.length)
    const hoje = new Date()
    const dataFormatada = hoje.toISOString().split("T")[0]

    // Update profile (shared)
    onPerfilChange({
      cnpj: cnpjs[idx],
      nome: nomes[idx],
      local: locais[idx],
    })

    // Update report data (per month)
    onRelatorioChange({
      comercioSemDoc: (Math.random() * 3000 + 500).toFixed(2),
      comercioComDoc: (Math.random() * 8000 + 1000).toFixed(2),
      industriaSemDoc: (Math.random() * 2000).toFixed(2),
      industriaComDoc: (Math.random() * 5000).toFixed(2),
      servicosSemDoc: (Math.random() * 2500 + 300).toFixed(2),
      servicosComDoc: (Math.random() * 6000 + 800).toFixed(2),
      dataAssinatura: dataFormatada,
    })
  }

  const imprimirRelatorio = (): void => {
    window.print()
  }

  const adicionarLembreteGoogleAgenda = (): void => {
    const hoje = new Date()
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
    const dataInicio = proximoMes.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "00Z"
    const dataFim = proximoMes.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 15) + "00Z"

    const titulo = encodeURIComponent("📋 Preencher Relatório MEI - Receitas Brutas")
    const descricao = encodeURIComponent(
      `Lembrete mensal para preencher o Relatório de Receitas Brutas do MEI.\n\n` +
        `🔗 Acesse o formulário online:\nhttps://relatoriomei.app.br\n\n` +
        `📝 Informações necessárias:\n` +
        `- Receitas de comércio (com e sem documento fiscal)\n` +
        `- Receitas de indústria (com e sem documento fiscal)\n` +
        `- Receitas de serviços (com e sem documento fiscal)\n\n` +
        `⚠️ Mantenha todos os documentos fiscais anexados ao relatório.`
    )

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataInicio}/${dataFim}&details=${descricao}&recur=RRULE:FREQ=MONTHLY;BYMONTHDAY=1`

    window.open(url, "_blank")
  }

  const exportarCSV = (): void => {
    const todosRelatorios = getTodosRelatorios()
    
    if (todosRelatorios.length === 0) {
      alert("Não há relatórios preenchidos para exportar.")
      return
    }

    // Cabeçalho do CSV com informações do perfil
    const csvRows: string[][] = [
      ["RELATÓRIOS MENSAIS DAS RECEITAS BRUTAS - MEI"],
      [],
      ["CNPJ", dados.cnpj],
      ["Nome Empresarial", dados.nome],
      ["Local", dados.local],
      [],
      ["RESUMO DE TODOS OS PERÍODOS"],
      [],
      ["Período", "Comércio S/Doc", "Comércio C/Doc", "Total Comércio", "Indústria S/Doc", "Indústria C/Doc", "Total Indústria", "Serviços S/Doc", "Serviços C/Doc", "Total Serviços", "TOTAL GERAL", "Data Assinatura"],
    ]

    let somaComercio = 0
    let somaIndustria = 0
    let somaServicos = 0

    // Adiciona cada relatório
    todosRelatorios.forEach(({ periodo, relatorio }) => {
      const [ano, mes] = periodo.split("-")
      const mesNome = meses.find(m => m.valor === mes)?.nome || mes
      const periodoFormatado = `${mesNome}/${ano}`
      
      const totalComercio = parseFloat(calcularTotal(relatorio.comercioSemDoc, relatorio.comercioComDoc))
      const totalIndustria = parseFloat(calcularTotal(relatorio.industriaSemDoc, relatorio.industriaComDoc))
      const totalServicos = parseFloat(calcularTotal(relatorio.servicosSemDoc, relatorio.servicosComDoc))
      const totalGeral = totalComercio + totalIndustria + totalServicos

      somaComercio += totalComercio
      somaIndustria += totalIndustria
      somaServicos += totalServicos

      csvRows.push([
        periodoFormatado,
        relatorio.comercioSemDoc,
        relatorio.comercioComDoc,
        totalComercio.toFixed(2),
        relatorio.industriaSemDoc,
        relatorio.industriaComDoc,
        totalIndustria.toFixed(2),
        relatorio.servicosSemDoc,
        relatorio.servicosComDoc,
        totalServicos.toFixed(2),
        totalGeral.toFixed(2),
        relatorio.dataAssinatura || "",
      ])
    })

    // Linha de totais
    csvRows.push([])
    csvRows.push([
      "TOTAIS",
      "", "", somaComercio.toFixed(2),
      "", "", somaIndustria.toFixed(2),
      "", "", somaServicos.toFixed(2),
      (somaComercio + somaIndustria + somaServicos).toFixed(2),
      "",
    ])

    const csvContent = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const dataAtual = new Date().toISOString().split("T")[0]
    link.download = `relatorios-mei-completo-${dataAtual}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportarGoogleSheets = (): void => {
    const totalComercioCalc = calcularTotal(dados.comercioSemDoc, dados.comercioComDoc)
    const totalIndustriaCalc = calcularTotal(dados.industriaSemDoc, dados.industriaComDoc)
    const totalServicosCalc = calcularTotal(dados.servicosSemDoc, dados.servicosComDoc)
    const totalGeralCalc = (
      parseFloat(totalComercioCalc) +
      parseFloat(totalIndustriaCalc) +
      parseFloat(totalServicosCalc)
    ).toFixed(2)

    const periodoFormatado = dados.periodo
      ? `${meses.find(m => m.valor === dados.periodo.split("-")[1])?.nome || ""} de ${dados.periodo.split("-")[0]}`
      : ""

    // Criar CSV para download
    const csvContent = [
      ["RELATÓRIO MENSAL DAS RECEITAS BRUTAS - MEI"],
      [],
      ["CNPJ", dados.cnpj],
      ["Nome Empresarial", dados.nome],
      ["Período de Apuração", periodoFormatado],
      [],
      ["RECEITAS", "Sem Documento Fiscal", "Com Documento Fiscal", "Total"],
      ["Comércio", dados.comercioSemDoc, dados.comercioComDoc, totalComercioCalc],
      ["Indústria", dados.industriaSemDoc, dados.industriaComDoc, totalIndustriaCalc],
      ["Serviços", dados.servicosSemDoc, dados.servicosComDoc, totalServicosCalc],
      [],
      ["TOTAL GERAL", "", "", totalGeralCalc],
      [],
      ["Local", dados.local],
      ["Data", dados.dataAssinatura],
    ]
      .map(row => row.join(","))
      .join("\n")

    // Baixar o arquivo CSV primeiro
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-mei-${dados.periodo || "sem-periodo"}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Mostrar instruções e abrir Google Sheets
    setTimeout(() => {
      const confirmar = confirm(
        "O arquivo CSV foi baixado!\n\n" +
        "Deseja abrir o Google Sheets para importar o arquivo?\n\n" +
        "Instruções:\n" +
        "1. Clique em 'Arquivo' > 'Importar'\n" +
        "2. Selecione a aba 'Fazer upload'\n" +
        "3. Arraste o arquivo CSV baixado ou clique para selecionar\n" +
        "4. Clique em 'Importar dados'"
      )
      if (confirmar) {
        window.open("https://docs.google.com/spreadsheets/create", "_blank")
      }
    }, 500)
  }

  useImperativeHandle(ref, () => ({
    gerarDadosAleatorios,
    adicionarLembreteGoogleAgenda,
    imprimirRelatorio,
    exportarCSV,
    exportarGoogleSheets,
  }))

  return (
    <div className="print-container">
      <div className="bg-card rounded-lg shadow-lg p-8 print-card border print:shadow-none print:border-0 print:bg-transparent print:p-0">
        {/* Cabeçalho */}
        <div className="border-b-2 border-primary pb-4 mb-6 print-header">
          <h1 className="text-2xl font-bold text-foreground text-center">
            RELATÓRIO MENSAL DAS RECEITAS BRUTAS
            {dados.periodo && (
              <span className="block text-xl mt-1 text-primary">
                {meses.find(m => m.valor === dados.periodo.split("-")[1])?.nome?.toUpperCase() || ""} DE {dados.periodo.split("-")[0]}
              </span>
            )}
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Microempreendedor Individual - MEI
          </p>
        </div>

        {/* Dados do Empreendedor */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">CNPJ:</label>
            <input
              type="text"
              value={dados.cnpj}
              onChange={(e) => handleCNPJChange(e.target.value)}
              placeholder="00.000.000/0001-00"
              maxLength={18}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Período de Apuração:
            </label>
            <div className="w-full px-3 py-2 border border-input bg-muted/50 rounded-md font-medium">
              {dados.periodo
                ? `${meses.find(m => m.valor === dados.periodo.split("-")[1])?.nome || ""} de ${dados.periodo.split("-")[0]}`
                : "Selecione um mês acima"}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Empreendedor Individual:
          </label>
          <input
            type="text"
            value={dados.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Nome completo do empreendedor"
            className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Comércio */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg print-section">
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
            RECEITA BRUTA MENSAL – REVENDA DE MERCADORIAS (COMÉRCIO)
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-foreground flex-1">
                I – Revenda de mercadorias com dispensa de emissão de documento fiscal
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={dados.comercioSemDoc}
                  onChange={(e) => handleChange("comercioSemDoc", e.target.value)}
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:hidden"
                />
                <span className="hidden print:inline w-32 px-3 py-2 border border-input bg-background rounded-md text-right print-input-value">
                  {formatarMoeda(dados.comercioSemDoc)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-foreground flex-1">
                II – Revenda de mercadorias com documento fiscal emitido
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={dados.comercioComDoc}
                  onChange={(e) => handleChange("comercioComDoc", e.target.value)}
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:hidden"
                />
                <span className="hidden print:inline w-32 px-3 py-2 border border-input bg-background rounded-md text-right print-input-value">
                  {formatarMoeda(dados.comercioComDoc)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t-2 border-blue-300 dark:border-blue-700 pt-2">
              <label className="text-sm font-bold text-foreground">
                III – Total das receitas com revenda de mercadorias (I + II)
              </label>
              <div className="flex items-center">
                <span className="mr-2 font-bold text-foreground">R$</span>
                <span className="w-32 px-3 py-2 bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-400 dark:border-blue-600 rounded-md font-bold text-right print-total-value">
                  {formatarMoeda(totalComercio)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indústria */}
        <div className="mb-6 bg-green-50 dark:bg-green-950/30 p-4 rounded-lg print-section">
          <h2 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4">
            RECEITA BRUTA MENSAL – VENDA DE PRODUTOS INDUSTRIALIZADOS (INDÚSTRIA)
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-foreground flex-1">
                IV – Venda de produtos industrializados com dispensa de emissão de documento fiscal
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={dados.industriaSemDoc}
                  onChange={(e) => handleChange("industriaSemDoc", e.target.value)}
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 print:hidden"
                />
                <span className="hidden print:inline w-32 px-3 py-2 border border-input bg-background rounded-md text-right print-input-value">
                  {formatarMoeda(dados.industriaSemDoc)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-foreground flex-1">
                V – Venda de produtos industrializados com documento fiscal emitido
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={dados.industriaComDoc}
                  onChange={(e) => handleChange("industriaComDoc", e.target.value)}
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 print:hidden"
                />
                <span className="hidden print:inline w-32 px-3 py-2 border border-input bg-background rounded-md text-right print-input-value">
                  {formatarMoeda(dados.industriaComDoc)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t-2 border-green-300 dark:border-green-700 pt-2">
              <label className="text-sm font-bold text-foreground">
                VI – Total das receitas com venda de produtos industrializados (IV + V)
              </label>
              <div className="flex items-center">
                <span className="mr-2 font-bold text-foreground">R$</span>
                <span className="w-32 px-3 py-2 bg-green-100 dark:bg-green-900/50 border-2 border-green-400 dark:border-green-600 rounded-md font-bold text-right print-total-value">
                  {formatarMoeda(totalIndustria)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div className="mb-6 bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg print-section">
          <h2 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4">
            RECEITA BRUTA MENSAL – PRESTAÇÃO DE SERVIÇOS
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-foreground flex-1">
                VII – Receita com prestação de serviços com dispensa de emissão de documento fiscal
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={dados.servicosSemDoc}
                  onChange={(e) => handleChange("servicosSemDoc", e.target.value)}
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 print:hidden"
                />
                <span className="hidden print:inline w-32 px-3 py-2 border border-input bg-background rounded-md text-right print-input-value">
                  {formatarMoeda(dados.servicosSemDoc)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-foreground flex-1">
                VIII – Receita com prestação de serviços com documento fiscal emitido
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={dados.servicosComDoc}
                  onChange={(e) => handleChange("servicosComDoc", e.target.value)}
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 print:hidden"
                />
                <span className="hidden print:inline w-32 px-3 py-2 border border-input bg-background rounded-md text-right print-input-value">
                  {formatarMoeda(dados.servicosComDoc)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t-2 border-purple-300 dark:border-purple-700 pt-2">
              <label className="text-sm font-bold text-foreground">
                IX – Total das receitas com prestação de serviços (VII + VIII)
              </label>
              <div className="flex items-center">
                <span className="mr-2 font-bold text-foreground">R$</span>
                <span className="w-32 px-3 py-2 bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-400 dark:border-purple-600 rounded-md font-bold text-right print-total-value">
                  {formatarMoeda(totalServicos)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Geral */}
        <div className="bg-stone-800 dark:bg-stone-900 text-white p-4 rounded-lg mb-6 print-total">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center">
              <IconCalculator className="mr-2 print:hidden" size={24} />
              <span className="text-lg font-bold">
                X – TOTAL GERAL DAS RECEITAS BRUTAS NO MÊS (III + VI + IX)
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl font-bold">R$</span>
              <span className="text-2xl font-bold bg-lime-400 text-stone-900 px-4 py-2 rounded-md print-grand-total">
                {formatarMoeda(totalGeral)}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t-2 border-border pt-4 mb-4 print-footer">
          <div className="grid md:grid-cols-[1fr_2fr_2fr] gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                LOCAL:
              </label>
              <input
                type="text"
                value={dados.local}
                onChange={(e) => handleChange("local", e.target.value)}
                placeholder="Cidade - UF"
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                DATA:
              </label>
              <div className="flex gap-1">
                <select
                  value={dados.dataAssinatura.split("-")[2] || ""}
                  onChange={(e) => {
                    const partes = dados.dataAssinatura.split("-")
                    const ano = partes[0] || String(anoAtual)
                    const mes = partes[1] || "01"
                    handleChange("dataAssinatura", `${ano}-${mes}-${e.target.value}`)
                  }}
                  className="w-16 px-2 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Dia</option>
                  {dias.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
                <select
                  value={dados.dataAssinatura.split("-")[1] || ""}
                  onChange={(e) => {
                    const partes = dados.dataAssinatura.split("-")
                    const ano = partes[0] || String(anoAtual)
                    const dia = partes[2] || "01"
                    handleChange("dataAssinatura", `${ano}-${e.target.value}-${dia}`)
                  }}
                  className="flex-1 px-2 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Mês</option>
                  {meses.map((mes) => (
                    <option key={mes.valor} value={mes.valor}>
                      {mes.nome.slice(0, 3)}
                    </option>
                  ))}
                </select>
                <select
                  value={dados.dataAssinatura.split("-")[0] || ""}
                  onChange={(e) => {
                    const partes = dados.dataAssinatura.split("-")
                    const mes = partes[1] || "01"
                    const dia = partes[2] || "01"
                    handleChange("dataAssinatura", `${e.target.value}-${mes}-${dia}`)
                  }}
                  className="w-20 px-2 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Ano</option>
                  {anos.map((ano) => (
                    <option key={ano} value={ano}>
                      {ano}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                ASSINATURA DO EMPRESÁRIO:
              </label>
              <div className="w-full h-10 border-b-2 border-muted-foreground print:h-6"></div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-600 p-4 text-sm print-anexos">
            <p className="font-semibold mb-1 text-foreground">
              ENCONTRAM-SE ANEXADOS A ESTE RELATÓRIO:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                Os documentos fiscais comprobatórios das entradas de mercadorias e serviços tomados
                referentes ao período
              </li>
              <li>
                As notas fiscais relativas às operações ou prestações realizadas eventualmente
                emitidas
              </li>
            </ul>
          </div>
        </div>

        {/* Botões de Ações */}
        <TooltipProvider>
          <div className="flex gap-2 justify-center flex-wrap print:hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={gerarDadosAleatorios} variant="outline" size="icon">
                  <IconRefresh size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gerar Exemplo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={adicionarLembreteGoogleAgenda} variant="outline" size="icon">
                  <IconCalendar size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lembrete Mensal</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={exportarCSV} variant="outline" size="icon">
                  <IconFileSpreadsheet size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Salvar CSV</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={exportarGoogleSheets} variant="outline" size="icon">
                  <IconBrandGoogleDrive size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Google Sheets</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={imprimirRelatorio} size="icon">
                  <IconDownload size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Imprimir / Salvar PDF</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
})
