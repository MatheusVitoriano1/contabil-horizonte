# Contexto do projeto: site de contabilidade para treinar GTM + GA4

> Arquivo de contexto para quem for construir o site (pessoa ou IA, por exemplo o Claude Code).
> Leia tudo antes de começar. As regras de tracking (seção 6) são obrigatórias.

---

## 1. Objetivo

Construir o site de um **escritório de contabilidade fictício**. O site serve de laboratório para praticar
**Google Tag Manager (GTM)** e **Google Analytics 4 (GA4)** e depois vira **case de portfólio** para uma vaga
de Analytics (requisitos: GTM, GA4, BigQuery, GCP).

É um site de **geração de leads** (não é e-commerce). As conversões são:

1. **Formulário de contato/orçamento** (conversão principal)
2. **Clique no WhatsApp**
3. **Download do guia em PDF** "Documentos necessários para o Imposto de Renda", liberado depois de um cadastro

---

## 2. Divisão de responsabilidades (importante)

| Quem | Faz o quê |
|---|---|
| **Quem constrói o site** | Site completo em Next.js, **snippet do GTM**, **todos os `dataLayer.push`** da seção 6, banner de cookies com Consent Mode v2, deploy na Vercel. |
| **Dono do projeto (eu)** | Configurar **tudo dentro do GTM e do GA4** manualmente: Google tag, tags de evento, acionadores, variáveis, consentimento, eventos-chave, dimensões personalizadas, validação no Preview/DebugView. |

**Regras para quem constrói:**
- **NÃO** instalar `gtag.js` direto nem qualquer tag do GA4 no código. O GA4 vai ser carregado **só pelo GTM**.
- **NÃO** usar `@next/third-parties` nem bibliotecas de analytics. Instalar o snippet do GTM à mão com `next/script`, para o código ficar visível e servir de estudo.
- **NÃO** criar nada dentro do GTM ou do GA4. Isso é o exercício do dono do projeto.
- Entregar um **guia de eventos** (`TRACKING.md`) na raiz do repositório, listando cada `dataLayer.push`, quando ele dispara e com quais parâmetros (veja a seção 10).

---

## 3. Negócio fictício

- **Nome:** Contábil Horizonte *(fictício; todos os dados são inventados)*
- **Slogan:** "Contabilidade descomplicada para quem empreende"
- **Cidade:** São Paulo – SP (atendimento 100% online para todo o Brasil)
- **Público:** MEIs, pequenas empresas (Simples Nacional), profissionais liberais e pessoas físicas na época do Imposto de Renda
- **Tom de voz:** próximo, claro e sem "contabilês"; frases curtas
- **Telefone/WhatsApp:** vem de uma variável de ambiente (`NEXT_PUBLIC_WHATSAPP_NUMBER`). Não colocar número real no código.
- **E-mail:** contato@contabilhorizonte.exemplo (fictício)

### Serviços (cada um com página própria)

| slug | Serviço | Para quem | Valor fictício do lead (BRL) |
|---|---|---|---|
| `abertura-de-empresa` | Abertura de empresa | Quem vai abrir CNPJ | 300 |
| `contabilidade-mei` | Contabilidade para MEI | MEIs | 100 |
| `contabilidade-simples-nacional` | Contabilidade para empresas do Simples | ME/EPP | 500 |
| `imposto-de-renda` | Declaração de Imposto de Renda PF | Pessoa física | 150 |
| `bpo-financeiro` | BPO financeiro | Pequenas empresas | 800 |

O **valor do lead** é usado no parâmetro `value` do evento `generate_lead`, para treinar valor de conversão.

---

## 4. Stack técnica

- **Next.js** (versão estável mais recente, **App Router**) + **TypeScript**
- **Tailwind CSS** para estilo
- **Hospedagem:** Vercel (deploy automático a partir do GitHub)
- **Formulários:** validação no cliente + **API Route** (`/api/contato` e `/api/guia-ir`) que valida o corpo e responde `{ ok: true }`. **Não precisa enviar e-mail nem salvar em banco**: só logar no servidor (sem dados pessoais no log).
- **Variáveis de ambiente** (criar `.env.example`):
  ```
  NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
  NEXT_PUBLIC_WHATSAPP_NUMBER=5511900000000
  NEXT_PUBLIC_SITE_URL=https://contabil-horizonte.vercel.app
  ```
  O ID do GA4 (`G-XXXXXXXXXX`) **não entra no código**: ele só é configurado dentro do GTM.
