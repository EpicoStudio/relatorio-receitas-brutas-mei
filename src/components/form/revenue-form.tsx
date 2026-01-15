import { useState } from "react"
import { IconCalculator, IconDownload, IconRefresh, IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

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
}

export function RevenueForm() {
  const [dados, setDados] = useState<DadosMEI>({
    cnpj: "",
    nome: "",
    periodo: "",
    comercioSemDoc: "0.00",
    comercioComDoc: "0.00",
    industriaSemDoc: "0.00",
    industriaComDoc: "0.00",
    servicosSemDoc: "0.00",
    servicosComDoc: "0.00",
  })

  const formatarMoeda = (valor: string | number): string => {
    return parseFloat(String(valor) || "0")
      .toFixed(2)
      .replace(".", ",")
  }

  const calcularTotal = (val1: string | number, val2: string | number): string => {
    return (parseFloat(String(val1) || "0") + parseFloat(String(val2) || "0")).toFixed(2)
  }

  const handleChange = (campo: keyof DadosMEI, valor: string): void => {
    setDados((prev) => ({ ...prev, [campo]: valor }))
  }

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
    const idx = Math.floor(Math.random() * nomes.length)

    setDados({
      cnpj: cnpjs[idx],
      nome: nomes[idx],
      periodo: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}/2026`,
      comercioSemDoc: (Math.random() * 3000 + 500).toFixed(2),
      comercioComDoc: (Math.random() * 8000 + 1000).toFixed(2),
      industriaSemDoc: (Math.random() * 2000).toFixed(2),
      industriaComDoc: (Math.random() * 5000).toFixed(2),
      servicosSemDoc: (Math.random() * 2500 + 300).toFixed(2),
      servicosComDoc: (Math.random() * 6000 + 800).toFixed(2),
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

  return (
    <div className="print-container">
      <div className="bg-card rounded-lg shadow-lg p-8 print-card border">
        {/* Cabeçalho */}
        <div className="border-b-2 border-primary pb-4 mb-6 print-header">
          <h1 className="text-2xl font-bold text-foreground text-center">
            RELATÓRIO MENSAL DAS RECEITAS BRUTAS
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
              onChange={(e) => handleChange("cnpj", e.target.value)}
              placeholder="00.000.000/0001-00"
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Período de Apuração:
            </label>
            <input
              type="text"
              value={dados.periodo}
              onChange={(e) => handleChange("periodo", e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="MM/AAAA"
            />
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
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print-input-value"
                />
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
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print-input-value"
                />
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
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 print-input-value"
                />
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
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 print-input-value"
                />
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
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 print-input-value"
                />
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
                  className="w-32 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 print-input-value"
                />
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
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                LOCAL E DATA:
              </label>
              <input
                type="text"
                defaultValue=""
                placeholder="Cidade, dia de mês de ano"
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              />
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

        {/* Botões */}
        <div className="flex gap-3 justify-center flex-wrap print:hidden">
          <Button onClick={gerarDadosAleatorios} variant="outline" className="gap-2">
            <IconRefresh size={20} />
            Gerar Exemplo
          </Button>
          <Button
            onClick={adicionarLembreteGoogleAgenda}
            variant="outline"
            className="gap-2"
          >
            <IconCalendar size={20} />
            Lembrete Mensal
          </Button>
          <Button onClick={imprimirRelatorio} className="gap-2">
            <IconDownload size={20} />
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
