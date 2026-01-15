import { IconExternalLink } from "@tabler/icons-react"
import { CollapsibleCard } from "@/components/ui/collapsible-card"

const officialLinks = [
  {
    title: "Portal do Empreendedor",
    description: "Site oficial para cadastro, alteração e baixa do MEI",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
  },
  {
    title: "PGMEI - Pagamento do DAS",
    description: "Gerar e pagar o boleto mensal do Simples Nacional",
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao",
  },
  {
    title: "DASN-SIMEI",
    description: "Fazer a Declaração Anual do MEI",
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/dasnsimei.app/Identificacao",
  },
  {
    title: "Consultar CNPJ MEI",
    description: "Verificar situação cadastral e dados do CNPJ",
    url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/consulta-cnpj",
  },
  {
    title: "Sebrae - Apoio ao MEI",
    description: "Cursos gratuitos, orientação e suporte para MEIs",
    url: "https://sebrae.com.br/sites/PortalSebrae/mei",
  },
  {
    title: "Receita Federal - Simples Nacional",
    description: "Informações oficiais sobre o regime tributário",
    url: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
  },
]

export function OfficialLinks() {
  return (
    <CollapsibleCard
      title="Links Úteis"
      icon={<IconExternalLink className="h-5 w-5 text-primary" />}
      defaultOpen={false}
    >
      <ul className="space-y-3">
        {officialLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {link.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </CollapsibleCard>
  )
}
