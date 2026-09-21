import React from "react";
import { TopLevelFormat } from "../types";
import {
  Layers,
  Video,
  Quote,
  Smartphone,
  Sparkles,
  Loader2,
  Wand2,
} from "lucide-react";
import { motion } from "motion/react";
import { EthicalComplianceBadge } from "./EthicalComplianceBadge";

interface MultiFormatBarProps {
  activeFormat: TopLevelFormat;
  onChangeFormat: (format: TopLevelFormat) => void;
  onRepurpose: () => void;
  isRepurposing: boolean;
  titleForCompliance: string;
  onSanitizeTitle?: (clean: string) => void;
  hasRepurposedContent?: {
    reels: boolean;
    singleCard: boolean;
    stories: boolean;
  };
}

export const MultiFormatBar: React.FC<MultiFormatBarProps> = ({
  activeFormat,
  onChangeFormat,
  onRepurpose,
  isRepurposing,
  titleForCompliance,
  onSanitizeTitle,
  hasRepurposedContent,
}) => {
  const tabs = [
    {
      id: "carousel" as TopLevelFormat,
      label: "Carrossel Psicoeducativo",
      shortLabel: "Carrossel",
      icon: Layers,
      description: "Fluxo completo de 7 slides",
      badge: null,
    },
    {
      id: "reels_script" as TopLevelFormat,
      label: "Roteiro de Reels / Vídeo Curto",
      shortLabel: "Reels / Vídeo",
      icon: Video,
      description: "Gancho 3s + Fala + CTA",
      badge: hasRepurposedContent?.reels ? "Pronto" : null,
    },
    {
      id: "single_card" as TopLevelFormat,
      label: "Frase de Impacto / Card Único",
      shortLabel: "Card Único",
      icon: Quote,
      description: "Modo minimalista",
      badge: hasRepurposedContent?.singleCard ? "Pronto" : null,
    },
    {
      id: "stories_sequence" as TopLevelFormat,
      label: "Sequência de Stories / Caixinha",
      shortLabel: "Stories (4 Telas)",
      icon: Smartphone,
      description: "Enquetes & Caixinha",
      badge: hasRepurposedContent?.stories ? "Pronto" : null,
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#18181B] rounded-2xl border border-[#E7E4DC] dark:border-[#2E2E33] p-2 sm:p-2.5 shadow-xs transition-clinical">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFormat === tab.id;

            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onChangeFormat(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0F3D3B] text-[#FFFFFF] shadow-sm font-semibold"
                    : "text-[#574E45] dark:text-zinc-300 hover:text-[#182625] dark:hover:text-white hover:bg-[#F8F7F4] dark:hover:bg-[#232328]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? "text-[#C9A864]" : "text-[#78716C] dark:text-zinc-400"
                  }`}
                />
                <span className="hidden xl:inline">{tab.label}</span>
                <span className="xl:hidden">{tab.shortLabel}</span>

                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tracking-wider uppercase ${
                      isActive
                        ? "bg-[#C9A864]/30 text-[#F5F2EC] border border-[#C9A864]/50"
                        : "bg-[#0F3D3B]/10 text-[#0F3D3B] dark:bg-[#154F4A]/40 dark:text-[#93C5BD]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right side: Repurpose Button + Ethics Compliance Badge */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E7E4DC] dark:border-[#2E2E33]">
          {/* Ethical Compliance Badge */}
          <EthicalComplianceBadge
            textToValidate={titleForCompliance}
            onSanitizeTitle={onSanitizeTitle}
          />

          {/* Desmembrar em Múltiplos Formatos (Multi-Repurpose) Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onRepurpose}
            disabled={isRepurposing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#0F3D3B] via-[#154F4A] to-[#0F3D3B] text-white shadow-xs hover:shadow-md border border-[#C9A864]/40 hover:border-[#C9A864] transition-all disabled:opacity-60 cursor-pointer"
            title="Gera automaticamente versões adaptadas para Reels, Card Único e Sequência de Stories a partir do tema atual"
          >
            {isRepurposing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A864]" />
                <span className="text-zinc-100">Desmembrando com IA...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 text-[#C9A864]" />
                <span className="tracking-tight">Desmembrar em Múltiplos Formatos</span>
                <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-[#C9A864]/25 text-[#F8F7F4] font-bold">
                  Multi-Repurpose
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
