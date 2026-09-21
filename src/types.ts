export type PostFormat =
  | "carousel"
  | "checklist"
  | "matrix"
  | "cycle"
  | "quote"
  | "coping_card"
  | "qa_provocation";

export type TopLevelFormat =
  | "carousel" // Carrossel Psicoeducativo (mantém o fluxo completo existente)
  | "reels_script" // Roteiro de Reels / Vídeo Curto (Gancho 3s + Roteiro + CTA sutil)
  | "single_card" // Frase de Impacto / Card Único (modo minimalista de alta densidade)
  | "stories_sequence"; // Sequência de Stories / Caixinha (3 a 4 telas de engajamento)

export interface ReelsScriptData {
  hookVisual3s: string; // O que mostrar e fazer nos primeiros 3 segundos
  hookAudioSpeech: string; // Fala inicial magnética
  teleprompterScript: string; // Roteiro de fala completo com quebras e pausas reflexivas
  visualDirections: string[]; // Tomadas/cenas sugeridas para gravação
  subtleCta: string; // Chamada de ação sutil e ética
  durationEstimate: string; // Ex: "35 a 45 segundos"
  audioVibe: string; // Tom e trilha recomendados (ex: Piano sutil e reflexivo)
}

export interface SingleCardData {
  badge: string; // Rótulo de topo (ex: "REFLEXÃO DO DIA • TCC")
  quote: string; // Frase de impacto psicológico
  authorOrRef: string; // Assinatura ou autor de referência
  reflection: string; // Desdobramento reflexivo de 1 a 2 linhas
  subtleTag: string; // Tag institucional de rodapé
}

export interface StoryCardItem {
  id: string;
  stepNumber: number;
  type: "enquete" | "identificacao" | "caixinha" | "conclusao_bio";
  tag: string;
  title: string;
  subtitle?: string;
  stickerType?: "enquete" | "caixinha" | "termometro" | "link";
  stickerQuestion: string;
  stickerOptions?: string[]; // Para enquete (ex: ["Sim, direto", "Quase nunca"])
  bodyText: string;
  speakerNote: string; // Dica de bastidor para o psicólogo gravar ou postar
}

export interface StoriesSequenceData {
  theme: string;
  screens: StoryCardItem[];
  objective: string;
}

export type AppTheme = "light" | "dark";

export type AspectRatio = "4:5" | "1:1" | "9:16";

export type TextAlignment = "left" | "center" | "right";

export type FontScale = "small" | "normal" | "large";

export type TextDensity = "concise" | "balanced" | "detailed";

export type IllustrationPlacement = "background" | "header" | "both" | "none";

export type SvgIllustration =
  | "existential_thread" // Linha Existencial Contínua (Rogeriana / Existencial)
  | "mind_brain" // Silhueta da Mente & Conexões Sinápticas
  | "anxiety_knot" // Nó da Ansiedade ao Desatar Fluido
  | "gestalt_awareness" // Ciclo de Contato & Awareness Gestáltica
  | "balance_stones" // Pedras de Equilíbrio & Ancoragem Zen
  | "neural_waves" // Ondas Emocionais & Respiração
  | "cognitive_path" // Trilhas Cognitivas & Ponto de Decisão TCC
  | "clean_editorial" // Geometria Sagrada & Estrela Minimalista
  | "none";

export interface ColorPalette {
  id: string;
  name: string;
  background: string;
  cardBg: string;
  accent: string;
  text: string;
  secondaryText: string;
  cardBorder: string;
}

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: "Editorial (Serifa)" | "Moderna (Sans-Serif)" | "Display / Clássica";
}

export interface TypographySettings {
  titleFont: string;
  bodyFont: string;
  fontScale: FontScale;
  alignment: TextAlignment;
  letterSpacing: string;
  lineHeight: string;
}

export type SlideRole = "cover" | "content" | "cta";

export interface CarouselSlide {
  id: string;
  slideNumber: number;
  slideRole?: SlideRole; // 'cover' = Capa de Alto Impacto, 'cta' = Fechamento & Ação, 'content' = Conteúdo Didático
  badge: string;
  title: string;
  subtitle?: string;
  body: string;
  items?: string[];
  highlightBox?: string;
  footerNote?: string;
  ctaActions?: {
    save?: string;
    share?: string;
    comment?: string;
    contact?: string;
  };
  customIllustration?: SvgIllustration;
  customImage?: CustomImageOverlay | null;
}

