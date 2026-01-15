import { IconInfoCircle } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AboutBox() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <IconInfoCircle className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Sobre a Ferramenta</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          Esta ferramenta gratuita ajuda Microempreendedores Individuais (MEI) a 
          preencher e gerar o <strong>Relatório Mensal de Receitas Brutas</strong>, 
          documento obrigatório para controle financeiro e declaração anual (DASN-SIMEI).
        </CardDescription>
        <CardDescription className="text-sm leading-relaxed mt-3">
          Preencha os valores de suas receitas mensais, imprima ou salve em PDF, 
          e mantenha seus registros organizados para a contabilidade.
        </CardDescription>
      </CardContent>
    </Card>
  )
}
