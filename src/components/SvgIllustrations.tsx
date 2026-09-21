import React from "react";
import { SvgIllustration } from "../types";

interface SvgIllustrationProps {
  type: SvgIllustration;
  accentColor: string;
  secondaryColor?: string;
  className?: string;
}

interface SvgIllustrationBackgroundProps {
  type: SvgIllustration;
  accentColor: string;
  secondaryColor?: string;
  opacity?: number;
  scale?: "normal" | "large" | "expansive";
  slideIndex?: number;
  totalSlides?: number;
  connectSlides?: boolean;
}

/**
 * Compact icon/badge renderer (for header/top detail)
 */
export const SvgIllustrationRenderer: React.FC<SvgIllustrationProps> = ({
  type,
  accentColor,
  secondaryColor = "currentColor",
  className = "w-14 h-8",
}) => {
  if (type === "none") return null;

  switch (type) {
    case "existential_thread":
      return (
        <svg
          viewBox="0 0 200 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M10 40C40 10 70 70 100 40C130 10 160 70 190 40"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
          <circle cx="10" cy="40" r="4" fill={accentColor} />
          <circle cx="100" cy="40" r="5" fill={accentColor} />
          <circle cx="190" cy="40" r="4" fill={accentColor} />
        </svg>
      );

    case "mind_brain":
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M30 65C22 62 18 52 20 42C22 32 30 25 40 25C44 18 56 18 60 25C70 25 78 32 80 42C82 52 78 62 70 65C68 75 58 82 50 82C42 82 32 75 30 65Z"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M50 25V82"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle cx="38" cy="45" r="3.5" fill={accentColor} />
          <circle cx="62" cy="45" r="3.5" fill={accentColor} />
          <circle cx="50" cy="60" r="3" fill={accentColor} />
        </svg>
      );

    case "anxiety_knot":
      return (
        <svg
          viewBox="0 0 140 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M10 30C15 15 25 45 35 20C45 45 25 15 40 35C48 48 55 25 65 30C80 30 105 30 130 30"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="130" cy="30" r="4" fill={accentColor} />
        </svg>
      );

    case "gestalt_awareness":
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="40" cy="40" r="30" stroke={accentColor} strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="40" cy="40" r="16" stroke={accentColor} strokeWidth="2.5" />
          <circle cx="40" cy="40" r="5" fill={accentColor} />
        </svg>
      );

    case "balance_stones":
      return (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <ellipse cx="40" cy="62" rx="26" ry="10" stroke={accentColor} strokeWidth="2" />
          <ellipse cx="40" cy="45" rx="19" ry="8" stroke={accentColor} strokeWidth="2" />
          <ellipse cx="40" cy="30" rx="12" ry="6" stroke={accentColor} strokeWidth="2" />
          <circle cx="40" cy="18" r="4" fill={accentColor} />
        </svg>
      );

    case "neural_waves":
      return (
        <svg
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M10 30C30 10 40 50 60 30C80 10 90 50 110 30"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 42C30 22 40 62 60 42C80 22 90 62 110 42"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "cognitive_path":
      return (
        <svg
          viewBox="0 0 120 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M10 20H110"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx="20" cy="20" r="5" fill={accentColor} />
          <circle cx="60" cy="20" r="6" stroke={accentColor} strokeWidth="2" fill="none" />
          <circle cx="100" cy="20" r="5" fill={accentColor} />
        </svg>
      );

    case "clean_editorial":
      return (
        <svg
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M30 5L33 23L51 26L35 34L39 52L26 40L11 48L19 32L6 22L24 21L30 5Z"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="30" cy="28" r="3" fill={accentColor} />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * Large, Expansive Background Vector Illustration Renderer
 * Creates a continuous, seamless, connected narrative journey across carousel slides:
 * - Slide 1 (Início): Genesis spark / origin node / initial tension, sending the primary line to the right edge
 * - Middle Slides (Travessia / Desenvolvimento): Line enters at the exact seam height, flows through transformations and insights, and exits at the right edge
 * - Last Slide (Conclusão / Desfecho): Line enters from previous slide and resolves into a peaceful grounded zen circle, calm anchor, or synthesized clarity
 * - Single-slide formats: Complete self-contained origin -> transformation -> resolution arc
 */
export const SvgIllustrationBackgroundRenderer: React.FC<SvgIllustrationBackgroundProps> = ({
  type,
  accentColor,
  secondaryColor = "currentColor",
  opacity = 0.16,
  scale = "expansive",
  slideIndex = 0,
  totalSlides = 1,
  connectSlides = true,
}) => {
  if (type === "none") return null;

  // Scale multiplier
  const scaleValue = scale === "expansive" ? 1.25 : scale === "large" ? 1.05 : 0.85;

  const isMultiSlide = totalSlides > 1 && connectSlides;
  const isFirstSlide = isMultiSlide && slideIndex === 0;
  const isLastSlide = isMultiSlide && slideIndex === totalSlides - 1;
  const isMiddleSlide = isMultiSlide && !isFirstSlide && !isLastSlide;

  // Mathematical boundary seam heights in SVG viewBox space (0..800 width, 0..1000 height)
  // Perfectly matching the exit height of slide (k-1) with the entry height of slide (k)
  const getSeamHeight = (boundaryIndex: number): number => {
    const phase = boundaryIndex * 1.75;
    return 500 + Math.sin(phase) * 95; // Stays gently between 405 and 595
  };

  const getSecondarySeamHeight = (boundaryIndex: number): number => {
    const phase = boundaryIndex * 1.75 + 1.1;
    return 540 + Math.sin(phase) * 75; // Stays gently between 465 and 615
  };

  const yIn = getSeamHeight(slideIndex);
  const yOut = getSeamHeight(slideIndex + 1);

  const yIn2 = getSecondarySeamHeight(slideIndex);
  const yOut2 = getSecondarySeamHeight(slideIndex + 1);

  const progress = isMultiSlide ? slideIndex / (totalSlides - 1) : 0.5;
  const waveMod = Math.sin(progress * Math.PI) * 40;

  switch (type) {
    case "existential_thread": {
      // Continuous Harmonic Thread connecting the mind from beginning to resolution
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {isFirstSlide ? (
              <>
                {/* SLIDE 1 (INÍCIO): Origin spark & leaving spline */}
                {/* Genesis Origin Pulsing Rings */}
                <circle cx="160" cy={yIn} r="65" stroke={accentColor} strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
                <circle cx="160" cy={yIn} r="38" stroke={accentColor} strokeWidth="1.5" />
                <circle cx="160" cy={yIn} r="14" fill={accentColor} fillOpacity="0.25" />
                <circle cx="160" cy={yIn} r="6" fill={accentColor} />

                {/* Initial Thread departing from Genesis */}
                <path
                  d={`M 160 ${yIn} C 320 ${yIn - 180}, 440 ${yIn + 140}, 580 ${yIn - 60} C 680 ${yIn - 180}, 720 ${yOut}, 800 ${yOut}`}
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Secondary Harmonic Departure Echo */}
                <path
                  d={`M 160 ${yIn + 20} C 340 ${yIn - 110}, 460 ${yIn + 190}, 600 ${yIn - 20} C 690 ${yIn - 120}, 730 ${yOut2}, 800 ${yOut2}`}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
                {/* Intermediate Insight Node */}
                <circle cx="580" cy={yIn - 60} r="7" fill={accentColor} />
                <circle cx="580" cy={yIn - 60} r="22" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" />
                {/* Direction Flow Particles */}
                <circle cx="380" cy={yIn - 40} r="4" fill={accentColor} />
                <circle cx="740" cy={yOut - 10} r="3.5" fill={accentColor} />
              </>
            ) : isMiddleSlide ? (
              <>
                {/* MIDDLE SLIDES (TRAVESSIA): Enters at yIn, flows through insights, exits at yOut */}
                <path
                  d={`M 0 ${yIn} C 120 ${yIn}, 220 ${yIn + (slideIndex % 2 === 0 ? 180 : -180)}, 400 ${500 + waveMod} C 580 ${500 - waveMod}, 680 ${yOut}, 800 ${yOut}`}
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0 ${yIn2} C 130 ${yIn2}, 230 ${yIn2 + (slideIndex % 2 === 0 ? 220 : -140)}, 410 ${540 + waveMod}, 590 ${540 - waveMod}, 690 ${yOut2}, 800 ${yOut2}`}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
                {/* Central Awakening Nodes */}
                <circle cx="400" cy={500 + waveMod} r="36" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="400" cy={500 + waveMod} r="14" fill={accentColor} fillOpacity="0.2" />
                <circle cx="400" cy={500 + waveMod} r="5" fill={accentColor} />

                <circle cx="220" cy={yIn + (slideIndex % 2 === 0 ? 180 : -180)} r="6" fill={accentColor} />
                <circle cx="620" cy={yOut - 30} r="4.5" fill={accentColor} />
              </>
            ) : isLastSlide ? (
              <>
                {/* LAST SLIDE (CONCLUSÃO / DESFECHO): Enters at yIn and resolves into Zen grounding Ensō */}
                <path
                  d={`M 0 ${yIn} C 140 ${yIn}, 280 ${yIn + 120}, 420 500 C 470 500, 520 500, 560 500`}
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0 ${yIn2} C 150 ${yIn2}, 290 ${yIn2 + 150}, 430 530 C 480 530, 530 520, 560 500`}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />

                {/* Destination Grounding Circle / Zen Ensō Synthesis */}
                <circle cx="560" cy="500" r="140" stroke={accentColor} strokeWidth="1" strokeDasharray="8 8" />
                <circle cx="560" cy="500" r="85" stroke={accentColor} strokeWidth="2.5" />
                <circle cx="560" cy="500" r="45" fill={accentColor} fillOpacity="0.15" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="560" cy="500" r="12" fill={accentColor} />
                <circle cx="560" cy="500" r="4" fill="#FFFFFF" />

                {/* Radiant Horizon of Integration */}
                <line x1="420" y1="500" x2="700" y2="500" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <line x1="560" y1="360" x2="560" y2="640" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </>
            ) : (
              <>
                {/* SINGLE SLIDE FORMAT (CHECKLIST, QUOTE, ETC.): Full Início -> Meio -> Fim */}
                <circle cx="120" cy="500" r="18" stroke={accentColor} strokeWidth="1.5" />
                <circle cx="120" cy="500" r="6" fill={accentColor} />
                <path
                  d="M 120 500 C 260 300, 360 700, 500 450 C 580 320, 640 500, 680 500"
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 120 520 C 270 340, 370 740, 510 490 C 590 360, 650 520, 680 500"
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
                <circle cx="680" cy="500" r="50" stroke={accentColor} strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="680" cy="500" r="10" fill={accentColor} />
              </>
            )}
          </svg>
        </div>
      );
    }

    case "anxiety_knot": {
      // From entangled chaos/tension to gradual untangling and serene resolution
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {isFirstSlide ? (
              <>
                {/* SLIDE 1: Entangled Tension Knot on left, releasing first fluid thread rightward */}
                <path
                  d={`M 180 ${yIn} C 120 ${yIn - 180}, 280 ${yIn - 160}, 240 ${yIn + 120} C 200 ${yIn + 220}, 100 ${yIn - 60}, 200 ${yIn - 120} C 280 ${yIn - 160}, 340 ${yIn + 80}, 420 ${yIn} C 540 ${yIn - 120}, 660 ${yOut + 60}, 800 ${yOut}`}
                  stroke={accentColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d={`M 200 ${yIn + 40} C 140 ${yIn - 120}, 300 ${yIn - 100}, 260 ${yIn + 160} C 220 ${yIn + 240}, 140 ${yIn}, 220 ${yIn - 60} C 300 ${yIn - 80}, 360 ${yIn + 120}, 440 ${yIn + 40} C 560 ${yIn - 80}, 670 ${yOut2 + 40}, 800 ${yOut2}`}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                {/* Entangled Focal Knot */}
                <circle cx="210" cy={yIn - 30} r="80" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <circle cx="210" cy={yIn - 30} r="25" fill={accentColor} fillOpacity="0.2" />
                <circle cx="210" cy={yIn - 30} r="8" fill={accentColor} />
              </>
            ) : isMiddleSlide ? (
              <>
                {/* MIDDLE SLIDES: The knot untangles into wide, relaxing sinusoidal breath waves */}
                <path
                  d={`M 0 ${yIn} C 150 ${yIn}, 260 ${yIn + (slideIndex % 2 === 0 ? 140 : -140)}, 400 ${500} C 540 ${500}, 650 ${yOut}, 800 ${yOut}`}
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0 ${yIn2} C 160 ${yIn2}, 270 ${yIn2 + (slideIndex % 2 === 0 ? 180 : -100)}, 410 ${540}, 550 ${540}, 660 ${yOut2}, 800 ${yOut2}`}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Untangling Flow Rings */}
                <circle cx="400" cy="500" r="45" stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="400" cy="500" r="10" fill={accentColor} fillOpacity="0.3" />
                <circle cx="400" cy="500" r="4" fill={accentColor} />
              </>
            ) : isLastSlide ? (
              <>
                {/* LAST SLIDE: Completely straight, serene, peaceful line & grounded calm nucleus */}
                <path
                  d={`M 0 ${yIn} C 160 ${yIn}, 320 500, 520 500`}
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0 ${yIn2} C 170 ${yIn2}, 330 530, 520 500`}
                  stroke={secondaryColor}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.6"
                />
                {/* Tranquil Anchor Center (Zero Tension) */}
                <circle cx="520" cy="500" r="110" stroke={accentColor} strokeWidth="1" strokeDasharray="8 8" />
                <circle cx="520" cy="500" r="60" stroke={accentColor} strokeWidth="2" />
                <circle cx="520" cy="500" r="28" fill={accentColor} fillOpacity="0.2" />
                <circle cx="520" cy="500" r="8" fill={accentColor} />
                <circle cx="620" cy="500" r="4" fill={accentColor} />
                <circle cx="680" cy="500" r="2.5" fill={accentColor} />
              </>
            ) : (
              <>
                {/* SINGLE SLIDE */}
                <path
                  d="M 60 500 C 140 280, 220 720, 300 400 C 380 180, 480 620, 600 500 L 740 500"
                  stroke={accentColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="210" cy="450" r="40" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="740" cy="500" r="30" stroke={accentColor} strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="740" cy="500" r="8" fill={accentColor} />
              </>
            )}
          </svg>
        </div>
      );
    }

    case "mind_brain": {
      // Large Subtle Silhouette of the Mind & Synaptic Network with seamless narrative continuity
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Primary Neural Connector Spline */}
            {isMultiSlide ? (
              <>
                <path
                  d={
                    isFirstSlide
                      ? `M 220 ${yIn} C 360 ${yIn - 140}, 500 ${yIn + 120}, 650 ${yOut - 40} L 800 ${yOut}`
                      : isLastSlide
                      ? `M 0 ${yIn} C 180 ${yIn + 40}, 340 500, 500 500`
                      : `M 0 ${yIn} C 180 ${yIn}, 340 ${500 + waveMod}, 480 ${500 - waveMod} C 620 ${500 - waveMod}, 700 ${yOut}, 800 ${yOut}`
                  }
                  stroke={accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d={
                    isFirstSlide
                      ? `M 220 ${yIn + 30} C 370 ${yIn - 90}, 510 ${yIn + 170}, 660 ${yOut2} L 800 ${yOut2}`
                      : isLastSlide
                      ? `M 0 ${yIn2} C 190 ${yIn2 + 20}, 350 530, 500 500`
                      : `M 0 ${yIn2} C 190 ${yIn2}, 350 ${540 + waveMod}, 490 ${540 - waveMod} C 630 ${540 - waveMod}, 710 ${yOut2}, 800 ${yOut2}`
                  }
                  stroke={accentColor}
                  strokeWidth="1.5"
                  strokeDasharray="6 6"
                />
              </>
            ) : (
              <path
                d="M 80 500 C 240 320, 560 680, 720 500"
                stroke={accentColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* Expansive Mind Contour Silhouette */}
            <path
              d="M 240 680 C 180 650, 140 560, 150 460 C 160 360, 230 280, 330 250 C 370 190, 480 180, 550 240 C 640 240, 710 320, 720 420 C 730 520, 690 620, 610 670 C 580 760, 480 820, 400 820 C 330 820, 250 760, 240 680 Z"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Neural Synapses & Insight Junctions */}
            <g stroke={accentColor} strokeWidth="1.5">
              <line x1="280" y1="420" x2="400" y2="360" />
              <line x1="400" y1="360" x2="520" y2="400" />
              <line x1="520" y1="400" x2="600" y2="520" />
              <line x1="400" y1="360" x2="400" y2="540" />
              <line x1="280" y1="420" x2="330" y2="580" />
              <line x1="330" y1="580" x2="400" y2="540" />
              <line x1="400" y1="540" x2="510" y2="600" />
              <line x1="510" y1="600" x2="600" y2="520" />
            </g>

            {/* Glowing Focal Points */}
            <circle cx="400" cy="360" r="12" fill={accentColor} fillOpacity="0.25" />
            <circle cx="400" cy="360" r="5" fill={accentColor} />
            <circle cx="280" cy="420" r="5" fill={accentColor} />
            <circle cx="520" cy="400" r="5" fill={accentColor} />
            <circle cx="400" cy="540" r="7" fill={accentColor} />
            <circle cx="330" cy="580" r="5" fill={accentColor} />
            <circle cx="510" cy="600" r="5" fill={accentColor} />
            <circle cx="600" cy="520" r="5" fill={accentColor} />

            {/* Ambient Thought Ripples */}
            <circle cx="400" cy="480" r="190" stroke={accentColor} strokeWidth="1" strokeDasharray="8 8" />
            <circle cx="400" cy="480" r="280" stroke={secondaryColor} strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.4" />
          </svg>
        </div>
      );
    }

    case "gestalt_awareness": {
      // Gestalt Awareness Field & Contact Boundary
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Seamless Contact Boundary Spline */}
            {isMultiSlide && (
              <path
                d={
                  isFirstSlide
                    ? `M 400 500 C 500 420, 650 ${yOut - 30}, 800 ${yOut}`
                    : isLastSlide
                    ? `M 0 ${yIn} C 150 ${yIn + 20}, 300 500, 400 500`
                    : `M 0 ${yIn} C 160 ${yIn}, 300 450, 400 500 C 500 550, 640 ${yOut}, 800 ${yOut}`
                }
                stroke={accentColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )}

            {/* Expansive Gestalt Ensō / Awareness Circle */}
            <circle cx="400" cy="500" r="320" stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="400" cy="500" r="240" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="400" cy="500" r="140" stroke={accentColor} strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Here-and-Now Anchor Center */}
            <circle cx="400" cy="500" r="50" fill={accentColor} fillOpacity="0.15" />
            <circle cx="400" cy="500" r="12" fill={accentColor} />

            {/* Dynamic Contact Field Rays */}
            <line x1="100" y1="500" x2="700" y2="500" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="400" y1="200" x2="400" y2="800" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </div>
      );
    }

    case "balance_stones": {
      // Zen Balancing Stones & Emotional Grounding
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Horizon Harmony Line traversing across slides */}
            {isMultiSlide ? (
              <path
                d={
                  isFirstSlide
                    ? `M 400 780 C 520 780, 660 ${yOut}, 800 ${yOut}`
                    : isLastSlide
                    ? `M 0 ${yIn} C 160 ${yIn}, 280 780, 400 780`
                    : `M 0 ${yIn} C 180 ${yIn}, 300 780, 400 780 C 500 780, 640 ${yOut}, 800 ${yOut}`
                }
                stroke={accentColor}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            ) : (
              <line x1="60" y1="780" x2="740" y2="780" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="3 3" />
            )}

            {/* Vertical Gravity Line of Grounding */}
            <line x1="400" y1="120" x2="400" y2="880" stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Stacked Organic Balanced Stones */}
            {/* Base Stone */}
            <path
              d="M 180 780 C 180 700, 260 660, 400 660 C 540 660, 620 700, 620 780 C 620 840, 520 860, 400 860 C 280 860, 180 840, 180 780 Z"
              stroke={accentColor}
              strokeWidth="3.5"
            />
            {/* Second Stone */}
            <path
              d="M 240 560 C 240 500, 300 470, 400 470 C 500 470, 560 500, 560 560 C 560 610, 490 630, 400 630 C 310 630, 240 610, 240 560 Z"
              stroke={accentColor}
              strokeWidth="3"
            />
            {/* Third Stone */}
            <path
              d="M 290 380 C 290 330, 340 310, 400 310 C 460 310, 510 330, 510 380 C 510 420, 460 440, 400 440 C 340 440, 290 420, 290 380 Z"
              stroke={accentColor}
              strokeWidth="2.5"
            />
            {/* Top Keystone Sphere */}
            <circle cx="400" cy="230" r="45" stroke={accentColor} strokeWidth="3" />
            <circle cx="400" cy="230" r="14" fill={accentColor} fillOpacity="0.3" />
          </svg>
        </div>
      );
    }

    case "neural_waves": {
      // Topographic Nervous System & Diaphragmatic Breath Waves with seamless continuous harmonics
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {[
              { yOffset: -280, width: 2, dash: "none" },
              { yOffset: -140, width: 3, dash: "none" },
              { yOffset: 0, width: 4, dash: "none" },
              { yOffset: 140, width: 2.5, dash: "6 6" },
              { yOffset: 280, width: 1.5, dash: "4 4" },
            ].map((wave, i) => {
              const startY = isMultiSlide ? yIn + wave.yOffset * 0.5 : 500 + wave.yOffset;
              const endY = isMultiSlide ? yOut + wave.yOffset * 0.5 : 500 + wave.yOffset;
              return (
                <path
                  key={i}
                  d={`M 0 ${startY} C 200 ${startY + (i % 2 === 0 ? 100 : -100)}, 600 ${endY - (i % 2 === 0 ? 100 : -100)}, 800 ${endY}`}
                  stroke={accentColor}
                  strokeWidth={wave.width}
                  strokeLinecap="round"
                  strokeDasharray={wave.dash}
                />
              );
            })}
            <circle cx="400" cy="500" r="70" stroke={accentColor} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="400" cy="500" r="10" fill={accentColor} fillOpacity="0.25" />
            <circle cx="400" cy="500" r="4" fill={accentColor} />
          </svg>
        </div>
      );
    }

    case "cognitive_path": {
      // Cognitive Pathways & Decision Graph
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Seamless bridge crossing */}
            {isMultiSlide ? (
              <path
                d={
                  isFirstSlide
                    ? `M 400 580 C 500 580, 650 ${yOut}, 800 ${yOut}`
                    : isLastSlide
                    ? `M 0 ${yIn} C 160 ${yIn}, 300 580, 400 580`
                    : `M 0 ${yIn} C 180 ${yIn}, 300 580, 400 580 C 500 580, 640 ${yOut}, 800 ${yOut}`
                }
                stroke={accentColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            ) : null}

            {/* Trunk line */}
            <path
              d="M 400 900 L 400 580"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Diverging Paths: Automatic Pattern vs Conscious Restructuring */}
            <path
              d="M 400 580 C 400 450, 220 400, 180 200"
              stroke={secondaryColor}
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <path
              d="M 400 580 C 400 450, 580 400, 620 200"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Central Insight Junction */}
            <circle cx="400" cy="580" r="32" stroke={accentColor} strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="400" cy="580" r="12" fill={accentColor} />

            {/* Goal Nodes */}
            <circle cx="620" cy="200" r="26" fill={accentColor} fillOpacity="0.2" />
            <circle cx="620" cy="200" r="8" fill={accentColor} />
            <circle cx="180" cy="200" r="8" stroke={secondaryColor} strokeWidth="2" />

            {/* Flow grid markers */}
            <line x1="120" y1="200" x2="680" y2="200" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <line x1="120" y1="580" x2="680" y2="580" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          </svg>
        </div>
      );
    }

    case "clean_editorial": {
      // Sacred Geometry & Therapeutic Compass
      return (
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-700 pointer-events-none select-none"
          style={{
            opacity,
            transform: `scale(${scaleValue})`,
          }}
        >
          <svg
            viewBox="0 0 800 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Seamless architectural axis */}
            {isMultiSlide ? (
              <path
                d={`M 0 ${yIn} L 400 500 L 800 ${yOut}`}
                stroke={accentColor}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            ) : null}

            {/* Outer Architectural Grid */}
            <rect x="120" y="160" width="560" height="680" stroke={accentColor} strokeWidth="1.5" strokeDasharray="8 8" />
            <circle cx="400" cy="500" r="280" stroke={accentColor} strokeWidth="2" />
            <circle cx="400" cy="500" r="160" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4" />

            {/* 8-Point Compass Star */}
            <path
              d="M 400 320 L 420 480 L 580 500 L 420 520 L 400 680 L 380 520 L 220 500 L 380 480 Z"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="400" cy="500" r="8" fill={accentColor} />

            {/* Quadrant Lines */}
            <line x1="120" y1="500" x2="680" y2="500" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" />
            <line x1="400" y1="160" x2="400" y2="840" stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>
      );
    }

    default:
      return null;
  }
};
