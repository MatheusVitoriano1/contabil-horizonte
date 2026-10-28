import { NextResponse } from "next/server";

interface ContatoBody {
  nome?: unknown;
  email?: unknown;
  telefone?: unknown;
  servicoInteresse?: unknown;
  porteEmpresa?: unknown;
  mensagem?: unknown;
  aceite?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContatoBody | null;

  const isValid =
    body !== null &&
    typeof body.nome === "string" &&
    body.nome.trim().length > 0 &&
    typeof body.email === "string" &&
    EMAIL_REGEX.test(body.email) &&
    typeof body.telefone === "string" &&
    body.telefone.trim().length > 0 &&
    typeof body.servicoInteresse === "string" &&
    body.servicoInteresse.trim().length > 0 &&
    body.aceite === true;

  if (!isValid) {
    return NextResponse.json({ ok: false, error: "dados_invalidos" }, { status: 400 });
  }

  // Log sem dados pessoais: nada de nome, e-mail, telefone ou mensagem.
  console.log("[api/contato] novo lead de orçamento", {
    servicoInteresse: body.servicoInteresse,
    porteEmpresa: typeof body.porteEmpresa === "string" ? body.porteEmpresa : null,
    recebidoEm: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
