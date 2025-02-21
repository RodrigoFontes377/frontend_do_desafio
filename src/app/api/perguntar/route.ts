import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pergunta } = await request.json();

    const backendUrl = "https://desafio-2-0.koyeb.app/api/all";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: pergunta }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (erro) {
    console.error("Erro ao processar a requisição:", erro);
    return NextResponse.json(
      { error: "Erro ao processar a requisição" },
      { status: 500 }
    );
  }
}
