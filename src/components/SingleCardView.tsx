import React, { useRef, useState } from "react";
import { SingleCardData, PostState } from "../types";
import {
  Quote,
  Copy,
  Check,
  Download,
  Sparkles,
  AlignLeft,
  AlignCenter,
  Image as ImageIcon,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import html2canvas from "html2canvas";

interface SingleCardViewProps {
  singleCard: SingleCardData;
  postState: PostState;
  onUpdateSingleCard: (updated: SingleCardData) => void;
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export const SingleCardView: React.FC<SingleCardViewProps> = ({
  singleCard,
  postState,
  onUpdateSingleCard,
  showToast,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"4:5" | "1:1">("4:5");
  const [align, setAlign] = useState<"left" | "center">("center");

  const palette = postState.palette;
  const brand = postState.brand;

  const handleCopyText = () => {
    const text = `"${singleCard.quote}"\n\n${singleCard.reflection}\n\n— ${brand.name} (${brand.crp})\n${singleCard.subtleTag}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("success", "Frase de impacto copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-res 300 DPI export
        useCORS: true,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `card-impacto-${singleCard.badge.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      showToast("success", "Card de impacto exportado em alta resolução PNG!");
    } catch (err) {
      console.error("Erro ao exportar card:", err);
      showToast("error", "Erro ao exportar a imagem. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header Controls */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#0F3D3B]/10 dark:bg-[#154F4A]/30 text-[#0F3D3B] dark:text-[#5EEAD4]">
            <Quote className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#182625] dark:text-zinc-100 flex items-center gap-2">
              Frase de Impacto & Card Único
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#C9A864]/20 text-[#0F3D3B] dark:text-[#C9A864] border border-[#C9A864]/40">
                Editorial Minimalista
              </span>
            </h2>
            <p className="text-xs text-[#574E45] dark:text-zinc-400">
              Formato de alta densidade reflexiva e compartilhamento orgânico para o feed.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Aspect Ratio Switch */}
          <div className="flex items-center bg-[#F8F7F4] dark:bg-zinc-800 rounded-xl p-1 border border-[#E7E4DC] dark:border-zinc-700 text-xs">
            <button
              type="button"
              onClick={() => setAspectRatio("4:5")}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                aspectRatio === "4:5"
                  ? "bg-[#0F3D3B] text-white"
                  : "text-[#574E45] dark:text-zinc-400"
              }`}
            >
              4:5 Vertical
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio("1:1")}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                aspectRatio === "1:1"
                  ? "bg-[#0F3D3B] text-white"
                  : "text-[#574E45] dark:text-zinc-400"
              }`}
            >
              1:1 Quadrado
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center bg-[#F8F7F4] dark:bg-zinc-800 rounded-xl p-1 border border-[#E7E4DC] dark:border-zinc-700 text-xs">
            <button
              type="button"
              onClick={() => setAlign("center")}
              className={`p-1.5 rounded-lg transition-all ${
                align === "center" ? "bg-[#0F3D3B] text-white" : "text-[#574E45] dark:text-zinc-400"
              }`}
              title="Centralizado"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAlign("left")}
              className={`p-1.5 rounded-lg transition-all ${
                align === "left" ? "bg-[#0F3D3B] text-white" : "text-[#574E45] dark:text-zinc-400"
              }`}
              title="À Esquerda"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-[#182625] dark:text-zinc-200 border border-[#E7E4DC] dark:border-zinc-700 hover:bg-zinc-50 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
          </motion.button>

          {/* Download PNG */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0F3D3B] hover:bg-[#154F4A] text-white transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Gerando..." : "Baixar PNG"}</span>
          </motion.button>
        </div>
      </div>

      {/* Main Grid: Card Canvas + Edit Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Visual Render Preview */}
        <div className="lg:col-span-7 xl:col-span-7 flex justify-center">
          <div
            ref={cardRef}
            className={`w-full max-w-[460px] shadow-2xl rounded-2xl relative overflow-hidden transition-all flex flex-col justify-between p-8 sm:p-10 border ${
              aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
            }`}
            style={{
              backgroundColor: palette.background || "#F8F7F4",
              borderColor: palette.cardBorder || "#E7E4DC",
              color: palette.text || "#182625",
            }}
          >
            {/* Elegant corner accents */}
            <div
              className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 opacity-40 pointer-events-none"
              style={{ borderColor: palette.accent || "#0F3D3B" }}
            />
            <div
              className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 opacity-40 pointer-events-none"
              style={{ borderColor: palette.accent || "#0F3D3B" }}
            />
            <div
              className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 opacity-40 pointer-events-none"
              style={{ borderColor: palette.accent || "#0F3D3B" }}
            />
            <div
              className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 opacity-40 pointer-events-none"
              style={{ borderColor: palette.accent || "#0F3D3B" }}
            />

            {/* Top Badge */}
            <div className={`flex ${align === "center" ? "justify-center" : "justify-start"} items-center pt-2`}>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border"
                style={{
                  backgroundColor: `${palette.accent || "#0F3D3B"}15`,
                  borderColor: `${palette.accent || "#0F3D3B"}35`,
                  color: palette.accent || "#0F3D3B",
                }}
              >
                {singleCard.badge || "REFLEXÃO CLÍNICA"}
              </span>
            </div>

            {/* Middle Quote */}
            <div className={`my-auto space-y-4 ${align === "center" ? "text-center" : "text-left"}`}>
              {/* Quote icon / ornament */}
              <div
                className={`flex ${align === "center" ? "justify-center" : "justify-start"} opacity-80`}
                style={{ color: "#C9A864" }}
              >
                <Quote className="w-8 h-8 rotate-180" />
              </div>

              {/* The Quote Statement */}
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight font-serif tracking-tight"
                style={{ color: palette.text || "#182625" }}
              >
                "{singleCard.quote}"
              </h1>

              {/* Golden divider line */}
              <div
                className={`w-14 h-0.5 my-3 ${align === "center" ? "mx-auto" : ""}`}
                style={{ backgroundColor: "#C9A864" }}
              />

              {/* Reflection note */}
              {singleCard.reflection && (
                <p
                  className="text-xs sm:text-sm font-medium leading-relaxed max-w-md opacity-85"
                  style={{ color: palette.secondaryText || "#4A5A58" }}
                >
                  {singleCard.reflection}
                </p>
              )}
            </div>

            {/* Bottom Author / Brand Info */}
            <div
              className={`pt-4 border-t flex ${
                align === "center" ? "flex-col items-center text-center" : "items-center justify-between"
              } gap-1`}
              style={{ borderColor: `${palette.cardBorder || "#E7E4DC"}90` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: palette.accent || "#0F3D3B" }}
                >
                  ψ
                </div>
                <div>
                  <p className="text-xs font-bold leading-none" style={{ color: palette.text || "#182625" }}>
                    {brand.name || "Seu Nome"}
                  </p>
                  <p className="text-[10px] opacity-75 leading-tight" style={{ color: palette.secondaryText }}>
                    {brand.crp || "Psicólogo(a) Clínico(a)"}
                  </p>
                </div>
              </div>

              {brand.instagram && (
                <span
                  className="text-[11px] font-medium opacity-80 mt-1 sm:mt-0"
                  style={{ color: palette.accent || "#0F3D3B" }}
                >
                  {brand.instagram}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Editor Inputs */}
        <div className="lg:col-span-5 xl:col-span-5 bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E7E4DC] dark:border-[#2E2E33] pb-3">
            <Sparkles className="w-4 h-4 text-[#C9A864]" />
            <h3 className="text-sm font-bold text-[#182625] dark:text-zinc-100">
              Personalizar Conteúdo do Card
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
              Badge / Categoria Superior:
            </label>
            <input
              type="text"
              value={singleCard.badge}
              onChange={(e) => onUpdateSingleCard({ ...singleCard, badge: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
              Frase de Impacto Principal:
            </label>
            <textarea
              value={singleCard.quote}
              onChange={(e) => onUpdateSingleCard({ ...singleCard, quote: e.target.value })}
              rows={4}
              className="w-full text-sm font-semibold p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
              Reflexão ou Desdobramento (1 a 2 linhas):
            </label>
            <textarea
              value={singleCard.reflection}
              onChange={(e) => onUpdateSingleCard({ ...singleCard, reflection: e.target.value })}
              rows={3}
              className="w-full text-xs p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
              Assinatura / Referência Conceitual:
            </label>
            <input
              type="text"
              value={singleCard.authorOrRef}
              onChange={(e) => onUpdateSingleCard({ ...singleCard, authorOrRef: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
