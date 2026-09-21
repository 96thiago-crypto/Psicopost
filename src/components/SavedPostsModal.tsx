import React, { useState, useEffect } from "react";
import { PostState, SavedPostDraft } from "../types";
import {
  Bookmark,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  FolderOpen,
  Plus,
  Check,
  Clock,
  X,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface SavedPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: PostState;
  onLoadState: (loadedState: PostState) => void;
}

const STORAGE_KEY = "psicopost_saved_drafts_v1";

export const SavedPostsModal: React.FC<SavedPostsModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onLoadState,
}) => {
  const [drafts, setDrafts] = useState<SavedPostDraft[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load drafts on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setDrafts(parsed);
          }
        }
      } catch (err) {
        console.error("Erro ao ler rascunhos salvos:", err);
      }
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const saveDraftsToStorage = (updated: SavedPostDraft[]) => {
    setDrafts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Erro ao salvar no storage:", err);
    }
  };

  const handleSaveCurrent = () => {
    const title =
      currentState.themeTitle ||
      (currentState.format === "carousel"
        ? currentState.carousel.slides[0]?.title
        : "Post sem título") ||
      "Post de Psicologia";

    const newDraft: SavedPostDraft = {
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      title: title.slice(0, 60),
      savedAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      format: currentState.format,
      approachName: currentState.brand.signature || "Psicologia Clínica",
      slidesCount:
        currentState.format === "carousel"
          ? currentState.carousel.slides.length
          : 1,
      state: JSON.parse(JSON.stringify(currentState)),
    };

    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    showToast("Post salvo na biblioteca de rascunhos!");
  };

  const handleLoadDraft = (draft: SavedPostDraft) => {
    onLoadState(draft.state);
    showToast(`Rascunho "${draft.title}" carregado com sucesso!`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleDuplicateDraft = (draft: SavedPostDraft) => {
    const duplicated: SavedPostDraft = {
      ...draft,
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      title: `${draft.title} (Cópia)`,
      savedAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [duplicated, ...drafts];
    saveDraftsToStorage(updated);
    showToast("Rascunho duplicado com sucesso!");
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
    showToast("Rascunho removido.");
  };

  const handleExportBackupJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(drafts, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `psicopost_biblioteca_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Backup JSON baixado com sucesso!");
    } catch (err) {
      console.error(err);
      showToast("Erro ao exportar backup.");
    }
  };

  const handleImportBackupJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const merged = [...parsed, ...drafts];
          // Remove duplicates by id
          const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values());
          saveDraftsToStorage(unique);
          showToast(`${parsed.length} posts importados para a biblioteca!`);
        } else {
          showToast("Formato de arquivo inválido.");
        }
      } catch (err) {
        console.error(err);
        showToast("Erro ao processar arquivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  const filteredDrafts = drafts.filter((d) =>
    (d.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.approachName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.format || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#FAF7F2] dark:bg-[#18181B] border border-[#D4CDBA] dark:border-[#2E2E33] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative transition-colors duration-200">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-[#1C1A17] dark:bg-[#27272A] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 border border-[#8B5E3C] animate-in fade-in slide-in-from-top-2 duration-200">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4CDBA] dark:border-[#2E2E33] flex items-center justify-between bg-white/70 dark:bg-[#141417]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B5E3C]/10 dark:bg-[#8B5E3C]/20 border border-[#8B5E3C]/30 text-[#8B5E3C] dark:text-[#D9A888]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1C1A17] dark:text-[#F4F4F5] flex items-center gap-2 font-serif">
                Biblioteca de Posts & Rascunhos Salvos
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A1A1AA]">
                {drafts.length} {drafts.length === 1 ? "projeto salvo" : "projetos salvos"} no seu navegador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrent}
              className="px-3.5 py-1.5 bg-[#8B5E3C] hover:bg-[#70482B] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Salvar Post Atual</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#78716C] dark:text-[#A1A1AA] hover:text-[#1C1A17] dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#18181B] border-b border-[#D4CDBA] dark:border-[#2E2E33] flex flex-wrap items-center justify-between gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] dark:text-[#A1A1AA]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por tema, abordagem ou formato..."
              className="w-full bg-[#FAF7F2] dark:bg-[#27272A] border border-[#D4CDBA] dark:border-[#3F3F46] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1C1A17] dark:text-[#F4F4F5] placeholder-[#78716C] dark:placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5E3C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackupJson}
              disabled={drafts.length === 0}
              className="px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-[#27272A] hover:bg-[#E8E3D8] dark:hover:bg-[#323238] border border-[#D4CDBA] dark:border-[#3F3F46] rounded-xl text-[11px] font-semibold text-[#574E45] dark:text-[#E4E4E7] flex items-center gap-1 transition disabled:opacity-40 cursor-pointer"
              title="Baixar backup completo em JSON"
            >
              <Download className="w-3 h-3 text-[#8B5E3C] dark:text-[#D9A888]" />
              <span>Exportar Backup</span>
            </button>

            <label
              className="px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-[#27272A] hover:bg-[#E8E3D8] dark:hover:bg-[#323238] border border-[#D4CDBA] dark:border-[#3F3F46] rounded-xl text-[11px] font-semibold text-[#574E45] dark:text-[#E4E4E7] flex items-center gap-1 transition cursor-pointer"
              title="Importar backup JSON"
            >
              <Upload className="w-3 h-3 text-[#8B5E3C] dark:text-[#D9A888]" />
              <span>Importar</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportBackupJson}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Drafts List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar bg-[#FAF7F2] dark:bg-[#121214]">
          {filteredDrafts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E8E3D8] dark:bg-[#27272A] border border-[#D4CDBA] dark:border-[#3F3F46] flex items-center justify-center text-[#8B5E3C] dark:text-[#D9A888] mb-3">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1C1A17] dark:text-[#F4F4F5] font-serif">
                {searchQuery ? "Nenhum rascunho encontrado" : "Nenhum post salvo ainda"}
              </h4>
              <p className="text-xs text-[#78716C] dark:text-[#A1A1AA] max-w-sm mt-1 mb-4">
                {searchQuery
                  ? "Tente buscar por outras palavras-chave ou limpe a busca."
                  : "Clique em 'Salvar Post Atual' para guardar seus carrosséis e posts favoritos com toda a configuração visual e de texto intacta."}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleSaveCurrent}
                  className="px-4 py-2 bg-[#8B5E3C] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#70482B] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Post Atual como 1º Rascunho</span>
                </button>
              )}
            </div>
          ) : (
            filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-3.5 bg-white dark:bg-[#18181B] border border-[#D4CDBA] dark:border-[#2E2E33] hover:border-[#8B5E3C] dark:hover:border-[#8B5E3C] rounded-xl transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#8B5E3C]/10 dark:bg-[#8B5E3C]/20 text-[#8B5E3C] dark:text-[#D9A888] border border-[#8B5E3C]/20 dark:border-[#8B5E3C]/30">
                      {draft.format.toUpperCase()}
                      {draft.format === "carousel" && ` (${draft.slidesCount} slides)`}
                    </span>
                    <span className="text-[11px] text-[#78716C] dark:text-[#A1A1AA] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {draft.savedAt}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C1A17] dark:text-[#F4F4F5] truncate font-serif">
                    {draft.title || "Post sem título"}
                  </h4>
                  {draft.approachName && (
                    <p className="text-[11px] text-[#78716C] dark:text-[#A1A1AA] mt-0.5 truncate">
                      {draft.approachName}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleLoadDraft(draft)}
                    className="px-3 py-1.5 bg-[#1C1A17] dark:bg-[#27272A] hover:bg-[#332F2B] dark:hover:bg-[#3F3F46] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs border border-transparent dark:border-[#3F3F46]"
                  >
                    <span>Carregar</span>
                    <ArrowRight className="w-3 h-3 text-[#D4CDBA]" />
                  </button>

                  <button
                    onClick={() => handleDuplicateDraft(draft)}
                    className="p-1.5 bg-[#FAF7F2] dark:bg-[#27272A] hover:bg-[#E8E3D8] dark:hover:bg-[#323238] border border-[#D4CDBA] dark:border-[#3F3F46] rounded-lg text-[#574E45] dark:text-[#E4E4E7] transition cursor-pointer"
                    title="Duplicar rascunho"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="p-1.5 bg-[#FAF7F2] dark:bg-[#27272A] hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-[#D4CDBA] dark:border-[#3F3F46] hover:border-rose-300 dark:hover:border-rose-800 rounded-lg text-[#78716C] dark:text-[#A1A1AA] hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                    title="Excluir rascunho"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-[#D4CDBA] dark:border-[#2E2E33] bg-[#F5F2EC] dark:bg-[#141417] flex items-center justify-between text-xs text-[#78716C] dark:text-[#A1A1AA]">
          <span>
            💡 Os rascunhos são armazenados localmente e ficam salvos mesmo se você fechar a página.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white dark:bg-[#27272A] border border-[#D4CDBA] dark:border-[#3F3F46] rounded-xl font-semibold text-[#1C1A17] dark:text-[#F4F4F5] hover:bg-[#E8E3D8] dark:hover:bg-[#323238] transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
