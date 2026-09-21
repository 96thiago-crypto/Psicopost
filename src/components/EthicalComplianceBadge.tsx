import React, { useState, useMemo } from "react";
import { ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, AlertCircle, Info, X, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EthicalComplianceBadgeProps {
  textToValidate: string;
  onSanitizeTitle?: (sanitized: string) => void;
  className?: string;
}

// Sensationalist triggers forbidden or discouraged by CFP (Resolução CFP nº 010/2005)
const ETHICAL_FLAGS = [
  { pattern: /cure|cura\s+r[aá]pida|cura\s+definitiva|curar\s+em/i, reason: "Promessa de cura rápida ou definitiva (incompatível com a Resolução CFP 010/2005)" },
  { pattern: /elimine\s+(de\s+vez|para\s+sempre|em\s+\d+\s+dias)/i, reason: "Garantia de resultado infalível ou eliminação total de sintoma" },
  { pattern: /m[eé]todo\s+infal[ií]vel|segredo\s+revelado|f[oó]rmula\s+m[aá]gica/i, reason: "Sensacionalismo e autopromoção inadequada" },
  { pattern: /voc[eê]\s+tem\s+(depress[aã]o|borderline|tdah)\s+se/i, reason: "Indução precipitada a autodiagnóstico sem avaliação clínica individual" },
  { pattern: /nunca\s+mais\s+sinta|acabe\s+com\s+a\s+ansiedade\s+agora/i, reason: "Promessa de anulação completa de emoções humanas naturais" },
  { pattern: /garantido|100%\s+eficaz|resultado\s+garantido/i, reason: "Garantia indevida de eficácia absoluta" },
];

export const EthicalComplianceBadge: React.FC<EthicalComplianceBadgeProps> = ({
  textToValidate,
  onSanitizeTitle,
  className = "",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isAiAuditing, setIsAiAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<{
    score: number;
    verdict: string;
    feedback: string;
    suggestions: string[];
  } | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Heuristic analysis of the title/hook
  const analysis = useMemo(() => {
    const text = textToValidate || "";
    const issues: string[] = [];

    for (const flag of ETHICAL_FLAGS) {
      if (flag.pattern.test(text)) {
        issues.push(flag.reason);
      }
    }

    const isCompliant = issues.length === 0;
    return {
      isCompliant,
      issues,
      sanitizedSuggestion: text
        .replace(/cure\s+de\s+vez|cure\s+definitivamente/gi, "compreenda e acolha")
        .replace(/elimine\s+para\s+sempre|elimine\s+de\s+vez/gi, "aprenda a regular")
        .replace(/nunca\s+mais\s+sinta/gi, "saiba como lidar quando sentir")
        .replace(/m[eé]todo\s+infal[ií]vel/gi, "estratégias fundamentadas")
        .replace(/acabe\s+com\s+a\s+ansiedade/gi, "desatando o nó da ansiedade")
        .replace(/garantido/gi, "clinicamente orientado"),
    };
  }, [textToValidate]);

  const handleDeepAiAudit = async () => {
    if (!textToValidate.trim()) return;
    setIsAiAuditing(true);
    setAuditError(null);
    try {
      const res = await fetch("/api/gemini/check-ethics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToValidate }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAuditResult(data.data);
      } else {
        throw new Error(data.error || "Não foi possível auditar o texto no momento.");
      }
    } catch (err: any) {
      setAuditError(err?.message || "Erro na auditoria ética.");
    } finally {
      setIsAiAuditing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowModal(true);
          if (!aiAuditResult && !isAiAuditing) {
            handleDeepAiAudit();
          }
        }}
        className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all tap-subtle ${
          analysis.isCompliant
            ? "bg-[#0F3D3B]/10 hover:bg-[#0F3D3B]/15 text-[#0F3D3B] dark:bg-[#154F4A]/30 dark:text-[#93C5BD] border border-[#0F3D3B]/20"
            : "bg-amber-500/10 hover:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30"
        } ${className}`}
        title="Clique para auditar o alinhamento com a Resolução CFP 010/2005"
      >
        {analysis.isCompliant ? (
          <>
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F3D3B] dark:text-[#5EEAD4]" />
            <span className="font-semibold tracking-wide">Tom Ético CFP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold">Revisão de Tom Ético</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          </>
        )}
      </button>

      {/* Modal / Dialog */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#1C1C20] rounded-2xl shadow-2xl border border-[#E7E4DC] dark:border-[#2E2E33] overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-[#F8F7F4] dark:bg-[#232328] border-b border-[#E7E4DC] dark:border-[#2E2E33] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${analysis.isCompliant ? "bg-[#0F3D3B]/10 text-[#0F3D3B] dark:text-[#5EEAD4]" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"}`}>
                    {analysis.isCompliant ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#182625] dark:text-zinc-100">
                      Compliance Ético & Comunicação Responsável
                    </h3>
                    <p className="text-xs text-[#574E45] dark:text-zinc-400">
                      Validação conforme o Código de Ética e Resolução CFP nº 010/2005
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Text excerpt under review */}
                <div className="p-3 bg-[#F8F7F4] dark:bg-[#18181B] rounded-xl border border-[#E7E4DC] dark:border-[#2E2E33]">
                  <p className="text-xs font-semibold text-[#574E45] dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Texto / Gancho em Análise:
                  </p>
                  <p className="text-sm font-medium text-[#182625] dark:text-zinc-200 italic">
                    "{textToValidate || "Sem título definido"}"
                  </p>
                </div>

                {/* Status assessment */}
                {analysis.isCompliant ? (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Conformidade Prévia Validada</span>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400/90 leading-relaxed">
                      Não foram detectadas promessas de cura rápida, termos sensacionalistas ou garantias infalíveis. O gancho respeita o tom reflexivo e psicoeducativo.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Ajustes Recomendados no Tom da Mensagem:</span>
                    </div>
                    <ul className="text-xs text-amber-800/90 dark:text-amber-300/90 space-y-1 pl-4 list-disc">
                      {analysis.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>

                    {onSanitizeTitle && analysis.sanitizedSuggestion !== textToValidate && (
                      <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between gap-3">
                        <div className="text-xs text-amber-900 dark:text-amber-200">
                          Sugestão ética: <span className="font-medium italic">"{analysis.sanitizedSuggestion}"</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onSanitizeTitle(analysis.sanitizedSuggestion);
                            setShowModal(false);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shrink-0 tap-subtle"
                        >
                          Aplicar Ajuste
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Deep Audit Results */}
                {isAiAuditing && (
                  <div className="p-4 bg-[#F8F7F4] dark:bg-[#232328] rounded-xl flex items-center justify-center gap-2.5 text-xs text-[#574E45] dark:text-zinc-400">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0F3D3B] dark:text-[#5EEAD4]" />
                    <span>Auditando diretrizes detalhadas do CFP com IA...</span>
                  </div>
                )}

                {aiAuditResult && !isAiAuditing && (
                  <div className="p-3.5 bg-[#F8F7F4] dark:bg-[#18181B] border border-[#E7E4DC] dark:border-[#2E2E33] rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#182625] dark:text-zinc-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A864]" />
                        Auditoria de Ética IA
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0F3D3B]/10 dark:bg-[#154F4A]/40 text-[#0F3D3B] dark:text-[#5EEAD4]">
                        Nota: {aiAuditResult.score}/100 • {aiAuditResult.verdict}
                      </span>
                    </div>
                    <p className="text-xs text-[#574E45] dark:text-zinc-300 leading-relaxed">
                      {aiAuditResult.feedback}
                    </p>
                    {aiAuditResult.suggestions && aiAuditResult.suggestions.length > 0 && (
                      <div className="pt-1.5">
                        <p className="text-xs font-medium text-[#182625] dark:text-zinc-300 mb-1">
                          Recomendações clínicas:
                        </p>
                        <ul className="text-xs text-[#574E45] dark:text-zinc-400 space-y-1 pl-4 list-disc">
                          {aiAuditResult.suggestions.map((sug, idx) => (
                            <li key={idx}>{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {auditError && (
                  <p className="text-xs text-rose-500 dark:text-rose-400">{auditError}</p>
                )}

                {/* Key CFP Guidelines Reminder */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/60 dark:border-zinc-700/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <Info className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Diretrizes Principais (Art. 20 - Código de Ética):</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    1. Não utilizar o preço do serviço como forma de propaganda.<br />
                    2. Não fazer previsão taxativa de resultados terapêuticos.<br />
                    3. Divulgar somente qualificações, atividades e recursos devidamente reconhecidos pela profissão.<br />
                    4. Promover a reflexão e o cuidado em saúde mental sem criar dependência ou estigma.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-[#F8F7F4] dark:bg-[#232328] border-t border-[#E7E4DC] dark:border-[#2E2E33] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDeepAiAudit}
                  disabled={isAiAuditing}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3D3B] dark:text-[#5EEAD4] hover:underline disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A864]" />
                  Re-auditar com IA
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#182625] dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-[#E7E4DC] dark:border-[#3F3F46] rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors tap-subtle"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
