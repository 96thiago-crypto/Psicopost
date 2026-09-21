import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PostState,
  CarouselSlide,
  MatrixContent,
  QuoteContent,
  CopingCardContent,
  ChecklistContent,
  CycleContent,
  QAProvocationContent,
} from "../types";
import { SvgIllustrationRenderer, SvgIllustrationBackgroundRenderer } from "./SvgIllustrations";
import {
  Download,
  Sparkles,
  User,
  Instagram,
  CheckSquare,
  ArrowRight,
  HelpCircle,
  Bookmark,
  Share2,
  MessageCircle,
  Calendar,
  Heart,
} from "lucide-react";
import { exportElementToPng } from "../utils/exportUtils";

interface SlideCanvasProps {
  postState: PostState;
  slideIndex?: number;
  isExporting?: boolean;
  isFocusMode?: boolean;
  onUpdateSlide?: (slideIndex: number, updated: Partial<CarouselSlide>) => void;
  onUpdateMatrix?: (updated: Partial<MatrixContent>) => void;
  onUpdateQuote?: (updated: Partial<QuoteContent>) => void;
  onUpdateCopingCard?: (updated: Partial<CopingCardContent>) => void;
  onUpdateChecklist?: (updated: Partial<ChecklistContent>) => void;
  onUpdateCycle?: (updated: Partial<CycleContent>) => void;
  onUpdateQAProvocation?: (updated: Partial<QAProvocationContent>) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  postState,
  slideIndex = 0,
  isExporting = false,
  isFocusMode = false,
  onUpdateSlide,
  onUpdateMatrix,
  onUpdateQuote,
  onUpdateCopingCard,
  onUpdateChecklist,
  onUpdateCycle,
  onUpdateQAProvocation,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Direction tracker for smooth slide transitions (1 = next / forward, -1 = prev / backward)
  const prevSlideIndexRef = useRef(slideIndex);
  const direction = slideIndex >= prevSlideIndexRef.current ? 1 : -1;

  useEffect(() => {
    prevSlideIndexRef.current = slideIndex;
  }, [slideIndex]);

