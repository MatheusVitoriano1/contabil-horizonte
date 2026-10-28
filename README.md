# Contábil Horizonte

Site institucional e de geração de leads de um **escritório de contabilidade fictício**
("Contábil Horizonte"), construído como laboratório de **Google Tag Manager (GTM)** e
**Google Analytics 4 (GA4)** e como case de portfólio para vagas de Analytics (GTM, GA4,
BigQuery, GCP).

> Projeto fictício, criado para fins de estudo. Nenhum dado é real.

## Arquitetura

```
Site (Next.js, App Router)
   │  dataLayer.push(...)   ← lib/tracking.ts (helper único, sem PII)
   ▼
dataLayer
   ▼
Google Tag Manager (GTM)     ← tags, acionadores, variáveis, Consent Mode (configurado no GTM)
   ▼
Google Analytics 4 (GA4)     ← eventos, eventos-chave, dimensões personalizadas
   ▼
BigQuery (fase 2)  →  Looker Studio / SQL
```

- O site **nunca** carrega `gtag.js` ou qualquer tag do GA4 diretamente: o GTM é o único ponto de
  entrada de analytics, instalado manualmente com `next/script` (sem `@next/third-parties`).
- Todo o rastreamento de interação é feito via `dataLayer.push`, documentado em
  [`TRACKING.md`](TRACKING.md).
- Tudo que fica **dentro** do GTM/GA4 (tags, acionadores, variáveis, consentimento, eventos-chave,
  dimensões, filtros) é configurado manualmente pelo dono do projeto — não faz parte do código.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4
- API Routes para os formulários (`/api/contato`, `/api/guia-ir`) — apenas validam e logam no
  servidor, sem enviar e-mail ou salvar em banco
- Hospedagem: [Vercel](https://vercel.com/)

## Como rodar localmente

Pré-requisitos: Node.js 20+ e npm.

```bash
npm install
cp .env.example .env.local   # edite os valores conforme necessário
npm run dev
```

O site sobe em [http://localhost:3000](http://localhost:3000).

Scripts disponíveis:

```bash
npm run dev     # ambiente de desenvolvimento
npm run build   # build de produção
npm run start   # roda o build de produção
npm run lint     # ESLint
```

## Variáveis de ambiente

Veja [`.env.example`](.env.example):

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | ID do container do GTM (ex.: `GTM-XXXXXXX`). O ID do GA4 (`G-...`) **não** entra no código — é configurado só dentro do GTM. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp (formato internacional, só dígitos) usado nos links `wa.me`. |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, usada em metadados (`metadataBase`). |

## Deploy (Vercel)

1. Suba o repositório no GitHub.
2. No painel da Vercel, importe o repositório.
3. Configure as três variáveis de ambiente acima (Production e Preview).
4. Deploy automático a cada push na branch principal.

## Estrutura do projeto

```
app/            # rotas (App Router) + API Routes
components/     # componentes de UI e de tracking
lib/            # dados de serviços, helpers de tracking e de consentimento
public/         # PDF do guia de IR e demais arquivos estáticos
TRACKING.md     # guia de todos os eventos do dataLayer
```

## O que falta ser configurado (fora do código)

Todo o trabalho de configuração do **GTM** e do **GA4** (Google tag, tags de evento, acionadores,
variáveis, Consent Mode, eventos-chave, dimensões personalizadas, filtro de tráfego interno,
exploração de funil, validação no Preview/DebugView e, na fase 2, integração com BigQuery) é feito
manualmente pelo dono do projeto, fora deste repositório.
