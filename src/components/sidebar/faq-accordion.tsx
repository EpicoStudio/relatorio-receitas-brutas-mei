import { IconHelpCircle } from "@tabler/icons-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CollapsibleCard } from "@/components/ui/collapsible-card"

const faqItems = [
  {
    question: "O que é o Relatório Mensal de Receitas Brutas?",
    answer:
      "É um documento onde o MEI registra mensalmente o total de suas receitas brutas (faturamento), separando as vendas com e sem emissão de nota fiscal. Este relatório é obrigatório e deve ser arquivado por 5 anos.",
  },
  {
    question: "Sou obrigado a preencher este relatório?",
    answer:
      "Sim! Todo MEI deve preencher o Relatório Mensal de Receitas Brutas até o dia 20 do mês seguinte ao da apuração, conforme a Resolução CGSN nº 140/2018. Ele é essencial para a Declaração Anual (DASN-SIMEI).",
  },
  {
    question: "Qual a diferença entre Comércio, Indústria e Serviços?",
    answer:
      "Comércio: venda de produtos. Indústria: fabricação e venda de produtos industrializados. Serviços: prestação de serviços como consertos, consultorias, etc. Preencha apenas as seções correspondentes às suas atividades.",
  },
  {
    question: "Preciso guardar as notas fiscais anexadas?",
    answer:
      "Sim! Guarde todas as notas fiscais de compras e vendas, bem como os comprovantes das receitas, por no mínimo 5 anos. Eles podem ser solicitados em caso de fiscalização.",
  },
  {
    question: "Qual o limite de faturamento do MEI em 2026?",
    answer:
      "O limite anual de faturamento do MEI é de R$ 81.000,00, equivalente a uma média de R$ 6.750,00 por mês. Se ultrapassar esse valor, é necessário migrar para Microempresa (ME).",
  },
  {
    question: "O que acontece se eu não preencher o relatório?",
    answer:
      "A falta do relatório pode dificultar a elaboração da DASN-SIMEI e, em caso de fiscalização, gerar multas e complicações com a Receita Federal. Mantenha seus registros em dia!",
  },
  {
    question: "Posso usar este relatório para a DASN-SIMEI?",
    answer:
      "Sim! Os dados deste relatório são a base para preencher a Declaração Anual do Simples Nacional (DASN-SIMEI), onde você informa o faturamento total do ano.",
  },
  {
    question: "Como exportar para o Google Sheets?",
    answer:
      "Clique em 'Google Sheets' no cabeçalho. O sistema baixará um arquivo CSV e abrirá uma nova planilha. Na planilha, vá em Arquivo > Importar > Fazer upload, selecione o CSV baixado e clique em 'Importar dados'.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim! Todos os dados são processados localmente no seu navegador. Nenhuma informação é enviada para servidores externos. Os arquivos PDF e CSV são gerados diretamente no seu dispositivo.",
  },
]

export function FAQAccordion() {
  return (
    <CollapsibleCard
      title="Perguntas Frequentes"
      icon={<IconHelpCircle className="h-5 w-5 text-primary" />}
      defaultOpen={false}
    >
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-sm hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </CollapsibleCard>
  )
}
