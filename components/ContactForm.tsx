"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { servicos, getServicoBySlug, slugParaSnakeCase } from "@/lib/servicos";
import {
  trackFormStart,
  trackFormSubmitError,
  trackGenerateLeadOrcamento,
  type PorteEmpresa,
} from "@/lib/tracking";

const PORTE_OPTIONS: { value: PorteEmpresa; label: string }[] = [
  { value: "nao_tenho_empresa", label: "Ainda não tenho empresa" },
  { value: "mei", label: "MEI" },
  { value: "me", label: "Microempresa (ME)" },
  { value: "epp", label: "Empresa de Pequeno Porte (EPP)" },
  { value: "outro", label: "Outro" },
];

interface FormErrors {
  nome?: string;
  email?: string;
  telefone?: string;
  servico?: string;
  aceite?: string;
}

interface Props {
  /** Pré-seleciona o serviço (ex.: ao vir de uma página de serviço). */
  servicoInicial?: string;
}

export default function ContactForm({ servicoInicial }: Props) {
  const router = useRouter();
  const hasStartedRef = useRef(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servicoInteresse, setServicoInteresse] = useState(servicoInicial ?? "");
  const [porteEmpresa, setPorteEmpresa] = useState<PorteEmpresa | "">("");
  const [mensagem, setMensagem] = useState("");
  const [aceite, setAceite] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFirstInteraction() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackFormStart({
      form_id: "contato_orcamento",
      form_name: "Formulário de contato e orçamento",
    });
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!nome.trim()) next.nome = "Informe seu nome.";
    if (!email.trim()) next.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Digite um e-mail válido.";
    if (!telefone.trim() || telefone.replace(/\D/g, "").length < 10)
      next.telefone = "Informe um telefone/WhatsApp válido, com DDD.";
    if (!servicoInteresse) next.servico = "Selecione o serviço de interesse.";
    if (!aceite) next.aceite = "É preciso aceitar a política de privacidade para continuar.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      trackFormSubmitError({
        form_id: "contato_orcamento",
        error_type: "validacao",
        error_fields: Object.keys(validation).join(","),
      });
      return;
    }

    setApiError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          servicoInteresse,
          porteEmpresa,
          mensagem,
          aceite,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error("api_error");
      }

      const servico = getServicoBySlug(servicoInteresse);
      trackGenerateLeadOrcamento({
        servico_interesse: slugParaSnakeCase(servicoInteresse),
        porte_empresa: porteEmpresa as PorteEmpresa,
        value: servico?.valorLead ?? 0,
      });

      router.push(`/obrigado?servico=${servicoInteresse}`);
    } catch {
      trackFormSubmitError({ form_id: "contato_orcamento", error_type: "api", error_fields: "" });
      setApiError(
        "Não conseguimos enviar seu formulário agora. Tente novamente em alguns minutos."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFirstInteraction}
      noValidate
      className="space-y-5"
    >
      <div>
        <label htmlFor="contato-nome" className="block text-sm font-medium text-slate-800">
          Nome*
        </label>
        <input
          id="contato-nome"
          name="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-invalid={Boolean(errors.nome)}
          aria-describedby={errors.nome ? "contato-nome-erro" : undefined}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        {errors.nome && (
          <p id="contato-nome-erro" className="mt-1 text-sm text-red-600">
            {errors.nome}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contato-email" className="block text-sm font-medium text-slate-800">
          E-mail*
        </label>
        <input
          id="contato-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contato-email-erro" : undefined}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        {errors.email && (
          <p id="contato-email-erro" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contato-telefone" className="block text-sm font-medium text-slate-800">
          Telefone/WhatsApp*
        </label>
        <input
          id="contato-telefone"
          name="telefone"
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="(11) 90000-0000"
          aria-invalid={Boolean(errors.telefone)}
          aria-describedby={errors.telefone ? "contato-telefone-erro" : undefined}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        {errors.telefone && (
          <p id="contato-telefone-erro" className="mt-1 text-sm text-red-600">
            {errors.telefone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contato-servico" className="block text-sm font-medium text-slate-800">
          Serviço de interesse*
        </label>
        <select
          id="contato-servico"
          name="servicoInteresse"
          value={servicoInteresse}
          onChange={(e) => setServicoInteresse(e.target.value)}
          aria-invalid={Boolean(errors.servico)}
          aria-describedby={errors.servico ? "contato-servico-erro" : undefined}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <option value="">Selecione...</option>
          {servicos.map((servico) => (
            <option key={servico.slug} value={servico.slug}>
              {servico.nome}
            </option>
          ))}
        </select>
        {errors.servico && (
          <p id="contato-servico-erro" className="mt-1 text-sm text-red-600">
            {errors.servico}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contato-porte" className="block text-sm font-medium text-slate-800">
          Porte da empresa
        </label>
        <select
          id="contato-porte"
          name="porteEmpresa"
          value={porteEmpresa}
          onChange={(e) => setPorteEmpresa(e.target.value as PorteEmpresa)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <option value="">Selecione...</option>
          {PORTE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contato-mensagem" className="block text-sm font-medium text-slate-800">
          Mensagem
        </label>
        <textarea
          id="contato-mensagem"
          name="mensagem"
          rows={4}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="aceite"
            checked={aceite}
            onChange={(e) => setAceite(e.target.checked)}
            aria-invalid={Boolean(errors.aceite)}
            aria-describedby={errors.aceite ? "contato-aceite-erro" : undefined}
            className="mt-1 h-4 w-4 accent-emerald-700"
          />
          <span>
            Li e aceito a{" "}
            <a href="/politica-de-privacidade" className="font-medium text-emerald-800 underline">
              política de privacidade
            </a>
            .*
          </span>
        </label>
        {errors.aceite && (
          <p id="contato-aceite-erro" className="mt-1 text-sm text-red-600">
            {errors.aceite}
          </p>
        )}
      </div>

      {apiError && (
        <p role="alert" className="text-sm text-red-600">
          {apiError}
        </p>
      )}

      <button
        type="submit"
        id="contato_enviar_formulario"
        data-cta="contato_enviar_formulario"
        disabled={isSubmitting}
        className="w-full rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar e pedir orçamento"}
      </button>
    </form>
  );
}