- **Responsivo** (mobile-first), acessível (labels nos campos, contraste, foco visível), em **pt-BR**.

---

## 5. Páginas e componentes

### Rotas

| Rota | Conteúdo | `page_type` |
|---|---|---|
| `/` | Home: hero com CTA, serviços, diferenciais, depoimentos fictícios, faixa do guia de IR, CTA final | `home` |
| `/servicos` | Lista de serviços | `servicos` |
| `/servicos/[slug]` | Página de cada serviço (a partir dos dados da seção 3), com CTA para o formulário e para o WhatsApp | `servico` |
| `/imposto-de-renda` | Landing page do IR 2027 com o formulário do guia em PDF | `landing_ir` |
| `/contato` | Formulário de contato/orçamento | `contato` |
| `/obrigado` | Página de agradecimento depois do formulário de contato | `obrigado` |
| `/politica-de-privacidade` | Política de privacidade e cookies (texto simples) | `institucional` |

### Componentes
- `Header` (com CTA "Fale com um contador")
- `Footer`
- `WhatsAppFloat`: botão flutuante em todas as páginas
- `CtaButton`: botão reutilizável que dispara `cta_click`
- `ContactForm`
- `GuiaIrForm`: formulário de cadastro que libera o PDF
- `CookieBanner` + `CookiePreferences` (modal "Personalizar")
- `GtmScript` e `RouteChangeTracker` (seção 6)

### Formulário de contato (`form_id: contato_orcamento`)
Campos: nome*, e-mail*, telefone/WhatsApp*, **serviço de interesse*** (select com os 5 serviços),
**porte da empresa** (select: `nao_tenho_empresa`, `mei`, `me`, `epp`, `outro`), mensagem, aceite da política*.
Depois de enviar com sucesso, redireciona para `/obrigado?servico=<slug>`.

### Formulário do guia de IR (`form_id: guia_ir`)
Campos: nome*, e-mail*, "Você declara IR todo ano?" (sim/não), aceite da política*.
Depois do sucesso, mostra o botão **"Baixar o guia (PDF)"**, que abre `/guia-documentos-imposto-de-renda-2027.pdf`.

### O PDF
Gerar um PDF simples (1 a 2 páginas, com a marca fictícia) em `public/guia-documentos-imposto-de-renda-2027.pdf`, com um checklist:
documentos pessoais e de dependentes, informes de rendimentos (empregador, bancos, corretoras, INSS),
despesas médicas e de educação, previdência privada, bens e direitos (imóveis, veículos), dívidas e ônus,
aluguéis recebidos e pagos, recibo da declaração do ano anterior. Colocar um aviso de que o conteúdo é ilustrativo.

### Elementos clicáveis
Todo CTA e todo link de WhatsApp deve ter **`id`** ou **`data-cta`** descritivo (ex.: `data-cta="hero_fale_contador"`),
para que eu também possa treinar acionadores de **clique nativos do GTM** (Click ID, Click Classes, Click Text),
além dos eventos do dataLayer.

---

## 6. Especificação de tracking (dataLayer)

### Regras gerais
1. Sempre usar `window.dataLayer = window.dataLayer || []; window.dataLayer.push({...})`, centralizado em um helper `lib/tracking.ts` (`pushEvent(event, params)`).
2. **Nunca enviar dado pessoal (PII)** para o dataLayer: nada de nome, e-mail, telefone ou texto da mensagem. Isso viola a política do Google Analytics.
3. Nomes de eventos e parâmetros em `snake_case`, minúsculos, em inglês quando houver evento recomendado do GA4.
4. Valores de parâmetros em `snake_case` também (ex.: `contabilidade_mei`), nunca texto livre com acento.
5. Antes de cada evento de interação, **não** é preciso limpar o dataLayer, mas cada push deve levar todos os parâmetros do evento.

### Ordem de carregamento (no `<head>` do `app/layout.tsx`)
1. **Consentimento padrão** (antes do GTM, `strategy="beforeInteractive"` ou script inline):
   ```js
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('consent', 'default', {
     ad_storage: 'denied',
     ad_user_data: 'denied',
     ad_personalization: 'denied',
     analytics_storage: 'denied',
     functionality_storage: 'granted',
     security_storage: 'granted',
     wait_for_update: 500
   });
   ```
   Se o usuário já tiver escolhido antes (salvo em `localStorage`, chave `cookie_consent`), enviar logo em seguida um `gtag('consent', 'update', {...})` com a escolha salva.
