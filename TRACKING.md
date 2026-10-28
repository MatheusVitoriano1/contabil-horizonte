# TRACKING.md — Guia de eventos (dataLayer)

Este documento lista todo `dataLayer.push` deste site: onde ele é disparado no código, quando
dispara e com quais parâmetros. Tudo é centralizado em [`lib/tracking.ts`](lib/tracking.ts)
através da função `pushEvent(event, params)`.

> Nenhum push contém dado pessoal (nome, e-mail, telefone ou texto de mensagem).
> Nomes de eventos/parâmetros em `snake_case`; valores também em `snake_case` (sem hífen, sem acento).

---

## 1. `virtual_page_view`

- **Gatilho no código:** [`components/RouteChangeTracker.tsx`](components/RouteChangeTracker.tsx),
  renderizado em [`app/layout.tsx`](app/layout.tsx). Dispara em um `useEffect` que depende de
  `pathname` e `searchParams`.
- **Quando dispara:** no primeiro carregamento de qualquer página e em toda troca de rota da SPA
  (o GTM só vê a primeira carga; use este evento para "page_view" em vez do automático).
- **Parâmetros:**
  | Parâmetro | Tipo | Exemplo |
  |---|---|---|
  | `page_path` | string | `/servicos/contabilidade-mei` |
  | `page_location` | string (URL completa) | `https://contabil-horizonte.vercel.app/servicos/contabilidade-mei` |
  | `page_title` | string | `Contabilidade para MEI \| Contábil Horizonte` |
  | `page_type` | enum | `home`, `servicos`, `servico`, `landing_ir`, `contato`, `obrigado`, `institucional` |
  | `servico` | string (opcional) | `contabilidade_mei` (apenas em `/servicos/[slug]` e, se vier na URL, em `/obrigado`) |

- **Exemplo de push:**
  ```js
  {
    event: 'virtual_page_view',
    page_path: '/servicos/contabilidade-mei',
    page_location: 'https://contabil-horizonte.vercel.app/servicos/contabilidade-mei',
    page_title: 'Contabilidade para MEI | Contábil Horizonte',
    page_type: 'servico',
    servico: 'contabilidade_mei'
  }
  ```

---

## 2. `cta_click`

- **Gatilho no código:** [`components/CtaButton.tsx`](components/CtaButton.tsx), no `onClick`.
  Usado em `Header`, `Footer`, home (`app/page.tsx`), `/servicos`, `/servicos/[slug]`.
- **Quando dispara:** clique em qualquer `CtaButton` (nunca em links de WhatsApp — esses disparam
  `whatsapp_click`).
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `cta_id` | string | id único do botão, ex.: `hero_fale_contador`, `faixa_ir_baixar_guia` |
  | `cta_text` | string | texto visível do botão |
  | `cta_location` | enum | `header`, `hero`, `servico`, `faixa_ir`, `cta_final`, `footer` |
  | `cta_destination` | string | URL de destino, ex.: `/contato` |

- **Exemplo de push:**
  ```js
  {
    event: 'cta_click',
    cta_id: 'hero_fale_contador',
    cta_text: 'Fale com um contador',
    cta_location: 'hero',
    cta_destination: '/contato'
  }
  ```

---

## 3. `whatsapp_click`

- **Gatilho no código:** [`components/WhatsAppLink.tsx`](components/WhatsAppLink.tsx), no
  `onClick`. Usado em `WhatsAppFloat` (flutuante), `Header`, páginas de serviço, `/contato` e
  `/obrigado`.
- **Quando dispara:** clique em qualquer link de WhatsApp do site.
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `cta_location` | enum | `flutuante`, `header`, `servico`, `contato`, `obrigado` |
  | `page_type` | enum | mesmo enum do `virtual_page_view` |
  | `servico` | string (opcional) | presente quando o clique ocorre em contexto de um serviço |

- **Exemplo de push:**
  ```js
  {
    event: 'whatsapp_click',
    cta_location: 'servico',
    page_type: 'servico',
    servico: 'bpo_financeiro'
  }
  ```

---

## 4. `form_start`

