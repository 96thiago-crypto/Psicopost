import React, { useRef, useState } from "react";
import { StoriesSequenceData, StoryCardItem, BrandSettings, ColorPalette } from "../types";
import {
  Smartphone,
  Copy,
  Check,
  Download,
  HelpCircle,
  Sparkles,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import html2canvas from "html2canvas";

interface StoriesSequenceViewProps {
  sequence: StoriesSequenceData;
  brand: BrandSettings;
  palette: ColorPalette;
  onUpdateSequence: (updated: StoriesSequenceData) => void;
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export const StoriesSequenceView: React.FC<StoriesSequenceViewProps> = ({
  sequence,
  brand,
  palette,
  onUpdateSequence,
  showToast,
}) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const storyFrameRef = useRef<HTMLDivElement>(null);

  const screens = sequence.screens || [];
  const currentScreen: StoryCardItem | undefined = screens[activeScreenIndex] || screens[0];

  const handleCopySingle = () => {
    if (!currentScreen) return;
    const text = `📱 STORY ${currentScreen.stepNumber} • ${currentScreen.tag}
Título: ${currentScreen.title}
${currentScreen.subtitle ? `Subtítulo: ${currentScreen.subtitle}\n` : ""}
Conteúdo:
${currentScreen.bodyText}

[FIGURINHA / ADESIVO]: ${currentScreen.stickerQuestion}
${currentScreen.stickerOptions ? `Opções: ${currentScreen.stickerOptions.join(" | ")}` : ""}

💡 Dica de Gravação: ${currentScreen.speakerNote}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("success", `Story ${currentScreen.stepNumber} copiado!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `SEQUÊNCIA DE STORIES (4 TELAS DE ENGAJAMENTO CLÍNICO)
Tema: ${sequence.theme}
Objetivo: ${sequence.objective}
Profissional: ${brand.name} (${brand.crp})

` + screens.map((s) => `--- TELA ${s.stepNumber}: ${s.tag} ---
Título: ${s.title}
${s.subtitle ? `Subtítulo: ${s.subtitle}\n` : ""}${s.bodyText}

[FIGURINHA INSTAGRAM]: ${s.stickerQuestion}
${s.stickerOptions ? `Opções: ${s.stickerOptions.join(" / ")}\n` : ""}
💡 Bastidor de Gravação: ${s.speakerNote}
`).join("\n\n");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast("success", "Sequência completa de 4 Stories copiada!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadStoryPng = async () => {
    if (!storyFrameRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(storyFrameRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `story-${currentScreen?.stepNumber || 1}-${sequence.theme.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      showToast("success", `Story ${currentScreen?.stepNumber} baixado em PNG 9:16!`);
    } catch (err) {
      console.error(err);
      showToast("error", "Erro ao exportar Story em PNG.");
    } finally {
      setIsExporting(false);
    }
  };

  const updateCurrentScreenField = (field: keyof StoryCardItem, value: any) => {
    if (!currentScreen) return;
    const updatedScreens = [...screens];
    updatedScreens[activeScreenIndex] = {
      ...currentScreen,
      [field]: value,
    };
    onUpdateSequence({ ...sequence, screens: updatedScreens });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header bar */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#0F3D3B]/10 dark:bg-[#154F4A]/30 text-[#0F3D3B] dark:text-[#5EEAD4]">
            <Smartphone className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#182625] dark:text-zinc-100 flex items-center gap-2">
              Sequência de Stories & Caixinha
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#C9A864]/20 text-[#0F3D3B] dark:text-[#C9A864] border border-[#C9A864]/40">
                4 Telas Interativas (9:16)
              </span>
            </h2>
            <p className="text-xs text-[#574E45] dark:text-zinc-400">
              Jornada de engajamento reflexivo: Quebra de padrão ➔ Identificação ➔ Caixinha ➔ Condução ética à bio.
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleCopySingle}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-[#182625] dark:text-zinc-200 border border-[#E7E4DC] dark:border-zinc-700 hover:bg-zinc-50 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar Tela Atual</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyAll}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0F3D3B] hover:bg-[#154F4A] text-white transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Copiado!" : "Copiar Todas (4)"}</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadStoryPng}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#C9A864] hover:bg-[#B89753] text-[#0F3D3B] transition-all font-bold disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Exportando..." : "Baixar Tela PNG"}</span>
          </motion.button>
        </div>
      </div>

      {/* Screen step tabs (1, 2, 3, 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {screens.map((sc, idx) => {
          const isActive = idx === activeScreenIndex;
          return (
            <button
              key={sc.id || idx}
              type="button"
              onClick={() => setActiveScreenIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all tap-subtle cursor-pointer ${
                isActive
                  ? "bg-[#0F3D3B] text-white border-[#0F3D3B] shadow-sm"
                  : "bg-white dark:bg-[#18181B] border-[#E7E4DC] dark:border-[#2E2E33] text-[#574E45] dark:text-zinc-300 hover:border-[#0F3D3B]/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#C9A864]" : "text-[#0F3D3B] dark:text-[#5EEAD4]"}`}>
                  Tela 0{idx + 1}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${isActive ? "bg-white/15 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                  {sc.type}
                </span>
              </div>
              <p className="text-xs font-semibold line-clamp-1">
                {sc.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Grid: 9:16 Interactive Canvas Preview + Step Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 9:16 Story Frame Canvas */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
          <div
            ref={storyFrameRef}
            className="w-full max-w-[340px] aspect-[9/16] rounded-[32px] p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden border-2"
            style={{
              backgroundColor: palette.background || "#F8F7F4",
              borderColor: palette.cardBorder || "#E7E4DC",
              color: palette.text || "#182625",
            }}
          >
            {/* Top Instagram Story Progress Bars (4 dashes) */}
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i <= activeScreenIndex ? "bg-[#0F3D3B] dark:bg-[#C9A864]" : "bg-[#0F3D3B]/20 dark:bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* User profile header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: palette.accent || "#0F3D3B" }}
                  >
                    ψ
                  </div>
                  <div>
                    <span className="text-xs font-bold leading-none block" style={{ color: palette.text }}>
                      {brand.instagram || brand.name || "seu.perfil"}
                    </span>
                    <span className="text-[10px] opacity-60">agora</span>
                  </div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${palette.accent || "#0F3D3B"}15`,
                    color: palette.accent || "#0F3D3B",
                  }}
                >
                  {currentScreen?.tag || "STORY INTERATIVO"}
                </span>
              </div>
            </div>

            {/* Middle Content */}
            <div className="my-auto space-y-4 text-center px-1">
              <h2
                className="text-lg sm:text-xl font-bold font-serif leading-snug"
                style={{ color: palette.text }}
              >
                {currentScreen?.title}
              </h2>

              {currentScreen?.subtitle && (
                <p
                  className="text-xs font-medium opacity-80"
                  style={{ color: palette.secondaryText }}
                >
                  {currentScreen.subtitle}
                </p>
              )}

              {/* Body Text Box */}
              <div
                className="p-3.5 rounded-2xl text-xs font-medium leading-relaxed text-left whitespace-pre-line border shadow-xs"
                style={{
                  backgroundColor: palette.cardBg || "#FFFFFF",
                  borderColor: palette.cardBorder || "#E7E4DC",
                  color: palette.text,
                }}
              >
                {currentScreen?.bodyText}
              </div>

              {/* Native Instagram Sticker Simulation */}
              {currentScreen?.stickerType === "enquete" && (
                <div className="p-3 bg-white/95 dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700 space-y-2 text-center">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    {currentScreen.stickerQuestion}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(currentScreen.stickerOptions || ["Sim", "Não"]).map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className="py-2 px-1 text-[11px] font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentScreen?.stickerType === "caixinha" && (
                <div className="bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 p-3 rounded-2xl border border-pink-400/40 shadow-md space-y-2 text-center">
                  <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-white dark:bg-zinc-800 text-pink-600 shadow-xs">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    {currentScreen.stickerQuestion}
                  </span>
                  <div className="py-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 text-[11px] border border-zinc-200 dark:border-zinc-700">
                    Toque para responder...
                  </div>
                </div>
              )}

              {currentScreen?.stickerType === "link" && (
                <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0F3D3B] text-[#FFFFFF] text-xs font-bold shadow-lg border border-[#C9A864]/50">
                  <ExternalLink className="w-3.5 h-3.5 text-[#C9A864]" />
                  <span>{currentScreen.stickerQuestion}</span>
                </div>
              )}

              {currentScreen?.stickerType === "termometro" && (
                <div className="p-3 bg-white/95 dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-center">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    {currentScreen.stickerQuestion}
                  </span>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full relative flex items-center px-1">
                    <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs shadow-md mx-auto">
                      ❤️
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom reply footer */}
            <div className="pt-3 border-t flex items-center justify-between text-xs opacity-75" style={{ borderColor: `${palette.cardBorder}80` }}>
              <span>Responder a {brand.instagram || "você"}...</span>
              <div className="flex items-center gap-2">
                <span>🤍</span>
                <span>✈️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Screen Content Editor & Speaker Notes */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DC] dark:border-[#2E2E33] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A864]" />
                <h3 className="text-sm font-bold text-[#182625] dark:text-zinc-100">
                  Editar Conteúdo do Story {currentScreen?.stepNumber}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  disabled={activeScreenIndex === 0}
                  onClick={() => setActiveScreenIndex((prev) => Math.max(0, prev - 1))}
                  className="p-1 rounded-lg border border-[#E7E4DC] dark:border-zinc-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-[#574E45] dark:text-zinc-400 px-2">
                  {activeScreenIndex + 1} de {screens.length}
                </span>
                <button
                  type="button"
                  disabled={activeScreenIndex === screens.length - 1}
                  onClick={() => setActiveScreenIndex((prev) => Math.min(screens.length - 1, prev + 1))}
                  className="p-1 rounded-lg border border-[#E7E4DC] dark:border-zinc-700 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
                Título do Story:
              </label>
              <input
                type="text"
                value={currentScreen?.title || ""}
                onChange={(e) => updateCurrentScreenField("title", e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
                Texto Principal do Story:
              </label>
              <textarea
                value={currentScreen?.bodyText || ""}
                onChange={(e) => updateCurrentScreenField("bodyText", e.target.value)}
                rows={4}
                className="w-full text-xs p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
                Texto do Adesivo / Enquete / Caixinha:
              </label>
              <input
                type="text"
                value={currentScreen?.stickerQuestion || ""}
                onChange={(e) => updateCurrentScreenField("stickerQuestion", e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#0F3D3B] dark:text-[#93C5BD]"
              />
            </div>

            {/* Speaker Note */}
            <div className="p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F3D3B] dark:text-[#5EEAD4]">
                <HelpCircle className="w-3.5 h-3.5 text-[#C9A864]" />
                <span>Dica de Gravação & Bastidor Clínico:</span>
              </div>
              <textarea
                value={currentScreen?.speakerNote || ""}
                onChange={(e) => updateCurrentScreenField("speakerNote", e.target.value)}
                rows={2}
                className="w-full text-xs bg-transparent border-none focus:outline-hidden text-[#574E45] dark:text-zinc-300 italic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
