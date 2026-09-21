import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EthicalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedIssues: string[];
  onConfirmExport: () => void;
}

export const EthicalReviewModal: React.FC<EthicalReviewModalProps> = ({
  isOpen,
  onClose,
  detectedIssues,
  onConfirmExport,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-[#18181B] text-[#1C1A17] dark:text-[#F4F4F5] w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-amber-500/40 dark:border-amber-500/30 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Resolução CFP nº 010/2005
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1C1A17] dark:text-[#F4F4F5] leading-tight">
                  Revisão Ética Recomendada
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#78716C] hover:text-[#1C1A17] dark:hover:text-white rounded-full hover:bg-black/5 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#574E45] dark:text-[#A1A1AA] leading-relaxed mb-4">
            O filtro ético do Studio Psicopost identificou termos que podem sugerir promessa de cura rápida, garantia absoluta de resultados ou indução precipitada a autodiagnósticos:
          </p>

          {/* List of Detected Issues */}
          <div className="space-y-2 mb-5">
            {detectedIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{issue}</span>
              </div>
            ))}
          </div>

          {/* Clarification */}
          <div className="p-3 bg-[#FAF7F2] dark:bg-[#27272A] border border-[#D4CDBA] dark:border-[#3F3F46] rounded-xl text-[11px] text-[#574E45] dark:text-[#D4D4D8] mb-6">
            O Código de Ética Profissional recomenda substituir promessas definitivas por reflexões de acolhimento e incentivo ao processo terapêutico continuado. O app não altera seu texto sozinho para respeitar a sua autonomia clínica.
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#D4CDBA] dark:border-[#3F3F46] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer text-[#1C1A17] dark:text-[#F4F4F5]"
            >
              Voltar e Ajustar Texto
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirmExport();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Confirmar e Baixar Mesmo Assim</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