- **Gatilho no código:** `onFocus` do `<form>`, com uma flag (`useRef`) para disparar só uma vez
  por carregamento de página. Em [`components/ContactForm.tsx`](components/ContactForm.tsx) e
  [`components/GuiaIrForm.tsx`](components/GuiaIrForm.tsx).
- **Quando dispara:** na primeira interação (foco/digitação) em um dos dois formulários.
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `form_id` | enum | `contato_orcamento`, `guia_ir` |
  | `form_name` | string | nome legível do formulário |

- **Exemplo de push:**
  ```js
  {
    event: 'form_start',
    form_id: 'contato_orcamento',
    form_name: 'Formulário de contato e orçamento'
  }
  ```

---

## 5. `form_submit_error`

- **Gatilho no código:** `handleSubmit` em `ContactForm.tsx` e `GuiaIrForm.tsx`, tanto na validação
  client-side quanto no `catch` da chamada à API.
- **Quando dispara:** envio com erro de validação (campo obrigatório/inválido) ou erro de resposta
  da API (`/api/contato` ou `/api/guia-ir`).
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `form_id` | enum | `contato_orcamento`, `guia_ir` |
  | `error_type` | enum | `validacao`, `api` |
  | `error_fields` | string | nomes dos campos com erro, separados por vírgula (ex.: `email,aceite`); vazio quando `error_type` é `api` |

- **Exemplo de push:**
  ```js
  {
    event: 'form_submit_error',
    form_id: 'contato_orcamento',
    error_type: 'validacao',
    error_fields: 'email,telefone'
  }
  ```

---

## 6. `generate_lead` (orçamento)

- **Gatilho no código:** `handleSubmit` de `ContactForm.tsx`, após resposta `{ ok: true }` de
  `POST /api/contato` e antes do `router.push('/obrigado?servico=...')`.
- **Quando dispara:** sucesso no envio do formulário de contato/orçamento.
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `form_id` | string fixo | `contato_orcamento` |
  | `form_name` | string fixo | `Formulário de contato e orçamento` |
  | `lead_type` | string fixo | `orcamento` |
  | `servico_interesse` | enum | `abertura_de_empresa`, `contabilidade_mei`, `contabilidade_simples_nacional`, `imposto_de_renda`, `bpo_financeiro` |
  | `porte_empresa` | enum | `nao_tenho_empresa`, `mei`, `me`, `epp`, `outro` |
  | `value` | number | valor fictício do lead (ver tabela abaixo) |
  | `currency` | string fixo | `BRL` |

  | Serviço (`servico_interesse`) | `value` |
  |---|---|
  | `abertura_de_empresa` | 300 |
  | `contabilidade_mei` | 100 |
  | `contabilidade_simples_nacional` | 500 |
  | `imposto_de_renda` | 150 |
  | `bpo_financeiro` | 800 |

- **Exemplo de push:**
  ```js
  {
    event: 'generate_lead',
    form_id: 'contato_orcamento',
    form_name: 'Formulário de contato e orçamento',
    lead_type: 'orcamento',
    servico_interesse: 'contabilidade_mei',
    porte_empresa: 'mei',
    value: 100,
    currency: 'BRL'
  }
  ```

---

## 7. `generate_lead` (guia de IR)

- **Gatilho no código:** `handleSubmit` de `GuiaIrForm.tsx`, após resposta `{ ok: true }` de
  `POST /api/guia-ir`. Libera o botão de download (não há redirect).
- **Quando dispara:** sucesso no cadastro do formulário do guia de Imposto de Renda.
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `form_id` | string fixo | `guia_ir` |
  | `form_name` | string fixo | `Formulário do guia de Imposto de Renda` |
  | `lead_type` | string fixo | `material_rico` |
  | `declara_ir_todo_ano` | enum | `sim`, `nao` |
  | `value` | number fixo | `20` |
  | `currency` | string fixo | `BRL` |

- **Exemplo de push:**
  ```js
  {
    event: 'generate_lead',
    form_id: 'guia_ir',
    form_name: 'Formulário do guia de Imposto de Renda',
    lead_type: 'material_rico',
    declara_ir_todo_ano: 'sim',
    value: 20,
    currency: 'BRL'
  }
  ```

