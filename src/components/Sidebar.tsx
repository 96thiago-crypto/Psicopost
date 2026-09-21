import React, { useState, useEffect } from "react";
import {
  PostState,
  ColorPalette,
  FontScale,
  TextAlignment,
  CanvasTexture,
} from "../types";
import {
  CLINICAL_PALETTES,
  AVAILABLE_FONTS,
} from "../data/clinicalTemplates";
import {
  Sparkles,
  Palette,
  Award,
  Upload,
  Check,
  BookOpen,
  Bookmark,
  Lock,
  Target,
  Wand2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Zap,
  FileText,
  Smartphone,
} from "lucide-react";

interface SidebarProps {
  postState: PostState;
  onUpdatePostState: (updater: (prev: PostState) => PostState) => void;
  onGenerateAI: (
    theme: string,
    approach: string,
    tone: string,
    textDensity?: string,
    customInst?: string
  ) => Promise<void>;
  isAILoading: boolean;
  onChangePasswordClick: () => void;
  onOpenSavedPosts?: () => void;
}

const APPROACH_OPTIONS = [
  {
    id: "TCC (Terapia Cognitivo-Comportamental)",
    label: "TCC (Beck)",
    icon: "🧠",
  },
  {
    id: "Psicanálise / Psicanalítica (Freud & Lacan)",
    label: "Psicanálise",
    icon: "🛋️",
  },
  {
    id: "ACP (Abordagem Centrada na Pessoa - Carl Rogers)",
    label: "ACP (Rogers)",
    icon: "🌿",
  },
  {
    id: "Gestalt-Terapia",
    label: "Gestalt",
    icon: "👁️",
  },
];

const QUICK_TOPICS = [
  "Autocrítica e Perfeccionismo",
  "Ansiedade e Excesso de Futuro",
  "Limites Saudáveis nas Relações",
  "Sensação de Insuficiência",
];

const TONE_OPTIONS = [
  "Clínico e Empático",
  "Didático e Acolhedor",
  "Reflexivo e Profundo",
  "Direto e Prático",
];

