import React, { useState, useEffect, useRef } from "react";
import {
  PostState,
  AuthState,
  CarouselSlide,
  MatrixContent,
  QuoteContent,
  CopingCardContent,
  AspectRatio,
  TopLevelFormat,
} from "./types";
import {
  CLINICAL_PALETTES,
  AVAILABLE_FONTS,
  INITIAL_CAROUSEL_SLIDES,
  INITIAL_CHECKLIST,
  INITIAL_MATRIX,
  INITIAL_CYCLE,
  INITIAL_QUOTE,
  INITIAL_COPING_CARD,
  INITIAL_QA_PROVOCATION,
  INITIAL_REELS_SCRIPT,
  INITIAL_SINGLE_CARD,
  INITIAL_STORIES_SEQUENCE,
} from "./data/clinicalTemplates";
import { AuthOverlay } from "./components/AuthOverlay";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SlideCanvas } from "./components/SlideCanvas";
import { SlideNavigation } from "./components/SlideNavigation";
import { GridOverview } from "./components/GridOverview";
import { CaptionModal } from "./components/CaptionModal";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { DevicePreviewModal } from "./components/DevicePreviewModal";
import { SavedPostsModal } from "./components/SavedPostsModal";
import { MultiFormatBar } from "./components/MultiFormatBar";
import { ReelsScriptView } from "./components/ReelsScriptView";
import { SingleCardView } from "./components/SingleCardView";
import { StoriesSequenceView } from "./components/StoriesSequenceView";
import { OnboardingTourModal } from "./components/OnboardingTourModal";
import { EthicalReviewModal } from "./components/EthicalReviewModal";
import { checkEthicalIssues } from "./utils/ethicalChecker";
import { batchExportSlides, exportCarouselToZip, exportElementToPng } from "./utils/exportUtils";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Sparkles, Edit3, HelpCircle, AlertCircle, Eye, Sliders, Smartphone, PanelLeftClose, PanelLeftOpen, Sun, Moon } from "lucide-react";