---

## 8. `guia_ir_download`

- **Gatilho no código:** `onClick` do botão "Baixar o guia (PDF)" em
  [`components/GuiaIrForm.tsx`](components/GuiaIrForm.tsx), exibido só depois do `generate_lead`.
- **Quando dispara:** clique no link que abre o PDF
  (`/guia-documentos-imposto-de-renda-2027.pdf`).
- **Parâmetros:**
  | Parâmetro | Tipo | Valor |
  |---|---|---|
  | `file_name` | string fixo | `guia-documentos-imposto-de-renda-2027` |
  | `file_extension` | string fixo | `pdf` |
  | `link_url` | string | `/guia-documentos-imposto-de-renda-2027.pdf` |

- **Exemplo de push:**
  ```js
  {
    event: 'guia_ir_download',
    file_name: 'guia-documentos-imposto-de-renda-2027',
    file_extension: 'pdf',
    link_url: '/guia-documentos-imposto-de-renda-2027.pdf'
  }
  ```

> Observação: o nome do evento no dataLayer não precisa ser igual ao nome do evento no GA4 — por
> exemplo, `guia_ir_download` pode ser mapeado, dentro do GTM, para o evento recomendado
> `file_download`.

---

## 9. `consent_update`

- **Gatilho no código:** [`lib/consent.ts`](lib/consent.ts) (`applyAndTrackConsent`), chamado pelo
  contexto [`components/CookieConsentContext.tsx`](components/CookieConsentContext.tsx) a partir
  do banner (`CookieBanner.tsx`) e do modal (`CookiePreferences.tsx`).
- **Quando dispara:** toda vez que o usuário escolhe uma opção de cookies (no banner ou no modal
  "Personalizar").
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `consent_analytics` | enum | `granted`, `denied` |
  | `consent_marketing` | enum | `granted`, `denied` |
  | `consent_method` | enum | `aceitar_todos`, `rejeitar_todos`, `personalizado` |

- **Exemplo de push:**
  ```js
  {
    event: 'consent_update',
    consent_analytics: 'granted',
    consent_marketing: 'denied',
    consent_method: 'personalizado'
  }
  ```

- **Observação:** antes deste evento, o mesmo código também chama `gtag('consent', 'update', {...})`
  (array no formato do `gtag.js`, não um objeto de evento), que é o que o GTM lê para atualizar o
  Consent Mode v2. Veja a seção 10.

---

## 10. Consent Mode v2 (`gtag('consent', ...)`)

Não é um evento nomeado, mas também é um push no `dataLayer`, feito antes de qualquer outro script:

- **Default**, inline em [`components/GtmScript.tsx`](components/GtmScript.tsx), executado com
  `strategy="beforeInteractive"` **antes** do snippet do GTM:
  ```js
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
  Se já existir uma escolha salva em `localStorage` (`cookie_consent`), o mesmo script já envia um
  `update` em seguida, antes do GTM carregar.
- **Update**, disparado pelo `lib/consent.ts` sempre que o usuário escolhe no banner/modal:
  ```js
  gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });
  ```

---

## 11. `scroll_depth` (opcional)

- **Gatilho no código:** [`components/ScrollDepthTracker.tsx`](components/ScrollDepthTracker.tsx),
  usado apenas em [`app/imposto-de-renda/page.tsx`](app/imposto-de-renda/page.tsx).
- **Quando dispara:** uma única vez para cada marco de rolagem (25%, 50%, 75%, 90%).
- **Parâmetros:**
  | Parâmetro | Tipo | Valores possíveis |
  |---|---|---|
  | `percent_scrolled` | number | `25`, `50`, `75`, `90` |

- **Exemplo de push:**
  ```js
  {
    event: 'scroll_depth',
    percent_scrolled: 50
  }
  ```

---

## Onde fica cada `id`/`data-cta`

Todo elemento clicável relevante tem `id` e `data-cta` com o mesmo valor descritivo (ex.:
`data-cta="hero_fale_contador"`), para treinar acionadores de clique nativo do GTM (Click ID,
Click Classes, Click Text) e comparar com os eventos do dataLayer.
