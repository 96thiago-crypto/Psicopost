import React from "react";
import { PostState, AuthState } from "../types";
import { useTheme } from "../context/ThemeContext";
import { Download, FileText, LogOut, Sun, Moon, Smartphone, Check, Cloud, Bookmark, HelpCircle, Maximize2, Minimize2 } from "lucide-react";

interface HeaderProps {
  postState: PostState;
  authState?: AuthState;
  onLogout: () => void;
  onOpenCaptionModal: () => void;
  onOpenDevicePreview?: () => void;
  onOpenSavedPosts?: () => void;
  onOpenOnboardingTour?: () => void;
  onBatchExport: () => void;
  isBatchExporting: boolean;
  exportProgress: { current: number; total: number } | null;
  onToggleAspectRatio?: (ratio: any) => void;
  saveStatus?: "idle" | "saving" | "saved";
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  postState,
  onLogout,
  onOpenCaptionModal,
  onOpenDevicePreview,
  onOpenSavedPosts,
  onOpenOnboardingTour,
  onBatchExport,
  isBatchExporting,
  exportProgress,
  saveStatus = "idle",
  isFocusMode = false,
  onToggleFocusMode,
}) => {
  const { isDark, toggleTheme } = useTheme();

  // Human-readable format indicator
  const formatLabel = (() => {
    if (postState.topLevelFormat === "reels_script") return "Reels • Roteiro 3s";
    if (postState.topLevelFormat === "single_card") return "Card Único • Frase";
    if (postState.topLevelFormat === "stories_sequence") return "Stories • 4 Telas";
    if (postState.format === "carousel") {
      return `Carrossel • ${postState.carousel.slides.length} slides`;
    }
    if (postState.format === "matrix") return "Matriz • Mito vs Realidade";
    if (postState.format === "checklist") return "Checklist de Sinais";
    if (postState.format === "cycle") return "Ciclo da Mente";
    if (postState.format === "quote") return "Citação Editorial";
    if (postState.format === "coping_card") return "Cartão SOS Enfrentamento";
    if (postState.format === "qa_provocation") return "Pergunta Terapêutica";
    return "Carrossel Clínico";
  })();

  return (
    <header
      id="main-header"
      className={`h-16 border-b px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 shadow-xs transition-clinical ${
        isDark
          ? "bg-[#18181B]/95 backdrop-blur-md border-[#27272A] text-[#F4F4F5]"
          : "bg-white/95 backdrop-blur-sm border-[#D4CDBA] text-[#1C1A17]"
      }`}
    >
      {/* Grupo Esquerdo: Marca & Status */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#8B5E3C] flex items-center justify-center shadow-xs text-white font-serif font-black text-base shrink-0">
          Ψ
        </div>

        <div className="flex items-center gap-2">
          <h1
            className={`text-base font-bold font-serif tracking-tight leading-tight ${
              isDark ? "text-[#F4F4F5]" : "text-[#1C1A17]"
            }`}
          >
            Studio Psicopost
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8B5E3C]/10 text-[#8B5E3C] dark:bg-[#8B5E3C]/20 dark:text-[#D9A888]">
            PRO
          </span>
        </div>

        {/* Indicador sutil de Status 'Salvando...' / 'Salvo' */}
        {saveStatus !== "idle" && (
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
              saveStatus === "saving"
                ? isDark
                  ? "text-amber-300"
                  : "text-amber-700"
                : isDark
                ? "text-emerald-400"
                : "text-emerald-700"
            }`}
          >
            {saveStatus === "saving" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Salvo</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Grupo Direito: Ferramentas Essenciais */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 1. Biblioteca de Rascunhos & Posts Salvos */}
        {onOpenSavedPosts && (
          <button
            type="button"
            onClick={onOpenSavedPosts}
            id="header-saved-posts-button"
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
              isDark
                ? "bg-[#27272A] hover:bg-[#323238] border-[#3F3F46] text-[#F4F4F5]"
                : "bg-[#FAF7F2] hover:bg-[#F0ECE1] border-[#D4CDBA] text-[#1C1A17]"
            }`}
            title="Abrir Biblioteca de Posts & Rascunhos Salvos"
            aria-label="Biblioteca de Rascunhos"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isDark ? "text-[#D9A888]" : "text-[#8B5E3C]"}`} />
            <span className="hidden sm:inline">Rascunhos</span>
          </button>
        )}

        {/* 2. Modo Foco (Tela Cheia sem Distrações) */}
        {onToggleFocusMode && (
          <button
            type="button"
            onClick={onToggleFocusMode}
            id="header-focus-mode-button"
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
              isFocusMode
                ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-xs ring-2 ring-[#8B5E3C]/30"
                : isDark
                ? "bg-[#27272A] hover:bg-[#323238] border-[#3F3F46] text-[#F4F4F5]"
                : "bg-[#FAF7F2] hover:bg-[#F0ECE1] border-[#D4CDBA] text-[#1C1A17]"
            }`}
            title={
              isFocusMode
                ? "Sair do Modo Foco e restaurar painel lateral (Esc)"
                : "Modo Foco: recolher barra lateral para visualizar e editar em tela cheia"
            }
            aria-label={isFocusMode ? "Sair do Modo Foco" : "Ativar Modo Foco"}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="hidden sm:inline">Sair do Foco</span>
              </>
            ) : (
              <>
                <Maximize2 className={`w-3.5 h-3.5 ${isDark ? "text-[#D9A888]" : "text-[#8B5E3C]"} shrink-0`} />
                <span className="hidden sm:inline">Modo Foco</span>
              </>
            )}
          </button>
        )}

        {/* 3. Gerador & Editor de Legendas */}
        <button
          type="button"
          onClick={onOpenCaptionModal}
          id="header-caption-button"
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
            isDark
              ? "bg-[#27272A] hover:bg-[#323238] border-[#3F3F46] text-[#F4F4F5]"
              : "bg-[#FAF7F2] hover:bg-[#F0ECE1] border-[#D4CDBA] text-[#1C1A17]"
          }`}
          title="Ver e copiar legenda gerada para o Instagram"
          aria-label="Legendas"
        >
          <FileText className={`w-3.5 h-3.5 ${isDark ? "text-[#D9A888]" : "text-[#8B5E3C]"}`} />
          <span className="hidden sm:inline">Legenda</span>
        </button>

        {/* 4. Alternador de Tema Claro / Escuro */}
        <button
          type="button"
          onClick={toggleTheme}
          id="theme-toggle-button"
          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
            isDark
              ? "bg-[#27272A] hover:bg-[#323238] border-[#3F3F46] text-[#FDE047]"
              : "bg-[#FAF7F2] hover:bg-[#F0ECE1] border-[#D4CDBA] text-[#8B5E3C]"
          }`}
          title={isDark ? "Alternar para Tema Claro" : "Alternar para Tema Escuro"}
          aria-label={isDark ? "Alternar para Tema Claro" : "Alternar para Tema Escuro"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#8B5E3C]" />
          )}
        </button>

        {/* Separador vertical */}
        <div className="w-px h-5 bg-[#D4CDBA]/60 dark:bg-[#27272A] mx-0.5" />

        {/* 4. AÇÃO PRIMÁRIA: Baixar Imagens (ZIP ou PNG) */}
        <button
          type="button"
          onClick={onBatchExport}
          disabled={isBatchExporting}
          id="header-export-button"
          className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 shadow-sm disabled:opacity-50 cursor-pointer shrink-0 ${
            isDark
              ? "bg-[#8B5E3C] hover:bg-[#734B2E] text-white"
              : "bg-[#1C1A17] hover:bg-[#332F2B] text-white"
          }`}
          title={
            postState.format === "carousel"
              ? `Baixar todos os ${postState.carousel.slides.length} slides prontos para o Instagram (arquivo ZIP com imagens em alta resolução)`
              : "Baixar post em imagem de alta resolução (PNG HD)"
          }
          aria-label="Baixar Imagens"
        >
          {isBatchExporting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="text-xs">
                {exportProgress
                  ? `${exportProgress.current}/${exportProgress.total}`
                  : "Preparando..."}
              </span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap font-medium">
                {postState.format === "carousel" ? "Baixar Imagens (ZIP)" : "Baixar Imagem (PNG)"}
              </span>
            </>
          )}
        </button>

        {/* 5. Logout */}
        <div
          className={`pl-1 border-l shrink-0 ${
            isDark ? "border-[#27272A]" : "border-[#D4CDBA]"
          }`}
        >
          <button
            type="button"
            onClick={onLogout}
            id="header-logout-button"
            className={`p-2 rounded-xl transition cursor-pointer flex items-center text-xs shrink-0 ${
              isDark
                ? "text-[#A1A1AA] hover:text-red-400 hover:bg-[#27272A]"
                : "text-[#78716C] hover:text-red-700 hover:bg-[#F5F2EC]"
            }`}
            title="Sair da conta"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};



