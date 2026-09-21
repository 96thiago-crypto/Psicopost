import React from "react";
import { PostState, CarouselSlide } from "../types";
import { SlideCanvas } from "./SlideCanvas";
import { useTheme } from "../context/ThemeContext";
import { Download, Layers } from "lucide-react";

interface GridOverviewProps {
  postState: PostState;
  onSelectSlide: (index: number) => void;
  onUpdateSlide: (slideIndex: number, updated: Partial<CarouselSlide>) => void;
}

export const GridOverview: React.FC<GridOverviewProps> = ({
  postState,
  onSelectSlide,
  onUpdateSlide,
}) => {
  const { isDark } = useTheme();
  const slides = postState.carousel.slides;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div
        className={`flex items-center justify-between pb-4 border-b ${
          isDark ? "border-[#27272A]" : "border-[#D4CDBA]"
        }`}
      >
        <div>
          <h3
            className={`text-base font-bold font-serif flex items-center gap-2 ${
              isDark ? "text-[#F4F4F5]" : "text-[#1C1A17]"
            }`}
          >
            <Layers className="w-4 h-4 text-[#8B5E3C]" />
            Visão Geral do Carrossel ({slides.length} Slides)
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? "text-[#A1A1AA]" : "text-[#78716C]"}`}>
            Visualize toda a narrativa clínica de ponta a ponta. Clique em qualquer slide para focar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id ? `${slide.id}-${index}` : `grid-slide-${index}`}
            className={`flex flex-col border rounded-2xl p-3.5 transition group relative shadow-sm ${
              isDark
                ? "bg-[#1E1E22] border-[#27272A] hover:border-[#8B5E3C]"
                : "bg-white border-[#D4CDBA] hover:border-[#8B5E3C]"
            }`}
          >
            {/* Header with slide number & jump button */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                  isDark
                    ? "text-[#D9A888] bg-[#27272A] border-[#3F3F46]"
                    : "text-[#8B5E3C] bg-[#F5F2EC] border-[#D4CDBA]"
                }`}
              >
                Slide {index + 1}
              </span>
              <button
                onClick={() => onSelectSlide(index)}
                className={`text-[11px] font-semibold transition cursor-pointer ${
                  isDark
                    ? "text-[#A1A1AA] hover:text-[#D9A888]"
                    : "text-[#78716C] hover:text-[#8B5E3C]"
                }`}
              >
                Editar no Foco →
              </button>
            </div>

            {/* Slide Miniature / Canvas */}
            <div
              className="w-full overflow-hidden rounded-xl cursor-pointer"
              onClick={() => onSelectSlide(index)}
            >
              <SlideCanvas
                postState={postState}
                slideIndex={index}
                onUpdateSlide={onUpdateSlide}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

