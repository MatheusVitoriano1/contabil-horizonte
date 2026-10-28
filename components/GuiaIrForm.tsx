"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  trackFormStart,
  trackFormSubmitError,
  trackGenerateLeadGuiaIr,
  trackGuiaIrDownload,
} from "@/lib/tracking";

const PDF_URL = "/guia-documentos-imposto-de-renda-2027.pdf";

interface FormErrors {
  nome?: string;
  email?: string;
  aceite?: string;
}

export default function GuiaIrForm() {
  const hasStartedRef = useRef(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [declaraIrTodoAno, setDeclaraIrTodoAno] = useState<"sim" | "nao" | "">("");
  const [aceite, setAceite] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  function handleFirstInteraction() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackFormStart({ form_id: "guia_ir", form_name: "Formulário do guia de Imposto de Renda" });
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!nome.trim()) next.nome = "Informe seu nome.";
    if (!email.trim()) next.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Digite um e-mail válido.";
    if (!aceite) next.aceite = "É preciso aceitar a política de privacidade para continuar.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      trackFormSubmitError({
        form_id: "guia_ir",
        error_type: "validacao",
        error_fields: Object.keys(validation).join(","),
      });
      return;
    }

    setApiError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/guia-ir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, declaraIrTodoAno, aceite }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error("api_error");
      }

      trackGenerateLeadGuiaIr({
        declara_ir_todo_ano: declaraIrTodoAno === "sim" ? "sim" : "nao",
      });
      setIsUnlocked(true);
    } catch {
      trackFormSubmitError({ form_id: "guia_ir", error_type: "api", error_fields: "" });
      setApiError("Não conseguimos processar seu cadastro agora. Tente novamente em alguns minutos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDownloadClick() {
    trackGuiaIrDownload({ link_url: PDF_URL });
  }

  if (isUnlocked) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-base font-semibold text-emerald-900">
          Cadastro confirmado! Seu guia está liberado.
        </p>
        <a
          href={PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          id="guia_ir_baixar_pdf"
          data-cta="guia_ir_baixar_pdf"
          onClick={handleDownloadClick}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Baixar o guia (PDF)
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFirstInteraction}
      noValidate
      className="space-y-5"
    >
      <div>
        <label htmlFor="guia-ir-nome" className="block text-sm font-medium text-slate-800">
          Nome*
        </label>
        <input
          id="guia-ir-nome"
          name="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-invalid={Boolean(errors.nome)}
          aria-describedby={errors.nome ? "guia-ir-nome-erro" : undefined}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        {errors.nome && (
          <p id="guia-ir-nome-erro" className="mt-1 text-sm text-red-600">
            {errors.nome}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="guia-ir-email" className="block text-sm font-medium text-slate-800">
          E-mail*
        </label>
        <input
          id="guia-ir-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "guia-ir-email-erro" : undefined}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        {errors.email && (
          <p id="guia-ir-email-erro" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-800">
          Você declara Imposto de Renda todo ano?
        </span>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="declaraIrTodoAno"
              value="sim"
              checked={declaraIrTodoAno === "sim"}
              onChange={() => setDeclaraIrTodoAno("sim")}
              className="h-4 w-4 accent-emerald-700"
            />
            Sim
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="declaraIrTodoAno"
              value="nao"
              checked={declaraIrTodoAno === "nao"}
              onChange={() => setDeclaraIrTodoAno("nao")}
              className="h-4 w-4 accent-emerald-700"
            />
            Não
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="aceite"
            checked={aceite}
            onChange={(e) => setAceite(e.target.checked)}
            aria-invalid={Boolean(errors.aceite)}
            aria-describedby={errors.aceite ? "guia-ir-aceite-erro" : undefined}
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
          <p id="guia-ir-aceite-erro" className="mt-1 text-sm text-red-600">
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
        id="guia_ir_enviar_formulario"
        data-cta="guia_ir_enviar_formulario"
        disabled={isSubmitting}
        className="w-full rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Quero receber o guia"}
      </button>
    </form>
  );
}
