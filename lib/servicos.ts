export type ServicoSlug =
  | "abertura-de-empresa"
  | "contabilidade-mei"
  | "contabilidade-simples-nacional"
  | "imposto-de-renda"
  | "bpo-financeiro";

export interface Servico {
  slug: ServicoSlug;
  nome: string;
  paraQuem: string;
  valorLead: number;
  resumo: string;
  descricao: string[];
  beneficios: string[];
}

export const servicos: Servico[] = [
  {
    slug: "abertura-de-empresa",
    nome: "Abertura de empresa",
    paraQuem: "Quem vai abrir CNPJ",
    valorLead: 300,
    resumo:
      "Tiramos o seu CNPJ do papel sem burocracia, do enquadramento certo ao alvará de funcionamento.",
    descricao: [
      "Abrir uma empresa envolve escolher o enquadramento certo, definir a atividade (CNAE), registrar o contrato social e conseguir as licenças necessárias. Fazemos tudo isso por você, do começo ao fim.",
      "Analisamos o seu caso para indicar o regime tributário mais vantajoso e já deixamos a empresa pronta para emitir nota fiscal e contratar, se for o caso.",
    ],
    beneficios: [
      "Definição do melhor enquadramento tributário",
      "Registro na Junta Comercial e nos órgãos municipais/estaduais",
      "Emissão do CNPJ e das licenças de funcionamento",
      "Orientação sobre nota fiscal e primeiros passos financeiros",
    ],
  },
  {
    slug: "contabilidade-mei",
    nome: "Contabilidade para MEI",
    paraQuem: "MEIs",
    valorLead: 100,
    resumo:
      "Declaração anual, guias (DAS) e orientação mensal para o MEI nunca perder prazo nem pagar multa.",
    descricao: [
      "Como MEI, você tem obrigações simples, mas que não podem ser esquecidas: pagar o DAS todo mês e entregar a Declaração Anual do Simples (DASN-SIMEI).",
      "Cuidamos desse controle para você, avisamos sobre prazos e ajudamos a entender quando é hora de crescer e migrar para outro enquadramento.",
    ],
    beneficios: [
      "Emissão e controle das guias mensais (DAS)",
      "Declaração anual (DASN-SIMEI) sem atraso",
      "Alertas de prazos e limites de faturamento",
      "Orientação sobre quando migrar de enquadramento",
    ],
  },
  {
    slug: "contabilidade-simples-nacional",
    nome: "Contabilidade para empresas do Simples",
    paraQuem: "ME e EPP",
    valorLead: 500,
    resumo:
      "Contabilidade completa para micro e pequenas empresas do Simples Nacional, com folha, impostos e relatórios em dia.",
    descricao: [
      "Micro e pequenas empresas do Simples Nacional precisam de uma contabilidade que acompanhe o crescimento do negócio: apuração de impostos, folha de pagamento, livros fiscais e relatórios financeiros.",
      "Fazemos a gestão contábil completa, com atendimento próximo para você focar em vender e deixar a parte fiscal com a gente.",
    ],
    beneficios: [
      "Apuração mensal do Simples Nacional (PGDAS)",
      "Folha de pagamento e obrigações trabalhistas",
      "Relatórios financeiros para tomada de decisão",
      "Suporte para emissão de notas fiscais e livros fiscais",
    ],
  },
  {
    slug: "imposto-de-renda",
    nome: "Declaração de Imposto de Renda PF",
    paraQuem: "Pessoa física",
    valorLead: 150,
    resumo:
      "Sua declaração de IR revisada por contador, sem erros, sem cair na malha fina e com a melhor restituição possível.",
    descricao: [
      "Fazemos a sua declaração de Imposto de Renda de pessoa física do jeito certo: organizamos seus documentos, escolhemos entre o modelo simples ou completo e revisamos tudo antes de enviar.",
      "O objetivo é simples: você não cair na malha fina e, quando possível, aumentar a sua restituição.",
    ],
    beneficios: [
      "Escolha do melhor modelo de declaração (simples ou completo)",
      "Revisão completa antes do envio à Receita Federal",
      "Orientação sobre bens, dependentes e deduções",
      "Acompanhamento da restituição",
    ],
  },
  {
    slug: "bpo-financeiro",
    nome: "BPO financeiro",
    paraQuem: "Pequenas empresas",
    valorLead: 800,
    resumo:
      "Terceirize a rotina financeira da sua empresa: contas a pagar e receber, fluxo de caixa e relatórios de gestão.",
    descricao: [
      "BPO financeiro é terceirizar toda a rotina financeira da empresa para um time especializado, com processos organizados e relatórios confiáveis.",
      "Cuidamos de contas a pagar e a receber, conciliação bancária, fluxo de caixa e relatórios de gestão, para você tomar decisões com dados reais.",
    ],
    beneficios: [
      "Contas a pagar e a receber organizadas",
      "Conciliação bancária e fluxo de caixa atualizado",
      "Relatórios de gestão mensais",
      "Mais tempo para focar no crescimento do negócio",
    ],
  },
];

export function getServicoBySlug(slug: string): Servico | undefined {
  return servicos.find((servico) => servico.slug === slug);
}

export function slugParaSnakeCase(slug: string): string {
  return slug.replace(/-/g, "_");
}
