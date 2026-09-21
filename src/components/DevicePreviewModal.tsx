import React, { useState } from "react";
import { PostState } from "../types";
import { SlideCanvas } from "./SlideCanvas";
import { useTheme } from "../context/ThemeContext";
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Instagram,
  Layers,
  Sparkles,
} from "lucide-react";

interface DevicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  postState: PostState;
}

type DeviceType = "mobile" | "tablet" | "feed";

export const DevicePreviewModal: React.FC<DevicePreviewModalProps> = ({
  isOpen,
  onClose,
  postState,
}) => {
  const { isDark } = useTheme();
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    postState.carousel.currentSlideIndex || 0
  );
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const totalSlides =
    postState.format === "carousel" ? postState.carousel.slides.length : 1;

  const nextSlide = () => {
    if (postState.format === "carousel") {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (postState.format === "carousel") {
      setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl h-[94vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-[#121214] border-[#27272A] text-[#F4F4F5]"
            : "bg-[#FDFBF7] border-[#D4CDBA] text-[#1C1A17]"
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`h-16 px-5 border-b flex items-center justify-between shrink-0 ${
            isDark
              ? "border-[#27272A] bg-[#18181B]/90"
              : "border-[#E8E3D8] bg-white/90"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B5E3C] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-serif">
                Simulador de Preview Instagram
              </h2>
              <p
                className={`text-[11px] ${
                  isDark ? "text-[#A1A1AA]" : "text-[#78716C]"
                }`}
              >
                Veja exatamente como o seu paciente verá o post no feed
              </p>
            </div>
          </div>

          {/* Device Selector Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-[#27272A]/10 dark:bg-[#27272A]/40 rounded-2xl border border-[#D4CDBA]/50 dark:border-[#3F3F46]">
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                device === "mobile"
                  ? "bg-[#8B5E3C] text-white shadow-xs"
                  : isDark
                  ? "text-[#A1A1AA] hover:text-white"
                  : "text-[#78716C] hover:text-[#1C1A17]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Celular</span>
            </button>

            <button
              type="button"
              onClick={() => setDevice("tablet")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                device === "tablet"
                  ? "bg-[#8B5E3C] text-white shadow-xs"
                  : isDark
                  ? "text-[#A1A1AA] hover:text-white"
                  : "text-[#78716C] hover:text-[#1C1A17]"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet / iPad</span>
            </button>

            <button
              type="button"
              onClick={() => setDevice("feed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer hidden sm:flex ${
                device === "feed"
                  ? "bg-[#8B5E3C] text-white shadow-xs"
                  : isDark
                  ? "text-[#A1A1AA] hover:text-white"
                  : "text-[#78716C] hover:text-[#1C1A17]"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Feed Web</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isDark
                ? "hover:bg-[#27272A] text-[#A1A1AA] hover:text-white"
                : "hover:bg-[#E8E3D8] text-[#78716C] hover:text-[#1C1A17]"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Stage Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-radial from-transparent to-black/10">
          {/* 1. MOCKUP DE CELULAR (SMARTPHONE FRAME) */}
          {device === "mobile" && (
            <div className="w-full max-w-[380px] bg-black p-3.5 rounded-[44px] shadow-2xl border-[4px] border-[#3F3F46]/60 relative flex flex-col">
              {/* Dynamic Island / Camera Notch */}
              <div className="w-24 h-4 bg-[#18181B] rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#27272A] ml-auto mr-2" />
              </div>

              {/* Instagram Mobile App UI Frame */}
              <div className="bg-white dark:bg-[#000000] text-[#1C1A17] dark:text-white rounded-[32px] overflow-hidden flex flex-col border border-[#27272A]/20">
                {/* Instagram Top Bar */}
                <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626]">
                  <div className="flex items-center gap-1.5 font-bold tracking-tight text-xs">
                    <Instagram className="w-4 h-4 text-[#8B5E3C]" />
                    <span>Instagram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 opacity-80" />
                    <MessageCircle className="w-4 h-4 opacity-80" />
                  </div>
                </div>

                {/* Profile Post Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5E3C] to-[#E8C5A5] p-[2px]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden flex items-center justify-center text-[11px] font-bold text-[#8B5E3C]">
                        {postState.brand.avatarBase64 ? (
                          <img
                            src={postState.brand.avatarBase64}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          postState.brand.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-none">
                        {postState.brand.instagram?.replace("@", "") || "seuperfil.psi"}
                      </span>
                      <span className="text-[10px] text-gray-500 block mt-0.5 leading-none">
                        {postState.brand.name} • {postState.brand.crp}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-gray-500">•••</span>
                </div>

                {/* Canvas Display with Swipe Simulation */}
                <div className="relative w-full overflow-hidden bg-black group">
                  <SlideCanvas
                    postState={postState}
                    slideIndex={currentSlideIndex}
                    onSwipeLeft={nextSlide}
                    onSwipeRight={prevSlide}
                  />

                  {/* Navigation Arrows for Carousel */}
                  {postState.format === "carousel" && (
                    <>
                      {currentSlideIndex > 0 && (
                        <button
                          type="button"
                          onClick={prevSlide}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center shadow-md backdrop-blur-xs cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      {currentSlideIndex < totalSlides - 1 && (
                        <button
                          type="button"
                          onClick={nextSlide}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center shadow-md backdrop-blur-xs cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      {/* Slide Indicator Badge */}
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white tracking-widest">
                        {currentSlideIndex + 1}/{totalSlides}
                      </div>
                    </>
                  )}
                </div>

                {/* Instagram Action Icons */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsLiked(!isLiked)}
                        className="cursor-pointer"
                      >
                        <Heart
                          className={`w-5 h-5 transition ${
                            isLiked ? "fill-red-500 text-red-500 scale-110" : ""
                          }`}
                        />
                      </button>
                      <MessageCircle className="w-5 h-5" />
                      <Share2 className="w-5 h-5" />
                    </div>

                    {/* Carousel Dots */}
                    {postState.format === "carousel" && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              currentSlideIndex === idx
                                ? "bg-[#8B5E3C] w-3"
                                : "bg-gray-300 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsSaved(!isSaved)}
                      className="cursor-pointer"
                    >
                      <Bookmark
                        className={`w-5 h-5 transition ${
                          isSaved ? "fill-[#8B5E3C] text-[#8B5E3C]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes count & Title */}
                  <div className="text-[11px] space-y-1">
                    <span className="font-bold block">1.482 curtidas</span>
                    <p className="line-clamp-2 leading-relaxed">
                      <span className="font-bold mr-1.5">
                        {postState.brand.instagram?.replace("@", "") || "seuperfil.psi"}
                      </span>
                      {postState.carousel.mainTitle}
                    </p>
                    <span className="text-[10px] text-gray-400 block pt-0.5">
                      Ver todos os 48 comentários
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MOCKUP DE TABLET / IPAD */}
          {device === "tablet" && (
            <div className="w-full max-w-[560px] bg-black p-4 rounded-[40px] shadow-2xl border-[4px] border-[#3F3F46]/60 flex flex-col">
              <div className="bg-white dark:bg-[#000000] text-[#1C1A17] dark:text-white rounded-[28px] overflow-hidden flex flex-col border border-[#27272A]/20">
                <div className="p-3.5 flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8B5E3C] to-[#E8C5A5] p-[2px]">
                      <div className="w-full h-full rounded-full bg-white dark:bg-black overflow-hidden flex items-center justify-center text-xs font-bold text-[#8B5E3C]">
                        {postState.brand.avatarBase64 ? (
                          <img
                            src={postState.brand.avatarBase64}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          postState.brand.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {postState.brand.instagram?.replace("@", "") || "seuperfil.psi"}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {postState.brand.signature}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-[#FAF7F2] dark:bg-[#18181B] border rounded-full text-[#8B5E3C]">
                    Preview Tablet
                  </span>
                </div>

                <div className="relative w-full bg-black">
                  <SlideCanvas
                    postState={postState}
                    slideIndex={currentSlideIndex}
                    onSwipeLeft={nextSlide}
                    onSwipeRight={prevSlide}
                  />

                  {postState.format === "carousel" && (
                    <>
                      {currentSlideIndex > 0 && (
                        <button
                          type="button"
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center shadow-lg backdrop-blur-xs cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}
                      {currentSlideIndex < totalSlides - 1 && (
                        <button
                          type="button"
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center shadow-lg backdrop-blur-xs cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="p-3.5 flex items-center justify-between border-t border-[#E5E5E5] dark:border-[#262626]">
                  <span className="text-xs font-bold text-gray-500">
                    Slide {currentSlideIndex + 1} de {totalSlides}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-6 h-6 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          currentSlideIndex === idx
                            ? "bg-[#8B5E3C] text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. MOCKUP DE FEED WEB (DESKTOP GRID) */}
          {device === "feed" && (
            <div className="w-full max-w-[620px] bg-white dark:bg-[#18181B] border border-[#D4CDBA] dark:border-[#27272A] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-[#E8E3D8] dark:border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-bold text-sm">
                    {postState.brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{postState.brand.name}</h4>
                    <p className="text-[11px] text-gray-500">{postState.brand.instagram}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8B5E3C] font-semibold">
                  <Layers className="w-4 h-4" />
                  <span>Carrossel Clínico</span>
                </div>
              </div>

              <div className="relative bg-black">
                <SlideCanvas
                  postState={postState}
                  slideIndex={currentSlideIndex}
                />
              </div>

              {postState.format === "carousel" && (
                <div className="p-3 bg-[#FAF7F2] dark:bg-[#121214] flex items-center justify-between border-t border-[#E8E3D8] dark:border-[#27272A]">
                  <button
                    type="button"
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="px-3 py-1.5 bg-white dark:bg-[#27272A] border rounded-xl text-xs font-semibold disabled:opacity-30 cursor-pointer"
                  >
                    Anterior
                  </button>
                  <span className="text-xs font-bold text-[#8B5E3C]">
                    Slide {currentSlideIndex + 1} / {totalSlides}
                  </span>
                  <button
                    type="button"
                    onClick={nextSlide}
                    disabled={currentSlideIndex === totalSlides - 1}
                    className="px-3 py-1.5 bg-white dark:bg-[#27272A] border rounded-xl text-xs font-semibold disabled:opacity-30 cursor-pointer"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
