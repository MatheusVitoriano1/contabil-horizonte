import { NextResponse } from "next/server";

interface GuiaIrBody {
  nome?: unknown;
  email?: unknown;
  declaraIrTodoAno?: unknown;
  aceite?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as GuiaIrBody | null;

  const isValid =
    body !== null &&
    typeof body.nome === "string" &&
    body.nome.trim().length > 0 &&
    typeof body.email === "string" &&
    EMAIL_REGEX.test(body.email) &&
    body.aceite === true;

  if (!isValid) {
    return NextResponse.json({ ok: false, error: "dados_invalidos" }, { status: 400 });
  }

  // Log sem dados pessoais: nada de nome ou e-mail.
  console.log("[api/guia-ir] novo lead de material rico", {
    declaraIrTodoAno: body.declaraIrTodoAno === "sim" ? "sim" : "nao",
    recebidoEm: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
