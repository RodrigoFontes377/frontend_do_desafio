"use client";

import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  ChevronDown,
  ChevronUp,
  Star,
  Loader2,
} from "lucide-react";

interface AvaliacaoCriterios {
  clareza: number;
  precisao: number;
  criatividade: number;
  gramatica: number;
  profundidade: number;
  coerencia: number;
}

interface RespostaLLM {
  modelo: string;
  resposta: string;
  avaliacoes: {
    [avaliador: string]: AvaliacaoCriterios;
  };
}

interface MediaFinal {
  posição: number;
  modelo: string;
  notaFinal: string;
  notas_criterios: {
    clareza: string;
    precisao: string;
    criatividade: string;
    gramatica: string;
    profundidade: string;
    coerencia: string;
  };
}

interface RespostaBackend {
  question: string;
  responses: {
    gemini: string;
    mistral: string;
    openRouter: string;
  };
  evaluations: {
    gemini: {
      gemini: AvaliacaoCriterios;
      mistral: AvaliacaoCriterios;
      openRouter: AvaliacaoCriterios;
    };
    mistral: {
      gemini: AvaliacaoCriterios;
      mistral: AvaliacaoCriterios;
      openRouter: AvaliacaoCriterios;
    };
    openRouter: {
      gemini: AvaliacaoCriterios;
      mistral: AvaliacaoCriterios;
      openRouter: AvaliacaoCriterios;
    };
  };
  media_final: MediaFinal[];
}

const perguntasPreDefinidas = [
  "Qual é a diferença entre inteligência artificial e aprendizado de máquina?",
  "Como a IA está impactando o mercado de trabalho?",
  "Explique o conceito de redes neurais de forma simples",
  "Quais são os principais desafios éticos da IA?",
  "Como funciona o processamento de linguagem natural?",
  "Qual é o futuro da interação humano-máquina?",
  "Explique o conceito de viés em IA",
  "Como a IA está transformando a área da saúde?",
  "O que é computação quântica e como ela se relaciona com IA?",
  "Quais são as limitações atuais dos modelos de linguagem?",
];

