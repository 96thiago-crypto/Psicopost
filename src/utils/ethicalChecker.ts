import { PostState } from "../types";

export interface EthicalIssue {
  category: "cura" | "garantia" | "diagnostico";
  matchedText: string;
  recommendation: string;
}

const FORBIDDEN_PATTERNS = [
  {
    regex: /(cura\s+(definitiva|r[aá]pida|total|em\s+\d+|da\s+ansiedade|da\s+depress[aã]o)|cure\s+sua\s+ansiedade|elimine\s+(o\s+p[aâ]nico|a\s+ansiedade)\s+para\s+sempre)/gi,
    category: "cura" as const,
    recommendation: "Promessa de cura rápida ou definitiva (incompatível com a Resolução CFP nº 010/2005). Prefira 'regulação', 'manejo' ou 'compreensão terapêutica'.",
  },
  {
    regex: /(resultado\s+garantido|100%\s+eficaz|m[eé]todo\s+infal[ií]vel|f[oó]rmula\s+m[aá]gica|sucesso\s+comprovado\s+em\s+\d+\s+dias)/gi,
    category: "garantia" as const,
    recommendation: "Garantia absoluta de resultados. Cada processo psíquico é singular e o CFP veda a garantia de cura ou alívio imediato.",
  },
  {
    regex: /(voc[eê]\s+tem\s+(depress[aã]o|borderline|bipolaridade|ansiedade\s+generalizada|tdah|transtorno)|voc[eê]\s+[eé]\s+(bipolar|narcisista|borderline)|isso\s+[eé]\s+sinal\s+de\s+que\s+voc[eê]\s+tem)/gi,
    category: "diagnostico" as const,
    recommendation: "Indução precipitada a autodiagnóstico direto ao leitor. Prefira construções reflexivas como 'sinais que merecem acolhimento e investigação profissional'.",
  },
];

export function checkEthicalIssues(postState: PostState): string[] {
  const issues: string[] = [];

  // Extract all text chunks from postState
  const textChunks: string[] = [
    postState.themeTitle || "",
  ];

  if (postState.format === "carousel") {
    postState.carousel.slides.forEach((s) => {
      textChunks.push(s.title || "");
      textChunks.push(s.subtitle || "");
      textChunks.push(s.body || "");
      textChunks.push(s.highlightBox || "");
      if (s.items) textChunks.push(...s.items);
    });
  } else if (postState.format === "matrix") {
    textChunks.push(postState.matrix.title || "");
    textChunks.push(postState.matrix.subtitle || "");
    textChunks.push(...postState.matrix.mythItems);
    textChunks.push(...postState.matrix.realityItems);
    textChunks.push(postState.matrix.takeaway || "");
  } else if (postState.format === "quote") {
    textChunks.push(postState.quote.quote || "");
    textChunks.push(postState.quote.reflection || "");
  } else if (postState.format === "checklist") {
    textChunks.push(postState.checklist.title || "");
    textChunks.push(postState.checklist.subtitle || "");
    postState.checklist.items.forEach((item) => {
      textChunks.push(item.text);
      if (item.subtext) textChunks.push(item.subtext);
    });
    textChunks.push(postState.checklist.conclusion || "");
  } else if (postState.format === "cycle") {
    textChunks.push(postState.cycle.title || "");
    textChunks.push(postState.cycle.subtitle || "");
    postState.cycle.steps.forEach((st) => {
      textChunks.push(st.label);
      textChunks.push(st.description);
    });
    textChunks.push(postState.cycle.breakingPoint || "");
  } else if (postState.format === "coping_card") {
    textChunks.push(postState.copingCard.title || "");
    textChunks.push(postState.copingCard.subtitle || "");
    postState.copingCard.steps.forEach((st) => {
      textChunks.push(st.title);
      textChunks.push(st.description);
    });
    textChunks.push(postState.copingCard.mantra || "");
    textChunks.push(postState.copingCard.note || "");
  } else if (postState.format === "qa_provocation") {
    textChunks.push(postState.qaProvocation.question || "");
    textChunks.push(postState.qaProvocation.context || "");
    textChunks.push(...postState.qaProvocation.subQuestions);
    textChunks.push(postState.qaProvocation.therapeuticTakeaway || "");
  }

  const combinedText = textChunks.join(" ");

  FORBIDDEN_PATTERNS.forEach((pattern) => {
    const matches = combinedText.match(pattern.regex);
    if (matches && matches.length > 0) {
      const matchSample = `"${matches[0]}"`;
      issues.push(`Termo detectado: ${matchSample} — ${pattern.recommendation}`);
    }
  });

  return issues;
}
