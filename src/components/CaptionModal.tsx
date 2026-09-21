import React, { useState, useEffect, useMemo } from "react";
import { PostState } from "../types";
import {
  Sparkles,
  Copy,
  Check,
  X,
  Instagram,
  RefreshCw,
  Hash,
  Flame,
  Target,
  Brain,
  HeartHandshake,
  Plus,
  Layers,
  ArrowDownToLine,
  SlidersHorizontal,
  Wand2,
  Edit3,
  Undo2,
  BookOpen,
  Heart,
  Zap,
  CheckCheck,
  Send,
  RotateCcw,
  MessageSquare,
  FileText,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface CaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  postState: PostState;
}

interface TrendingCluster {
  id: string;
  label: string;
  icon: React.ReactNode;
  tags: string[];
}

export const CaptionModal: React.FC<CaptionModalProps> = ({ isOpen, onClose, postState }) => {
  const [captionText, setCaptionText] = useState("");
  const [activeTab, setActiveTab] = useState<"caption" | "ai_adjust" | "hashtags">("caption");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customInstruction, setCustomInstruction] = useState("");
  const [previousCaption, setPreviousCaption] = useState<string | null>(null);
  const [lastAiSummary, setLastAiSummary] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [activeRefineAction, setActiveRefineAction] = useState<string | null>(null);

  const [selectedApproach, setSelectedApproach] = useState(() => {
    const sig = (postState.brand.signature || "").toLowerCase();
    const tag = (postState.carousel.tag || postState.matrix.tag || postState.quote.tag || "").toLowerCase();
    if (sig.includes("acp") || tag.includes("acp") || sig.includes("humanista") || sig.includes("rogers")) return "ACP (Abordagem Centrada na Pessoa - Carl Rogers)";
    if (sig.includes("psicanal") || tag.includes("psicanal") || sig.includes("freud") || sig.includes("lacan")) return "Psicanálise / Psicanalítica (Freud & Lacan)";
    if (sig.includes("gestalt") || tag.includes("gestalt") || sig.includes("perls") || sig.includes("awareness")) return "Gestalt-Terapia";
    return "TCC (Terapia Cognitivo-Comportamental)";
  });

  const [aiTrendingClusters, setAiTrendingClusters] = useState<{
    trending?: string[];
    themeSpecific?: string[];
    approachSpecific?: string[];
    clinicalCall?: string[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CFP Ethics Check State
  const [isCheckingEthics, setIsCheckingEthics] = useState(false);
  const [ethicsResult, setEthicsResult] = useState<{
    isCompliant: boolean;
    score: number;
    verdict: string;
    feedback: string;
    suggestions: string[];
  } | null>(null);

  const showFeedback = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Get active theme keywords
  const theme = postState.themeTitle || postState.carousel.slides[0]?.title || "Saúde Mental e Autoconhecimento";

  // Build Curated Trending Hashtags Database
  const curatedClusters: TrendingCluster[] = useMemo(() => {
    const themeLower = theme.toLowerCase();

    // 1. General High Engagement (Em Alta no Brasil)
    const viralTrending = [
      "#saudemental",
      "#psicologia",
      "#autoconhecimento",
      "#terapiafazbem",
      "#desenvolvimentopessoal",
      "#cuidedevoce",
      "#psicoterapia",
      "#autocuidadoemocional",
      "#saudeemocional",
      "#mentehumana",
    ];

    // 2. Specific Theme / Niche tags based on topic
    let themeTags: string[] = [];
    if (themeLower.includes("ansiedade") || themeLower.includes("panico") || themeLower.includes("medo") || themeLower.includes("crise")) {
      themeTags = [
        "#ansiedadegeneralizada",
        "#crisedeansiedade",
        "#sintomasdeansiedade",
        "#transtornodeansiedade",
        "#ansiedadetemcura",
        "#controledaansiedade",
        "#menteansiosa",
        "#respiracao",
      ];
    } else if (themeLower.includes("procrastina") || themeLower.includes("perfeccionis") || themeLower.includes("produtiv")) {
      themeTags = [
        "#procrastinacao",
        "#perfeccionismo",
        "#sindromedaimpostora",
        "#autocobranca",
        "#focoedisciplina",
        "#ansiedadeprodutiva",
        "#paralisiaanalitica",
        "#disciplinapessoal",
      ];
    } else if (themeLower.includes("relaciona") || themeLower.includes("dependencia") || themeLower.includes("ciume") || themeLower.includes("apego")) {
      themeTags = [
        "#dependenciaemocional",
        "#relacionamentosaudavel",
        "#responsabilidadeafetiva",
        "#ciumes",
        "#apegoansioso",
        "#limitesemocionais",
        "#relacionamentos",
        "#maturidadeemocional",
      ];
    } else if (themeLower.includes("autoestima") || themeLower.includes("autoaceit") || themeLower.includes("culpa") || themeLower.includes("compaixao")) {
      themeTags = [
        "#autoestimafeminina",
        "#autoaceitacao",
        "#autocompaixao",
        "#amorproprio",
        "#inseguranca",
        "#paredecomparar",
        "#vocetemvalor",
        "#validacaoemocional",
      ];
    } else if (themeLower.includes("depress") || themeLower.includes("luto") || themeLower.includes("tristeza") || themeLower.includes("vazio")) {
      themeTags = [
        "#depressao",
        "#acolhimento",
        "#lutoeperdas",
        "#vocenaoestasozinho",
        "#esperanca",
        "#resiliencia",
        "#apoioemocional",
        "#dorinvisivel",
      ];
    } else {
      themeTags = [
        "#reflexaododia",
        "#maturidadeemocional",
        "#habitospsicologicos",
        "#psicoeducacao",
        "#comportamentohumano",
        "#equilibrioemocional",
      ];
    }

    // 3. Approach-specific tags
    let approachTags: string[] = [];
    if (selectedApproach.includes("ACP") || selectedApproach.includes("Pessoa") || selectedApproach.includes("Rogers")) {
      approachTags = [
        "#abordagemcentradanapessoa",
        "#carlrogers",
        "#psicologiahumanista",
        "#tendenciaatualizante",
        "#autoaceitacao",
        "#escutaempatica",
        "#tornarsepessoa",
        "#humanismo",
      ];
    } else if (selectedApproach.includes("Psicanálise") || selectedApproach.includes("Psicanalítica")) {
      approachTags = [
        "#psicanalise",
        "#psicanaliseclinica",
        "#inconsciente",
        "#freud",
        "#lacan",
        "#freudexplica",
        "#escutaclinica",
        "#sintomaepsicanalise",
        "#subjetividade",
      ];
    } else if (selectedApproach.includes("Gestalt")) {
      approachTags = [
        "#gestaltterapia",
        "#gestalt",
        "#fritzperls",
        "#aquieagora",
        "#awareness",
        "#ciclodecontato",
        "#ajustamentocriativo",
        "#psicologiafenomenologica",
        "#presencaplena",
      ];
    } else {
      // TCC
      approachTags = [
        "#terapiacognitivocomportamental",
        "#tccparapsicologos",
        "#reestruturacaocognitiva",
        "#pensamentosautomaticos",
        "#distorcoescognitivas",
        "#psicologiatcc",
      ];
    }

    // 4. Clinical Call to Action & Therapy Search
    const clinicalTags = [
      "#facaterapia",
      "#psicologoonline",
      "#psicoterapiaonline",
      "#terapiaonline",
      "#procureumpsicologo",
      "#agendeseuhorario",
      "#psicologiaclinica",
      "#atendimentoonline",
    ];

    return [
      {
        id: "trending",
        label: "🔥 Mais em Alta no Instagram",
        icon: <Flame className="w-3.5 h-3.5 text-amber-500" />,
        tags: aiTrendingClusters?.trending && aiTrendingClusters.trending.length > 0
          ? aiTrendingClusters.trending.map((t) => (t.startsWith("#") ? t : `#${t}`))
          : viralTrending,
      },
      {
        id: "theme",
        label: "🎯 Específicas do Tema & Sintoma",
        icon: <Target className="w-3.5 h-3.5 text-rose-500" />,
        tags: aiTrendingClusters?.themeSpecific && aiTrendingClusters.themeSpecific.length > 0
          ? aiTrendingClusters.themeSpecific.map((t) => (t.startsWith("#") ? t : `#${t}`))
          : themeTags,
      },
      {
        id: "approach",
        label: "🧠 Da Abordagem Teórica",
        icon: <Brain className="w-3.5 h-3.5 text-indigo-500" />,
        tags: aiTrendingClusters?.approachSpecific && aiTrendingClusters.approachSpecific.length > 0
          ? aiTrendingClusters.approachSpecific.map((t) => (t.startsWith("#") ? t : `#${t}`))
          : approachTags,
      },
      {
        id: "clinical",
        label: "🤍 Busca por Psicoterapia & Pacientes",
        icon: <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />,
        tags: aiTrendingClusters?.clinicalCall && aiTrendingClusters.clinicalCall.length > 0
          ? aiTrendingClusters.clinicalCall.map((t) => (t.startsWith("#") ? t : `#${t}`))
          : clinicalTags,
      },
    ];
  }, [theme, selectedApproach, aiTrendingClusters]);

  // All unique tags available
  const allAvailableTags = useMemo(() => {
    const set = new Set<string>();
    curatedClusters.forEach((c) => c.tags.forEach((t) => set.add(t.toLowerCase())));
    return Array.from(set);
  }, [curatedClusters]);

  // Filtered tags for the active category filter
  const displayedClusters = useMemo(() => {
    if (selectedCategory === "all") return curatedClusters;
    return curatedClusters.filter((c) => c.id === selectedCategory);
  }, [curatedClusters, selectedCategory]);

  // Check if a hashtag is currently present in caption text
  const isTagInCaption = (tag: string) => {
    const cleanTag = tag.replace("#", "").toLowerCase();
    const cleanCaption = captionText.toLowerCase();
    return cleanCaption.includes(`#${cleanTag}`) || cleanCaption.includes(cleanTag);
  };

  // Toggle hashtag in the caption text
  const toggleHashtagInCaption = (tag: string) => {
    const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
    const cleanTag = formattedTag.toLowerCase();

    if (isTagInCaption(tag)) {
      // Remove from caption
      const regex = new RegExp(`\\s*${formattedTag}\\b`, "gi");
      const updated = captionText.replace(regex, "").trim();
      setCaptionText(updated);
      showFeedback(`Hashtag ${formattedTag} removida da legenda`);
    } else {
      // Append to the bottom or end of hashtags
      if (captionText.includes("#")) {
        // Append next to existing tags
        setCaptionText(`${captionText.trim()} ${formattedTag}`);
      } else {
        // Create new line
        setCaptionText(`${captionText.trim()}\n\n${formattedTag}`);
      }
      showFeedback(`Hashtag ${formattedTag} adicionada à legenda!`);
    }
  };

  // Add all hashtags from a specific cluster
  const addClusterToCaption = (clusterTags: string[]) => {
    const tagsToAdd = clusterTags.filter((t) => !isTagInCaption(t));
    if (tagsToAdd.length === 0) {
      showFeedback("Todas as hashtags deste bloco já estão na legenda.");
      return;
    }

    const tagsString = tagsToAdd.join(" ");
    if (captionText.includes("#")) {
      setCaptionText(`${captionText.trim()} ${tagsString}`);
    } else {
      setCaptionText(`${captionText.trim()}\n\n${tagsString}`);
    }
    showFeedback(`${tagsToAdd.length} novas hashtags adicionadas à legenda!`);
  };

  // Copy just hashtags
  const handleCopyHashtagsOnly = (tagsToCopy: string[]) => {
    const text = tagsToCopy.join(" ");
    navigator.clipboard.writeText(text);
    setCopiedHashtags(true);
    showFeedback(`${tagsToCopy.length} hashtags copiadas para a área de transferência!`);
    setTimeout(() => setCopiedHashtags(false), 2500);
  };

  // Generate Caption logic
  const handleGenerateCaption = async (approachOverride?: string) => {
    setIsLoading(true);
    const approachToUse = approachOverride || selectedApproach;
    try {
      let mainPoints: string[] = [];

      if (postState.format === "carousel") {
        mainPoints = postState.carousel.slides.map((s) => s.title);
      } else if (postState.format === "matrix") {
        mainPoints = [postState.matrix.title, ...postState.matrix.realityItems];
      } else if (postState.format === "quote") {
        mainPoints = [postState.quote.quote, postState.quote.reflection];
      } else {
        mainPoints = [postState.copingCard.title, ...postState.copingCard.steps.map((st) => st.title)];
      }

      const res = await fetch("/api/gemini/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          approach: approachToUse,
          mainPoints,
          authorName: postState.brand.name || "Psicólogo(a)",
        }),
      });

      const data = await res.json();
      if (data.data?.trendingClusters) {
        setAiTrendingClusters(data.data.trendingClusters);
      }

      if (data.data?.fullFormattedCaption) {
        setCaptionText(data.data.fullFormattedCaption);
      } else if (data.data) {
        const d = data.data;
        const formatted = `${d.hook}\n\n${d.body}\n\n${d.cta}\n\n—\n${postState.brand.name} | ${postState.brand.signature} | ${postState.brand.crp}\n\n${d.hashtags.map((h: string) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`;
        setCaptionText(formatted);
      } else {
        buildFallbackCaption(approachToUse);
      }
    } catch (err) {
      console.error("Erro ao gerar legenda:", err);
      buildFallbackCaption(approachToUse);
    } finally {
      setIsLoading(false);
    }
  };

  const buildFallbackCaption = (appr: string) => {
    let approachSnippet = "na Terapia Cognitivo-Comportamental (TCC), aprendemos a flexibilizar pensamentos automáticos e criar novas estratégias saudáveis de enfrentamento.";
    let hashtags = "#psicologia #terapiacognitivocomportamental #tcc #saudemental #ansiedade #autoconhecimento #autocompaixao #reestruturacaocognitiva #psicoterapia #qualidadedevida";

    if (appr.includes("ACP") || appr.includes("Pessoa") || appr.includes("Rogers")) {
      approachSnippet = "na Abordagem Centrada na Pessoa (ACP), fundada por Carl Rogers, compreendemos que quando somos verdadeiramente acolhidos sem julgamentos, encontramos o caminho natural para a nossa autoaceitação e crescimento genuíno.";
      hashtags = "#psicologia #abordagemcentradanapessoa #acp #carlrogers #psicologiahumanista #autoaceitacao #empatia #saudemental #autoconhecimento #psicoterapia";
    } else if (appr.includes("Psicanálise") || appr.includes("Psicanalítica")) {
      approachSnippet = "na Psicanálise, compreendemos que o sintoma é uma mensagem do inconsciente que busca ser escutada e elaborada, permitindo que você ressignifique conflitos e padrões que se repetem.";
      hashtags = "#psicanalise #freud #lacan #psicanalitica #inconsciente #saudemental #autoconhecimento #escutaclinica #psicoterapia #reflexao";
    } else if (appr.includes("Gestalt") || appr.includes("Perls")) {
      approachSnippet = "na Gestalt-Terapia, olhamos para a sua experiência no 'aqui e agora', desenvolvendo a awareness (tomada de consciência) sobre suas reais necessidades e padrões de contato.";
      hashtags = "#gestaltterapia #gestalt #fritzperls #aquieagora #awareness #psicologia #autoconhecimento #saudemental #psicoterapia #presenca";
    }

    const text = `Você já se pegou preso a sentimentos ou conflitos que parecem difíceis de compreender? 💭

Muitas vezes, tentamos silenciar o que nos incomoda. Porém, ${approachSnippet}

Neste conteúdo, reuni reflexões essenciais para te ajudar a olhar com mais cuidado e profundidade para a sua história e para as suas emoções.

✨ Salve este post para consultar sempre que precisar de acolhimento e clareza.
💬 Deixe nos comentários: o que fez mais sentido para você nessa reflexão?

—
${postState.brand.name || "Psicólogo(a)"}
${postState.brand.signature || "Psicólogo(a) Clínico(a)"} | ${postState.brand.crp || "CRP 02/00000"}
Agendamentos e informações no link da bio. 🤍

${hashtags}`;
    setCaptionText(text);
  };

  useEffect(() => {
    if (isOpen && !captionText) {
      handleGenerateCaption();
    }
  }, [isOpen]);

  // Refine Caption with Gemini
  const handleRefineCaption = async (actionType: string, instructionText?: string) => {
    if (!captionText.trim()) {
      showFeedback("Digite ou gere um texto antes de solicitar ajustes.");
      return;
    }

    setIsRefining(true);
    setActiveRefineAction(actionType);
    setPreviousCaption(captionText);

    try {
      const res = await fetch("/api/gemini/refine-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCaption: captionText,
          instruction: instructionText || customInstruction,
          actionType,
          approach: selectedApproach,
          theme,
          authorName: postState.brand.name || "Psicólogo(a)",
        }),
      });

      const data = await res.json();
      if (data.data?.refinedCaption) {
        setCaptionText(data.data.refinedCaption);
        if (data.data.summaryOfChanges) {
          setLastAiSummary(data.data.summaryOfChanges);
        }
        showFeedback("Legenda ajustada com Gemini ✨");
        if (actionType === "custom") {
          setCustomInstruction("");
        }
      } else {
        showFeedback(data.error || "Não foi possível refinar a legenda. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao refinar legenda:", err);
      showFeedback("Erro de conexão ao refinar legenda.");
    } finally {
      setIsRefining(false);
      setActiveRefineAction(null);
    }
  };

  // Quick format helpers
  const handleUndo = () => {
    if (previousCaption) {
      const temp = captionText;
      setCaptionText(previousCaption);
      setPreviousCaption(temp);
      setLastAiSummary(null);
      showFeedback("Ajuste desfeito com sucesso.");
    }
  };

  const handleInsertSignature = () => {
    const signatureBlock = `\n\n—\n${postState.brand.name || "Psicólogo(a)"}\n${postState.brand.signature || "Psicologia Clínica"}${postState.brand.crp ? ` | ${postState.brand.crp}` : ""}\nAgendamentos e consultas no link da bio. 🤍`;
    if (!captionText.includes(postState.brand.name || "Psicólogo")) {
      setCaptionText(`${captionText.trim()}${signatureBlock}`);
      showFeedback("Assinatura profissional inserida!");
    } else {
      showFeedback("A assinatura já parece estar presente no texto.");
    }
  };

  const handleCleanFormatting = () => {
    // Replace multiple empty lines with standard clean double-break
    const cleaned = captionText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    setCaptionText(cleaned);
    showFeedback("Formatação e espaçamento otimizados para o Instagram!");
  };

  const handleClearHashtags = () => {
    const withoutTags = captionText.replace(/#[\wÀ-ÿ]+/g, "").trim().replace(/\n{3,}/g, "\n\n");
    setCaptionText(withoutTags);
    showFeedback("Hashtags removidas da legenda.");
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    showFeedback("Legenda completa copiada com sucesso!");
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleCheckEthics = async () => {
    if (!captionText.trim()) {
      showFeedback("Digite uma legenda antes de avaliar com o CFP.");
      return;
    }
    setIsCheckingEthics(true);
    try {
      const res = await fetch("/api/gemini/check-ethics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: captionText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEthicsResult(data.data);
        showFeedback(`Conformidade CFP: ${data.data.verdict} (${data.data.score}/100)`);
      } else {
        showFeedback(data.error || "Não foi possível validar no momento.");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Erro ao conectar com assistente ético.");
    } finally {
      setIsCheckingEthics(false);
    }
  };

  // Word count & reading time
  const wordCount = useMemo(() => {
    return captionText.trim() ? captionText.trim().split(/\s+/).length : 0;
  }, [captionText]);

  const readingTimeMin = useMemo(() => {
    return Math.max(0.5, Math.round((wordCount / 180) * 10) / 10);
  }, [wordCount]);

  // Count active hashtags in the caption
  const tagsInCaptionCount = (captionText.match(/#[\wÀ-ÿ]+/g) || []).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white border border-[#D4CDBA] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] relative">
        {/* Toast feedback banner */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-[#1C1A17] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 border border-[#8B5E3C] animate-in fade-in slide-in-from-top-2 duration-200">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4CDBA] flex items-center justify-between bg-[#F5F2EC]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B5E3C]/10 border border-[#8B5E3C]/30 text-[#8B5E3C]">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1C1A17] flex items-center gap-2 font-serif">
                Legenda, Ajustes & Hashtags para Instagram
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Redação clínica, refinamento manual integrado com Gemini e tags em alta no Brasil.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1A17] hover:bg-[#E8E3D8] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Legenda vs Ajustes Gemini vs Hashtags) */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-5 pt-3 pb-2.5 bg-[#FAF7F2] border-b border-[#D4CDBA] gap-2">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("caption")}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "caption"
                  ? "bg-[#1C1A17] text-white shadow-sm"
                  : "bg-white text-[#78716C] border border-[#D4CDBA] hover:text-[#1C1A17]"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#E8E3D8]" />
              <span>Texto da Legenda</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 ml-1">
                {captionText.length} carac.
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ai_adjust")}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === "ai_adjust"
                  ? "bg-[#8B5E3C] text-white shadow-sm"
                  : "bg-white text-[#78716C] border border-[#D4CDBA] hover:text-[#1C1A17]"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Ajustes com IA Gemini</span>
              <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-800 font-bold border border-amber-400/30 ml-0.5">
                Refinar
              </span>
            </button>

            <button
              onClick={() => setActiveTab("hashtags")}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "hashtags"
                  ? "bg-[#574E45] text-white shadow-sm"
                  : "bg-white text-[#78716C] border border-[#D4CDBA] hover:text-[#1C1A17]"
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Hashtags em Alta</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 ml-1">
                {tagsInCaptionCount}
              </span>
            </button>
          </div>

          {/* Quick approach switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider hidden sm:inline">
              Abordagem:
            </span>
            <select
              value={selectedApproach}
              onChange={(e) => {
                const newAppr = e.target.value;
                setSelectedApproach(newAppr);
                handleGenerateCaption(newAppr);
              }}
              className="bg-white border border-[#D4CDBA] rounded-lg px-2 py-1 text-xs font-semibold text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
            >
              <option value="ACP (Abordagem Centrada na Pessoa - Carl Rogers)">ACP (Rogers)</option>
              <option value="Psicanálise / Psicanalítica (Freud & Lacan)">Psicanálise</option>
              <option value="TCC (Terapia Cognitivo-Comportamental)">TCC (Beck)</option>
              <option value="Gestalt-Terapia">Gestalt-Terapia</option>
            </select>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          {/* ================= TAB 1: TEXTO DA LEGENDA ================= */}
          {activeTab === "caption" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                    Editor Direto da Legenda
                  </span>
                  <span className="text-[11px] text-[#8B5E3C] font-semibold bg-[#8B5E3C]/10 px-2 py-0.5 rounded-full border border-[#8B5E3C]/20">
                    {tagsInCaptionCount} hashtags • ~{wordCount} palavras (~{readingTimeMin} min)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("ai_adjust")}
                    className="text-xs text-[#8B5E3C] hover:text-[#6D492E] font-bold flex items-center gap-1.5 transition cursor-pointer px-2 py-1 bg-[#8B5E3C]/10 rounded-lg border border-[#8B5E3C]/20"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Ajustar com Gemini ✨</span>
                  </button>

                  <span className="text-[#D4CDBA]">|</span>

                  <button
                    onClick={() => handleGenerateCaption()}
                    disabled={isLoading}
                    className="text-xs text-[#1C1A17] hover:text-[#8B5E3C] font-semibold flex items-center gap-1.5 disabled:opacity-50 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#8B5E3C]" : ""}`} />
                    <span>Regerar do Zero</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  rows={13}
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl p-4 text-xs sm:text-sm text-[#1C1A17] leading-relaxed font-sans placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition custom-scrollbar font-normal"
                  placeholder="Gerando legenda estratégica..."
                />
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#F5F2EC] border border-[#D4CDBA] rounded-xl">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={handleInsertSignature}
                    className="px-2.5 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-lg text-[11px] font-semibold text-[#1C1A17] transition cursor-pointer"
                  >
                    + Assinatura & CRP
                  </button>
                  <button
                    onClick={handleCleanFormatting}
                    className="px-2.5 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-lg text-[11px] font-semibold text-[#1C1A17] transition cursor-pointer"
                  >
                    🧹 Espaçar Parágrafos
                  </button>
                  <button
                    onClick={handleClearHashtags}
                    className="px-2.5 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-lg text-[11px] font-semibold text-[#78716C] hover:text-[#1C1A17] transition cursor-pointer"
                  >
                    Limpar Hashtags
                  </button>
                  <button
                    onClick={handleCheckEthics}
                    disabled={isCheckingEthics}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 transition cursor-pointer flex items-center gap-1.5"
                    title="Validar conformidade com Código de Ética e Resolução CFP 010/2005"
                  >
                    {isCheckingEthics ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-amber-700" />
                        <span>Avaliando CFP...</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3 h-3 text-amber-700" />
                        <span>Validar Ética CFP</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setActiveTab("hashtags")}
                  className="px-3 py-1 bg-white border border-[#D4CDBA] hover:border-[#8B5E3C] text-xs font-bold text-[#8B5E3C] rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Gerenciar Hashtags ({tagsInCaptionCount})</span>
                </button>
              </div>

              {/* CFP Ethics Analysis Feedback Card */}
              {ethicsResult && (
                <div
                  className={`p-3.5 rounded-xl border transition-all animate-in fade-in slide-in-from-top-1 text-xs space-y-2 ${
                    ethicsResult.isCompliant
                      ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                      : "bg-amber-50/90 border-amber-300 text-amber-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold">
                      {ethicsResult.isCompliant ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                      )}
                      <span>Avaliação Ética CFP: {ethicsResult.verdict}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[11px] bg-white/80 border border-black/10">
                      Nota {ethicsResult.score}/100
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11px]">{ethicsResult.feedback}</p>
                  {ethicsResult.suggestions && ethicsResult.suggestions.length > 0 && (
                    <div className="pt-1 border-t border-black/10">
                      <span className="font-semibold text-[10px] uppercase tracking-wider block mb-1">
                        Sugestões Éticas:
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {ethicsResult.suggestions.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: AJUSTES DE TEXTO COM IA GEMINI ================= */}
          {activeTab === "ai_adjust" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Summary of last AI changes */}
              {lastAiSummary && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Último ajuste com Gemini:</strong> {lastAiSummary}
                    </span>
                  </div>
                  {previousCaption && (
                    <button
                      onClick={handleUndo}
                      className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Desfazer</span>
                    </button>
                  )}
                </div>
              )}

              {/* Main Grid: Controls vs Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left/Top Column: AI Presets & Custom Instructions */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Preset 1-Click Adjustments */}
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C1A17] uppercase tracking-wide flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#8B5E3C]" />
                        Ajustes Rápidos com 1 Clique
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78716C]">
                      Transforme o tom e a estrutura da legenda mantendo a fundamentação clínica:
                    </p>

                    <div className="space-y-1.5">
                      {[
                        {
                          id: "make_concise",
                          label: "Mais Conciso & Direto",
                          desc: "Reduz o texto para leitura ultra-rápida no feed",
                          icon: <Zap className="w-3.5 h-3.5 text-amber-600" />,
                        },
                        {
                          id: "expand_theory",
                          label: "Aprofundar Teoria Clínica",
                          desc: `Expande com conceitos e rigor ético da ${selectedApproach.split(" ")[0]}`,
                          icon: <BookOpen className="w-3.5 h-3.5 text-indigo-600" />,
                        },
                        {
                          id: "make_empathic",
                          label: "Mais Acolhedor & Empático",
                          desc: "Amplia validação emocional e escuta sensível",
                          icon: <Heart className="w-3.5 h-3.5 text-rose-500" />,
                        },
                        {
                          id: "stronger_cta",
                          label: "Gancho & CTA Mais Fortes",
                          desc: "Aprimora a 1ª linha de retenção e chamada ética",
                          icon: <Target className="w-3.5 h-3.5 text-emerald-600" />,
                        },
                        {
                          id: "layman_terms",
                          label: "Linguagem Acessível (Leigo)",
                          desc: "Remove jargões densos para fácil compreensão",
                          icon: <MessageSquare className="w-3.5 h-3.5 text-blue-600" />,
                        },
                        {
                          id: "fix_grammar",
                          label: "Polir Pontuação & Ritmo",
                          desc: "Revisa quebras de linha e fluidez para celular",
                          icon: <Edit3 className="w-3.5 h-3.5 text-slate-700" />,
                        },
                      ].map((preset) => {
                        const isThisLoading = isRefining && activeRefineAction === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            disabled={isRefining}
                            onClick={() => handleRefineCaption(preset.id)}
                            className="w-full p-2 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] hover:border-[#8B5E3C] rounded-lg text-left transition cursor-pointer flex items-start gap-2.5 group disabled:opacity-50"
                          >
                            <div className="p-1 rounded bg-[#FAF7F2] border border-[#D4CDBA] mt-0.5 shrink-0 group-hover:bg-white">
                              {preset.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-[#1C1A17] flex items-center justify-between">
                                <span>{preset.label}</span>
                                {isThisLoading && (
                                  <RefreshCw className="w-3 h-3 animate-spin text-[#8B5E3C]" />
                                )}
                              </div>
                              <p className="text-[10px] text-[#78716C] leading-snug line-clamp-1">
                                {preset.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Manual Prompt / Free Instruction for Gemini */}
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl space-y-2.5">
                    <span className="text-xs font-bold text-[#1C1A17] uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Instrução Manual para o Gemini
                    </span>
                    <p className="text-[11px] text-[#78716C]">
                      Digite livremente o que deseja adicionar, mudar ou enfatizar no texto:
                    </p>

                    <div className="space-y-2">
                      <textarea
                        value={customInstruction}
                        onChange={(e) => setCustomInstruction(e.target.value)}
                        rows={3}
                        disabled={isRefining}
                        placeholder="Ex: 'Acrescente uma metáfora sobre tempestades e âncoras', 'Mude o foco para ansiedade no trabalho', 'Adicione um convite sutil para psicoterapia online'..."
                        className="w-full bg-white border border-[#D4CDBA] rounded-lg p-2.5 text-xs text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] resize-none"
                      />

                      <div className="flex items-center justify-between gap-2">
                        {previousCaption && (
                          <button
                            type="button"
                            onClick={handleUndo}
                            className="px-2.5 py-1.5 bg-white border border-[#D4CDBA] rounded-lg text-xs font-semibold text-[#78716C] hover:text-[#1C1A17] transition cursor-pointer flex items-center gap-1"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            <span>Desfazer</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isRefining || !customInstruction.trim()}
                          onClick={() => handleRefineCaption("custom", customInstruction)}
                          className="px-3.5 py-1.5 bg-[#8B5E3C] hover:bg-[#6D492E] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 ml-auto cursor-pointer shadow-xs"
                        >
                          {isRefining && activeRefineAction === "custom" ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Processando...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Aplicar Ajuste com IA</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right/Bottom Column: Real-Time Interactive Editor */}
                <div className="lg:col-span-7 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                      Texto em Edição Ativa
                    </span>
                    <span className="text-[11px] text-[#78716C] font-mono">
                      {captionText.length} carac. • {wordCount} palavras
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <textarea
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      rows={16}
                      className="w-full h-full min-h-[360px] bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl p-4 text-xs sm:text-sm text-[#1C1A17] leading-relaxed font-sans placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition custom-scrollbar"
                      placeholder="Sua legenda aparecerá aqui..."
                    />
                  </div>

                  {/* Formatting quick pills */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={handleInsertSignature}
                        className="px-2 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-md text-[10.5px] font-semibold text-[#1C1A17] transition cursor-pointer"
                      >
                        + Assinatura
                      </button>
                      <button
                        onClick={handleCleanFormatting}
                        className="px-2 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-md text-[10.5px] font-semibold text-[#1C1A17] transition cursor-pointer"
                      >
                        🧹 Formatar Quebras
                      </button>
                    </div>

                    <button
                      onClick={handleCopyCaption}
                      className="px-3 py-1 bg-[#1C1A17] hover:bg-[#332F2B] text-white rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCaption ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCaption ? "Copiado!" : "Copiar Legenda"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: EXPLORADOR DE HASHTAGS EM ALTA ================= */}
          {activeTab === "hashtags" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[#D4CDBA]">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#1C1A17] text-white"
                        : "bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17]"
                    }`}
                  >
                    Todas as Categorias
                  </button>

                  <button
                    onClick={() => setSelectedCategory("trending")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      selectedCategory === "trending"
                        ? "bg-amber-600 text-white"
                        : "bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17]"
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    Em Alta Geral
                  </button>

                  <button
                    onClick={() => setSelectedCategory("theme")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      selectedCategory === "theme"
                        ? "bg-rose-600 text-white"
                        : "bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17]"
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    Tema do Post
                  </button>

                  <button
                    onClick={() => setSelectedCategory("approach")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      selectedCategory === "approach"
                        ? "bg-indigo-600 text-white"
                        : "bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17]"
                    }`}
                  >
                    <Brain className="w-3 h-3" />
                    Abordagem ({selectedApproach.split(" ")[0]})
                  </button>

                  <button
                    onClick={() => setSelectedCategory("clinical")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      selectedCategory === "clinical"
                        ? "bg-emerald-700 text-white"
                        : "bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17]"
                    }`}
                  >
                    <HeartHandshake className="w-3 h-3" />
                    Captação de Pacientes
                  </button>
                </div>

                <button
                  onClick={() => handleCopyHashtagsOnly(allAvailableTags)}
                  className="px-3 py-1 text-xs font-bold text-[#8B5E3C] hover:bg-[#8B5E3C]/10 border border-[#8B5E3C]/30 rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copiar Todas ({allAvailableTags.length})</span>
                </button>
              </div>

              {/* Information Bar */}
              <div className="flex items-center justify-between text-xs text-[#78716C] bg-[#FAF7F2] p-3 rounded-xl border border-[#D4CDBA]">
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  <span>
                    Clique em qualquer hashtag para <strong>adicionar</strong> ou <strong>remover</strong> da legenda.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-[#1C1A17]">Já inclusa na legenda</span>
                </div>
              </div>

              {/* Clusters List */}
              <div className="space-y-4">
                {displayedClusters.map((cluster) => {
                  return (
                    <div
                      key={cluster.id}
                      className="p-4 bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl space-y-3"
                    >
                      {/* Cluster Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-md bg-white border border-[#D4CDBA]">
                            {cluster.icon}
                          </div>
                          <h4 className="text-xs font-bold text-[#1C1A17] uppercase tracking-wide">
                            {cluster.label}
                          </h4>
                          <span className="text-[10px] text-[#78716C] font-mono">
                            ({cluster.tags.length} tags)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addClusterToCaption(cluster.tags)}
                            className="px-2.5 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-lg text-[11px] font-semibold text-[#1C1A17] flex items-center gap-1 transition cursor-pointer"
                          >
                            <ArrowDownToLine className="w-3 h-3 text-[#8B5E3C]" />
                            <span>Inserir Todas na Legenda</span>
                          </button>

                          <button
                            onClick={() => handleCopyHashtagsOnly(cluster.tags)}
                            className="px-2.5 py-1 bg-white hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-lg text-[11px] font-semibold text-[#78716C] hover:text-[#1C1A17] flex items-center gap-1 transition cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </button>
                        </div>
                      </div>

                      {/* Hashtags Tags Grid */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cluster.tags.map((tag) => {
                          const active = isTagInCaption(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleHashtagInCaption(tag)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer select-none ${
                                active
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-xs hover:bg-emerald-200"
                                  : "bg-white hover:bg-[#E8E3D8] text-[#1C1A17] border border-[#D4CDBA] hover:border-[#8B5E3C]"
                              }`}
                            >
                              {active ? (
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              ) : (
                                <Plus className="w-3 h-3 text-[#8B5E3C] shrink-0" />
                              )}
                              <span>{tag.startsWith("#") ? tag : `#${tag}`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#D4CDBA] bg-[#F5F2EC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#78716C]">
              <strong>{captionText.length}</strong> caracteres • <strong>{tagsInCaptionCount}</strong> hashtags • <strong>~{wordCount}</strong> palavras
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#E8E3D8] hover:bg-[#DCD7CB] border border-[#D4CDBA] rounded-xl text-xs font-semibold text-[#1C1A17] transition cursor-pointer"
            >
              Fechar
            </button>

            <button
              onClick={handleCopyCaption}
              className="px-5 py-2 bg-[#1C1A17] hover:bg-[#332F2B] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E8E3D8]" />
                  <span>Legenda Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Legenda Completa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