export default function Home() {
  const [pergunta, setPergunta] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [respostas, setRespostas] = useState<RespostaLLM[]>([]);
  const [mediaFinal, setMediaFinal] = useState<MediaFinal[]>([]);
  const [mostrarTodasPerguntas, setMostrarTodasPerguntas] = useState(false);

  const perguntasVisiveis = mostrarTodasPerguntas
    ? perguntasPreDefinidas
    : perguntasPreDefinidas.slice(0, 4);

  const enviarPergunta = async (perguntaEnviada: string) => {
    if (!perguntaEnviada.trim()) return;

    setCarregando(true);
    setRespostas([]);
    setMediaFinal([]);

    try {
      const response = await fetch("https://desafio-2-0.koyeb.app/api/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: pergunta }), // Enviando a pergunta corretamente
      });

      if (!response.ok) {
        throw new Error("Erro ao processar a pergunta");
      }

      const data: RespostaBackend = await response.json();

      // Transformar os dados recebidos no formato esperado pelo componente
      const respostasFormatadas: RespostaLLM[] = Object.entries(
        data.responses
      ).map(([modelo, resposta]) => ({
        modelo,
        resposta,
        avaliacoes: data.evaluations[modelo as keyof typeof data.evaluations],
      }));

      setRespostas(respostasFormatadas);
      setMediaFinal(data.media_final);
    } catch (erro) {
      console.error("Erro ao processar pergunta:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const selecionarPerguntaPreDefinida = (perguntaSelecionada: string) => {
    setPergunta(perguntaSelecionada);
  };

  const renderizarCriterios = (avaliacoes: AvaliacaoCriterios) => {
    const criterios = [
      { nome: "Clareza", valor: avaliacoes.clareza },
      { nome: "Precisão", valor: avaliacoes.precisao },
      { nome: "Criatividade", valor: avaliacoes.criatividade },
      { nome: "Gramática", valor: avaliacoes.gramatica },
      { nome: "Profundidade", valor: avaliacoes.profundidade },
      { nome: "Coerência", valor: avaliacoes.coerencia },
    ];

    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {criterios.map((criterio) => (
          <div key={criterio.nome} className="flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">{criterio.nome}:</span>
            <span className="text-sm font-medium">
              {criterio.valor.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Cabeçalho */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <Bot className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Comparador de LLMs
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Pergunta Personalizada */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Faça sua Pergunta</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={carregando}
            />
            <button
              onClick={() => enviarPergunta(pergunta)}
              disabled={!pergunta.trim() || carregando}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2 min-w-[140px] justify-center"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Perguntas Pré-definidas */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Perguntas Pré-definidas</h2>
            <button
              onClick={() => setMostrarTodasPerguntas(!mostrarTodasPerguntas)}
              className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
              disabled={carregando}
            >
              <span>
                {mostrarTodasPerguntas ? "Mostrar Menos" : "Ver Todas"}
              </span>
              {mostrarTodasPerguntas ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {perguntasVisiveis.map((perguntaPreDefinida, index) => (
              <button
                key={index}
                onClick={() =>
                  selecionarPerguntaPreDefinida(perguntaPreDefinida)
                }
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left"
                disabled={carregando}
              >
                {perguntaPreDefinida}
              </button>
            ))}
          </div>
        </section>

        {/* Respostas e Avaliações */}
        {respostas.length > 0 && (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Respostas e Avaliações
              </h2>
              <div className="flex flex-col space-y-6">
                {respostas.map((resposta, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-6 shadow-md"
                  >
                    {/* Modelo e Nota Final */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold capitalize">
                        {resposta.modelo}
                      </h3>
                      {mediaFinal.map(
                        (media) =>
                          media.modelo === resposta.modelo && (
                            <div key={media.modelo} className="text-sm">
                              <span className="text-gray-400">
                                Nota Final:{" "}
                              </span>
                              <span className="font-bold text-purple-400">
                                {media.notaFinal}
                              </span>
                            </div>
                          )
                      )}
                    </div>

                    {/* Resposta Gerada */}
                    <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                      {resposta.resposta}
                    </p>

                    {/* 🔍 Seção de Avaliações Cruzadas */}
                    <h4 className="text-md font-semibold mt-4 text-purple-400">
                      Como foi avaliado:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {Object.entries(resposta.avaliacoes).map(
                        ([avaliador, criterios]) => (
                          <div
                            key={avaliador}
                            className="p-3 bg-gray-700 rounded-lg shadow"
                          >
                            <h5 className="text-sm font-bold capitalize text-gray-300">
                              Avaliação por: {avaliador}
                            </h5>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-gray-400">
                              {Object.entries(criterios).map(
                                ([criterio, nota]) => (
                                  <div
                                    key={criterio}
                                    className="flex justify-between"
                                  >
                                    <span className="text-sm">{criterio}</span>
                                    <span className="text-sm font-bold text-purple-300">
                                      {nota}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ranking Final */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Ranking Final</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 gap-4">
                  {mediaFinal.map((media) => (
                    <div
                      key={media.modelo}
                      className="p-4 bg-gray-700 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-purple-400">
                            #{media.posição}
                          </span>
                          <span className="text-lg capitalize">
                            {media.modelo}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-purple-400">
                          Nota Final: {media.notaFinal}
                        </div>
                      </div>

                      {/* Exibir média de cada critério */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-300 mt-3">
                        {Object.entries(media.notas_criterios).map(
                          ([criterio, nota]) => (
                            <div
                              key={criterio}
                              className="flex justify-between bg-gray-600 p-2 rounded-lg"
                            >
                              <span className="text-sm font-medium">
                                {criterio}
                              </span>
                              <span className="text-sm font-bold text-purple-300">
                                {nota}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