  // Framer-motion transition variants for carousel slide flipping
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 36 : -36,
      opacity: 0,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 360, damping: 30 },
        opacity: { duration: 0.22, ease: "easeOut" },
        scale: { duration: 0.22, ease: "easeOut" },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.985,
      transition: {
        x: { type: "spring", stiffness: 360, damping: 30 },
        opacity: { duration: 0.16, ease: "easeIn" },
        scale: { duration: 0.16, ease: "easeIn" },
      },
    }),
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - endX;
    const diffY = touchStartYRef.current - endY;

    // Minimum distance of 40px and predominantly horizontal
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };
  const { palette, typography, brand, aspectRatio, format, illustration } = postState;

  const currentSlide = format === "carousel" ? postState.carousel.slides[slideIndex] : null;
  const activeIllustration = currentSlide?.customIllustration || illustration;
  const activeCustomImage =
    currentSlide?.customImage !== undefined && currentSlide?.customImage !== null
      ? currentSlide.customImage
      : postState.customImage;

  // Header detail visibility
  const showHeaderDetail =
    activeIllustration !== "none" &&
    (postState.illustrationPlacement === "header" ||
      postState.illustrationPlacement === "both");

  // Aspect ratio dimensions container classes
  const isSquare = aspectRatio === "1:1";
  const isStory = aspectRatio === "9:16";
  const isVertical = aspectRatio === "4:5";

  // When true, uses tighter spacing and smaller font steps to guarantee NO overflow
  const isCompact = isSquare || isStory;

  // Optimized padding:
  // - 1:1: compact padding to save vertical height
  // - 9:16: safe area top/bottom without taking too much height, comfortable side padding
  // - 4:5: standard balanced editorial padding
  const canvasPaddingClass = isSquare
    ? "p-3.5 sm:p-4"
    : isStory
    ? "pt-6 pb-5 px-4 sm:pt-7 sm:pb-6 sm:px-5"
    : "p-4 sm:p-5";

  // Font scale multipliers
  const scaleClass =
    typography.fontScale === "small"
      ? isCompact ? "text-[0.78rem] leading-snug" : "text-[0.85rem] leading-snug"
      : typography.fontScale === "large"
      ? isCompact ? "text-[0.92rem] leading-snug" : "text-[1.02rem] leading-snug"
      : isCompact ? "text-[0.84rem] leading-snug" : "text-[0.92rem] leading-snug";

  const titleScaleClass =
    typography.fontScale === "small"
      ? isStory ? "text-base sm:text-lg" : isSquare ? "text-base sm:text-lg" : "text-lg sm:text-xl"
      : typography.fontScale === "large"
      ? isStory ? "text-xl sm:text-2xl" : isSquare ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
      : isStory ? "text-lg sm:text-xl" : isSquare ? "text-lg sm:text-xl" : "text-xl sm:text-2xl";

  const handleDownloadSingle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    const name = `${postState.themeTitle || "psicopost"}_slide_${slideIndex + 1}`;
    await exportElementToPng(canvasRef.current, name, 3);
  };

  // Render Branding Footer
  const renderFooter = (currentNum?: number, totalNum?: number) => {
    return (
      <div
        className={`mt-auto ${isCompact ? "pt-1.5" : "pt-2"} border-t flex items-center justify-between text-xs transition-opacity duration-200 shrink-0`}
        style={{
          borderColor: `${palette.cardBorder}80`,
          color: palette.secondaryText,
        }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {brand.showAvatar && (
            <div
              className={`${isCompact ? "w-5 h-5 sm:w-6 sm:h-6" : "w-6 h-6 sm:w-7 sm:h-7"} rounded-full overflow-hidden flex items-center justify-center border shrink-0`}
              style={{
                borderColor: palette.accent,
                backgroundColor: `${palette.accent}20`,
              }}
            >
              {brand.avatarBase64 ? (
                <img
                  src={brand.avatarBase64}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-3 h-3" style={{ color: palette.accent }} />
              )}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span
              className="font-semibold tracking-wide truncate text-[10.5px] sm:text-xs leading-tight"
              style={{ color: palette.text }}
            >
              {brand.name || "Túlio Moura"}
            </span>
            {brand.showCrp && (
              <span className="text-[8.5px] sm:text-[9px] opacity-80 truncate leading-tight">
                {brand.signature || "Psicólogo Clínico • TCC"} | {brand.crp || "CRP 02/33860"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {brand.showInstagram && brand.instagram && (
            <div
              className="flex items-center gap-1 font-mono text-[9.5px] sm:text-[10.5px]"
              style={{ color: palette.accent }}
            >
              <Instagram className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-none">{brand.instagram}</span>
            </div>
          )}
          {brand.showSlideNumber && currentNum !== undefined && totalNum !== undefined && (
            <div
              className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium border shrink-0"
              style={{
                backgroundColor: `${palette.cardBg}90`,
                borderColor: palette.cardBorder,
                color: palette.text,
              }}
            >
              {String(currentNum).padStart(2, "0")}/{String(totalNum).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper to render text elements with smooth fade-in and scale-up using framer-motion
  const renderAnimatedText = ({
    as = "div",
    contentKey,
    key,
    className = "",
    style = {},
    delay = 0,
    contentEditable = false,
    suppressContentEditableWarning = false,
    onBlur,
    children,
  }: {
    as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
    contentKey: string;
    key?: React.Key;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
    contentEditable?: boolean;
    suppressContentEditableWarning?: boolean;
    onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
    children: React.ReactNode;
  }) => {
    const finalKey = key ?? contentKey;
    if (isExporting) {
      const Tag = as;
      return (
        <Tag
          key={finalKey}
          className={className}
          style={style}
          contentEditable={contentEditable}
          suppressContentEditableWarning={suppressContentEditableWarning}
          onBlur={onBlur}
        >
          {children}
        </Tag>
      );
    }

    const MotionComponent = (motion as any)[as] || motion.div;

    return (
      <MotionComponent
        key={finalKey}
        initial={{ opacity: 0, scale: 0.96, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.28,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
        style={style}
        contentEditable={contentEditable}
        suppressContentEditableWarning={suppressContentEditableWarning}
        onBlur={onBlur}
      >
        {children}
      </MotionComponent>
    );
  };

  // 1. Render Carousel Single Slide
  const renderCarouselSlide = () => {
    const slides = postState.carousel.slides;
    const slide = slides[slideIndex] || slides[0];
    if (!slide) return null;

    const isCover = slide.slideRole === "cover" || slide.slideNumber === 1;
    const isCta = slide.slideRole === "cta" || (slide.slideNumber === slides.length && slides.length > 1);

    // ==========================================
    // A) LAYOUT DE CAPA (PRIMEIRA IMPRESSÃO & HOOK)
    // ==========================================
    if (isCover) {
      return (
        <div className={`h-full flex flex-col justify-between ${canvasPaddingClass} relative`}>
          {/* Top Tag Bar - Minimalist, editorial */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
              style={{
                backgroundColor: `${palette.accent}12`,
                borderColor: `${palette.accent}30`,
                color: palette.accent,
              }}
            >
              {slide.badge || "01 • GUIA CLÍNICO"}
            </span>
          </div>

          {/* Cover Main Hook Center */}
          <div
            className={`flex-1 flex flex-col justify-center min-h-0 my-auto ${
              typography.alignment === "center" ? "text-center items-center" : "text-left"
            }`}
          >
            {/* Super Hook Title */}
            {renderAnimatedText({
              as: "h1",
              contentKey: `${slideIndex}-cover-title-${slide.title}`,
              delay: 0.02,
              className: `font-bold leading-[1.18] tracking-tight mb-2 ${
                isStory
                  ? "text-xl sm:text-2xl"
                  : isSquare
                  ? "text-xl sm:text-2xl"
                  : "text-2xl sm:text-3xl"
              }`,
              style: {
                fontFamily: typography.titleFont,
                color: palette.text,
              },
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e) =>
                onUpdateSlide?.(slideIndex, { title: e.currentTarget.textContent || "" }),
              children: slide.title,
            })}

            {/* Sub-hook - Clean, elegant typography without heavy card borders */}
            {slide.subtitle &&
              renderAnimatedText({
                as: "p",
                contentKey: `${slideIndex}-cover-sub-${slide.subtitle}`,
                delay: 0.07,
                className: "text-xs sm:text-sm font-medium mb-2 leading-relaxed opacity-85",
                style: {
                  fontFamily: typography.bodyFont,
                  color: palette.secondaryText,
                },
                contentEditable: true,
                suppressContentEditableWarning: true,
                onBlur: (e) =>
                  onUpdateSlide?.(slideIndex, { subtitle: e.currentTarget.textContent || "" }),
                children: slide.subtitle,
              })}

            {/* Introductory Context Hook */}
            {slide.body &&
              renderAnimatedText({
                as: "p",
                contentKey: `${slideIndex}-cover-body-${slide.body}`,
                delay: 0.12,
                className: `leading-relaxed mb-2 opacity-80 ${scaleClass}`,
                style: {
                  fontFamily: typography.bodyFont,
                  color: palette.text,
                },
                contentEditable: true,
                suppressContentEditableWarning: true,
                onBlur: (e) =>
                  onUpdateSlide?.(slideIndex, { body: e.currentTarget.textContent || "" }),
                children: slide.body,
              })}

            {/* Visual Swipe Hook - Minimalist & refined */}
            {brand.showSwipeHint &&
              renderAnimatedText({
                as: "div",
                contentKey: `${slideIndex}-cover-pill-${slide.footerNote || "swipe"}`,
                delay: 0.18,
                className: "mt-1.5 flex items-center gap-1.5",
                children: (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border transition"
                    style={{
                      backgroundColor: `${palette.accent}12`,
                      borderColor: `${palette.accent}30`,
                      color: palette.accent,
                    }}
                  >
                    <span>{slide.footerNote || "Arraste para o lado"}</span>
                    <span className="text-xs">→</span>
                  </div>
                ),
              })}
          </div>

          {/* Branding Footer */}
          {renderFooter(slide.slideNumber, slides.length)}
        </div>
      );
    }

    // ==========================================
    // B) LAYOUT DE CTA (FECHAMENTO & CONEXÃO)
    // ==========================================
    if (isCta) {
      return (
        <div className={`h-full flex flex-col justify-between ${canvasPaddingClass} relative`}>
          {/* Top Tag - Clean single badge */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
              style={{
                backgroundColor: `${palette.accent}12`,
                borderColor: `${palette.accent}30`,
                color: palette.accent,
              }}
            >
              {slide.badge || "SALVE & COMPARTILHE"}
            </span>
          </div>

          {/* CTA Main Content */}
          <div
            className={`flex-1 flex flex-col justify-center min-h-0 my-auto ${
              typography.alignment === "center" ? "text-center items-center" : "text-left"
            }`}
          >
            <div>
              {renderAnimatedText({
                as: "h2",
                contentKey: `${slideIndex}-cta-title-${slide.title}`,
                delay: 0.02,
                className: `font-bold leading-tight mb-1.5 ${titleScaleClass}`,
                style: {
                  fontFamily: typography.titleFont,
                  color: palette.text,
                },
                contentEditable: true,
                suppressContentEditableWarning: true,
                onBlur: (e) =>
                  onUpdateSlide?.(slideIndex, { title: e.currentTarget.textContent || "" }),
                children: slide.title || "Gostou desta reflexão? Salve para não perder",
              })}
              {slide.subtitle &&
                renderAnimatedText({
                  as: "p",
                  contentKey: `${slideIndex}-cta-sub-${slide.subtitle}`,
                  delay: 0.07,
                  className: "text-xs sm:text-sm font-medium leading-relaxed opacity-85 mb-2",
                  style: {
                    fontFamily: typography.bodyFont,
                    color: palette.secondaryText,
                  },
                  contentEditable: true,
                  suppressContentEditableWarning: true,
                  onBlur: (e) =>
                    onUpdateSlide?.(slideIndex, { subtitle: e.currentTarget.textContent || "" }),
                  children: slide.subtitle,
                })}
            </div>

            {/* Clean & Balanced 3-Action Row */}
            {renderAnimatedText({
              as: "div",
              contentKey: `${slideIndex}-cta-actions`,
              delay: 0.12,
              className: "w-full max-w-sm my-1.5",
              children: (
                <div
                  className="p-2 rounded-xl border flex items-center justify-around text-center gap-1.5"
                  style={{
                    backgroundColor: `${palette.cardBg}80`,
                    borderColor: `${palette.cardBorder}80`,
                  }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: `${palette.accent}15`,
                        borderColor: `${palette.accent}30`,
                        color: palette.accent,
                      }}
                    >
                      <Bookmark className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: palette.text }}>
                      Salvar
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: `${palette.accent}15`,
                        borderColor: `${palette.accent}30`,
                        color: palette.accent,
                      }}
                    >
                      <Share2 className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: palette.text }}>
                      Compartilhar
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: `${palette.accent}15`,
                        borderColor: `${palette.accent}30`,
                        color: palette.accent,
                      }}
                    >
                      <MessageCircle className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: palette.text }}>
                      Comentar
                    </span>
                  </div>
                </div>
              ),
            })}

            {/* Subtle Clinical Bio Note */}
            {renderAnimatedText({
              as: "div",
              contentKey: `${slideIndex}-cta-bio`,
              delay: 0.16,
              className: "mt-1.5 text-center text-[11px] sm:text-xs opacity-80 leading-snug",
              style: {
                color: palette.secondaryText,
                fontFamily: typography.bodyFont,
              },
              children: (
                <p>
                  Sessões de psicoterapia online • Informações e agendamentos pelo link na bio
                </p>
              ),
            })}

            {/* Therapeutic highlight note (if present) */}
            {slide.highlightBox &&
              renderAnimatedText({
                as: "div",
                contentKey: `${slideIndex}-cta-box-${slide.highlightBox}`,
                delay: 0.2,
                className: "p-2 mt-1.5 rounded-xl border text-[11px] sm:text-xs italic leading-relaxed text-center",
                style: {
                  backgroundColor: `${palette.cardBg}80`,
                  borderColor: `${palette.cardBorder}80`,
                  color: palette.text,
                  fontFamily: typography.bodyFont,
                },
                contentEditable: true,
                suppressContentEditableWarning: true,
                onBlur: (e) =>
                  onUpdateSlide?.(slideIndex, { highlightBox: e.currentTarget.textContent || "" }),
                children: slide.highlightBox,
              })}
          </div>

          {/* Branding Footer */}
          {renderFooter(slide.slideNumber, slides.length)}
        </div>
      );
    }

    // ==========================================
    // C) LAYOUT DE CONTEÚDO DIDÁTICO
    // ==========================================
    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass} relative`}>
        {/* Top Tag Bar */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {slide.badge || `0${slide.slideNumber} • PSICOLOGIA`}
          </span>
        </div>

        {/* Slide Main Content */}
        <div
          className={`flex-1 flex flex-col justify-center min-h-0 my-auto ${
            typography.alignment === "center" ? "text-center items-center" : "text-left"
          }`}
        >
          {/* Main Title */}
          {renderAnimatedText({
            as: "h2",
            contentKey: `${slideIndex}-didactic-title-${slide.title}`,
            delay: 0.02,
            className: `font-bold leading-[1.2] tracking-tight mb-1.5 ${titleScaleClass}`,
            style: {
              fontFamily: typography.titleFont,
              color: palette.text,
            },
            contentEditable: true,
            suppressContentEditableWarning: true,
            onBlur: (e) =>
              onUpdateSlide?.(slideIndex, { title: e.currentTarget.textContent || "" }),
            children: slide.title,
          })}

          {/* Subtitle */}
          {slide.subtitle &&
            renderAnimatedText({
              as: "p",
              contentKey: `${slideIndex}-didactic-sub-${slide.subtitle}`,
              delay: 0.07,
              className: "text-xs sm:text-sm font-medium mb-1.5 leading-relaxed opacity-85",
              style: {
                fontFamily: typography.bodyFont,
                color: palette.secondaryText,
              },
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e) =>
                onUpdateSlide?.(slideIndex, { subtitle: e.currentTarget.textContent || "" }),
              children: slide.subtitle,
            })}

          {/* Body Text */}
          {slide.body &&
            renderAnimatedText({
              as: "p",
              contentKey: `${slideIndex}-didactic-body-${slide.body}`,
              delay: 0.12,
              className: `leading-relaxed mb-2 opacity-90 ${scaleClass}`,
              style: {
                fontFamily: typography.bodyFont,
                color: palette.text,
              },
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e) =>
                onUpdateSlide?.(slideIndex, { body: e.currentTarget.textContent || "" }),
              children: slide.body,
            })}

          {/* Item List (Bullets) - Clean, refined, non-boxed */}
          {slide.items && slide.items.length > 0 && (
            <div className={`w-full ${isCompact ? "space-y-1 my-1" : "space-y-1.5 my-1.5"}`}>
              {slide.items.map((item, idx) => (
                <React.Fragment key={`slide-${slideIndex}-item-${idx}-${item.slice(0, 15)}`}>
                  {renderAnimatedText({
                    key: `slide-${slideIndex}-item-${idx}`,
                    as: "div",
                    contentKey: `${slideIndex}-item-${idx}-${item}`,
                    delay: 0.14 + idx * 0.04,
                    className: "flex items-start gap-2 text-xs sm:text-sm text-left leading-relaxed",
                    style: {
                      color: palette.text,
                      fontFamily: typography.bodyFont,
                    },
                    children: (
                      <>
                        <span
                          className="font-mono text-xs font-bold shrink-0 mt-0.5"
                          style={{ color: palette.accent }}
                        >
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        <span className="flex-1 opacity-90 leading-snug">{item}</span>
                      </>
                    ),
                  })}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Highlight Box - Subtle, refined quote without harsh side border */}
          {slide.highlightBox &&
            renderAnimatedText({
              as: "div",
              contentKey: `${slideIndex}-didactic-box-${slide.highlightBox}`,
              delay: 0.22,
              className: "w-full p-2 my-1.5 rounded-xl border text-[11px] sm:text-xs italic leading-relaxed",
              style: {
                backgroundColor: `${palette.cardBg}80`,
                borderColor: `${palette.cardBorder}80`,
                color: palette.text,
                fontFamily: typography.bodyFont,
              },
              contentEditable: true,
              suppressContentEditableWarning: true,
              onBlur: (e) =>
                onUpdateSlide?.(slideIndex, { highlightBox: e.currentTarget.textContent || "" }),
              children: slide.highlightBox,
            })}

          {/* Footer Note / Swipe Instruction - Minimalist */}
          {slide.footerNote && brand.showSwipeHint &&
            renderAnimatedText({
              as: "div",
              contentKey: `${slideIndex}-didactic-fn-${slide.footerNote}`,
              delay: 0.26,
              className: "mt-1.5 text-xs font-medium flex items-center gap-1 opacity-75 tracking-wide",
              style: { color: palette.accent, fontFamily: typography.bodyFont },
              children: (
                <span>{slide.footerNote}</span>
              ),
            })}
        </div>

        {/* Branding Footer */}
        {renderFooter(slide.slideNumber, slides.length)}
      </div>
    );
  };

  // 2. Render Checklist Clínico / Guia de Sinais (Mais Salvo do Instagram)
  const renderChecklist = () => {
    const checklist = postState.checklist || {
      tag: "CHECKLIST CLÍNICO • AUTOPERCEPÇÃO",
      title: "5 Sinais de que a Autocobrança Virou Ansiedade Crônica",
      subtitle: "Identifique se o seu padrão mental está ativando seu cérebro em modo de alerta:",
      items: [
        { id: "1", text: "Incapacidade de relaxar sem sentir culpa por estar 'parado'", subtext: "A mente interpreta o descanso como uma ameaça ou perda de tempo" },
        { id: "2", text: "Procrastinação de decisões importantes por medo de falhar", subtext: "A paralisia do perfeccionismo disfuncional" },
        { id: "3", text: "Foco obsessivo nos erros, ignorando todas as suas vitórias", subtext: "Distorção cognitiva de Abstração Seletiva" },
        { id: "4", text: "Dificuldade de delegar: 'Se eu não fizer, não sairá certo'", subtext: "Hiper-responsabilidade e crença de controle" },
        { id: "5", text: "Tensão física constante nos ombros, mandíbula ou respiração curta", subtext: "Hipervigilância do sistema nervoso" },
      ],
      conclusion: "Se você se identificou com mais de 2 itens, seu cérebro está operando sob alarme falso. A psicoterapia te ajuda a desarmar esse mecanismo.",
    };

    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass}`}>
        {/* Header - Clean single badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {checklist.tag || "CHECKLIST CLÍNICO"}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-2">
          <h2
            className={`font-bold leading-tight ${titleScaleClass}`}
            style={{ fontFamily: typography.titleFont, color: palette.text }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateChecklist?.({ title: e.currentTarget.textContent || "" })}
          >
            {checklist.title}
          </h2>
          {checklist.subtitle && (
            <p
              className="text-xs sm:text-sm mt-0.5 font-medium opacity-85"
              style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateChecklist?.({ subtitle: e.currentTarget.textContent || "" })}
            >
              {checklist.subtitle}
            </p>
          )}
        </div>

        {/* Checklist Items - Clean & refined */}
        <div className="space-y-1.5 my-auto flex-1 min-h-0 flex flex-col justify-center">
          {checklist.items.map((item, idx) => (
            <div
              key={item.id ? `${item.id}-${idx}` : `checklist-item-${idx}`}
              className={`${isCompact ? "p-1.5" : "p-2 sm:p-2.5"} rounded-xl border flex items-start gap-2.5 transition`}
              style={{
                backgroundColor: `${palette.cardBg}80`,
                borderColor: `${palette.cardBorder}80`,
              }}
            >
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border"
                style={{
                  backgroundColor: `${palette.accent}15`,
                  borderColor: `${palette.accent}40`,
                  color: palette.accent,
                }}
              >
                ✓
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs sm:text-sm font-semibold leading-snug"
                  style={{ color: palette.text, fontFamily: typography.titleFont }}
                >
                  {item.text}
                </p>
                {item.subtext && (
                  <p
                    className="text-[10px] leading-snug mt-0.5 opacity-75"
                    style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
                  >
                    {item.subtext}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion / Diagnosis Box */}
        {checklist.conclusion && (
          <div
            className={`${isCompact ? "p-2 my-1 text-xs" : "p-2.5 my-2 text-xs"} rounded-xl border text-center font-medium leading-relaxed`}
            style={{
              backgroundColor: `${palette.cardBg}80`,
              borderColor: `${palette.cardBorder}80`,
              color: palette.text,
              fontFamily: typography.bodyFont,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateChecklist?.({ conclusion: e.currentTarget.textContent || "" })}
          >
            {checklist.conclusion}
          </div>
        )}

        {/* Branding Footer */}
        {renderFooter(1, 1)}
      </div>
    );
  };

  // 3. Render Matrix Comparativa (Mito vs. Realidade)
  const renderMatrix = () => {
    const { matrix } = postState;
    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {matrix.tag || "MATRIZ COMPARATIVA"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h2
            className={`font-bold leading-tight ${titleScaleClass}`}
            style={{ fontFamily: typography.titleFont, color: palette.text }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateMatrix?.({ title: e.currentTarget.textContent || "" })}
          >
            {matrix.title}
          </h2>
          {matrix.subtitle && (
            <p
              className="text-xs sm:text-sm mt-0.5 opacity-85"
              style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
            >
              {matrix.subtitle}
            </p>
          )}
        </div>

        {/* 2-Column Comparison Grid */}
        <div className={`grid grid-cols-2 ${isCompact ? "gap-2 my-auto py-0.5" : "gap-2.5 my-auto py-1"} flex-1 min-h-0`}>
          {/* Myths / Common View Column */}
          <div
            className={`${isCompact ? "p-2.5" : "p-3"} rounded-xl border flex flex-col`}
            style={{
              backgroundColor: `${palette.cardBg}80`,
              borderColor: `${palette.cardBorder}80`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-rose-500/20 text-rose-500 text-xs font-semibold uppercase tracking-wider">
              <span>✕</span>
              <span>{matrix.mythHeader || "VISÃO COMUM (MITO)"}</span>
            </div>
            <ul className={`space-y-1.5 ${isCompact ? "text-xs" : "text-xs sm:text-sm"} flex-1`} style={{ color: palette.text }}>
              {matrix.mythItems.map((item, i) => (
                <li key={`myth-${i}`} className="flex items-start gap-1.5 leading-snug opacity-90">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reality / Evidence Column */}
          <div
            className={`${isCompact ? "p-2.5" : "p-3"} rounded-xl border flex flex-col`}
            style={{
              backgroundColor: `${palette.cardBg}80`,
              borderColor: `${palette.accent}50`,
            }}
          >
            <div
              className="flex items-center gap-1.5 mb-1.5 pb-1 border-b text-xs font-semibold uppercase tracking-wider"
              style={{
                borderColor: `${palette.accent}30`,
                color: palette.accent,
              }}
            >
              <span>✓</span>
              <span>{matrix.realityHeader || "EVIDÊNCIA CLÍNICA"}</span>
            </div>
            <ul className={`space-y-1.5 ${isCompact ? "text-xs" : "text-xs sm:text-sm"} flex-1`} style={{ color: palette.text }}>
              {matrix.realityItems.map((item, i) => (
                <li key={`reality-${i}`} className="flex items-start gap-1.5 leading-snug">
                  <span style={{ color: palette.accent }} className="font-bold">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Takeaway Box */}
        {matrix.takeaway && (
          <div
            className={`${isCompact ? "p-2 my-1 text-xs" : "p-2.5 my-2 text-xs sm:text-sm"} rounded-xl border text-center font-medium leading-relaxed`}
            style={{
              backgroundColor: `${palette.cardBg}80`,
              borderColor: `${palette.cardBorder}80`,
              color: palette.text,
              fontFamily: typography.bodyFont,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateMatrix?.({ takeaway: e.currentTarget.textContent || "" })}
          >
            {matrix.takeaway}
          </div>
        )}

        {/* Branding Footer */}
        {renderFooter(1, 1)}
      </div>
    );
  };

  // 4. Render Ciclo da Mente / Fluxo Psicológico (Campeão Didático)
  const renderCycle = () => {
    const cycle = postState.cycle || {
      tag: "O CICLO DA ANSIEDADE & EVITAÇÃO",
      title: "Como a Evitação Comportamental Alimenta o Medo",
      subtitle: "O mecanismo psicológico que transforma preocupação em sintoma crônico:",
      steps: [
        { number: "1", label: "Gatilho & Situação", description: "Uma conversa difícil ou tarefa surge no dia a dia." },
        { number: "2", label: "Pensamento Automático", description: "«Não vou conseguir dar conta e todos vão me julgar.»" },
        { number: "3", label: "Comportamento de Fuga", description: "Você cancela compromissos ou adia o que precisa fazer." },
        { number: "4", label: "Alívio & Reforço", description: "A ansiedade cai na hora, ensinando o cérebro que 'fugir salvou sua vida'." },
      ],
      breakingPoint: "⚡ PONTO DE RUPTURA: Enfrentamento gradual guiado. Ao tolerar o desconforto e agir, seu cérebro aprende que o perigo não é real.",
    };

    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass}`}>
        {/* Header - Clean single badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {cycle.tag || "CICLO DA MENTE"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h2
            className={`font-bold leading-tight ${titleScaleClass}`}
            style={{ fontFamily: typography.titleFont, color: palette.text }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateCycle?.({ title: e.currentTarget.textContent || "" })}
          >
            {cycle.title}
          </h2>
          {cycle.subtitle && (
            <p
              className="text-xs sm:text-sm mt-0.5 opacity-85 font-medium"
              style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
            >
              {cycle.subtitle}
            </p>
          )}
        </div>

        {/* 4 Steps Visual Flow Cards */}
        <div className={`grid grid-cols-2 ${isCompact ? "gap-1.5 py-0.5" : "gap-2 py-1"} my-auto flex-1 min-h-0`}>
          {cycle.steps.map((st, idx) => (
            <div
              key={`cycle-step-${idx}-${st.number}`}
              className={`${isCompact ? "p-2" : "p-2.5"} rounded-xl border flex flex-col justify-between`}
              style={{
                backgroundColor: `${palette.cardBg}80`,
                borderColor: `${palette.cardBorder}80`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-mono font-bold text-[11px]"
                  style={{ color: palette.accent }}
                >
                  0{st.number}.
                </span>
                <span
                  className="text-[9.5px] font-semibold uppercase tracking-wider opacity-70"
                  style={{ color: palette.secondaryText }}
                >
                  Etapa {idx + 1}
                </span>
              </div>

              <div>
                <h4
                  className="text-xs sm:text-sm font-semibold leading-tight"
                  style={{ color: palette.text, fontFamily: typography.titleFont }}
                >
                  {st.label}
                </h4>
                <p
                  className="text-[10.5px] sm:text-xs leading-snug mt-0.5 opacity-80"
                  style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
                >
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Breaking Point Box */}
        {cycle.breakingPoint && (
          <div
            className={`${isCompact ? "p-2 my-1 text-[11px]" : "p-2.5 my-1.5 text-xs sm:text-sm"} rounded-xl border font-medium leading-relaxed`}
            style={{
              backgroundColor: `${palette.cardBg}80`,
              borderColor: `${palette.cardBorder}80`,
              color: palette.text,
              fontFamily: typography.bodyFont,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateCycle?.({ breakingPoint: e.currentTarget.textContent || "" })}
          >
            {cycle.breakingPoint}
          </div>
        )}

        {/* Branding Footer */}
        {renderFooter(1, 1)}
      </div>
    );
  };

  // 5. Render Strong Quote Editorial
  const renderQuote = () => {
    const { quote } = postState;
    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass} relative`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {quote.tag || "REFLEXÃO CLÍNICA"}
          </span>
        </div>

        {/* Quote Content */}
        <div className="my-auto flex flex-col items-center justify-center text-center max-w-xl mx-auto py-1 flex-1 min-h-0">
          {/* Subtle Quotation Mark */}
          <span
            className="text-5xl sm:text-6xl font-serif leading-none select-none opacity-30 mb-[-1rem]"
            style={{ color: palette.accent }}
          >
            “
          </span>

          <blockquote
            className={`font-serif italic font-medium leading-snug tracking-tight mb-3 ${titleScaleClass}`}
            style={{
              fontFamily: typography.titleFont,
              color: palette.text,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateQuote?.({ quote: e.currentTarget.textContent || "" })}
          >
            {quote.quote}
          </blockquote>

          {/* Author attribution */}
          <div
            className="text-xs sm:text-sm font-semibold tracking-wider uppercase mb-3 opacity-80"
            style={{
              color: palette.accent,
              fontFamily: typography.bodyFont,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateQuote?.({ author: e.currentTarget.textContent || "" })}
          >
            — {quote.author}
          </div>

          {/* Reflection */}
          {quote.reflection && (
            <p
              className={`leading-relaxed max-w-md opacity-85 ${scaleClass}`}
              style={{
                fontFamily: typography.bodyFont,
                color: palette.secondaryText,
              }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateQuote?.({ reflection: e.currentTarget.textContent || "" })}
            >
              {quote.reflection}
            </p>
          )}

          {/* Call to action prompt */}
          {quote.callToAction && (
            <div
              className="mt-2 text-xs font-semibold tracking-wide opacity-80"
              style={{ color: palette.accent, fontFamily: typography.bodyFont }}
            >
              {quote.callToAction}
            </div>
          )}
        </div>

        {/* Branding Footer */}
        {renderFooter(1, 1)}
      </div>
    );
  };

  // 6. Render Coping Card / SOS
  const renderCopingCard = () => {
    const { copingCard } = postState;
    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {copingCard.tag || "CARTÃO DE ENFRENTAMENTO"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h2
            className={`font-bold leading-tight ${titleScaleClass}`}
            style={{ fontFamily: typography.titleFont, color: palette.text }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateCopingCard?.({ title: e.currentTarget.textContent || "" })}
          >
            {copingCard.title}
          </h2>
          {copingCard.subtitle && (
            <p
              className="text-xs sm:text-sm mt-0.5 opacity-85"
              style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
            >
              {copingCard.subtitle}
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-1.5 my-auto flex-1 min-h-0 flex flex-col justify-center">
          {copingCard.steps.map((st, idx) => (
            <div
              key={`coping-step-${idx}-${st.number}`}
              className={`${isCompact ? "p-2" : "p-2.5"} rounded-xl border flex items-center gap-2.5 transition`}
              style={{
                backgroundColor: `${palette.cardBg}80`,
                borderColor: `${palette.cardBorder}80`,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 border"
                style={{
                  backgroundColor: `${palette.accent}15`,
                  borderColor: `${palette.accent}40`,
                  color: palette.accent,
                }}
              >
                {st.number}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-xs sm:text-sm font-semibold leading-tight"
                  style={{ color: palette.text, fontFamily: typography.titleFont }}
                >
                  {st.title}
                </h4>
                <p
                  className="text-[10.5px] sm:text-xs leading-snug mt-0.5 opacity-80"
                  style={{ color: palette.secondaryText, fontFamily: typography.bodyFont }}
                >
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mantra Box */}
        {copingCard.mantra && (
          <div
            className={`${isCompact ? "p-2 my-1 text-xs" : "p-2.5 my-2 text-xs sm:text-sm"} rounded-xl border text-center italic font-medium`}
            style={{
              backgroundColor: `${palette.cardBg}80`,
              borderColor: `${palette.cardBorder}80`,
              color: palette.text,
              fontFamily: typography.bodyFont,
            }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateCopingCard?.({ mantra: e.currentTarget.textContent || "" })}
          >
            {copingCard.mantra}
          </div>
        )}

        {/* Branding Footer */}
        {renderFooter(1, 1)}
      </div>
    );
  };

  // 7. Render Pergunta Terapêutica / Quebra de Padrão (Campeão de Comentários & DM)
  const renderQAProvocation = () => {
    const qa = postState.qaProvocation || {
      tag: "PERGUNTA TERAPÊUTICA & REFLEXÃO",
      question: "O que você faria hoje se não tivesse a obrigação de ser perfeito?",
      context: "Muitas vezes passamos a vida obedecendo a regras invisíveis que aprendemos no passado. Essas regras não são leis biológicas; são apenas pensamentos que você nunca questionou.",
      subQuestions: [
        "De onde veio essa regra de que você nunca pode falhar?",
        "Quem você está tentando não decepcionar até hoje?",
        "Qual é o custo emocional de sustentar esse padrão nos próximos 5 anos?",
      ],
      therapeuticTakeaway: "A sua paz não depende de controlar o mundo, mas de confiar na sua capacidade de lidar com o imperfeito.",
      invitation: "Deixe nos comentários: qual cobrança você escolhe soltar hoje?",
    };

    return (
      <div className={`h-full flex flex-col justify-between ${canvasPaddingClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border"
            style={{
              backgroundColor: `${palette.accent}12`,
              borderColor: `${palette.accent}30`,
              color: palette.accent,
            }}
          >
            {qa.tag || "PERGUNTA TERAPÊUTICA"}
          </span>
        </div>

        {/* Big Provocative Question */}
        <div className="my-auto space-y-1.5 flex-1 min-h-0 flex flex-col justify-center">
          <h2
            className={`font-bold leading-[1.2] tracking-tight ${titleScaleClass}`}
            style={{ fontFamily: typography.titleFont, color: palette.text }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdateQAProvocation?.({ question: e.currentTarget.textContent || "" })}
          >
            {qa.question}
          </h2>

          {/* Context */}
          {qa.context && (
            <p
              className={`leading-relaxed opacity-85 ${scaleClass}`}
              style={{ fontFamily: typography.bodyFont, color: palette.secondaryText }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateQAProvocation?.({ context: e.currentTarget.textContent || "" })}
            >
              {qa.context}
            </p>
          )}

          {/* Sub questions */}
          {qa.subQuestions && qa.subQuestions.length > 0 && (
            <div className={`space-y-1.5 ${isCompact ? "pt-0.5" : "pt-1"}`}>
              {qa.subQuestions.map((q, idx) => (
                <div
                  key={`qa-sub-${idx}`}
                  className={`${isCompact ? "p-1.5" : "p-2"} rounded-xl border flex items-start gap-2 text-xs sm:text-sm`}
                  style={{
                    backgroundColor: `${palette.cardBg}80`,
                    borderColor: `${palette.cardBorder}80`,
                    color: palette.text,
                    fontFamily: typography.bodyFont,
                  }}
                >
                  <span style={{ color: palette.accent }} className="font-bold shrink-0">
                    •
                  </span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          )}

          {/* Therapeutic Takeaway */}
          {qa.therapeuticTakeaway && (
            <div
              className={`${isCompact ? "p-2 text-xs" : "p-2.5 text-xs sm:text-sm"} rounded-xl border italic font-medium leading-relaxed`}
              style={{
                backgroundColor: `${palette.cardBg}80`,
                borderColor: `${palette.cardBorder}80`,
                color: palette.text,
                fontFamily: typography.bodyFont,
              }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateQAProvocation?.({ therapeuticTakeaway: e.currentTarget.textContent || "" })}
            >
              {qa.therapeuticTakeaway}
            </div>
          )}

          {/* Invitation / Call to Comments */}
          {qa.invitation && (
            <div
              className="text-xs font-semibold tracking-wide opacity-85 pt-0.5"
              style={{ color: palette.accent, fontFamily: typography.bodyFont }}
            >
              <span>{qa.invitation}</span>
            </div>
          )}
        </div>

        {/* Branding Footer */}
        {renderFooter(1, 1)}
      </div>
    );
  };

  const renderTextureLayer = () => {
    const texture = postState.texture || "none";
    if (texture === "none") return null;

    if (texture === "grain") {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-35 mix-blend-overlay"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id={`grain-filter-${slideIndex}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#grain-filter-${slideIndex})`} />
          </svg>
        </div>
      );
    }

    if (texture === "paper") {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-1 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(${palette.cardBorder} 0.75px, transparent 0.75px), radial-gradient(${palette.cardBorder} 0.75px, transparent 0.75px)`,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
          aria-hidden="true"
        />
      );
    }

    if (texture === "subtle-dots") {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-1 opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(${palette.accent} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
      );
    }

    if (texture === "warm-linen") {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-1 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${palette.cardBorder}33 0, ${palette.cardBorder}33 1px, transparent 0, transparent 6px), repeating-linear-gradient(-45deg, ${palette.cardBorder}33 0, ${palette.cardBorder}33 1px, transparent 0, transparent 6px)`,
          }}
          aria-hidden="true"
        />
      );
    }

    return null;
  };

  return (
    <div
      className={`relative group w-full mx-auto select-text transition-all duration-300 flex justify-center items-center ${
        isExporting ? "" : "py-1 sm:py-2"
      }`}
    >
      {/* Canvas Element that will be exported to PNG via html2canvas */}
      <div
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        data-export-id={`slide-canvas-${slideIndex}`}
        className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 relative border flex flex-col justify-between"
        style={{
          backgroundColor: palette.background,
          borderColor: palette.cardBorder,
          ...(isExporting
            ? isStory
              ? { width: "450px", height: "800px", minWidth: "450px", minHeight: "800px" }
              : isVertical
              ? { width: "540px", height: "675px", minWidth: "540px", minHeight: "675px" }
              : { width: "540px", height: "540px", minWidth: "540px", minHeight: "540px" }
            : {
                aspectRatio: isStory ? "9 / 16" : isVertical ? "4 / 5" : "1 / 1",
                width: "100%",
                maxWidth: isFocusMode
                  ? isStory
                    ? "min(calc(min(80vh, 640px) * 9 / 16), 360px)"
                    : isVertical
                    ? "min(calc(min(78vh, 600px) * 4 / 5), 450px)"
                    : "min(min(72vh, 480px), 480px)"
                  : isStory
                  ? "min(calc(min(72vh, 560px) * 9 / 16), 330px)"
                  : isVertical
                  ? "min(calc(min(70vh, 520px) * 4 / 5), 415px)"
                  : "min(min(66vh, 440px), 440px)",
              }),
        }}
      >
        {/* Subtle decorative background noise / gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(circle at 10% 10%, ${palette.cardBg} 0%, transparent 60%)`,
          }}
        />

        {/* Tactile Texture Layer (Analog grain, paper, linen, dots) */}
        {renderTextureLayer()}

        {/* Custom Uploaded Background Image Layer (if user chose background placement) */}
        {activeCustomImage && activeCustomImage.url && activeCustomImage.placement === "background" && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0"
            style={{
              opacity: activeCustomImage.opacity ?? 0.22,
              filter: activeCustomImage.blur ? `blur(${activeCustomImage.blur}px)` : undefined,
              mixBlendMode: activeCustomImage.blendMode || "normal",
            }}
          >
            {/* If contain mode, render ambient blurred copy behind so uncropped image looks premium and seamless */}
            {activeCustomImage.fit === "contain" && (
              <img
                src={activeCustomImage.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110"
                referrerPolicy="no-referrer"
              />
            )}
            <img
              src={activeCustomImage.url}
              alt="Imagem de Fundo Personalizada"
              className={`w-full h-full relative z-10 ${
                activeCustomImage.fit === "contain"
                  ? "object-contain p-2"
                  : activeCustomImage.fit === "scale-down"
                  ? "object-scale-down p-1"
                  : "object-cover"
              } ${
                activeCustomImage.position === "top"
                  ? "object-top"
                  : activeCustomImage.position === "bottom"
                  ? "object-bottom"
                  : "object-center"
              }`}
              style={{
                transform:
                  activeCustomImage.scale && activeCustomImage.scale !== 1
                    ? `scale(${activeCustomImage.scale})`
                    : undefined,
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Large Vector Illustration Background Layer (Reconnecting the post/series) */}
        {activeIllustration !== "none" &&
          (postState.illustrationPlacement === "background" ||
            postState.illustrationPlacement === "both" ||
            !postState.illustrationPlacement) && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
              <SvgIllustrationBackgroundRenderer
                type={activeIllustration}
                accentColor={palette.accent}
                secondaryColor={palette.secondaryText}
                opacity={postState.illustrationOpacity ?? 0.16}
                scale={postState.illustrationScale ?? "expansive"}
                slideIndex={slideIndex}
                totalSlides={postState.format === "carousel" ? postState.carousel.slides.length : 1}
                connectSlides={postState.connectSlides ?? true}
              />
            </div>
          )}

        {/* Active Format Content (Rendered above background with perfect z-10 readability) */}
        <div className="relative z-10 h-full flex flex-col overflow-hidden">
          {format === "carousel" &&
            (isExporting ? (
              renderCarouselSlide()
            ) : (
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={`slide-${slideIndex}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full w-full flex flex-col"
                >
                  {renderCarouselSlide()}
                </motion.div>
              </AnimatePresence>
            ))}
          {format === "checklist" &&
            (isExporting ? (
              renderChecklist()
            ) : (
              <motion.div
                key="format-checklist"
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col"
              >
                {renderChecklist()}
              </motion.div>
            ))}
          {format === "matrix" &&
            (isExporting ? (
              renderMatrix()
            ) : (
              <motion.div
                key="format-matrix"
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col"
              >
                {renderMatrix()}
              </motion.div>
            ))}
          {format === "cycle" &&
            (isExporting ? (
              renderCycle()
            ) : (
              <motion.div
                key="format-cycle"
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col"
              >
                {renderCycle()}
              </motion.div>
            ))}
          {format === "quote" &&
            (isExporting ? (
              renderQuote()
            ) : (
              <motion.div
                key="format-quote"
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col"
              >
                {renderQuote()}
              </motion.div>
            ))}
          {format === "coping_card" &&
            (isExporting ? (
              renderCopingCard()
            ) : (
              <motion.div
                key="format-coping_card"
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col"
              >
                {renderCopingCard()}
              </motion.div>
            ))}
          {format === "qa_provocation" &&
            (isExporting ? (
              renderQAProvocation()
            ) : (
              <motion.div
                key="format-qa_provocation"
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col"
              >
                {renderQAProvocation()}
              </motion.div>
            ))}
        </div>

        {/* Custom Uploaded Foreground Image Layer (if user chose foreground / overlay placement) */}
        {activeCustomImage && activeCustomImage.url && activeCustomImage.placement === "foreground" && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-20"
            style={{
              opacity: activeCustomImage.opacity ?? 0.85,
              filter: activeCustomImage.blur ? `blur(${activeCustomImage.blur}px)` : undefined,
              mixBlendMode: activeCustomImage.blendMode || "normal",
            }}
          >
            <img
              src={activeCustomImage.url}
              alt="Sobreposição / Frente Personalizada"
              className={`w-full h-full ${
                activeCustomImage.fit === "contain"
                  ? "object-contain p-3"
                  : activeCustomImage.fit === "scale-down"
                  ? "object-scale-down p-1"
                  : "object-cover"
              } ${
                activeCustomImage.position === "top"
                  ? "object-top"
                  : activeCustomImage.position === "bottom"
                  ? "object-bottom"
                  : "object-center"
              }`}
              style={{
                transform:
                  activeCustomImage.scale && activeCustomImage.scale !== 1
                    ? `scale(${activeCustomImage.scale})`
                    : undefined,
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      {/* Floating Single-Download Action Button */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={handleDownloadSingle}
          title="Baixar este slide em PNG HD (3x)"
          className="p-2 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-xl shadow-lg border border-neutral-700/80 transition flex items-center gap-1.5 text-xs backdrop-blur cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>PNG HD</span>
        </button>
      </div>
    </div>
  );
};