2. **Snippet do GTM** (`<script>` no head + `<noscript>` com iframe logo após abrir o `<body>`), usando `NEXT_PUBLIC_GTM_ID`.

### Navegação em SPA (ponto de aprendizado)
O Next.js troca de página **sem recarregar**, então o GTM só vê o primeiro carregamento.
Por isso, o `RouteChangeTracker` (client component que usa `usePathname` + `useSearchParams`) deve disparar
em **todo carregamento e toda troca de rota**:

```js
{
  event: 'virtual_page_view',
  page_path: '/servicos/contabilidade-mei',
  page_location: 'https://.../servicos/contabilidade-mei',
  page_title: 'Contabilidade para MEI | Contábil Horizonte',
  page_type: 'servico',
  servico: 'contabilidade-mei'   // só nas páginas de serviço e na /obrigado
}
```
Ele também deve disparar no primeiro carregamento, para eu poder desligar o page_view automático e usar só este.

### Eventos

| Evento (dataLayer) | Quando dispara | Parâmetros |
|---|---|---|
| `virtual_page_view` | Todo carregamento e toda troca de rota | `page_path`, `page_location`, `page_title`, `page_type`, `servico` (opcional) |
| `cta_click` | Clique em qualquer `CtaButton` (exceto WhatsApp) | `cta_id`, `cta_text`, `cta_location` (`header`, `hero`, `servico`, `faixa_ir`, `cta_final`, `footer`), `cta_destination` |
| `whatsapp_click` | Clique em qualquer link de WhatsApp | `cta_location` (`flutuante`, `header`, `servico`, `contato`, `obrigado`), `servico` (se houver), `page_type` |
| `form_start` | Primeira interação (foco/digitação) em um formulário, **uma vez por formulário por página** | `form_id`, `form_name` |
| `form_submit_error` | Envio com erro de validação ou erro da API | `form_id`, `error_type` (`validacao`, `api`), `error_fields` (ex.: `email,telefone`) |
| `generate_lead` | **Sucesso** no envio do formulário de contato (resposta `ok` da API, antes do redirect) | `form_id: 'contato_orcamento'`, `form_name`, `lead_type: 'orcamento'`, `servico_interesse`, `porte_empresa`, `value` (tabela da seção 3), `currency: 'BRL'` |
| `generate_lead` | **Sucesso** no formulário do guia de IR | `form_id: 'guia_ir'`, `form_name`, `lead_type: 'material_rico'`, `declara_ir_todo_ano` (`sim`/`nao`), `value: 20`, `currency: 'BRL'` |
| `guia_ir_download` | Clique em "Baixar o guia (PDF)" | `file_name: 'guia-documentos-imposto-de-renda-2027'`, `file_extension: 'pdf'`, `link_url` |
| `consent_update` | Quando o usuário escolhe no banner ou no modal | `consent_analytics` (`granted`/`denied`), `consent_marketing` (`granted`/`denied`), `consent_method` (`aceitar_todos`, `rejeitar_todos`, `personalizado`) |
| `scroll_depth` *(opcional)* | 25/50/75/90% de scroll na `/imposto-de-renda` | `percent_scrolled` |

> Observação para mim: o nome do evento no dataLayer **não precisa** ser o nome do evento no GA4.
> Ex.: posso mapear `guia_ir_download` para o evento `file_download` do GA4 dentro do GTM.

### Banner de cookies (Consent Mode v2)
- Aparece na primeira visita, fixo no rodapé, com: **Aceitar todos**, **Rejeitar**, **Personalizar**.
- O "Personalizar" abre um modal com 2 categorias: **Análise** (`analytics_storage`) e **Marketing** (`ad_storage`, `ad_user_data`, `ad_personalization`).
- Ao escolher: salvar em `localStorage` (`cookie_consent`), chamar `gtag('consent','update',{...})` **e** fazer o push de `consent_update`.
- Link "Preferências de cookies" no footer para reabrir o modal.
- Envolver todo acesso a `localStorage` em try/catch.

---

## 7. O que EU vou configurar no GTM/GA4 (checklist de estudo)

*(Seção para mim; quem constrói o site não precisa fazer nada daqui.)*

