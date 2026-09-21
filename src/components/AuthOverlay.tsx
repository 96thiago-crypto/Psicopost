import React, { useState, useEffect } from "react";
import { AuthState, UserAccount } from "../types";
import { supabase, supabaseDb } from "../lib/supabase";
import {
  ShieldCheck,
  UserCheck,
  Key,
  Eye,
  EyeOff,
  User,
  Mail,
  AtSign,
  UserPlus,
  LogIn,
  CheckCircle2,
} from "lucide-react";

interface AuthOverlayProps {
  authState: AuthState;
  onLogin: (username: string, remember: boolean, name?: string, email?: string) => void;
}

const DEFAULT_USERS: Record<string, string> = {
  tulio: "psico2026",
  admin: "psico2026",
  psi: "psico2026",
};

const DEFAULT_PROFILES: Record<string, UserAccount> = {
  tulio: {
    username: "tulio",
    name: "Túlio Moura",
    email: "tuliomoura.psi@gmail.com",
    crp: "CRP 02/33860",
    instagram: "@tuliomoura.psi",
  },
  admin: {
    username: "admin",
    name: "Administrador Clínico",
    email: "admin@psicopost.pro",
    crp: "CRP 02/00000",
    instagram: "@psicopost.pro",
  },
  psi: {
    username: "psi",
    name: "Psicólogo(a) Convidado(a)",
    email: "contato@psicologia.com.br",
    crp: "CRP 06/00000",
    instagram: "@psicologia.clinica",
  },
};

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ authState, onLogin }) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize default users if not present
    const savedCredentials = localStorage.getItem("psicopost_auth_users");
    if (!savedCredentials) {
      localStorage.setItem("psicopost_auth_users", JSON.stringify(DEFAULT_USERS));
    }

    const savedProfiles = localStorage.getItem("psicopost_user_profiles");
    if (!savedProfiles) {
      localStorage.setItem("psicopost_user_profiles", JSON.stringify(DEFAULT_PROFILES));
    }
  }, []);

  if (authState.isAuthenticated) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const inputVal = loginUsername.trim();
    const isEmail = inputVal.includes("@");
    const trimmedUser = inputVal.toLowerCase();

    // 1. First attempt Supabase Auth if email is used or we find an email for this username
    try {
      const storedProfilesRaw = localStorage.getItem("psicopost_user_profiles");
      const profiles: Record<string, UserAccount> = storedProfilesRaw
        ? JSON.parse(storedProfilesRaw)
        : DEFAULT_PROFILES;

      const userProf = profiles[trimmedUser];
      const targetEmail = isEmail ? inputVal : userProf?.email;

      if (targetEmail) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: loginPassword,
        });

        if (!authError && authData.user) {
          const userMeta = authData.user.user_metadata || {};
          const displayName = userMeta.name || userProf?.name || trimmedUser;
          const finalUsername = userMeta.username || trimmedUser;

          setSuccessMsg("Autenticado com sucesso!");
          setTimeout(() => {
            setIsLoading(false);
            onLogin(finalUsername, rememberMe, displayName, targetEmail);
          }, 300);
          return;
        }
      }
    } catch (supabaseErr) {
      console.warn("Supabase Auth login notice:", supabaseErr);
    }

    // 2. Local / Standard Credential validation
    const storedUsersRaw = localStorage.getItem("psicopost_auth_users");
    const users: Record<string, string> = storedUsersRaw
      ? JSON.parse(storedUsersRaw)
      : DEFAULT_USERS;

    if (users[trimmedUser] && users[trimmedUser] === loginPassword) {
      const storedProfilesRaw = localStorage.getItem("psicopost_user_profiles");
      const profiles: Record<string, UserAccount> = storedProfilesRaw
        ? JSON.parse(storedProfilesRaw)
        : DEFAULT_PROFILES;

      const userProf = profiles[trimmedUser];
      const displayName = userProf?.name || (trimmedUser === "tulio" ? "Túlio Moura" : trimmedUser.toUpperCase());
      const displayEmail = userProf?.email || "";

      setTimeout(() => {
        setIsLoading(false);
        onLogin(trimmedUser, rememberMe, displayName, displayEmail);
      }, 300);
    } else {
      setIsLoading(false);
      setErrorMsg("Usuário/e-mail ou senha incorretos. Verifique suas credenciais ou crie uma nova conta.");
    }
  };

  // Handle Sign Up submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim().toLowerCase();
    const trimmedUser = signupUsername.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
    const pass = signupPassword;

    // Validations
    if (!trimmedName) {
      setErrorMsg("Por favor, insira o seu nome completo.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setErrorMsg("Por favor, insira um e-mail válido.");
      return;
    }

    if (!trimmedUser || trimmedUser.length < 3) {
      setErrorMsg("O nome de usuário deve ter ao menos 3 caracteres alfanuméricos.");
      return;
    }

    if (!pass || pass.length < 4) {
      setErrorMsg("A senha deve possuir ao menos 4 caracteres.");
      return;
    }

    setIsLoading(true);

    // 1. Attempt Supabase Auth Sign Up & Profile sync
    let supabaseSuccess = false;
    try {
      const { data: sbAuthData, error: sbAuthError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: pass,
        options: {
          data: {
            name: trimmedName,
            username: trimmedUser,
          },
        },
      });

      if (!sbAuthError && sbAuthData.user) {
        supabaseSuccess = true;
        // Attempt syncing to profiles table
        await supabaseDb.saveProfile(sbAuthData.user.id, {
          name: trimmedName,
          username: trimmedUser,
          email: trimmedEmail,
        });
      }
    } catch (err) {
      console.warn("Supabase SignUp notice:", err);
    }

    // 2. Persist in local storage for instant offline & fast access
    const storedUsersRaw = localStorage.getItem("psicopost_auth_users");
    const users: Record<string, string> = storedUsersRaw
      ? JSON.parse(storedUsersRaw)
      : { ...DEFAULT_USERS };

    users[trimmedUser] = pass;
    localStorage.setItem("psicopost_auth_users", JSON.stringify(users));

    const storedProfilesRaw = localStorage.getItem("psicopost_user_profiles");
    const profiles: Record<string, UserAccount> = storedProfilesRaw
      ? JSON.parse(storedProfilesRaw)
      : { ...DEFAULT_PROFILES };

    profiles[trimmedUser] = {
      username: trimmedUser,
      name: trimmedName,
      email: trimmedEmail,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("psicopost_user_profiles", JSON.stringify(profiles));

    setSuccessMsg("Conta criada com sucesso! Entrando no estúdio...");

    setTimeout(() => {
      setIsLoading(false);
      onLogin(trimmedUser, rememberMe, trimmedName, trimmedEmail);
    }, 450);
  };

  return (
    <div
      id="auth-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      <div className="w-full max-w-md bg-white border border-[#E7E4DC] rounded-3xl shadow-2xl overflow-hidden p-7 sm:p-9 text-[#182625] relative">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#0F3D3B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C9A864]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & Title (Large centered logo with app name beneath) */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0F3D3B] flex items-center justify-center shadow-lg text-white font-serif font-black text-4xl sm:text-5xl border-2 border-[#C9A864]/40 transition-transform hover:scale-105 duration-300">
            Ψ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#182625] mt-3.5 leading-tight">
            Estúdio Psicopost
          </h1>
        </div>

        {/* Mode Selector Tabs (Entrar / Criar Conta) */}
        <div className="flex bg-[#F8F7F4] p-1.5 rounded-2xl border border-[#E7E4DC] mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              authMode === "login"
                ? "bg-[#0F3D3B] text-white shadow-xs"
                : "text-[#574E45] hover:text-[#182625]"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("signup");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              authMode === "signup"
                ? "bg-[#0F3D3B] text-white shadow-xs"
                : "text-[#574E45] hover:text-[#182625]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Criar Conta</span>
          </button>
        </div>

        {/* ================= FORMULÁRIO: ENTRAR (LOGIN) ================= */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-[#574E45] uppercase tracking-wider mb-1.5">
                Usuário Cadastrado
              </label>
              <div className="relative">
                <input
                  id="login-username-input"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Seu nome de usuário"
                  className="w-full bg-[#F8F7F4] border border-[#E7E4DC] rounded-xl px-4 py-2.5 text-sm text-[#182625] placeholder-[#A8A29E] focus:outline-hidden focus:border-[#0F3D3B] transition"
                  required
                />
                <UserCheck className="absolute right-3.5 top-3 w-4 h-4 text-[#78716C] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#574E45] uppercase tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Sua senha de segurança"
                  className="w-full bg-[#F8F7F4] border border-[#E7E4DC] rounded-xl px-4 py-2.5 text-sm text-[#182625] placeholder-[#A8A29E] focus:outline-hidden focus:border-[#0F3D3B] transition pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#78716C] hover:text-[#182625] transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#574E45] select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E7E4DC] text-[#0F3D3B] focus:ring-[#0F3D3B] w-4 h-4 accent-[#0F3D3B]"
                />
                Lembrar meu acesso neste dispositivo
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <Key className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-3 px-4 bg-[#0F3D3B] hover:bg-[#154F4A] text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition shadow-md shadow-[#0F3D3B]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C9A864]" />
                  Acessar Estúdio
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= FORMULÁRIO: CRIAR CONTA (SIGN UP) ================= */}
        {authMode === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-in fade-in duration-200">
            {/* 1. Nome Completo */}
            <div>
              <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                Nome Completo do Profissional
              </label>
              <div className="relative">
                <input
                  id="signup-name-input"
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Ex: Dr. Thiago Silva ou Psicóloga Ana Costa"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition"
                  required
                />
                <User className="absolute right-3.5 top-2.5 w-4 h-4 text-[#78716C] pointer-events-none" />
              </div>
            </div>

            {/* 2. E-mail */}
            <div>
              <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                E-mail de Contato
              </label>
              <div className="relative">
                <input
                  id="signup-email-input"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Ex: seuemail@gmail.com"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition"
                  required
                />
                <Mail className="absolute right-3.5 top-2.5 w-4 h-4 text-[#78716C] pointer-events-none" />
              </div>
            </div>

            {/* 3. Usuário */}
            <div>
              <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                Nome de Usuário (Login)
              </label>
              <div className="relative">
                <input
                  id="signup-username-input"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value.toLowerCase())}
                  placeholder="Ex: thiago, anapsi, psicoclinica"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition"
                  required
                />
                <AtSign className="absolute right-3.5 top-2.5 w-4 h-4 text-[#78716C] pointer-events-none" />
              </div>
            </div>

            {/* 4. Senha */}
            <div>
              <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="signup-password-input"
                  type={showPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Crie uma senha (mínimo 4 dígitos)"
                  className="w-full bg-[#FAF7F2] border border-[#D4CDBA] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1C1A17] placeholder-[#A8A29E] focus:outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] transition pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-[#78716C] hover:text-[#1C1A17] transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#574E45] select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#D4CDBA] text-[#8B5E3C] focus:ring-[#8B5E3C] w-4 h-4 accent-[#8B5E3C]"
                />
                Lembrar meu acesso neste dispositivo
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <Key className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              id="btn-signup-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-3 px-4 bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wide transition shadow-md shadow-[#8B5E3C]/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-[#E8E3D8]" />
                  Criar Conta & Entrar no Estúdio
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

