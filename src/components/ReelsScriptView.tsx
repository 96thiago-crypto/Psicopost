import React, { useState } from "react";
import { ReelsScriptData, BrandSettings } from "../types";
import {
  Video,
  Copy,
  Check,
  Download,
  Clock,
  Music,
  Eye,
  Camera,
  MessageSquare,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReelsScriptViewProps {
  script: ReelsScriptData;
  themeTitle: string;
  brand: BrandSettings;
  onUpdateScript: (updated: ReelsScriptData) => void;
  showToast: (type: "success" | "error" | "info", msg: string) => void;
}

export const ReelsScriptView: React.FC<ReelsScriptViewProps> = ({
  script,
  themeTitle,
  brand,
  onUpdateScript,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState<"md" | "lg" | "xl">("lg");
  const [simulatorActive, setSimulatorActive] = useState(false);

  // Word count & speech duration estimate
  const wordsCount = (script.teleprompterScript || "").trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((wordsCount / 130) * 60) + 5; // average conversational pace in Portuguese

  const handleCopyFullScript = () => {
    const fullText = `🎬 ROTEIRO DE REELS / VÍDEO CURTO
Tema: ${themeTitle}
Psicólogo(a): ${brand.name} (${brand.crp})

⏱️ GANCHO VISUAL (PRIMEIROS 3 SEGUNDOS):
${script.hookVisual3s}

🗣️ FALA INICIAL (0-3s):
"${script.hookAudioSpeech}"

📜 ROTEIRO DE FALA (TELEPROMPTER):
${script.teleprompterScript}

🎥 SUGESTÕES DE CORTES / CENAS:
${script.visualDirections.map((d, i) => `${i + 1}. ${d}`).join("\n")}

🤍 CTA SUTIL (CHAMADA ÉTICA):
"${script.subtleCta}"

🎵 ÁUDIO & AMBIENTAÇÃO:
${script.audioVibe}
Duração Estimada: ~${estimatedSeconds} segundos`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast("success", "Roteiro de Reels completo copiado com sucesso!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const fullText = `ROTEIRO DE REELS - ${themeTitle}
Profissional: ${brand.name} | ${brand.crp}

GANCHO VISUAL (3s):
${script.hookVisual3s}

FALA INICIAL:
${script.hookAudioSpeech}

ROTEIRO COMPLETO DE FALA:
${script.teleprompterScript}

DIREÇÕES DE GRAVAÇÃO:
${script.visualDirections.join("\n")}

CTA ÉTICO:
${script.subtleCta}

ÁUDIO:
${script.audioVibe}
`;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roteiro-reels-${themeTitle.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("info", "Arquivo de roteiro TXT baixado.");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header bar */}
      <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F3D3B]/10 dark:bg-[#154F4A]/30 text-[#0F3D3B] dark:text-[#5EEAD4]">
              <Video className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#182625] dark:text-zinc-100 flex items-center gap-2">
                Roteiro de Reels & Vídeo Curto
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#C9A864]/20 text-[#0F3D3B] dark:text-[#C9A864] border border-[#C9A864]/40">
                  Formato 9:16
                </span>
              </h2>
              <p className="text-xs text-[#574E45] dark:text-zinc-400">
                Estruturado para reter a atenção nos primeiros 3 segundos e conduzir a reflexão ética com naturalidade.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setSimulatorActive(!simulatorActive)}
            className={`flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              simulatorActive
                ? "bg-[#0F3D3B] text-white border-[#0F3D3B]"
                : "bg-white dark:bg-zinc-800 text-[#182625] dark:text-zinc-200 border-[#E7E4DC] dark:border-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{simulatorActive ? "Ocultar Simulador 9:16" : "Simulador 9:16"}</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setTeleprompterOpen(true)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 text-[#182625] dark:text-zinc-200 border border-[#E7E4DC] dark:border-zinc-700 hover:bg-zinc-50 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Teleprompter</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyFullScript}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0F3D3B] hover:bg-[#154F4A] text-white transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copiado!" : "Copiar Roteiro"}</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadTxt}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-[#E7E4DC] dark:border-zinc-700 transition-colors"
            title="Baixar em arquivo TXT"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Main Grid: Content + Simulator */}
      <div className={`grid grid-cols-1 ${simulatorActive ? "lg:grid-cols-12" : ""} gap-5`}>
        {/* Left column: Script sections */}
        <div className={`space-y-4 ${simulatorActive ? "lg:col-span-7 xl:col-span-8" : "w-full"}`}>
          {/* 1. Hook Visual & Audio 3s Box */}
          <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border-2 border-[#C9A864]/50 dark:border-[#C9A864]/40 p-4 sm:p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#C9A864] text-[#0F3D3B] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Primeiros 3 Segundos
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-[#0F3D3B] dark:text-[#5EEAD4]" />
              <h3 className="text-sm font-bold text-[#182625] dark:text-zinc-100">
                1. Gancho Visual & Fala de Abertura (0 a 3s)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
                  Direção Cênica / O que mostrar na tela (Gesto, Enquadramento & Texto):
                </label>
                <textarea
                  value={script.hookVisual3s}
                  onChange={(e) => onUpdateScript({ ...script, hookVisual3s: e.target.value })}
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] focus:border-[#0F3D3B] dark:focus:border-[#5EEAD4] focus:outline-hidden transition-all text-[#182625] dark:text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#574E45] dark:text-zinc-400 mb-1">
                  Fala de Abertura Imediata (Áudio inicial que quebra o padrão):
                </label>
                <input
                  type="text"
                  value={script.hookAudioSpeech}
                  onChange={(e) => onUpdateScript({ ...script, hookAudioSpeech: e.target.value })}
                  className="w-full text-xs font-semibold p-3 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] focus:border-[#0F3D3B] dark:focus:border-[#5EEAD4] focus:outline-hidden transition-all text-[#0F3D3B] dark:text-[#93C5BD]"
                />
              </div>
            </div>
          </div>

          {/* 2. Teleprompter Speech Script */}
          <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0F3D3B] dark:text-[#5EEAD4]" />
                <h3 className="text-sm font-bold text-[#182625] dark:text-zinc-100">
                  2. Roteiro de Fala Completo
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#574E45] dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C9A864]" />
                  ~{estimatedSeconds}s de fala ({wordsCount} palavras)
                </span>
              </div>
            </div>

            <p className="text-xs text-[#574E45] dark:text-zinc-400">
              Dica clínica: Faça pausas de 1 segundo nas quebras de linha para permitir que o ouvinte processe a reflexão.
            </p>

            <textarea
              value={script.teleprompterScript}
              onChange={(e) => onUpdateScript({ ...script, teleprompterScript: e.target.value })}
              rows={8}
              className="w-full text-sm font-medium leading-relaxed p-3.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] focus:border-[#0F3D3B] dark:focus:border-[#5EEAD4] focus:outline-hidden transition-all text-[#182625] dark:text-zinc-200 custom-scrollbar"
            />
          </div>

          {/* 3. Visual Directions & Suggested Cuts */}
          <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A864]" />
              <h3 className="text-sm font-bold text-[#182625] dark:text-zinc-100">
                3. Tomadas e Cortes Sugeridos para Gravação
              </h3>
            </div>
            <div className="space-y-2">
              {script.visualDirections.map((dir, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-[#F8F7F4] dark:bg-[#232328] rounded-xl border border-[#E7E4DC] dark:border-[#2E2E33]"
                >
                  <span className="text-xs font-bold w-5 h-5 rounded-full bg-[#0F3D3B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={dir}
                    onChange={(e) => {
                      const updated = [...script.visualDirections];
                      updated[idx] = e.target.value;
                      onUpdateScript({ ...script, visualDirections: updated });
                    }}
                    className="flex-1 text-xs bg-transparent border-none focus:outline-hidden text-[#182625] dark:text-zinc-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Subtle Ethical CTA & Audio vibe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182625] dark:text-zinc-100">
                <MessageSquare className="w-3.5 h-3.5 text-[#0F3D3B] dark:text-[#5EEAD4]" />
                <span>Chamada de Ação Ética (CTA Sutil)</span>
              </div>
              <textarea
                value={script.subtleCta}
                onChange={(e) => onUpdateScript({ ...script, subtleCta: e.target.value })}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200"
              />
            </div>

            <div className="bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182625] dark:text-zinc-100">
                <Music className="w-3.5 h-3.5 text-[#C9A864]" />
                <span>Trilha Sonora & Tom Recomendado</span>
              </div>
              <textarea
                value={script.audioVibe}
                onChange={(e) => onUpdateScript({ ...script, audioVibe: e.target.value })}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl bg-[#F8F7F4] dark:bg-[#232328] border border-[#E7E4DC] dark:border-[#2E2E33] text-[#182625] dark:text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Right column: Mobile 9:16 Visual Simulator */}
        {simulatorActive && (
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center">
            <div className="sticky top-4 w-full max-w-[290px] aspect-[9/16] bg-[#0A0A0C] text-white rounded-[36px] p-4 border-4 border-zinc-800 shadow-2xl relative flex flex-col justify-between overflow-hidden">
              {/* Top phone notch */}
              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
              </div>

              {/* Status info */}
              <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
                <span>00:{estimatedSeconds < 10 ? `0${estimatedSeconds}` : estimatedSeconds}</span>
                <span className="flex items-center gap-1 text-[#C9A864]">
                  <Music className="w-3 h-3" /> Áudio Original
                </span>
              </div>

              {/* Center text on screen (Simulating Instagram Reels Text Overlay) */}
              <div className="my-auto space-y-3 px-2 text-center">
                <div className="inline-block px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-xs border border-white/10 text-white font-bold text-xs leading-snug shadow-lg">
                  {script.hookAudioSpeech}
                </div>
                <div className="p-2.5 rounded-xl bg-[#0F3D3B]/90 text-white text-[11px] font-medium leading-relaxed border border-[#C9A864]/40">
                  {script.teleprompterScript.slice(0, 110)}...
                </div>
              </div>

              {/* Bottom user / brand info */}
              <div className="space-y-1.5 text-left text-xs bg-gradient-to-t from-black via-black/80 to-transparent p-2 -mx-2 -mb-2 rounded-b-[28px]">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#0F3D3B] border border-[#C9A864] flex items-center justify-center text-[9px]">
                    ψ
                  </div>
                  <span>{brand.instagram || brand.name}</span>
                </div>
                <p className="text-[10px] text-zinc-300 line-clamp-2">
                  {script.subtleCta}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Teleprompter Full-Screen Modal */}
      <AnimatePresence>
        {teleprompterOpen && (
          <div className="fixed inset-0 z-50 bg-[#0F1716] text-[#F8F7F4] flex flex-col p-6 sm:p-10">
            {/* Top controls */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#C9A864]" />
                  Teleprompter para Gravação
                </h3>
                <p className="text-xs text-zinc-400">
                  Coloque o celular próximo à câmera e leia pausadamente.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setTeleprompterFontSize("md")}
                    className={`px-2.5 py-1 rounded-lg ${teleprompterFontSize === "md" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400"}`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeleprompterFontSize("lg")}
                    className={`px-2.5 py-1 rounded-lg ${teleprompterFontSize === "lg" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400"}`}
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeleprompterFontSize("xl")}
                    className={`px-2.5 py-1 rounded-lg ${teleprompterFontSize === "xl" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400"}`}
                  >
                    A++
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTeleprompterOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
                >
                  Fechar (ESC)
                </button>
              </div>
            </div>

            {/* Teleprompter text content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar max-w-3xl mx-auto py-12 px-4 text-center space-y-8">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 inline-block text-left text-xs text-[#C9A864]">
                <strong>🎬 CENA INICIAL (0-3s):</strong> {script.hookVisual3s}
              </div>

              <div
                className={`font-semibold text-zinc-100 tracking-wide leading-loose whitespace-pre-line ${
                  teleprompterFontSize === "md"
                    ? "text-lg sm:text-xl"
                    : teleprompterFontSize === "lg"
                    ? "text-xl sm:text-2xl"
                    : "text-2xl sm:text-3xl"
                }`}
              >
                {script.teleprompterScript}
              </div>

              <div className="p-4 rounded-2xl bg-[#0F3D3B]/40 border border-[#0F3D3B] text-sm text-[#93C5BD] italic">
                "{script.subtleCta}"
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
