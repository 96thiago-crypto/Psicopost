import express from "express";
import path from "path";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import {
  generateFallbackPostContent,
  generateFallbackRepurposed,
  generateFallbackCaption,
  generateFallbackHooks,
  generateFallbackEthics,
  generateFallbackRefineCaption,
} from "./serverFallback.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Robust JSON sanitizer and parser
function safeParseJSON(rawText: string | undefined): any {
  if (!rawText) return {};
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const startIdx = cleaned.indexOf("{");
    const endIdx = cleaned.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      return JSON.parse(cleaned.substring(startIdx, endIdx + 1));
    }
    throw e;
  }
}

// Circuit-breaker for models experiencing 503 high demand or 429 quota spikes
const modelCooldownMap = new Map<string, number>();

function isModelInCooldown(model: string): boolean {
  const expiresAt = modelCooldownMap.get(model);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    modelCooldownMap.delete(model);
    return false;
  }
  return true;
}

function recordModelIssue(model: string, cooldownMs: number = 180000) {
  modelCooldownMap.set(model, Date.now() + cooldownMs);
}

function getAvailableModels(): string[] {
  const primaryModel = "gemini-3.1-flash-lite";
  const alternateModel = "gemini-3.8-flash";

  if (isModelInCooldown(primaryModel)) {
    return [alternateModel, primaryModel];
  }
  return [primaryModel, alternateModel];
}

