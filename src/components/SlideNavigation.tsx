import React from "react";
import { ChevronLeft, ChevronRight, Eye, Grid, Smartphone, Download } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface SlideNavigationProps {
  totalSlides: number;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  viewMode: "single" | "grid";
  onToggleViewMode: (mode: "single" | "grid") => void;
  onOpenPreview?: () => void;
  onExportZip?: () => void;
  isExporting?: boolean;
}

export const SlideNavigation: React.FC<SlideNavigationProps> = ({
  totalSlides,
  currentIndex,
  onSelectIndex,
  viewMode,
  onToggleViewMode,
  onOpenPreview,
  onExportZip,
  isExporting,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex items-center justify-between gap-2.5 backdrop-blur-md border rounded-2xl p-2 px-3 sm:px-4 shadow-md max-w-xl mx-auto w-full transition-colors duration-200 ${
        isDark
          ? "bg-[#18181B]/95 border-[#27272A] text-[#F4F4F5]"
          : "bg-white/90 border-[#D4CDBA] text-[#1C1A17]"
      }`}
    >
      {/* Prev button */}
      <button
        onClick={() => onSelectIndex(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        className={`p-2 rounded-xl transition cursor-pointer border disabled:opacity-30 ${
          isDark
            ? "bg-[#27272A] hover:bg-[#323238] disabled:hover:bg-[#27272A] text-[#F4F4F5] border-[#3F3F46]"
            : "bg-[#E8E3D8] hover:bg-[#DCD7CB] disabled:hover:bg-[#E8E3D8] text-[#1C1A17] border-[#D4CDBA]"
        }`}
        title="Slide Anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Slide Index Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectIndex(idx)}
            className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
              currentIndex === idx
                ? "bg-[#8B5E3C] text-white shadow-sm scale-105"
                : isDark
                ? "bg-[#27272A] hover:bg-[#323238] text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#3F3F46]"
                : "bg-[#E8E3D8]/60 hover:bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17] border border-[#D4CDBA]/50"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => onSelectIndex(Math.min(totalSlides - 1, currentIndex + 1))}
        disabled={currentIndex === totalSlides - 1}
        className={`p-2 rounded-xl transition cursor-pointer border disabled:opacity-30 ${
          isDark
            ? "bg-[#27272A] hover:bg-[#323238] disabled:hover:bg-[#27272A] text-[#F4F4F5] border-[#3F3F46]"
            : "bg-[#E8E3D8] hover:bg-[#DCD7CB] disabled:hover:bg-[#E8E3D8] text-[#1C1A17] border-[#D4CDBA]"
        }`}
        title="Próximo Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className={`h-5 w-[1px] ${isDark ? "bg-[#27272A]" : "bg-[#D4CDBA]"}`} />

      {/* Single / Grid View Toggle */}
      <button
        onClick={() => onToggleViewMode(viewMode === "single" ? "grid" : "single")}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
          viewMode === "grid"
            ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-xs"
            : isDark
            ? "bg-[#27272A] hover:bg-[#323238] text-[#F4F4F5] border-[#3F3F46]"
            : "bg-[#E8E3D8] hover:bg-[#DCD7CB] text-[#1C1A17] border-[#D4CDBA]"
        }`}
        title={viewMode === "single" ? "Ver todos os slides em grade" : "Voltar para slide individual"}
      >
        {viewMode === "single" ? (
          <>
            <Grid className="w-3.5 h-3.5" />
            <span className="text-[11px]">Grade</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px]">Foco</span>
          </>
        )}
      </button>
    </div>
  );
};

