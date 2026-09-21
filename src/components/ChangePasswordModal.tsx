import React, { useState } from "react";
import { Lock, Check, X, ShieldAlert } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const storedUsersRaw = localStorage.getItem("psicopost_auth_users");
    const users: Record<string, string> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};

    if (users[currentUsername] && users[currentUsername] !== currentPassword) {
      setErrorMsg("A senha atual digitada está incorreta.");
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg("A nova senha deve possuir ao menos 4 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("A nova senha e a confirmação não coincidem.");
      return;
    }

    // Save updated password
    users[currentUsername] = newPassword;
    localStorage.setItem("psicopost_auth_users", JSON.stringify(users));

    setSuccessMsg("Senha atualizada com sucesso no armazenamento local!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-[#D4CDBA] rounded-2xl shadow-2xl overflow-hidden p-6 text-[#1C1A17]">
        <div className="flex items-center justify-between pb-4 border-b border-[#D4CDBA] mb-5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8B5E3C]" />
            <h3 className="text-sm font-bold text-[#1C1A17] font-serif">
              Alterar Senha ({currentUsername})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1A17] hover:bg-[#E8E3D8] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#78716C] mb-1 uppercase tracking-wider">
              Senha Atual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite a senha atual"
              className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#78716C] mb-1 uppercase tracking-wider">
              Nova Senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha segura"
              className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#78716C] mb-1 uppercase tracking-wider">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-3 py-2.5 text-xs text-[#1C1A17] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
              required
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#E8E3D8] hover:bg-[#DCD7CB] border border-[#D4CDBA] rounded-xl text-xs font-semibold text-[#1C1A17] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1C1A17] hover:bg-[#332F2B] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Salvar Nova Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