export const Sidebar: React.FC<SidebarProps> = ({
  postState,
  onUpdatePostState,
  onGenerateAI,
  isAILoading,
  onChangePasswordClick,
  onOpenSavedPosts,
}) => {
  const [activeTab, setActiveTab] = useState<"ai" | "design" | "brand">("ai");
  const [themeInput, setThemeInput] = useState(postState.themeTitle || "");
  const [selectedApproach, setSelectedApproach] = useState(
    "TCC (Terapia Cognitivo-Comportamental)"
  );
  const [selectedTone, setSelectedTone] = useState("Clínico e Empático");
  const [selectedDensity, setSelectedDensity] = useState<"concise" | "balanced" | "detailed">(
    postState.textDensity || "balanced"
  );
  const [customInstructions, setCustomInstructions] = useState("");

  // Cover hooks generation state
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<any[] | null>(null);
  const [hookErrorMsg, setHookErrorMsg] = useState<string | null>(null);
  const [appliedHookIndex, setAppliedHookIndex] = useState<number | null>(null);
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false);

  // Sync themeInput if postState.themeTitle changes from outside
  useEffect(() => {
    if (postState.themeTitle && postState.themeTitle !== themeInput) {
      setThemeInput(postState.themeTitle);
    }
  }, [postState.themeTitle]);

  const handleGenerateCoverHooks = async () => {
    const effectiveTheme = themeInput.trim() || postState.themeTitle || "Autoaceitação e Saúde Mental";
    setIsGeneratingHooks(true);
    setHookErrorMsg(null);

    try {
      const res = await fetch("/api/ai/cover-hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: effectiveTheme,
          approach: selectedApproach,
          tone: selectedTone,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.variations) {
        setGeneratedHooks(json.data.variations);
      } else {
        setHookErrorMsg(json.error || "Não foi possível gerar os ganchos. Tente novamente.");
      }
    } catch (err: any) {
      setHookErrorMsg(err?.message || "Erro ao conectar com o serviço de IA.");
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const handleApplyHook = (hook: any, index: number) => {
    onUpdatePostState((prev) => {
      if (prev.format === "carousel") {
        const updatedSlides = [...prev.carousel.slides];
        if (updatedSlides.length > 0) {
          updatedSlides[0] = {
            ...updatedSlides[0],
            title: hook.title,
            subtitle: hook.subtitle,
            badge: hook.badge || updatedSlides[0].badge,
          };
        }
        return {
          ...prev,
          themeTitle: hook.title,
          carousel: {
            ...prev.carousel,
            mainTitle: hook.title,
            slides: updatedSlides,
            currentSlideIndex: 0,
          },
        };
      }
      return {
        ...prev,
        themeTitle: hook.title,
      };
    });
    setAppliedHookIndex(index);
    setTimeout(() => setAppliedHookIndex(null), 2000);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpdatePostState((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          avatarBase64: base64,
          showAvatar: true,
        },
      }));
      setAvatarUploadSuccess(true);
      setTimeout(() => setAvatarUploadSuccess(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside
      id="sidebar-panel"
      className="w-full lg:w-96 bg-[#F5F2EC] border-r border-[#D4CDBA] flex flex-col h-full shrink-0 shadow-sm z-20"
    >
      {/* Tab Navigation */}
      <nav className="flex border-b border-[#D4CDBA] bg-[#FAF7F2] shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "ai"
              ? "border-b-2 border-[#8B5E3C] bg-white text-[#8B5E3C] shadow-2xs"
              : "text-[#78716C] hover:bg-white/50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Conteúdo & IA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("design")}
          className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "design"
              ? "border-b-2 border-[#8B5E3C] bg-white text-[#8B5E3C] shadow-2xs"
              : "text-[#78716C] hover:bg-white/50"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Visual & Cores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brand")}
          className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "brand"
              ? "border-b-2 border-[#8B5E3C] bg-white text-[#8B5E3C] shadow-2xs"
              : "text-[#78716C] hover:bg-white/50"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Meu Perfil</span>
        </button>
      </nav>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#1C1A17] custom-scrollbar">
        {/* ================= ABA 1: CONTEÚDO & IA ================= */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            {/* Abordagem Teórica */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-2">
              <label className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Abordagem Psicológica
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {APPROACH_OPTIONS.map((app) => {
                  const isSelected = selectedApproach === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedApproach(app.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-xs"
                          : "bg-[#FAF7F2] text-[#574E45] border-[#D4CDBA] hover:border-[#8B5E3C]"
                      }`}
                    >
                      <span className="text-sm">{app.icon}</span>
                      <span className="truncate">{app.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tema ou Pergunta Disparadora */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1C1A17]">
                  Tema ou Pergunta do Post
                </label>
                <span className="text-[10px] text-[#78716C]">
                  Clínico e reflexivo
                </span>
              </div>

              <textarea
                rows={2}
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                placeholder="Ex: Por que a culpa aparece quando finalmente decidimos descansar?"
                className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl p-2.5 text-xs text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] resize-none"
              />

              {/* Sugestões Rápidas de 1 Clique */}
              <div>
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block mb-1.5">
                  Sugestões Rápidas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setThemeInput(topic)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E8E3D8] border border-[#D4CDBA] text-[11px] text-[#574E45] transition cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tom e Densidade */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider mb-1">
                    Tom de Voz
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-2 py-1.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                  >
                    {TONE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider mb-1">
                    Texto por Slide
                  </label>
                  <select
                    value={selectedDensity}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setSelectedDensity(val);
                      onUpdatePostState((prev) => ({ ...prev, textDensity: val }));
                    }}
                    className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-2 py-1.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                  >
                    <option value="concise">Conciso (rápido)</option>
                    <option value="balanced">Equilibrado (padrão)</option>
                    <option value="detailed">Aprofundado (mais texto)</option>
                  </select>
                </div>
              </div>

              {/* Instrução extra opcional */}
              <div>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Instrução adicional opcional (ex: citar Jung...)"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-2.5 py-1.5 text-[11px] text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
            </div>

            {/* Botão de Destaque: Gerar Post com IA */}
            <button
              type="button"
              onClick={() =>
                onGenerateAI(
                  themeInput || "O Paradoxo da Autoaceitação e o Crescimento Pessoal",
                  selectedApproach,
                  selectedTone,
                  selectedDensity,
                  customInstructions
                )
              }
              disabled={isAILoading}
              className="w-full py-3.5 px-4 bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold rounded-xl text-xs sm:text-sm tracking-wide transition shadow-md shadow-[#8B5E3C]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAILoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Criando Post com IA Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Post com IA ({selectedApproach.split(" ")[0]})</span>
                </>
              )}
            </button>

            {/* Alternativas de Título de Capa (Headlines) */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  Títulos Alternativos para a Capa
                </span>
              </div>

              <button
                type="button"
                onClick={handleGenerateCoverHooks}
                disabled={isGeneratingHooks}
                className="w-full py-2 px-3 bg-[#FAF7F2] hover:bg-[#E8E3D8] text-[#8B5E3C] border border-[#8B5E3C]/40 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition disabled:opacity-50"
              >
                {isGeneratingHooks ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin" />
                    <span>Criando 3 títulos...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Sugerir 3 Variações de Título</span>
                  </>
                )}
              </button>

              {hookErrorMsg && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                  {hookErrorMsg}
                </div>
              )}

              {generatedHooks && generatedHooks.length > 0 && (
                <div className="space-y-2 pt-1">
                  {generatedHooks.map((hook, idx) => {
                    const isApplied = appliedHookIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#1C1A17] leading-snug">
                            "{hook.title}"
                          </p>
                          {hook.subtitle && (
                            <p className="text-[10px] text-[#78716C] truncate mt-0.5">
                              {hook.subtitle}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyHook(hook, idx)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer ${
                            isApplied
                              ? "bg-emerald-600 text-white"
                              : "bg-[#8B5E3C] hover:bg-[#724C30] text-white"
                          }`}
                        >
                          {isApplied ? "Aplicado!" : "Usar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ABA 2: VISUAL & CORES ================= */}
        {activeTab === "design" && (
          <div className="space-y-4">
            {/* Proporções Oficiais do Instagram */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Proporções Oficiais do Instagram
              </label>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "4:5", label: "4:5 Retrato", px: "1080 × 1350", desc: "Padrão Feed" },
                  { id: "1:1", label: "1:1 Quadrado", px: "1080 × 1080", desc: "Feed Clássico" },
                  { id: "9:16", label: "9:16 Stories", px: "1080 × 1920", desc: "Stories/Reels" },
                ].map((fmt) => {
                  const isSelected = postState.aspectRatio === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() =>
                        onUpdatePostState((prev) => ({
                          ...prev,
                          aspectRatio: fmt.id as any,
                        }))
                      }
                      className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                        isSelected
                          ? "bg-[#FAF7F2] border-[#8B5E3C] ring-1 ring-[#8B5E3C]"
                          : "bg-white border-[#D4CDBA] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <span className={`text-[11px] font-bold ${isSelected ? "text-[#8B5E3C]" : "text-[#1C1A17]"}`}>
                        {fmt.label}
                      </span>
                      <span className="text-[9px] text-[#78716C] mt-0.5 font-mono">
                        {fmt.px}
                      </span>
                      <span className="text-[8.5px] text-[#A8A29E] mt-0.5">
                        {fmt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paletas Clínicas Harmonizadas */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-2.5">
              <label className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Paleta de Cores do Post
              </label>

              <div className="grid grid-cols-1 gap-2">
                {CLINICAL_PALETTES.map((pal) => {
                  const isSelected = postState.palette.id === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => onUpdatePostState((prev) => ({ ...prev, palette: pal }))}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF7F2] border-[#8B5E3C] ring-1 ring-[#8B5E3C]"
                          : "bg-white border-[#D4CDBA] hover:bg-[#FAF7F2]"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#1C1A17] block">
                          {pal.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: pal.background }}
                            title="Fundo"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: pal.cardBg }}
                            title="Cartão"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: pal.accent }}
                            title="Destaque"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: pal.text }}
                            title="Texto"
                          />
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#8B5E3C]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tipografia */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-3">
              <label className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Tipografia & Alinhamento
              </label>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider block mb-1">
                  Fonte dos Títulos
                </span>
                <select
                  value={postState.typography.titleFont}
                  onChange={(e) =>
                    onUpdatePostState((prev) => ({
                      ...prev,
                      typography: { ...prev.typography, titleFont: e.target.value },
                    }))
                  }
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-2.5 py-1.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                >
                  {AVAILABLE_FONTS.map((f) => (
                    <option key={f.id} value={f.fontFamily}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Escala e Alinhamento */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider block mb-1">
                    Tamanho
                  </span>
                  <div className="flex rounded-xl border border-[#D4CDBA] bg-[#FAF7F2] p-0.5">
                    {(["small", "normal", "large"] as FontScale[]).map((sc) => (
                      <button
                        key={sc}
                        type="button"
                        onClick={() =>
                          onUpdatePostState((prev) => ({
                            ...prev,
                            typography: { ...prev.typography, fontScale: sc },
                          }))
                        }
                        className={`flex-1 py-1 text-center text-[10px] font-bold rounded-lg transition cursor-pointer ${
                          postState.typography.fontScale === sc
                            ? "bg-[#8B5E3C] text-white"
                            : "text-[#78716C] hover:text-[#1C1A17]"
                        }`}
                      >
                        {sc === "small" ? "P" : sc === "normal" ? "M" : "G"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider block mb-1">
                    Alinhamento
                  </span>
                  <div className="flex rounded-xl border border-[#D4CDBA] bg-[#FAF7F2] p-0.5">
                    {[
                      { id: "left", icon: AlignLeft },
                      { id: "center", icon: AlignCenter },
                      { id: "right", icon: AlignRight },
                    ].map((al) => {
                      const Icon = al.icon;
                      return (
                        <button
                          key={al.id}
                          type="button"
                          onClick={() =>
                            onUpdatePostState((prev) => ({
                              ...prev,
                              typography: { ...prev.typography, alignment: al.id as any },
                            }))
                          }
                          className={`flex-1 py-1 flex items-center justify-center rounded-lg transition cursor-pointer ${
                            postState.typography.alignment === al.id
                              ? "bg-[#8B5E3C] text-white"
                              : "text-[#78716C] hover:text-[#1C1A17]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Textura do Post */}
            <div className="bg-white border border-[#D4CDBA] p-3 rounded-2xl shadow-2xs space-y-2">
              <span className="text-xs font-bold text-[#1C1A17] block">
                Textura do Fundo
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "none", label: "Liso / Clean", icon: "✨" },
                  { id: "grain", label: "Grão Suave", icon: "🎞️" },
                  { id: "paper", label: "Papel Editorial", icon: "📜" },
                  { id: "warm-linen", label: "Linho Têxtil", icon: "🧵" },
                ].map((item) => {
                  const isSelected = (postState.texture || "none") === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        onUpdatePostState((prev) => ({
                          ...prev,
                          texture: item.id as CanvasTexture,
                        }))
                      }
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF7F2] border-[#8B5E3C] text-[#8B5E3C] ring-1 ring-[#8B5E3C]"
                          : "bg-white border-[#D4CDBA] text-[#574E45] hover:border-[#8B5E3C]"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 3: MEU PERFIL ================= */}
        {activeTab === "brand" && (
          <div className="space-y-4">
            {/* Foto ou Logo */}
            <div className="bg-white border border-[#D4CDBA] p-3.5 rounded-2xl shadow-2xs space-y-3">
              <span className="text-xs font-bold text-[#1C1A17] block">
                Foto de Perfil ou Logo
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#8B5E3C] bg-[#FAF7F2] overflow-hidden flex items-center justify-center shrink-0">
                  {postState.brand.avatarBase64 ? (
                    <img
                      src={postState.brand.avatarBase64}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-5 h-5 text-[#8B5E3C]" />
                  )}
                </div>

                <div className="flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#E8E3D8] border border-[#D4CDBA] rounded-xl text-xs font-semibold text-[#1C1A17] cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-[#8B5E3C]" />
                    <span>Trocar Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </label>
                  {avatarUploadSuccess && (
                    <span className="text-[11px] text-emerald-600 block mt-1 font-semibold">
                      Foto atualizada!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="bg-white border border-[#D4CDBA] p-3.5 rounded-2xl shadow-2xs space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider mb-1">
                  Nome do Profissional
                </label>
                <input
                  type="text"
                  value={postState.brand.name}
                  onChange={(e) =>
                    onUpdatePostState((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, name: e.target.value },
                    }))
                  }
                  placeholder="Ex: Dra. Ana Moura"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider mb-1">
                  Assinatura / Especialidade
                </label>
                <input
                  type="text"
                  value={postState.brand.signature}
                  onChange={(e) =>
                    onUpdatePostState((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, signature: e.target.value },
                    }))
                  }
                  placeholder="Ex: Psicóloga Clínica • TCC"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider mb-1">
                  Registro Profissional (CRP)
                </label>
                <input
                  type="text"
                  value={postState.brand.crp}
                  onChange={(e) =>
                    onUpdatePostState((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, crp: e.target.value },
                    }))
                  }
                  placeholder="Ex: CRP 02/12345"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#78716C] tracking-wider mb-1">
                  @ do Instagram
                </label>
                <input
                  type="text"
                  value={postState.brand.instagram}
                  onChange={(e) =>
                    onUpdatePostState((prev) => ({
                      ...prev,
                      brand: { ...prev.brand, instagram: e.target.value },
                    }))
                  }
                  placeholder="Ex: @dra.anapsi"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>
            </div>

            {/* Elementos Visíveis no Rodapé */}
            <div className="bg-white border border-[#D4CDBA] p-3.5 rounded-2xl shadow-2xs space-y-2">
              <span className="text-xs font-bold text-[#1C1A17] block mb-1">
                Elementos Visíveis no Rodapé
              </span>
              {[
                { key: "showAvatar", label: "Foto / Logo de Perfil" },
                { key: "showInstagram", label: "@ do Instagram" },
                { key: "showCrp", label: "CRP e Especialidade" },
                { key: "showSlideNumber", label: "Contador de Slides (01/07)" },
              ].map((tog) => (
                <label
                  key={tog.key}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] text-xs text-[#1C1A17] cursor-pointer select-none"
                >
                  <span>{tog.label}</span>
                  <input
                    type="checkbox"
                    checked={(postState.brand as any)[tog.key]}
                    onChange={(e) =>
                      onUpdatePostState((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, [tog.key]: e.target.checked },
                      }))
                    }
                    className="w-4 h-4 rounded border-[#D4CDBA] text-[#8B5E3C] focus:ring-[#8B5E3C] accent-[#8B5E3C]"
                  />
                </label>
              ))}
            </div>

            {/* Ações de Conta & Rascunhos */}
            <div className="space-y-2 pt-1">
              {onOpenSavedPosts && (
                <button
                  type="button"
                  onClick={onOpenSavedPosts}
                  className="w-full py-2.5 px-3 bg-white hover:bg-[#FAF7F2] border border-[#8B5E3C]/40 text-[#8B5E3C] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Ver Meus Posts & Rascunhos Salvos</span>
                </button>
              )}

              <button
                type="button"
                onClick={onChangePasswordClick}
                className="w-full py-2.5 px-3 bg-white hover:bg-[#FAF7F2] border border-[#D4CDBA] text-[#574E45] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Alterar Senha de Acesso</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