function AppContent() {
  const { isDark, toggleTheme } = useTheme();

  // Authentication State
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem("psicopost_session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      isAuthenticated: false,
      user: null,
      rememberMe: true,
    };
  });

  // Post & Workspace State
  const [postState, setPostState] = useState<PostState>(() => {
    const saved = localStorage.getItem("psicopost_current_draft");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      topLevelFormat: "carousel",
      format: "carousel",
      aspectRatio: "4:5",
      themeTitle: "O Ciclo da Autocrítica e Perfeccionismo",
      textDensity: "balanced",
      palette: CLINICAL_PALETTES[0], // Linho Nobre & Verde-Petróleo (Clínico Editorial)
      typography: {
        titleFont: AVAILABLE_FONTS[0].fontFamily, // Cormorant Garamond
        bodyFont: AVAILABLE_FONTS[4].fontFamily, // Plus Jakarta Sans
        fontScale: "normal",
        alignment: "left",
        letterSpacing: "normal",
        lineHeight: "normal",
      },
      illustration: "anxiety_knot",
      illustrationPlacement: "background",
      illustrationOpacity: 0.16,
      illustrationScale: "expansive",
      connectSlides: true,
      brand: {
        name: "TÚLIO MOURA",
        signature: "Psicólogo Clínico • TCC & ACT",
        crp: "CRP 02/33860",
        instagram: "@tuliomoura.psi",
        defaultTag: "PSICOLOGIA CLÍNICA • TCC",
        avatarBase64: null,
        avatarShape: "circle",
        showAvatar: true,
        showInstagram: true,
        showCrp: true,
        showSlideNumber: true,
        showSwipeHint: true,
      },
      carousel: {
        tag: "PSICOLOGIA CLÍNICA • TCC",
        mainTitle: "Por que você sente que precisa dar conta de tudo?",
        slides: INITIAL_CAROUSEL_SLIDES,
        currentSlideIndex: 0,
      },
      matrix: INITIAL_MATRIX,
      checklist: INITIAL_CHECKLIST,
      cycle: INITIAL_CYCLE,
      quote: INITIAL_QUOTE,
      copingCard: INITIAL_COPING_CARD,
      qaProvocation: INITIAL_QA_PROVOCATION,
      reelsScript: INITIAL_REELS_SCRIPT,
      singleCard: INITIAL_SINGLE_CARD,
      storiesSequence: INITIAL_STORIES_SEQUENCE,
    };
  });

  // UI view modes & Modals
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDevicePreviewOpen, setIsDevicePreviewOpen] = useState(false);
  const [isSavedPostsOpen, setIsSavedPostsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isEthicalModalOpen, setIsEthicalModalOpen] = useState(false);
  const [detectedEthicalIssues, setDetectedEthicalIssues] = useState<string[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [isBatchExporting, setIsBatchExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Keyboard shortcut: Escape exits Focus Mode when modals are not open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        if (
          !isCaptionModalOpen &&
          !isPasswordModalOpen &&
          !isSavedPostsOpen &&
          !isOnboardingOpen &&
          !isEthicalModalOpen &&
          !isDevicePreviewOpen
        ) {
          setIsFocusMode(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isFocusMode,
    isCaptionModalOpen,
    isPasswordModalOpen,
    isSavedPostsOpen,
    isOnboardingOpen,
    isEthicalModalOpen,
    isDevicePreviewOpen,
  ]);

  // Auto-launch 3-step onboarding tour for first-time visitors
  useEffect(() => {
    const tourDone = localStorage.getItem("psicopost_onboarding_completed");
    if (!tourDone) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Auto-save sync status ("idle" | "saving" | "saved")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const isInitialMount = useRef(true);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden off-screen render container for batch exports
  const hiddenBatchContainerRef = useRef<HTMLDivElement>(null);

  // Save current draft automatically and trigger visual sync indicator
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus("saving");
    localStorage.setItem("psicopost_current_draft", JSON.stringify(postState));

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      setSaveStatus("saved");
      resetTimerRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 1600);
    }, 450);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [postState]);

  // Keyboard arrow navigation for carousel slides (when not typing in an input or editable field)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (postState.format !== "carousel") return;
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        setPostState((prev) => {
          if (prev.carousel.currentSlideIndex <= 0) return prev;
          return {
            ...prev,
            carousel: {
              ...prev.carousel,
              currentSlideIndex: prev.carousel.currentSlideIndex - 1,
            },
          };
        });
      } else if (e.key === "ArrowRight") {
        setPostState((prev) => {
          if (prev.carousel.currentSlideIndex >= prev.carousel.slides.length - 1) return prev;
          return {
            ...prev,
            carousel: {
              ...prev.carousel,
              currentSlideIndex: prev.carousel.currentSlideIndex + 1,
            },
          };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [postState.format, postState.carousel.slides.length]);

  // Auth login handler
  const handleLogin = (username: string, remember: boolean, name?: string, email?: string) => {
    const finalDisplayName = name || (username === "tulio" ? "Túlio Moura" : username.toUpperCase());
    const authData: AuthState = {
      isAuthenticated: true,
      user: {
        username,
        name: finalDisplayName,
        email: email || undefined,
      },
      rememberMe: remember,
    };
    setAuthState(authData);
    if (remember) {
      localStorage.setItem("psicopost_session", JSON.stringify(authData));
    } else {
      sessionStorage.setItem("psicopost_session", JSON.stringify(authData));
    }

    // If user provided a custom name during registration, personalize the brand header if it matches default
    if (name && name.trim().length > 0 && username !== "tulio") {
      setPostState((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          name: name.toUpperCase(),
        },
      }));
    }

    showToast("success", `Bem-vindo(a) ao Studio Psicopost, ${finalDisplayName}!`);
  };

  // Auth logout handler
  const handleLogout = () => {
    localStorage.removeItem("psicopost_session");
    sessionStorage.removeItem("psicopost_session");
    setAuthState({
      isAuthenticated: false,
      user: null,
      rememberMe: true,
    });
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  // AI Content Generator with Gemini API
  const handleGenerateAI = async (
    theme: string,
    approach: string,
    tone: string,
    textDensity: string = "balanced",
    customInstructions?: string
  ) => {
    setIsAILoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const res = await fetch("/api/gemini/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          theme,
          approach,
          tone,
          textDensity,
          format: postState.format,
          customInstructions,
        }),
      });

      clearTimeout(timeoutId);

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        throw new Error(`Falha na resposta do servidor (${res.status}). Tente novamente.`);
      }

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json?.error || `Erro (${res.status}) ao estruturar o post com IA.`);
      }

      const generated = json.data;

      if (postState.format === "carousel" && generated.slides) {
        const mappedSlides: CarouselSlide[] = generated.slides.map((s: any, idx: number) => ({
          id: `slide-ai-${idx}-${Date.now()}`,
          slideNumber: s.slideNumber || idx + 1,
          badge: s.badge || `0${idx + 1} • ${approach.split(" ")[0]}`,
          title: s.title || "Título Clínico",
          subtitle: s.subtitle || "",
          body: s.body || "",
          items: s.items || [],
          highlightBox: s.highlightBox || "",
          footerNote: s.footerNote || (idx === generated.slides.length - 1 ? "Salve para consultar depois 🤍" : "Continue lendo 👉"),
        }));

        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          carousel: {
            ...prev.carousel,
            tag: generated.tag || prev.carousel.tag,
            mainTitle: generated.mainTitle || theme,
            slides: mappedSlides,
            currentSlideIndex: 0,
          },
        }));
        showToast("success", "Carrossel de 7 slides gerado com sucesso pelo Gemini!");
      } else if (postState.format === "checklist") {
        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          checklist: {
            tag: generated.tag || "CHECKLIST CLÍNICO • AUTOPERCEPÇÃO",
            title: generated.title || theme,
            subtitle: generated.subtitle || "",
            items: generated.items || [],
            conclusion: generated.conclusion || "",
          },
        }));
        showToast("success", "Checklist de sinais gerado com sucesso pelo Gemini!");
      } else if (postState.format === "cycle") {
        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          cycle: {
            tag: generated.tag || "CICLO DA MENTE • ENGENHARIA DO SINTOMA",
            title: generated.title || theme,
            subtitle: generated.subtitle || "",
            steps: generated.steps || [],
            breakingPoint: generated.breakingPoint || "",
          },
        }));
        showToast("success", "Ciclo da mente gerado com sucesso pelo Gemini!");
      } else if (postState.format === "qa_provocation") {
        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          qaProvocation: {
            tag: generated.tag || "QUESTIONAMENTO TERAPÊUTICO",
            question: generated.question || theme,
            context: generated.context || "",
            subQuestions: generated.subQuestions || [],
            therapeuticTakeaway: generated.therapeuticTakeaway || "",
            invitation: generated.invitation || "Deixe sua reflexão nos comentários 🤍",
          },
        }));
        showToast("success", "Pergunta terapêutica gerada com sucesso pelo Gemini!");
      } else if (postState.format === "matrix") {
        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          matrix: {
            tag: generated.tag || "TCC • MITO VS. REALIDADE",
            title: generated.title || theme,
            subtitle: generated.subtitle || "",
            mythHeader: generated.mythHeader || "VISÃO COMUM (MITOS)",
            mythItems: generated.mythItems || [],
            realityHeader: generated.realityHeader || "VISÃO CLÍNICA TCC",
            realityItems: generated.realityItems || [],
            takeaway: generated.takeaway || "",
          },
        }));
        showToast("success", "Matriz comparativa gerada com sucesso pelo Gemini!");
      } else if (postState.format === "quote") {
        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          quote: {
            tag: generated.tag || "REFLEXÃO CLÍNICA",
            quote: generated.quote || theme,
            author: generated.author || "Túlio Moura",
            reflection: generated.reflection || "",
            callToAction: generated.callToAction || "O que você pensa sobre isso?",
          },
        }));
        showToast("success", "Post editorial de citação gerado com sucesso pelo Gemini!");
      } else {
        // coping_card
        setPostState((prev) => ({
          ...prev,
          themeTitle: theme,
          copingCard: {
            tag: generated.tag || "SOS ANSIEDADE • ENFRENTAMENTO",
            title: generated.title || theme,
            subtitle: generated.subtitle || "",
            steps: generated.steps || [],
            mantra: generated.mantra || "",
            note: generated.note || "",
          },
        }));
        showToast("success", "Cartão de enfrentamento gerado com sucesso pelo Gemini!");
      }
    } catch (err: any) {
      console.error("Erro na geração com Gemini:", err);
      const isAbort = err?.name === "AbortError";
      const message = isAbort
        ? "Tempo limite atingido ao gerar com o Gemini. Por favor, tente novamente."
        : (err?.message || "Erro ao comunicar com a IA Gemini. Tente novamente.");
      showToast("error", message);
    } finally {
      setIsAILoading(false);
    }
  };

  // Desmembrar em Múltiplos Formatos (Multi-Repurpose into Reels, Single Card & Stories)
  const handleRepurposeContent = async () => {
    setIsRepurposing(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const theme = postState.themeTitle || postState.carousel.mainTitle || "Saúde Emocional";
    const mainTitle = postState.carousel.mainTitle || theme;
    const slides = postState.carousel.slides || [];
    const approach = postState.brand.signature || "TCC";

    try {
      const res = await fetch("/api/gemini/repurpose-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          theme,
          mainTitle,
          slides,
          approach,
        }),
      });

      clearTimeout(timeoutId);
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        throw new Error("Falha na resposta do servidor de IA.");
      }

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json?.error || "Não foi possível desmembrar com IA.");
      }

      const { reelsScript, singleCard, storiesSequence } = json.data;

      setPostState((prev) => ({
        ...prev,
        reelsScript: reelsScript || prev.reelsScript,
        singleCard: singleCard || prev.singleCard,
        storiesSequence: storiesSequence || prev.storiesSequence,
      }));

      showToast("success", "✨ Conteúdo desmembrado com sucesso em Reels, Card Único e Stories!");
    } catch (err: any) {
      console.warn("Repurpose fallback triggered:", err?.message);

      // Intelligent client-side heuristic repurposing fallback so user never gets stuck
      const cover = slides[0];
      const second = slides[1] || slides[0];
      const finalSlide = slides[slides.length - 1] || slides[0];

      setPostState((prev) => ({
        ...prev,
        reelsScript: {
          hookVisual3s: `Olhar reflexivo direto para a câmera. Segurando uma xícara ou apoiando os braços na mesa. Texto na tela: '${cover?.title || theme}'.`,
          hookAudioSpeech: cover?.subtitle || "Se você sente isso ultimamente, pare 30 segundos para me ouvir.",
          teleprompterScript: `${cover?.body || "Muitas vezes acreditamos que precisamos carregar tudo em silêncio e dar conta do mundo sozinhos."}\n\n${second?.body || "Mas a verdade é que o cansaço acumulado não é fraqueza. É um pedido de socorro do seu corpo."}\n\n${finalSlide?.body || "Reconhecer seu limite não é desistir. É o primeiro ato de respeito consigo mesmo."}`,
          visualDirections: [
            "Cena 1 (0-3s): Plano médio direto para a câmera, respiração calma.",
            "Cena 2 (4-20s): Corte suave para ângulo lateral ou anotações clínicas.",
            "Cena 3 (21-35s): Pausa reflexiva de 1 segundo antes da frase de desfecho.",
            "Cena 4 (36-42s): Respiração consciente e fechamento acolhedor.",
          ],
          subtleCta: "Se essa mensagem fez sentido para você, salve para revisitar quando o peso aumentar.",
          durationEstimate: "35 a 45 segundos",
          audioVibe: "Piano acústico sereno em volume baixo (15%) e voz aveludada e pausada.",
        },
        singleCard: {
          badge: "REFLEXÃO DO DIA • CLÍNICA",
          quote: cover?.title || theme,
          authorOrRef: prev.brand.signature || "Psicologia Clínica",
          reflection: cover?.subtitle || "Dê a si mesmo a permissão de respirar antes de reagir às demandas do mundo.",
          subtleTag: "PSICOLOGIA CLÍNICA • SAÚDE MENTAL",
        },
        storiesSequence: {
          theme,
          objective: "Conscientização, acolhimento e engajamento reflexivo",
          screens: [
            {
              id: `story-auto-1-${Date.now()}`,
              stepNumber: 1,
              type: "enquete",
              tag: "TELA 01 • QUEBRA DE PADRÃO",
              title: cover?.title || "Você costuma se cobrar além da conta?",
              subtitle: "Uma reflexão honesta para o seu dia:",
              stickerType: "enquete",
              stickerQuestion: "Você sente essa cobrança no seu peito?",
              stickerOptions: ["Sim, muito 🥺", "Raramente ✨"],
              bodyText: cover?.body || "A autocrítica severa muitas vezes se disfarça de 'busca por excelência'. Mas na verdade, é apenas o medo de falhar.",
              speakerNote: "Grave olhando para a câmera com tom acolhedor e deixe a enquete bem centralizada.",
            },
            {
              id: `story-auto-2-${Date.now()}`,
              stepNumber: 2,
              type: "identificacao",
              tag: "TELA 02 • SINAIS",
              title: second?.title || "Como isso se manifesta no dia a dia?",
              subtitle: "Veja se você se reconhece em ao menos 2 itens:",
              stickerType: "termometro",
              stickerQuestion: "Nível de identificação:",
              bodyText: second?.body || "• Dificuldade de descansar sem culpa.\n• Sensação de estar sempre devendo algo.\n• Medo de decepcionar quem está ao seu redor.",
              speakerNote: "Destaque os comportamentos cotidianos sem termos patologizantes.",
            },
            {
              id: `story-auto-3-${Date.now()}`,
              stepNumber: 3,
              type: "caixinha",
              tag: "TELA 03 • CAIXINHA",
              title: "Espaço Seguro de Escuta",
              subtitle: "Vou responder com cuidado clínico:",
              stickerType: "caixinha",
              stickerQuestion: "Qual cobrança mais tem pesado para você ultimamente?",
              bodyText: "Colocar em palavras é o primeiro passo para desatar o nó do sofrimento emocional.",
              speakerNote: "Abra a caixinha e selecione perguntas com empatia técnica.",
            },
            {
              id: `story-auto-4-${Date.now()}`,
              stepNumber: 4,
              type: "conclusao_bio",
              tag: "TELA 04 • CONCLUSÃO & BIO",
              title: "Você não precisa enfrentar tudo sozinho(a)",
              subtitle: "A psicoterapia é o espaço onde esse ciclo pode ser ressignificado.",
              stickerType: "link",
              stickerQuestion: "Conheça o espaço de atendimento na bio 🤍",
              bodyText: "Se você deseja um espaço seguro e acolhedor para cuidar da sua saúde mental, o link para agendamento está disponível na minha bio.",
              speakerNote: "Chamada ética e suave direcionando para a bio em conformidade com o CFP.",
            },
          ],
        },
      }));

      showToast("success", "✨ Conteúdo desmembrado e adaptado com sucesso em múltiplos formatos!");
    } finally {
      setIsRepurposing(false);
    }
  };

  // Batch Export All Images (ZIP with all slides for Carousel, PNG for Single Post)
  const handleBatchExport = async (skipEthicalCheck: boolean = false) => {
    // 1. Auditoria Ética Conforme Resolução CFP 010/2005 (Alerta preventivo ao profissional)
    if (!skipEthicalCheck) {
      const ethicalIssues = checkEthicalIssues(postState);
      if (ethicalIssues.length > 0) {
        setDetectedEthicalIssues(ethicalIssues);
        setIsEthicalModalOpen(true);
        return;
      }
    }

    setIsBatchExporting(true);
    setExportProgress(null);

    try {
      const baseName = (postState.themeTitle || "psicopost")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .slice(0, 35) || "psicopost";

      if (postState.format === "carousel") {
        // Query all slides from the full staging export area
        const stagedContainers = document.querySelectorAll('[data-export-staging-slide]');
        const elementsArray: HTMLElement[] = [];

        stagedContainers.forEach((container) => {
          const innerCanvas = (container as HTMLElement).querySelector(
            '[data-export-id^="slide-canvas-"]'
          ) as HTMLElement;
          if (innerCanvas) {
            elementsArray.push(innerCanvas);
          } else {
            elementsArray.push(container as HTMLElement);
          }
        });

        if (elementsArray.length === 0) {
          // Fallback to any visible canvas in DOM
          const fallbackNodes = document.querySelectorAll('[data-export-id^="slide-canvas-"]');
          fallbackNodes.forEach((node) => elementsArray.push(node as HTMLElement));
        }

        if (elementsArray.length === 0) {
          throw new Error("Nenhum slide encontrado para exportação.");
        }

        // Build a formatted clinical caption for the archive
        const defaultCaption = `📌 ${postState.themeTitle || "Psicologia Clínica"}\n\n${postState.carousel.slides
          .map((s, i) => `[Slide ${i + 1}] ${s.title}\n${s.body ? s.body + "\n" : ""}${s.items && s.items.length > 0 ? s.items.join("\n") + "\n" : ""}${s.highlightBox ? "💡 " + s.highlightBox : ""}`)
          .join("\n\n")}\n\n💬 Salve este post para consultar depois e compartilhe nos stories!\n\n${postState.brand.name || "Psicólogo(a)"} | ${postState.brand.signature || "Psicologia Clínica"} | ${postState.brand.crp || ""}\nInstagram: ${postState.brand.instagram || ""}\n\n#psicologia #saudemental #psicoterapia #terapia #autoconhecimento #desenvolvimentopessoal`;

        await exportCarouselToZip(
          elementsArray,
          `${baseName}_todos_os_${elementsArray.length}_slides`,
          defaultCaption,
          (current, total) => {
            setExportProgress({ current, total });
          }
        );

        showToast(
          "success",
          `Sucesso! Todas as ${elementsArray.length} imagens foram extraídas e baixadas no arquivo ZIP!`
        );
      } else {
        // Single Post export
        const singleElem =
          (document.querySelector('[data-export-staging-slide="0"] [data-export-id^="slide-canvas-"]') as HTMLElement) ||
          (document.querySelector('[data-export-id^="slide-canvas-"]') as HTMLElement);

        if (!singleElem) throw new Error("Elemento do post não encontrado.");
        await exportElementToPng(singleElem, `${baseName}_post_hd`, 3);
        showToast("success", "Download da imagem em PNG HD 3x concluído com sucesso!");
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", "Erro ao renderizar e baixar imagens. Tente novamente.");
    } finally {
      setIsBatchExporting(false);
      setExportProgress(null);
    }
  };

  // Slide inline updater
  const handleUpdateSlide = (slideIndex: number, updated: Partial<CarouselSlide>) => {
    setPostState((prev) => {
      const slides = [...prev.carousel.slides];
      if (!slides[slideIndex]) return prev;
      slides[slideIndex] = { ...slides[slideIndex], ...updated };
      return {
        ...prev,
        carousel: {
          ...prev.carousel,
          slides,
        },
      };
    });
  };

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-200 ${
        isDark ? "bg-[#0F0F12] text-[#F4F4F5]" : "bg-[#F5F2EC] text-[#1C1A17]"
      }`}
    >
      {/* 1. Auth Lock Screen */}
      <AuthOverlay authState={authState} onLogin={handleLogin} />

      {/* 2. Top Header Bar */}
      <Header
        postState={postState}
        authState={authState}
        onLogout={handleLogout}
        onOpenCaptionModal={() => setIsCaptionModalOpen(true)}
        onOpenDevicePreview={() => setIsDevicePreviewOpen(true)}
        onOpenSavedPosts={() => setIsSavedPostsOpen(true)}
        onOpenOnboardingTour={() => setIsOnboardingOpen(true)}
        onBatchExport={handleBatchExport}
        isBatchExporting={isBatchExporting}
        exportProgress={exportProgress}
        saveStatus={saveStatus}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        onToggleAspectRatio={(ratio: AspectRatio) =>
          setPostState((prev) => ({ ...prev, aspectRatio: ratio }))
        }
      />

      {/* 3. Mobile Escrita / Preview Tab Switcher Bar */}
      <div
        className={`lg:hidden px-3 py-2 border-b flex flex-col gap-1.5 shrink-0 transition-colors duration-200 ${
          isDark
            ? "bg-[#18181B] border-[#27272A] text-[#F4F4F5]"
            : "bg-[#E8E3D8] border-[#D4CDBA] text-[#1C1A17]"
        }`}
      >
        <div className="flex items-center gap-1.5 p-1 bg-black/5 dark:bg-white/5 rounded-xl w-full">
          <button
            type="button"
            onClick={() => setMobileTab("editor")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              mobileTab === "editor"
                ? "bg-[#8B5E3C] text-white shadow-xs"
                : isDark
                ? "text-[#A1A1AA] hover:text-white"
                : "text-[#78716C] hover:text-[#1C1A17]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Painel & Escrita</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              mobileTab === "preview"
                ? "bg-[#8B5E3C] text-white shadow-xs"
                : isDark
                ? "text-[#A1A1AA] hover:text-white"
                : "text-[#78716C] hover:text-[#1C1A17]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visualizar Post</span>
          </button>
        </div>

        {/* Mobile save indicator bar */}
        {saveStatus !== "idle" && (
          <div
            className={`flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-all duration-300 animate-in fade-in ${
              saveStatus === "saving"
                ? isDark
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
                : isDark
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {saveStatus === "saving" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span>Sincronizando alterações...</span>
              </>
            ) : (
              <>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>Alterações salvas com sucesso</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 4. Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar with 3 interactive tabs - collapses completely in Focus Mode */}
        <div
          className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
            isFocusMode
              ? "w-0 opacity-0 pointer-events-none"
              : mobileTab === "preview"
              ? "hidden lg:flex w-full lg:w-96 opacity-100"
              : "flex w-full lg:w-96 opacity-100"
          }`}
        >
          <div className="w-full lg:w-96 h-full shrink-0">
            <Sidebar
              postState={postState}
              onUpdatePostState={setPostState}
              onGenerateAI={handleGenerateAI}
              isAILoading={isAILoading}
              onChangePasswordClick={() => setIsPasswordModalOpen(true)}
              onOpenSavedPosts={() => setIsSavedPostsOpen(true)}
            />
          </div>
        </div>

        {/* Center Stage / Interactive Canvas Canvas - hidden on mobile when editing if not focus mode */}
        <main
          className={`flex-1 overflow-y-auto flex flex-col justify-between p-4 sm:p-6 custom-scrollbar relative transition-colors duration-200 ${
            mobileTab === "editor" && !isFocusMode ? "hidden lg:flex" : "flex"
          } ${isDark ? "bg-[#0F0F12]" : "bg-[#F8F7F4]"}`}
        >
          {/* Top Canvas Toolbar: Clean Proportions, Focus Mode & Slide Position */}
          <div className="max-w-xl mx-auto w-full flex items-center justify-between gap-2 text-xs mb-3 px-1">
            <div className="flex items-center gap-2">
              {/* Focus Mode Quick Toggle */}
              <button
                type="button"
                onClick={() => setIsFocusMode((prev) => !prev)}
                id="canvas-focus-mode-toggle"
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shadow-2xs ${
                  isFocusMode
                    ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                    : isDark
                    ? "bg-[#18181B] hover:bg-[#27272A] border-[#27272A] text-zinc-300"
                    : "bg-white hover:bg-[#FAF7F2] border-[#D4CDBA] text-[#574E45]"
                }`}
                title={
                  isFocusMode
                    ? "Sair do Modo Foco e restaurar barra lateral (Esc)"
                    : "Modo Foco: recolher barra lateral para visualização limpa"
                }
              >
                {isFocusMode ? (
                  <>
                    <PanelLeftOpen className="w-3.5 h-3.5 text-white" />
                    <span className="text-[11px] font-medium">Restaurar Painel</span>
                  </>
                ) : (
                  <>
                    <PanelLeftClose className="w-3.5 h-3.5 text-[#8B5E3C] dark:text-[#D9A888]" />
                    <span className="text-[11px] font-medium hidden sm:inline">Modo Foco</span>
                  </>
                )}
              </button>

              {/* Proportions Selector */}
              <div
                className={`inline-flex items-center p-0.5 rounded-xl border shadow-2xs ${
                  isDark ? "bg-[#18181B] border-[#27272A]" : "bg-white border-[#D4CDBA]"
                }`}
              >
                {(
                  [
                    { id: "4:5", label: "4:5 Retrato", sub: "Feed Instagram Padrão (1080×1350)" },
                    { id: "1:1", label: "1:1 Quadrado", sub: "Feed Instagram Clássico (1080×1080)" },
                    { id: "9:16", label: "9:16 Stories", sub: "Stories & Reels (1080×1920)" },
                  ] as const
                ).map((r) => {
                  const active = postState.aspectRatio === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() =>
                        setPostState((prev) => ({ ...prev, aspectRatio: r.id }))
                      }
                      className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? "bg-[#8B5E3C] text-white shadow-2xs"
                          : isDark
                          ? "text-[#A1A1AA] hover:text-white"
                          : "text-[#78716C] hover:text-[#1C1A17]"
                      }`}
                      title={r.sub}
                    >
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slide Index Indicator, Focus Contrast Theme Toggle & Esc hint */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle within Canvas Toolbar (Focus Mode contrast test) */}
              {isFocusMode && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  id="canvas-focus-theme-toggle"
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shadow-2xs ${
                    isDark
                      ? "bg-[#18181B] hover:bg-[#27272A] border-[#27272A] text-amber-300 hover:text-amber-200"
                      : "bg-white hover:bg-[#FAF7F2] border-[#D4CDBA] text-[#8B5E3C] hover:text-[#734B2E]"
                  }`}
                  title={
                    isDark
                      ? "Mudar fundo para Claro para testar o contraste da paleta"
                      : "Mudar fundo para Escuro para testar o contraste da paleta"
                  }
                  aria-label={isDark ? "Alternar para Fundo Claro" : "Alternar para Fundo Escuro"}
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[11px] font-medium text-zinc-300">Fundo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                      <span className="text-[11px] font-medium text-[#574E45]">Fundo Escuro</span>
                    </>
                  )}
                </button>
              )}

              {isFocusMode && (
                <span className="text-[10px] text-[#8B5E3C] dark:text-[#D9A888] font-medium hidden md:inline">
                  Pressione <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[9px]">Esc</kbd> para sair
                </span>
              )}

              {postState.format === "carousel" && (
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                    isDark
                      ? "bg-[#18181B] text-zinc-300 border-[#27272A]"
                      : "bg-white text-[#574E45] border-[#D4CDBA]"
                  }`}
                >
                  Slide {postState.carousel.currentSlideIndex + 1} de {postState.carousel.slides.length}
                  {postState.carousel.currentSlideIndex === 0 && " • Capa"}
                </span>
              )}
            </div>
          </div>

              {/* Center Canvas View */}
              <div className="flex-1 flex items-center justify-center my-auto w-full">
                {viewMode === "single" || postState.format !== "carousel" ? (
                  <SlideCanvas
                    postState={postState}
                    slideIndex={postState.carousel.currentSlideIndex}
                    isFocusMode={isFocusMode}
                    onUpdateSlide={handleUpdateSlide}
                    onUpdateMatrix={(upd) =>
                      setPostState((p) => ({ ...p, matrix: { ...p.matrix, ...upd } }))
                    }
                    onUpdateChecklist={(upd) =>
                      setPostState((p) => ({ ...p, checklist: { ...p.checklist, ...upd } }))
                    }
                    onUpdateCycle={(upd) =>
                      setPostState((p) => ({ ...p, cycle: { ...p.cycle, ...upd } }))
                    }
                    onUpdateQuote={(upd) =>
                      setPostState((p) => ({ ...p, quote: { ...p.quote, ...upd } }))
                    }
                    onUpdateCopingCard={(upd) =>
                      setPostState((p) => ({ ...p, copingCard: { ...p.copingCard, ...upd } }))
                    }
                    onUpdateQAProvocation={(upd) =>
                      setPostState((p) => ({ ...p, qaProvocation: { ...p.qaProvocation, ...upd } }))
                    }
                    onSwipeLeft={() => {
                      if (postState.format === "carousel") {
                        setPostState((p) => ({
                          ...p,
                          carousel: {
                            ...p.carousel,
                            currentSlideIndex: Math.min(
                              p.carousel.slides.length - 1,
                              p.carousel.currentSlideIndex + 1
                            ),
                          },
                        }));
                      }
                    }}
                    onSwipeRight={() => {
                      if (postState.format === "carousel") {
                        setPostState((p) => ({
                          ...p,
                          carousel: {
                            ...p.carousel,
                            currentSlideIndex: Math.max(0, p.carousel.currentSlideIndex - 1),
                          },
                        }));
                      }
                    }}
                  />
                ) : (
                  <GridOverview
                    postState={postState}
                    onSelectSlide={(idx) => {
                      setPostState((p) => ({
                        ...p,
                        carousel: { ...p.carousel, currentSlideIndex: idx },
                      }));
                      setViewMode("single");
                    }}
                    onUpdateSlide={handleUpdateSlide}
                  />
                )}
              </div>

              {/* Bottom Carousel Navigation (If Carousel active) */}
              {postState.format === "carousel" && (
                <div className="mt-6">
                  <SlideNavigation
                    totalSlides={postState.carousel.slides.length}
                    currentIndex={postState.carousel.currentSlideIndex}
                    onSelectIndex={(idx) =>
                      setPostState((p) => ({
                        ...p,
                        carousel: { ...p.carousel, currentSlideIndex: idx },
                      }))
                    }
                    viewMode={viewMode}
                    onToggleViewMode={setViewMode}
                    onOpenPreview={() => setIsDevicePreviewOpen(true)}
                  />
                </div>
              )}
        </main>
      </div>

      {/* Hidden Offscreen Staging Container for 100% Reliable Batch Capture */}
      <div
        className="fixed pointer-events-none"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0",
          width: "540px",
          opacity: 1,
          zIndex: -9999,
        }}
        aria-hidden="true"
      >
        {postState.format === "carousel" ? (
          postState.carousel.slides.map((_, idx) => (
            <div
              key={`staging-slide-${idx}`}
              data-export-staging-slide={idx}
              className="mb-8"
              style={{ width: "540px" }}
            >
              <SlideCanvas
                postState={postState}
                slideIndex={idx}
                isExporting={true}
              />
            </div>
          ))
        ) : (
          <div
            data-export-staging-slide={0}
            style={{ width: "540px" }}
          >
            <SlideCanvas
              postState={postState}
              slideIndex={0}
              isExporting={true}
            />
          </div>
        )}
      </div>

      {/* 4. Modals */}
      <DevicePreviewModal
        isOpen={isDevicePreviewOpen}
        onClose={() => setIsDevicePreviewOpen(false)}
        postState={postState}
      />

      <CaptionModal
        isOpen={isCaptionModalOpen}
        onClose={() => setIsCaptionModalOpen(false)}
        postState={postState}
      />

      <SavedPostsModal
        isOpen={isSavedPostsOpen}
        onClose={() => setIsSavedPostsOpen(false)}
        currentState={postState}
        onLoadState={(loaded) => {
          setPostState(loaded);
          showToast("success", "Projeto carregado com sucesso da biblioteca!");
        }}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        currentUsername={authState.user?.username || "tulio"}
      />

      {/* Onboarding Inicial (Guia de 3 Passos) */}
      <OnboardingTourModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Auditoria Ética Conforme Resolução CFP 010/2005 */}
      <EthicalReviewModal
        isOpen={isEthicalModalOpen}
        issues={detectedEthicalIssues}
        onClose={() => setIsEthicalModalOpen(false)}
        onConfirmExport={() => {
          setIsEthicalModalOpen(false);
          handleBatchExport(true);
        }}
      />

      {/* 5. Toast Notifications */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
              notification.type === "success"
                ? isDark
                  ? "bg-[#18181B] border-[#8B5E3C] text-[#F4F4F5]"
                  : "bg-[#1C1A17] border-[#8B5E3C] text-[#F5F2EC]"
                : "bg-red-900 border-red-500 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <Sparkles className="w-4 h-4 text-[#8B5E3C]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{notification.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