export type CustomImagePlacement = "background" | "foreground";
export type CustomImageFit = "cover" | "contain" | "scale-down";
export type CustomImagePosition = "center" | "top" | "bottom";

export interface CustomImageOverlay {
  url: string; // Base64 data URL or external URL
  name?: string;
  placement: CustomImagePlacement; // 'background' (fundo) or 'foreground' (frente / overlay)
  opacity: number; // 0.05 to 1.0 (e.g. 0.22 for subtle background, 0.85 for foreground badge)
  fit: CustomImageFit;
  position?: CustomImagePosition; // 'center' | 'top' | 'bottom'
  scale?: number; // 0.8 to 1.5
  blur?: number; // 0 to 12px
  blendMode?: "normal" | "multiply" | "screen" | "overlay" | "soft-light";
  applyToAllSlides: boolean; // true = all slides in carousel, false = current slide only
}

export interface MatrixContent {
  tag: string;
  title: string;
  subtitle: string;
  mythHeader: string;
  mythItems: string[];
  realityHeader: string;
  realityItems: string[];
  takeaway: string;
}

export interface QuoteContent {
  tag: string;
  quote: string;
  author: string;
  reflection: string;
  callToAction: string;
}

export interface CopingStep {
  number: string;
  title: string;
  description: string;
}

export interface CopingCardContent {
  tag: string;
  title: string;
  subtitle: string;
  steps: CopingStep[];
  mantra: string;
  note: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  subtext?: string;
}

export interface ChecklistContent {
  tag: string;
  title: string;
  subtitle: string;
  items: ChecklistItem[];
  conclusion: string;
}

export interface CycleStep {
  number: string;
  label: string;
  description: string;
}

export interface CycleContent {
  tag: string;
  title: string;
  subtitle: string;
  steps: CycleStep[];
  breakingPoint: string;
}

export interface QAProvocationContent {
  tag: string;
  question: string;
  context: string;
  subQuestions: string[];
  therapeuticTakeaway: string;
  invitation: string;
}

export interface BrandSettings {
  name: string;
  signature: string;
  crp: string;
  instagram: string;
  defaultTag: string;
  avatarBase64: string | null;
  avatarShape: "circle" | "square" | "rounded";
  showAvatar: boolean;
  showInstagram: boolean;
  showCrp: boolean;
  showSlideNumber: boolean;
  showSwipeHint: boolean;
}

export type CanvasTexture = "none" | "grain" | "paper" | "subtle-dots" | "warm-linen";

export interface PostState {
  format: PostFormat;
  topLevelFormat?: TopLevelFormat; // "carousel" | "reels_script" | "single_card" | "stories_sequence"
  aspectRatio: AspectRatio;
  themeTitle: string;
  palette: ColorPalette;
  typography: TypographySettings;
  illustration: SvgIllustration;
  illustrationPlacement?: IllustrationPlacement;
  illustrationOpacity?: number; // 0.05 to 0.50
  illustrationScale?: "normal" | "large" | "expansive";
  connectSlides?: boolean; // continuous dynamic wave flow across carousel slides
  texture?: CanvasTexture; // Sutil textura de papel / grão analógico
  customImage?: CustomImageOverlay | null; // Uploaded custom image (fundo ou frente)
  brand: BrandSettings;
  textDensity?: TextDensity;
  
  // Content models
  carousel: {
    tag: string;
    mainTitle: string;
    slides: CarouselSlide[];
    currentSlideIndex: number;
  };
  matrix: MatrixContent;
  quote: QuoteContent;
  copingCard: CopingCardContent;
  checklist: ChecklistContent;
  cycle: CycleContent;
  qaProvocation: QAProvocationContent;

  // New Multi-Format Content Models
  reelsScript?: ReelsScriptData;
  singleCard?: SingleCardData;
  storiesSequence?: StoriesSequenceData;
}

export interface SavedPostDraft {
  id: string;
  title: string;
  savedAt: string;
  format: PostFormat;
  approachName?: string;
  slidesCount?: number;
  state: PostState;
}

export interface UserAccount {
  username: string;
  name: string;
  email?: string;
  password?: string;
  crp?: string;
  instagram?: string;
  createdAt?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    name: string;
    email?: string;
  } | null;
  rememberMe: boolean;
}