- [ ] **Google tag** com o ID `G-XXXXXXXXXX`, disparando em "Initialization – All Pages"
- [ ] Decidir: desligar a opção "Mudanças de página com base em eventos do histórico do navegador" na medição otimizada e usar `virtual_page_view` (evita page_view duplicado)
- [ ] **Variáveis da camada de dados** para cada parâmetro da tabela da seção 6
- [ ] **Acionadores de evento personalizado** para cada evento
- [ ] **Tags de evento do GA4**: `page_view`, `generate_lead`, `whatsapp_click`, `cta_click`, `form_start`, `form_submit_error`, `file_download`
- [ ] Testar um acionador de **clique nativo** (Click ID / `data-cta`) e comparar com o evento do dataLayer
- [ ] **Configurações de consentimento** nas tags + verificar no Preview a aba "Consent"
- [ ] **Eventos-chave** no GA4: `generate_lead` (e talvez `whatsapp_click`)
- [ ] **Dimensões personalizadas**: `form_id`, `lead_type`, `servico_interesse`, `porte_empresa`, `cta_location`, `page_type`
- [ ] **Filtro de tráfego interno** e lista de exclusão de referências
- [ ] Validar tudo no **Preview + DebugView**, publicar versão com descrição
- [ ] Criar **exploração de funil**: `virtual_page_view` (serviço) → `form_start` → `generate_lead`
- [ ] Testar UTMs (`?utm_source=linkedin&utm_medium=social&utm_campaign=ir2027`)
- [ ] Fase 2: vincular **GA4 → BigQuery** e consultar os eventos com SQL

---

## 8. Fora de escopo
- Envio real de e-mail, CRM ou banco de dados
- Login, área do cliente, blog completo, CMS
- Qualquer tag de mídia (Meta Pixel, Google Ads): pode entrar numa fase 2
- GTM server-side (fase 2 ou 3)

---

## 9. Critérios de pronto (para quem constrói)
1. `npm run build` passa sem erros; deploy funcionando na Vercel.
2. Com o **GTM Preview** aberto, cada evento da seção 6 aparece no momento certo e com todos os parâmetros.
3. Navegar entre 3 páginas sem recarregar gera 3 `virtual_page_view`.
4. Nenhum push contém nome, e-mail, telefone ou mensagem.
5. O consentimento `default` aparece **antes** do carregamento do GTM; o `update` aparece depois da escolha no banner e é reaplicado em visitas seguintes.
6. Os formulários mostram erro por campo, disparam `form_submit_error` e só disparam `generate_lead` depois do sucesso da API.
7. O PDF abre depois do cadastro e dispara `guia_ir_download`.
8. Lighthouse mobile com Acessibilidade ≥ 90.
9. `README.md` (como rodar, variáveis de ambiente, deploy) e `TRACKING.md` (seção 10) entregues.

---

## 10. Entregáveis
- Repositório no GitHub (público, para virar portfólio)
- `README.md`: descrição do projeto, arquitetura `site → dataLayer → GTM → GA4 → (BigQuery → Looker Studio)`, como rodar localmente e fazer o deploy
- `TRACKING.md`: tabela com cada evento, gatilho no código (arquivo/componente), parâmetros, valores possíveis e um exemplo de push
- `.env.example`
- URL da Vercel funcionando

---

## 11. Estrutura sugerida

```
app/
  layout.tsx              # consent default + GTM + RouteChangeTracker + CookieBanner + WhatsAppFloat
  page.tsx                # home
  servicos/page.tsx
  servicos/[slug]/page.tsx
  imposto-de-renda/page.tsx
  contato/page.tsx
  obrigado/page.tsx
  politica-de-privacidade/page.tsx
  api/contato/route.ts
  api/guia-ir/route.ts
components/
  Header.tsx  Footer.tsx  CtaButton.tsx  WhatsAppFloat.tsx
  ContactForm.tsx  GuiaIrForm.tsx
  CookieBanner.tsx  CookiePreferences.tsx
  GtmScript.tsx  RouteChangeTracker.tsx
lib/
  tracking.ts             # pushEvent(), tipos dos eventos
  consent.ts              # ler/salvar escolha, gtag consent update
  servicos.ts             # dados da seção 3
public/
  guia-documentos-imposto-de-renda-2027.pdf
TRACKING.md
README.md
.env.example
```