// Resilient multi-model fallback execution with timeout & circuit breaker
async function generateGeminiWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string,
  responseSchema?: any
): Promise<any> {
  const models = getAvailableModels();
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {
        systemInstruction,
        responseMimeType: "application/json",
      };
      if (responseSchema) {
        config.responseSchema = responseSchema;
      }
      if (model === "gemini-3.8-flash") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      // Race against an 11-second timeout per model to prevent hanging when Google servers queue 503 requests
      const generatePromise = ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Model '${model}' timeout after 11s`)), 11000);
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const rawText = response?.text;
      if (rawText) {
        if (modelCooldownMap.has(model)) {
          modelCooldownMap.delete(model);
        }
        return safeParseJSON(rawText);
      }
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || err || "");
      const isTemporaryDemandSpike =
        msg.includes("503") ||
        msg.includes("high demand") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("timeout") ||
        err?.status === 503 ||
        err?.code === 503;

      const isQuotaExhausted =
        msg.includes("429") ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.includes("Quota exceeded") ||
        err?.status === 429;

      if (isTemporaryDemandSpike || isQuotaExhausted) {
        recordModelIssue(model, 180000);
        console.log(`[Gemini Route] Model '${model}' experienced high demand/timeout. Switching smoothly to alternative.`);
      } else {
        console.log(`[Gemini Route] Notice for '${model}': ${msg.slice(0, 80)}. Switching to alternative.`);
      }
    }
  }

  throw lastError || new Error("Serviço de inteligência artificial temporariamente indisponível.");
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Studio Psicopost Pro API" });
});

// Endpoint: Generate structured post content based on clinical framework
app.post("/api/gemini/generate-content", async (req, res) => {
  try {
    const {
      theme,
      approach = "TCC (Terapia Cognitivo-Comportamental)",
      tone = "Clínico e Empático",
      format = "carousel", // "carousel", "matrix", "quote", "coping_card", "checklist", "cycle", "qa_provocation"
      textDensity = "balanced", // "concise" (menos texto), "balanced" (médio), "detailed" (mais texto)
      customInstructions = "",
      aspectRatio = "4:5",
    } = req.body;

    if (!theme) {
      return res.status(400).json({ error: "O tema é obrigatório." });
    }

    const ai = getAIClient();

    let theoreticalGuidance = "";
    let approachAuthorSuggestion = "";
    let copingToolSuggestion = "";

    if (approach.includes("ACP") || approach.includes("Pessoa") || approach.includes("Rogers") || approach.includes("Humanista")) {
      theoreticalGuidance = `Fundamentos teóricos da ACP (Abordagem Centrada na Pessoa - Carl Rogers):
- Conceitos centrais rigorosos: Tendência Atualizante, incongruência entre 'Eu Real' e 'Eu Ideal', condições de valor introjetadas, consideração positiva incondicional, escuta empática profunda e congruência/autenticidade.
- Autores de referência: Carl Rogers, John Shlien, Rachel Balabanian.
- Linguagem: Fenomenológica humanista, acolhedora, respeitando a sabedoria organísmica da pessoa, sem diagnósticos patologizantes ou jargões mecanicistas.
- Compreensão do sofrimento: Ocorre quando o indivíduo abandona sua experiência organísmica interna para tentar corresponder às condições de valor impostas pela sociedade e família.`;
      approachAuthorSuggestion = "Carl Rogers (fundador da ACP) ou reflexão fenomenológica humanista";
      copingToolSuggestion = "Pausa Fenomenológica de autoescuta organísmica, conexão com o Eu Real e validação empática incondicional";
    } else if (approach.includes("Psicanálise") || approach.includes("Psicanalítica") || approach.includes("Freud") || approach.includes("Lacan") || approach.includes("Winnicott")) {
      theoreticalGuidance = `Fundamentos teóricos da Psicanálise (Freud, Lacan, Winnicott):
- Conceitos centrais rigorosos: Inconsciente dinâmico, sintoma como mensagem cifrada e formação de compromisso, mecanismos de defesa (recalque, projeção, negação, racionalização, sublimação), tirania do Supereu e sentimento inconsciente de culpa, compulsão à repetição, o objeto a e a fantasia fundamental, o ambiente facilitador e o falso self (Winnicott).
- Autores de referência: Sigmund Freud, Jacques Lacan, Donald W. Winnicott, Melanie Klein.
- Linguagem: Profunda, analítica, ética, instigando o leitor a questionar sua própria implicação inconsciente no sofrimento ("qual é a sua responsabilidade na desordem de que você se queixa?").
- Compreensão do sofrimento: O sintoma é uma tentativa de cura que fracassou; aquilo que é recalcado retorna no corpo, na angústia ou na repetição dos mesmos nós relacionais.`;
      approachAuthorSuggestion = "Sigmund Freud, Jacques Lacan ou Donald Winnicott";
      copingToolSuggestion = "Roteiro de associação livre, escuta da mensagem do sintoma e desativação da culpa do Supereu";
    } else if (approach.includes("ACT") || approach.includes("Compromisso")) {
      theoreticalGuidance = `Fundamentos da ACT (Terapia de Aceitação e Compromisso - Steven Hayes):
- Conceitos centrais rigorosos: Hexaflex e flexibilidade psicológica, esquiva experiencial (o ciclo inútil de tentar suprimir emoções difíceis), fusão cognitiva (acreditar cegamente no que a mente diz), Eu-Contexto (o observador imutável), aceitação ativa da dor inevitável e ações comprometidas com valores existenciais.
- Autores de referência: Steven C. Hayes, Kirk Strosahl, Kelly Wilson, Russ Harris.
- Linguagem: Vivencial, empática, metafórica (metáfora dos passageiros no ônibus, da areia movediça, do céu e do clima passageiro), pragmática e compassiva.
- Compreensão do sofrimento: Não é a dor que gera o sofrimento crônico, mas a luta incansável contra os pensamentos e sentimentos, paralisando a vida vivida com propósito.`;
      approachAuthorSuggestion = "Steven C. Hayes ou Russ Harris";
      copingToolSuggestion = "Exercício de desfusão cognitiva (Folhas no Riacho, nomear a mente) e ancoragem no momento presente com valores";
    } else if (approach.includes("Esquema") || approach.includes("Young")) {
      theoreticalGuidance = `Fundamentos da Terapia do Esquema (Jeffrey Young):
- Conceitos centrais rigorosos: Esquemas Iniciais Desadaptativos (EIDs) formados na infância por necessidades emocionais não atendidas (abandono/instabilidade, privação emocional, padrões inflexíveis, desconfiança/abuso), Modos do Esquema (Criança Vulnerável, Crítico Punitivo/Exigente, Modos de Enfrentamento Desadaptativo, Modo Adulto Saudável), reparentalização limitada e confronto empático.
- Autores de referência: Jeffrey Young, Janet Klosko, Marjorie Weishaar.
- Linguagem: Psicoeducativa de acolhimento profundo, estruturada, clara, focada em validar a dor da criança interna e fortalecer a autonomia do Adulto Saudável.
- Compreensão do sofrimento: Situações gatilho ativam esquemas antigos; a pessoa reage a partir de dores infantis e autocrítica destrutiva.`;
      approachAuthorSuggestion = "Jeffrey Young";
      copingToolSuggestion = "Protocolo de reparentalização interna, expulsão do Crítico Punitivo e proteção da Criança Vulnerável";
    } else if (approach.includes("DBT") || approach.includes("Dialética")) {
      theoreticalGuidance = `Fundamentos da DBT (Terapia Comportamental Dialética - Marsha Linehan):
- Conceitos centrais rigorosos: Síntese dialética entre Aceitação Radical e Mudança Comportamental, Teoria Biossocial (vulnerabilidade biológica + ambiente invalidante), Mente Sábia (Wise Mind), Regulação Emocional, Efetividade Interpessoal (DEAR MAN), Tolerância ao Mal-Estar.
- Autores de referência: Marsha Linehan.
- Linguagem: Compassiva, sem julgamento (non-judgmental stance), prática, estruturada e orientada a habilidades clínicas.
- Compreensão do sofrimento: Tempestades de desregulação emocional levam a comportamentos de alívio rápido e dano posterior quando faltam habilidades de tolerância.`;
      approachAuthorSuggestion = "Marsha Linehan";
      copingToolSuggestion = "Habilidade T.I.P.P. (Temperatura, Exercício Intenso, Respiração Compassada, Relaxamento Muscular) ou STOP";
    } else if (approach.includes("Gestalt") || approach.includes("Perls")) {
      theoreticalGuidance = `Fundamentos da Gestalt-Terapia (Fritz Perls):
- Conceitos centrais rigorosos: Aqui-e-Agora, Awareness (tomada de consciência sensorial e existencial), autorregulação organísmica, ciclo de contato, interrupções/fronteiras de contato (introjeção, projeção, retroflexão, confluência, deflexão), fechamento de gestalts abertas (situações inacabadas).
- Autores de referência: Fritz Perls, Laura Perls, Paul Goodman, Gary Yontef.
- Linguagem: Fenomenológica, atenta à linguagem corporal, direta, focada no 'como' e no 'onde' a experiência se dá no presente.
- Compreensão do sofrimento: A energia fica retida em assuntos inacabados do passado ou ansiedade projetada no futuro, impedindo o contato fluido com a realidade atual.`;
      approachAuthorSuggestion = "Fritz Perls";
      copingToolSuggestion = "Exercício de Awareness no Aqui-e-Agora, escuta do corpo e fechamento de ciclo de contato";
    } else {
      theoreticalGuidance = `Fundamentos da TCC (Terapia Cognitivo-Comportamental - Aaron Beck):
- Conceitos centrais rigorosos: Modelo Cognitivo (Situação -> Pensamentos Automáticos -> Resposta Emocional, Fisiológica e Comportamental), distorções cognitivas catalogadas (catastrofização, pensamento dicotômico, leitura mental, filtro negativo, personalização), crenças nucleares (desamor, desvalor, desamparo), questionamento socrático, descentramento e reestruturação cognitiva empírica.
- Autores de referência: Aaron T. Beck, Judith S. Beck, David Clark, Robert Leahy.
- Linguagem: Didática, estruturada, clara, empoderadora e ancorada em sólida evidência científica da psicologia contemporânea.
- Compreensão do sofrimento: Não são os fatos em si que causam sofrimento, mas as interpretações automáticas disfuncionais consolidadas como verdades absolutas.`;
      approachAuthorSuggestion = "Aaron Beck, Judith Beck ou Epicteto (base filosófica estóica)";
      copingToolSuggestion = "Protocolo RPD (Registro de Pensamentos), técnica 5-4-3-2-1 ou respiração diafragmática com reestruturação";
    }

    let densityGuidance = "";
    if (textDensity === "concise" || aspectRatio === "1:1") {
      densityGuidance = `EXTENSÃO / DENSIDADE DE TEXTO: CONCISO, DIRETO E PRECISO (FORMATO COMPACTO).
- Frases concisas com alto impacto reflexivo.
- Título principal de 4 a 8 palavras marcantes.
- Corpo do texto em 2 frases curtas e acolhedoras.
- Itens em lista: exatamente 2 a 3 itens, de 1 linha cada.
- GARANTIA VISUAL: O texto precisa caber com folga e respiração visual no slide para que nada seja cortado.`;
    } else if (textDensity === "detailed") {
      densityGuidance = `EXTENSÃO / DENSIDADE DE TEXTO: APROFUNDADO & DETALHADO (ALTO VALOR PSICOEDUCATIVO).
- Desenvolva o conteúdo com fundamentação teórica sólida e riqueza de nuances clínicas.
- Parágrafos bem estruturados de 3 a 4 linhas, com ritmo editorial elegante.
- Explique o mecanismo psicológico com profundidade e autoridade científica.`;
    } else {
      densityGuidance = `EXTENSÃO / DENSIDADE DE TEXTO: EQUILIBRADO / PADRÃO EDITORIAL PREMIUM.
- Equilíbrio perfeito entre profundidade clínica e leveza visual para o Instagram.
- Títulos magnéticos e acolhedores, com subtítulos explicativos.
- Parágrafos médios de 2 a 3 linhas bem pontuadas e acolhedoras.`;
    }

    let systemPrompt = `Você é um psicólogo clínico sênior, autor e docente em psicologia, especialista com maestria na abordagem: ${approach}.
Sua missão é criar postagens psicoeducativas de altíssimo padrão para o Instagram, com veracidade científica, rigor teórico inquestionável e profunda empatia humana.
${theoreticalGuidance}

${densityGuidance}

DIRETRIZES FUNDAMENTAIS:
1. RIGOR E VERACIDADE CIENTÍFICA: Utilize terminologias e processos legítimos da abordagem ${approach}. Jamais misture conceitos de escolas teóricas divergentes.
2. ÉTICA DO CFP (CONSELHO FEDERAL DE PSICOLOGIA): Jamais faça promessas sensacionalistas de cura rápida, autopromoção vulgar ou diagnósticos fechados. Promova reflexão, psicoeducação e acolhimento.
3. ADAPTAÇÃO VISUAL: Cada slide deve ser lapidado como uma peça de design editorial. Frases bem estruturadas, sem excesso de palavras desnecessárias.
4. TOM DE VOZ: ${tone}.
5. GRAMÁTICA: Português do Brasil (PT-BR) culto, impecável, com pontuação elegante e fluida.`;

    if (format === "carousel") {
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie um carrossel de 7 slides de ALTÍSSIMO IMPACTO para Instagram sobre o tema: "${theme}" estritamente fundamentado na abordagem ${approach}.

ATENÇÃO RIGOROSA À CAPA (PRIMEIRA IMPRESSÃO) E AO CTA FINAL (CONVERSÃO & SALVAMENTO):

Slide 1 (CAPA MAGNÉTICA - PRIMEIRA IMPRESSÃO):
- slideRole: "cover"
- badge: "01 • CAPA"
- title: Título Gancho (Hook) de altíssimo impacto que faz a pessoa PARAR de rolar o feed nos primeiros 2 segundos. Deve tocar na ferida emocional com acolhimento clínico e inteligência.
- subtitle: Sub-gancho que valida a dor e promete a transformação ou entendimento profundo.
- body: Frase curta, magnética e acolhedora de abertura contextualizando o tema.
- footerNote: "Deslize para desvendar ➔"

Slide 2 (Identificação no Cotidiano):
- slideRole: "content"
- badge: "02 • IDENTIFICAÇÃO"
- Como o leitor vivencia essa dor no dia a dia, com 3 comportamentos ou sentimentos concretos em lista.

Slide 3 (O Mecanismo sob a ótica de ${approach}):
- slideRole: "content"
- badge: "03 • O MECANISMO"
- Explicação profunda e didática da raiz psicológica segundo os conceitos fundamentais de ${approach}.

Slide 4 (As Barreiras / Armadilhas / Defesas):
- slideRole: "content"
- badge: "04 • AS ARMADILHAS"
- As armadilhas psicológicas ou defesas internas que mantêm a pessoa presa ao ciclo.

Slide 5 (O Ponto de Virada / Insight Clínico):
- slideRole: "content"
- badge: "05 • PONTO DE VIRADA"
- O insight transformador da abordagem ${approach}, metáfora clínica ou citação/paradoxo teórico.

Slide 6 (Autonomia & Prática Terapêutica):
- slideRole: "content"
- badge: "06 • NA PRÁTICA"
- 3 passos, reflexões ou exercícios práticos para a pessoa aplicar na sua rotina.

Slide 7 (SLIDE DE FECHAMENTO & CTA - CHAMADA PARA AÇÃO):
- slideRole: "cta"
- badge: "07 • SALVE & COMPARTILHE"
- title: Título acolhedor e instigante de encerramento (ex: "Gostou desta reflexão? Salve para não esquecer").
- subtitle: "A psicoterapia te ajuda a transformar esse entendimento em liberdade emocional."
- body: Mensagem calorosa de encorajamento clínico.
- items: Exatamente 4 chamadas para ação (CTAs) práticas e diretas para o Instagram:
  1. "💾 Salve este post para consultar sempre que a mente acelerar"
  2. "🔄 Compartilhe nos Stories para acolher mais pessoas"
  3. "💬 Deixe seu comentário: qual parte mais fez sentido para você?"
  4. "🗓️ Atendimentos clínicos online e presenciais disponíveis (Link na bio)"
- highlightBox: Frase inspiradora de fechamento ético convidando para a psicoterapia.
- footerNote: "Compartilhe e salve este guia ✨"

${customInstructions ? `Instruções adicionais personalizadas: ${customInstructions}` : ""}`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING, description: "Categoria do post, ex: ACP • AUTOACEITAÇÃO ou TCC • ANSIEDADE" },
            mainTitle: { type: Type.STRING, description: "Título principal do post" },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.INTEGER },
                  slideRole: { type: Type.STRING, description: "'cover' para slide 1, 'content' para slides 2-6, 'cta' para slide 7" },
                  badge: { type: Type.STRING, description: "Badge do slide, ex: 01 • CAPA ou 07 • SALVE & COMPARTILHE" },
                  title: { type: Type.STRING, description: "Título principal do slide" },
                  subtitle: { type: Type.STRING, description: "Subtítulo ou apoio" },
                  body: { type: Type.STRING, description: "Texto explicativo do slide, bem fluido e acolhedor" },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Itens em tópicos/lista se aplicável (opcional)",
                  },
                  highlightBox: { type: Type.STRING, description: "Frase destaque em caixa de ênfase (opcional)" },
                  footerNote: { type: Type.STRING, description: "Chamada de rodapé, ex: Deslize para compreender 👉 ou Salve este post ✨" },
                },
                required: ["slideNumber", "badge", "title", "body"],
              },
            },
          },
          required: ["tag", "mainTitle", "slides"],
        }
      );

      return res.json({ success: true, data: parsed });
    } else if (format === "checklist") {
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie um Guia / Checklist Clínico de Sinais e Autopercepção para Instagram sobre o tema: "${theme}" na abordagem ${approach}.
Este é o formato mais salvo no Instagram: liste 5 sinais sutis que a pessoa reconhece em si mesma, cada um com uma explicação técnica rápida, e uma conclusão terapêutica acolhedora.`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING, description: "Ex: CHECKLIST CLÍNICO • AUTOPERCEPÇÃO" },
            title: { type: Type.STRING, description: "Título atraente, ex: 5 Sinais de que a Autocobrança Virou Ansiedade" },
            subtitle: { type: Type.STRING, description: "Subtítulo explicativo" },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING, description: "Comportamento ou sinal identificável" },
                  subtext: { type: Type.STRING, description: "Explicação clínica curta do mecanismo subjacente" },
                },
                required: ["text", "subtext"],
              },
            },
            conclusion: { type: Type.STRING, description: "Frase conclusiva e encorajamento terapêutico" },
          },
          required: ["tag", "title", "items", "conclusion"],
        }
      );

      return res.json({ success: true, data: parsed });
    } else if (format === "cycle") {
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie um Ciclo Psicológico (Engrenagem do Sintoma & Ponto de Ruptura) para Instagram sobre o tema: "${theme}" na abordagem ${approach}.
Descreva 4 etapas sequenciais do ciclo (Gatilho ➔ Pensamento/Interpretação ➔ Comportamento ➔ Reforço do Sintoma) e defina com precisão o Ponto de Ruptura / Intervenção Terapêutica.`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING, description: "Ex: O CICLO DA ANSIEDADE & EVITAÇÃO" },
            title: { type: Type.STRING, description: "Título claro e didático" },
            subtitle: { type: Type.STRING, description: "Subtítulo do processo" },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING, description: "1, 2, 3, 4" },
                  label: { type: Type.STRING, description: "Nome da etapa" },
                  description: { type: Type.STRING, description: "O que acontece na mente ou corpo" },
                },
                required: ["number", "label", "description"],
              },
            },
            breakingPoint: { type: Type.STRING, description: "Onde e como a psicoterapia quebra o ciclo" },
          },
          required: ["tag", "title", "steps", "breakingPoint"],
        }
      );

      return res.json({ success: true, data: parsed });
    } else if (format === "qa_provocation") {
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie um post de Pergunta Terapêutica / Quebra de Padrão (Questionamento Socrático / Fenomenológico) para Instagram sobre o tema: "${theme}" na abordagem ${approach}.
Deve conter uma pergunta principal profunda e instigante que faz a pessoa pausar a rolagem, contexto clínico, 3 sub-perguntas reflexivas, uma síntese terapêutica e um convite ético para reflexão nos comentários.`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING, description: "Ex: QUESTIONAMENTO TERAPÊUTICO" },
            question: { type: Type.STRING, description: "A grande pergunta reflexiva" },
            context: { type: Type.STRING, description: "Breve contextualização sobre o padrão mental abordado" },
            subQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 perguntas investigativas secundárias"
            },
            therapeuticTakeaway: { type: Type.STRING, description: "Síntese terapêutica acolhedora" },
            invitation: { type: Type.STRING, description: "Chamada convidativa para o leitor responder nos comentários" },
          },
          required: ["tag", "question", "context", "subQuestions", "therapeuticTakeaway", "invitation"],
        }
      );

      return res.json({ success: true, data: parsed });
    } else if (format === "matrix") {
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie uma Matriz Comparativa (Visão Comum / Mitos vs. Perspectiva Clínica de ${approach}) para Instagram sobre o tema: "${theme}".

Estrutura da Matriz:
- tag: Categoria com a sigla da abordagem, ex: "${approach.split(" ")[0]} • MITO VS. REALIDADE".
- mythHeader: O título da coluna do senso comum (ex: "VISÃO DO SENSO COMUM (O QUE VOCÊ PENSA)" ou "AS CONDIÇÕES DE VALOR").
- mythItems: 4 crenças distorcidas, mitos populares ou exigências irreais que as pessoas têm sobre esse tema.
- realityHeader: O título da coluna da abordagem (ex: "PERSPECTIVA DA ${approach.split(" ")[0]}" ou "VISÃO CLÍNICA BASEADA NA TEORIA").
- realityItems: 4 explicações clínicas verdadeiras, transformadoras e esclarecedoras sob a ótica de ${approach}.
- takeaway: Frase de fechamento e síntese clínica de alto impacto.`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            mythHeader: { type: Type.STRING },
            mythItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            realityHeader: { type: Type.STRING },
            realityItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            takeaway: { type: Type.STRING },
          },
          required: ["tag", "title", "mythHeader", "mythItems", "realityHeader", "realityItems", "takeaway"],
        }
      );

      return res.json({ success: true, data: parsed });
    } else if (format === "quote") {
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie um post editorial de Citação Forte e Reflexão Profunda sobre o tema: "${theme}" na abordagem ${approach}.

IMPORTANTE:
- A citação deve ser de um teórico/autor genuíno da abordagem ${approach} (${approachAuthorSuggestion}) ou uma frase clínica autoral profunda coerente com a escola teórica.
- A reflexão deve desdobrar o sentido da citação com riqueza psicológica e conectar com a vida real do leitor.
- O callToAction deve ser uma pergunta reflexiva tocante para os comentários.`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING, description: "Ex: CLÁSSICOS DA PSICOLOGIA • CARL ROGERS" },
            quote: { type: Type.STRING, description: "Citação marcante entre aspas" },
            author: { type: Type.STRING, description: "Nome do autor e título/abordagem" },
            reflection: { type: Type.STRING, description: "Texto de aprofundamento clínico (1 a 2 parágrafos densos e acolhedores)" },
            callToAction: { type: Type.STRING, description: "Pergunta reflexiva para engajar o leitor" },
          },
          required: ["tag", "quote", "author", "reflection", "callToAction"],
        }
      );

      return res.json({ success: true, data: parsed });
    } else {
      // coping_card
      const parsed = await generateGeminiWithFallback(
        ai,
        `Crie um Cartão de Enfrentamento Rápido (SOS / Protocolo Clínico) para manejo emocional imediato sobre o tema: "${theme}" baseado na abordagem ${approach}.

Ferramenta sugerida para esta abordagem: ${copingToolSuggestion}.
Estruture em 3 a 5 passos sequenciais bem claros, um mantra/frase de ancoragem coerente com ${approach}, e uma nota de acolhimento.`,
        systemPrompt,
        {
          type: Type.OBJECT,
          properties: {
            tag: { type: Type.STRING, description: "Ex: SOS ANSIEDADE ou PAUSA FENOMENOLÓGICA" },
            title: { type: Type.STRING, description: "Título do protocolo clínico" },
            subtitle: { type: Type.STRING, description: "Quando e como utilizar" },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING, description: "1, 2, 3, etc" },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["number", "title", "description"],
              },
            },
            mantra: { type: Type.STRING, description: "Frase de ancoragem ou acolhimento interno" },
            note: { type: Type.STRING, description: "Lembrete de validação e segurança" },
          },
          required: ["tag", "title", "steps", "mantra", "note"],
        }
      );

      return res.json({ success: true, data: parsed });
    }
  } catch (error: any) {
    console.warn("[Gemini API Fallback] Ativando contingência clínica estruturada para generate-content:", error?.message);
    const fallback = generateFallbackPostContent(
      req.body?.theme,
      req.body?.approach,
      req.body?.format,
      req.body?.tone,
      req.body?.textDensity
    );
    return res.json({ success: true, data: fallback, isFallback: true });
  }
});

// Endpoint: Generate high-engagement Instagram Caption with Clinical hook & hashtags
app.post("/api/gemini/generate-caption", async (req, res) => {
  try {
    const { theme, approach = "TCC", mainPoints = [], authorName = "Psicólogo" } = req.body;

    const ai = getAIClient();

    const parsed = await generateGeminiWithFallback(
      ai,
      `Gere uma legenda profissional, empática e altamente engajadora para o Instagram sobre o tema "${theme}".
Abordagem: ${approach}.
Profissional: ${authorName}.
Pontos abordados no carrossel/post: ${JSON.stringify(mainPoints)}.

A legenda deve conter:
1. Gancho de abertura irresistível (primeira linha que faz a pessoa parar o feed).
2. Desenvolvimento didático, acolhedor e humanizado (parágrafos curtos, bem espaçados e com boa respiração de leitura).
3. Uma reflexão prática ou pergunta para comentários que impulsione engajamento autêntico.
4. Chamada de ação (CTA) ética para acompanhamento terapêutico / agendamento / salvar o post.
5. Seleção completa das HASHTAGS MAIS EM ALTA E ESTRATÉGICAS para o tema e abordagem no Instagram brasileiro atual, divididas em:
   - Em Alta Geral de Saúde Mental (alto volume de busca)
   - Específicas do Tema/Sintoma tratado (nicho direto)
   - Da Abordagem Teórica (${approach})
   - De Busca por Atendimento Clínico / Psicoterapia`,
      "Você é um estrategista sênior de redes sociais e SEO para psicólogos clínicos no Instagram Brasil, garantindo conformidade ética com o CFP, redação em Português do Brasil (PT-BR) impecável, sem desvios ortográficos ou gramaticais, e as melhores práticas de alcance orgânico com hashtags de alta relevância.",
      {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING, description: "Primeira linha de impacto com emoji sutil" },
          body: { type: Type.STRING, description: "Corpo da legenda com parágrafos bem espaçados" },
          cta: { type: Type.STRING, description: "Chamada para ação ética" },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista das 10 a 15 melhores hashtags recomendadas com ou sem #"
          },
          trendingClusters: {
            type: Type.OBJECT,
            properties: {
              trending: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Hashtags com maior volume de engajamento no Instagram atual"
              },
              themeSpecific: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Hashtags hiper-específicas do sintoma ou tema abordado"
              },
              approachSpecific: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Hashtags da abordagem teórica específica"
              },
              clinicalCall: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Hashtags de busca por terapia e psicólogo"
              }
            },
            description: "Clusters de hashtags categorizadas por estratégia"
          },
          fullFormattedCaption: { type: Type.STRING, description: "Texto completo pronto para colar no Instagram com as hashtags organizadas ao final" },
        },
        required: ["hook", "body", "cta", "hashtags", "fullFormattedCaption"],
      }
    );

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn("[Gemini API Fallback] Ativando contingência clínica estruturada para generate-caption:", error?.message);
    const fallback = generateFallbackCaption(
      req.body?.theme,
      req.body?.approach,
      req.body?.authorName,
      req.body?.mainPoints
    );
    return res.json({ success: true, data: fallback, isFallback: true });
  }
});

// Endpoint: Refine & Adjust Caption with Custom Gemini Instructions or Presets
app.post("/api/gemini/refine-caption", async (req, res) => {
  try {
    const {
      currentCaption,
      instruction,
      actionType = "custom",
      approach = "TCC",
      theme = "Saúde Mental",
      authorName = "Psicólogo",
    } = req.body;

    if (!currentCaption || !currentCaption.trim()) {
      return res.status(400).json({ error: "O texto da legenda atual é obrigatório." });
    }

    const ai = getAIClient();

    let actionPrompt = "";
    if (actionType === "make_concise") {
      actionPrompt = "Torne a legenda mais concisa, direta ao ponto e dinâmica para leitura rápida no feed, mantendo o gancho principal e a chamada de ação.";
    } else if (actionType === "expand_theory") {
      actionPrompt = `Aprofunde a fundamentação teórica e clínica da abordagem ${approach}, explicando os mecanismos psicológicos e trazendo mais densidade ética e educativa.`;
    } else if (actionType === "make_empathic") {
      actionPrompt = "Aumente a validação emocional, o acolhimento humano e a linguagem empática, fazendo com que o leitor se sinta compreendido e menos solitário na sua dor.";
    } else if (actionType === "stronger_cta") {
      actionPrompt = "Fortaleça a primeira linha de gancho para prender a atenção no feed e crie uma chamada de ação (CTA) final ética mais persuasiva para comentários e agendamento.";
    } else if (actionType === "layman_terms") {
      actionPrompt = "Reescreva termos excessivamente técnicos ou acadêmicos em uma linguagem simples, clara e acessível para o público leigo, sem perder a precisão clínica.";
    } else if (actionType === "fix_grammar") {
      actionPrompt = "Revise a pontuação, o ritmo de leitura, a gramática e a diagramação visual de parágrafos para celular, deixando o texto com leitura perfeita.";
    } else {
      actionPrompt = instruction || "Aprimore e refine a legenda conforme as melhores práticas de psicologia no Instagram.";
    }

    const parsed = await generateGeminiWithFallback(
      ai,
      `Você recebeu a seguinte legenda de Instagram de um psicólogo sobre o tema "${theme}" (Abordagem: ${approach}, Profissional: ${authorName}):

--- LEGENDA ATUAL ---
${currentCaption}
---------------------

INSTRUÇÃO DE AJUSTE / REFINAMENTO:
${actionPrompt}
${instruction && actionType !== "custom" ? `Observação adicional do usuário: "${instruction}"` : ""}

DIRETRIZES:
1. Preserve a essência da mensagem e as hashtags relevantes que já existirem (a menos que a instrução peça explicitamente para alterá-las).
2. Mantenha a formatação limpa com parágrafos bem espaçados para o Instagram.
3. Garanta que o tom seja profissional, ético (conforme CFP) e humano.
4. Explique brevemente o que foi melhorado no campo "summaryOfChanges".`,
      "Você é um editor sênior e especialista em redação de conteúdo clínico e marketing ético para psicólogos no Instagram (PT-BR).",
      {
        type: Type.OBJECT,
        properties: {
          refinedCaption: {
            type: Type.STRING,
            description: "Texto completo da legenda aprimorada, pronta para publicar",
          },
          summaryOfChanges: {
            type: Type.STRING,
            description: "Resumo conciso de 1 frase explicando o que foi ajustado",
          },
        },
        required: ["refinedCaption", "summaryOfChanges"],
      }
    );

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn("[Gemini API Fallback] Ativando contingência clínica estruturada para refine-caption:", error?.message);
    const fallback = generateFallbackRefineCaption(
      req.body?.currentCaption,
      req.body?.actionType,
      req.body?.approach
    );
    return res.json({ success: true, data: fallback, isFallback: true });
  }
});

// Endpoint: Generate 3 Hook/Cover title variations for Instagram Carousels
app.post("/api/gemini/generate-hooks", async (req, res) => {
  try {
    const { theme = "Saúde Mental", approach = "TCC" } = req.body;

    const ai = getAIClient();

    const parsed = await generateGeminiWithFallback(
      ai,
      `Gere 3 variações estratégicas de TÍTULO E SUBTÍTULO DE CAPA para um carrossel de Instagram de um psicólogo.
Tema: "${theme}".
Abordagem clínica de referência: ${approach} (respeite se for ACP, Psicanálise, TCC ou Gestalt-Terapia).

As 3 variações obrigatórias:
1. "empathic": Abordagem Empática e Acolhedora. Faz o leitor se sentir visto, compreendido e sem culpa.
2. "pattern_breaker": Quebra de Padrão e Provocação Reflexiva. Questiona uma crença comum ou traz uma perspectiva inesperada que força a parada de rolagem no feed.
3. "scientific_didactic": Didática e de Autoridade Clínica. Foco no mecanismo psicológico, no processo de funcionamento e na fundamentação teórica clara.

Cada variação deve conter:
- title: Título da capa de alto impacto (máximo 2 a 3 linhas curtas, marcante).
- subtitle: Subtítulo de apoio complementar de 1 frase.
- badge: Rótulo de topo (ex: "01 • PSICOEDUCAÇÃO", "AUTOCUIDADO", etc).
- rationale: Breve frase explicando por que esse gancho converte e atrai o leitor ético.`,
      "Você é um especialista em psicologia clínica, redação editorial para saúde mental e copywriting ético para o Instagram Brasil. Produza textos de alta distinção, sem clichês baratos ou sensacionalismo.",
      {
        type: Type.OBJECT,
        properties: {
          variations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "empathic | pattern_breaker | scientific_didactic" },
                label: { type: Type.STRING, description: "Nome em português da abordagem do gancho" },
                badge: { type: Type.STRING, description: "Badge do slide de capa" },
                title: { type: Type.STRING, description: "Título impactante da capa" },
                subtitle: { type: Type.STRING, description: "Subtítulo do gancho" },
                rationale: { type: Type.STRING, description: "Por que esse gancho funciona" }
              },
              required: ["type", "label", "badge", "title", "subtitle", "rationale"]
            }
          }
        },
        required: ["variations"]
      }
    );

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn("[Gemini API Fallback] Ativando contingência clínica estruturada para generate-hooks:", error?.message);
    const fallback = generateFallbackHooks(req.body?.theme, req.body?.approach);
    return res.json({ success: true, data: fallback, isFallback: true });
  }
});

// Endpoint: Check CFP Ethics & Advertising Guidelines
app.post("/api/gemini/check-ethics", async (req, res) => {
  try {
    const { text = "" } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "O texto para análise é obrigatório." });
    }

    const ai = getAIClient();

    const parsed = await generateGeminiWithFallback(
      ai,
      `Analise o seguinte texto destinado a uma postagem de Instagram de um psicólogo no Brasil:

--- TEXTO ---
${text}
-------------

Avalie segundo o Código de Ética Profissional do Psicólogo e a Resolução CFP nº 010/2005 (publicidade e propaganda de psicologia):
1. Verifique se há promessas indevidas de cura mágica, garantia de resultados rápidos ou sensacionalismo.
2. Verifique se induz a autodiagnósticos precipitados ou estigmatizantes.
3. Verifique se o tom é psicoeducativo, responsável e respeitoso.
4. Forneça uma nota de conformidade de 0 a 100, um status (aprovado/ajustes recomendados/atenção), feedback conciso e 1 a 3 sugestões de melhoria ética caso necessário.`,
      "Você é um consultor em ética profissional para psicólogos no Brasil, especialista nas normas e resoluções do CFP (Conselho Federal de Psicologia).",
      {
        type: Type.OBJECT,
        properties: {
          isCompliant: { type: Type.BOOLEAN, description: "True se o texto cumpre as boas práticas éticas do CFP" },
          score: { type: Type.NUMBER, description: "Nota de 0 a 100 de conformidade ética" },
          verdict: { type: Type.STRING, description: "Status: 'Excelente Conformidade' | 'Ajustes Leves' | 'Requer Atenção Ética'" },
          feedback: { type: Type.STRING, description: "Análise sucinta da comunicação" },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Sugestões de melhoria ética caso existam"
          }
        },
        required: ["isCompliant", "score", "verdict", "feedback", "suggestions"]
      }
    );

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn("[Gemini API Fallback] Ativando contingência clínica estruturada para check-ethics:", error?.message);
    const fallback = generateFallbackEthics(req.body?.text);
    return res.json({ success: true, data: fallback, isFallback: true });
  }
});

// Endpoint: Desmembrar em Múltiplos Formatos (Multi-Repurpose into Reels, Single Card & Stories)
app.post("/api/gemini/repurpose-content", async (req, res) => {
  try {
    const {
      theme = "Saúde Mental",
      approach = "TCC (Terapia Cognitivo-Comportamental)",
      mainTitle = "",
      slides = [],
    } = req.body;

    const ai = getAIClient();

    const slideSummaries = Array.isArray(slides)
      ? slides
          .slice(0, 7)
          .map((s: any, idx: number) => `Slide ${idx + 1}: ${s.title || ""} - ${s.body || ""}`)
          .join("\n")
      : "";

    const parsed = await generateGeminiWithFallback(
      ai,
      `Você é um estrategista sênior de conteúdo de psicologia clínica.
O psicólogo já criou um carrossel didático com o seguinte tema e conteúdo:
Tema: "${theme}"
Título Principal: "${mainTitle || theme}"
Abordagem Clínica: ${approach}
Conteúdo dos Slides Existentes:
${slideSummaries || "Conteúdo focado no alívio do perfeccionismo e autocrítica severa."}

SUA TAREFA:
Desmembre e adapte esse mesmo tema e conteúdo em 3 OUTROS FORMATOS DE ALTO IMPACTO no Instagram, preservando a coerência conceitual e o rigor ético do CFP (sem promessas mágicas):

1. reelsScript (Roteiro de Reels / Vídeo Curto de 35 a 45s):
   - hookVisual3s: O que o psicólogo deve mostrar e fazer nos primeiros 3 segundos na tela (gesto, postura, texto de capa).
   - hookAudioSpeech: Fala inicial magnética que prende a atenção.
   - teleprompterScript: Roteiro completo de fala, em blocos curtos, focado em reflexão, autocompaixão e psicoeducação.
   - visualDirections: 3 a 4 indicações de cortes de câmera ou enquadramentos simples.
   - subtleCta: Chamada sutil (ex: "Se você se percebe nesse padrão, leia a reflexão na legenda").
   - durationEstimate: "35 a 45 segundos"
   - audioVibe: Tom e estilo de áudio recomendado.

2. singleCard (Frase de Impacto / Card Único):
   - badge: Tag de topo curta (ex: "REFLEXÃO DO DIA • TCC").
   - quote: Uma frase profunda, memorável e reflexiva que sintetiza o aprendizado central do carrossel.
   - authorOrRef: Assinatura clínica ("Psicologia Clínica" ou nome do autor teórico da abordagem).
   - reflection: 1 a 2 linhas curtas de aprofundamento prático.
   - subtleTag: "SAÚDE MENTAL • PSICOLOGIA CLÍNICA"

3. storiesSequence (Sequência de 4 Stories com alto engajamento):
   - theme: O tema trabalhado.
   - objective: Objetivo terapêutico da sequência.
   - screens: Array com exatamente 4 telas:
     * Tela 1 (tipo "enquete"): Pergunta inicial de quebra de padrão com opções de enquete reflexivas.
     * Tela 2 (tipo "identificacao"): Validação de 3 sinais do cotidiano onde o leitor se reconhece.
     * Tela 3 (tipo "caixinha"): Pergunta de caixinha de perguntas para os seguidores desabafarem/refletirem.
     * Tela 4 (tipo "conclusao_bio"): Fechamento acolhedor com convite ético para conhecer o espaço de atendimento na bio.
     Cada tela com id, stepNumber, type, tag, title, subtitle, stickerType ("enquete" | "caixinha" | "termometro" | "link"), stickerQuestion, stickerOptions (para enquete), bodyText e speakerNote.`,
      "Você é um psicólogo clínico experiente e consultor de marketing ético de saúde mental, garantindo redação impecável em Português do Brasil (PT-BR), conformidade estrita com o CFP e formatos nativos de alto engajamento no Instagram.",
      {
        type: Type.OBJECT,
        properties: {
          reelsScript: {
            type: Type.OBJECT,
            properties: {
              hookVisual3s: { type: Type.STRING },
              hookAudioSpeech: { type: Type.STRING },
              teleprompterScript: { type: Type.STRING },
              visualDirections: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              subtleCta: { type: Type.STRING },
              durationEstimate: { type: Type.STRING },
              audioVibe: { type: Type.STRING },
            },
            required: [
              "hookVisual3s",
              "hookAudioSpeech",
              "teleprompterScript",
              "visualDirections",
              "subtleCta",
              "durationEstimate",
              "audioVibe",
            ],
          },
          singleCard: {
            type: Type.OBJECT,
            properties: {
              badge: { type: Type.STRING },
              quote: { type: Type.STRING },
              authorOrRef: { type: Type.STRING },
              reflection: { type: Type.STRING },
              subtleTag: { type: Type.STRING },
            },
            required: ["badge", "quote", "authorOrRef", "reflection", "subtleTag"],
          },
          storiesSequence: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              objective: { type: Type.STRING },
              screens: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    stepNumber: { type: Type.NUMBER },
                    type: { type: Type.STRING },
                    tag: { type: Type.STRING },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    stickerType: { type: Type.STRING },
                    stickerQuestion: { type: Type.STRING },
                    stickerOptions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    bodyText: { type: Type.STRING },
                    speakerNote: { type: Type.STRING },
                  },
                  required: [
                    "id",
                    "stepNumber",
                    "type",
                    "tag",
                    "title",
                    "stickerQuestion",
                    "bodyText",
                    "speakerNote",
                  ],
                },
              },
            },
            required: ["theme", "objective", "screens"],
          },
        },
        required: ["reelsScript", "singleCard", "storiesSequence"],
      }
    );

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.warn("[Gemini API Fallback] Ativando contingência clínica estruturada para repurpose-content:", error?.message);
    const fallback = generateFallbackRepurposed(
      req.body?.theme,
      req.body?.mainTitle,
      req.body?.approach,
      req.body?.slides
    );
    return res.json({ success: true, data: fallback, isFallback: true });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Studio Psicopost Pro Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
