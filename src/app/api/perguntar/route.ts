import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pergunta } = await request.json(); // Pega a pergunta do body

    const backendUrl = "http://localhost:4000/api/all"; // Chamando o backend

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Envia JSON corretamente
      body: JSON.stringify({ question: pergunta }), // Enviando no formato certo
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
