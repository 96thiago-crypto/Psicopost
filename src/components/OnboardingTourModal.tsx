import React, { useState, useEffect } from "react";
import { Sparkles, Download, CheckCircle2, ArrowRight, X, HelpCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReadyTemplate?: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onSelectReadyTemplate,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    localStorage.setItem("psicopost_onboarding_completed", "true");
    onClose();
  };

  const steps = [
    {
      step: 1,
      badge: "Passo 1 de 3",
      title: "Escolha o que deseja postar",
      desc: "Você não precisa saber nada de design. Basta escolher um modelo pronto de 1 clique ou digitar seu tema (ex: ansiedade, limites, autocobrança) e selecionar sua abordagem clínica (TCC, ACP, Psicanálise, Gestalt).",
      icon: <Sparkles className="w-8 h-8 text-[#8B5E3C]" />,
      detail: "Formulação técnica rigorosa de acordo com os autores clássicos de cada abordagem.",
    },
    {
      step: 2,
      badge: "Passo 2 de 3",
      title: "A IA monta o conteúdo e o visual",
      desc: "O Studio Psicopost gera slides sequenciais, cartões reflexivos e legendas completas com espaçamento ideal para o Instagram, tudo auditado pelo Código de Ética do CFP (sem promessas mágicas ou sensacionalismo).",
      icon: <ShieldCheck className="w-8 h-8 text-[#0F3D3B]" />,
      detail: "Filtro ético em duas camadas garantindo respeito às resoluções do CFP/CRP.",
    },
    {
      step: 3,
      badge: "Passo 3 de 3",
      title: "Baixe as imagens e publique",
      desc: "Revise seu post em segundos e clique no botão 'Baixar Imagens' no topo para receber os arquivos em altíssima qualidade (PNG) ou um arquivo .ZIP com todos os slides ordenados e a legenda pronta para copiar e colar.",
      icon: <Download className="w-8 h-8 text-[#8B5E3C]" />,
      detail: "Tudo pronto em menos de 5 minutos, direto do computador ou celular.",
    },
  ];

  const current = steps[currentStep - 1];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-[#18181B] text-[#1C1A17] dark:text-[#F4F4F5] w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#D4CDBA] dark:border-[#27272A] relative overflow-hidden"
        >
          {/* Top Bar with Step Indicators */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    stepNum === currentStep
                      ? "w-8 bg-[#8B5E3C]"
                      : stepNum < currentStep
                      ? "w-4 bg-[#8B5E3C]/40"
                      : "w-4 bg-[#D4CDBA] dark:bg-[#27272A]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="p-1.5 text-[#78716C] hover:text-[#1C1A17] dark:hover:text-white rounded-full hover:bg-black/5 transition cursor-pointer"
              title="Fechar tour"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] dark:bg-[#27272A] border border-[#D4CDBA] dark:border-[#3F3F46] flex items-center justify-center shrink-0 shadow-xs">
              {current.icon}
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C] dark:text-[#D9A888]">
                {current.badge}
              </span>
              <h3 className="text-lg font-serif font-bold text-[#1C1A17] dark:text-[#F4F4F5] leading-tight">
                {current.title}
              </h3>
              <p className="text-xs text-[#574E45] dark:text-[#A1A1AA] leading-relaxed pt-1">
                {current.desc}
              </p>
            </div>
          </div>

          {/* Clinical Assurance Note */}
          <div className="p-3 bg-[#FAF7F2] dark:bg-[#27272A]/70 border border-[#D4CDBA] dark:border-[#3F3F46] rounded-2xl text-[11px] text-[#574E45] dark:text-[#D4D4D8] flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-4 h-4 text-[#8B5E3C] shrink-0" />
            <span>{current.detail}</span>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs font-semibold text-[#78716C] dark:text-[#A1A1AA] hover:text-[#1C1A17] dark:hover:text-white transition cursor-pointer"
            >
              Pular introdução
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-[#D4CDBA] dark:border-[#3F3F46] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Voltar
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#734B2E] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Próximo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-5 py-2.5 bg-[#8B5E3C] hover:bg-[#734B2E] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Começar a Criar</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
