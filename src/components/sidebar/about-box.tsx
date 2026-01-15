import { IconInfoCircle } from "@tabler/icons-react"
import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { CardDescription } from "@/components/ui/card"

export function AboutBox() {
  return (
    <CollapsibleCard
      title="Sobre a Ferramenta"
      icon={<IconInfoCircle className="h-5 w-5 text-primary" />}
      defaultOpen={true}
    >
      <CardDescription className="text-sm leading-relaxed">
        Esta ferramenta gratuita ajuda Microempreendedores Individuais (MEI) a 
        preencher e gerar o <strong>Relatório Mensal de Receitas Brutas</strong>, 
        documento obrigatório para controle financeiro e declaração anual (DASN-SIMEI).
      </CardDescription>
      <CardDescription className="text-sm leading-relaxed mt-3">
        Preencha os valores de suas receitas mensais, imprima ou salve em PDF, 
        e mantenha seus registros organizados para a contabilidade.
      </CardDescription>
      <CardDescription className="text-sm leading-relaxed mt-3 text-primary/80">
        <strong>💾 Seus dados ficam salvos!</strong> Volte todo mês para preencher novos 
        relatórios — as informações anteriores permanecem salvas no seu navegador.
      </CardDescription>
    </CollapsibleCard>
  )
}
