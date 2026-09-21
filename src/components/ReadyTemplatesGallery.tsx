import React from "react";
import { Sparkles, Layers, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { PostState, PostFormat, TopLevelFormat, ColorPalette } from "../types";

export interface ReadyTemplateItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  format: PostFormat;
  topLevelFormat?: TopLevelFormat;
  approach: string;
  paletteId: string;
  description: string;
  applyState: (prev: PostState) => PostState;
}

interface ReadyTemplatesGalleryProps {
  onApplyTemplate: (template: ReadyTemplateItem) => void;
  className?: string;
}

export const READY_TEMPLATES: ReadyTemplateItem[] = [
  {
    id: "tpl-carousel-ansiedade",
    name: "Carrossel: Ansiedade & Desaceleração",
    category: "Carrossel Clínico • TCC",
    icon: "📑",
    format: "carousel",
    topLevelFormat: "carousel",
    approach: "TCC (Terapia Cognitivo-Comportamental)",
    paletteId: "warm_terracotta",
    description: "7 slides completos: gancho magnético, identificação, mecanismo da ansiedade, armadilhas cognitivas e CTA ético.",
    applyState: (prev) => ({
      ...prev,
      format: "carousel",
      topLevelFormat: "carousel",
      themeTitle: "Por que sua mente acelera quando você tenta descansar?",
      aspectRatio: "4:5",
      carousel: {
        ...prev.carousel,
        tag: "TCC • ANSIEDADE & REGULAÇÃO",
        mainTitle: "Por que sua mente acelera quando você tenta descansar?",
        slides: [
          {
            id: "slide-1",
            slideNumber: 1,
            slideRole: "cover",
            badge: "01 • REFLEXÃO",
            title: "Por que sua mente acelera justamente quando você tenta descansar?",
            subtitle: "Se você sente culpa ao não fazer nada, isso não é preguiça: é hipervigilância.",
            body: "Quando o corpo para, a mente desacostumada ao silêncio interpreta a pausa como perigo iminente.",
            footerNote: "Deslize para compreender ➔",
          },
          {
            id: "slide-2",
            slideNumber: 2,
            slideRole: "content",
            badge: "02 • IDENTIFICAÇÃO",
            title: "Como a hipervigilância se manifesta na sua rotina:",
            body: "A sensação constante de que algo urgente está sendo esquecido ou negligenciado.",
            items: [
              "Checar notificações ou e-mails de trabalho durante o fim de semana",
              "Sensação de aperto no peito ao tentar apenas relaxar no sofá",
              "Necessidade de justificar cada minuto livre com produtividade",
            ],
            footerNote: "O mecanismo por trás disso 👉",
          },
          {
            id: "slide-3",
            slideNumber: 3,
            slideRole: "content",
            badge: "03 • O MECANISMO",
            title: "O cérebro condicionado à sobrecarga",
            body: "Para quem passou anos operando sob estresse contínuo, a ausência de estímulos parece vulnerabilidade. Seu sistema nervoso aprendeu que estar alerta é a única forma de se manter seguro.",
            highlightBox: "Descansar exige segurança interna. Sem ela, a pausa vira ansiedade.",
            footerNote: "Continue deslizando 👉",
          },
          {
            id: "slide-4",
            slideNumber: 4,
            slideRole: "content",
            badge: "04 • A ARMADILHA",
            title: "A crença de que descansar precisa ser 'merecido'",
            body: "Muitos de nós fomos ensinados que só temos direito ao descanso depois de esgotar todas as energias. Isso transforma o autocuidado em prêmio, e não em necessidade biológica básica.",
            items: [
              "Confundir descanso restaurador com 'tempo perdido'",
              "Esperar a exaustão total para finalmente deitar",
              "Alimentar pensamentos de autocrítica severa",
            ],
            footerNote: "O ponto de virada 👉",
          },
          {
            id: "slide-5",
            slideNumber: 5,
            slideRole: "content",
            badge: "05 • PONTO DE VIRADA",
            title: "Pausa consciente não é desperdício: é regulação",
            body: "Na TCC, aprendemos a questionar a catastrofização da pausa. O mundo não desmorona porque você respirou por 30 minutos sem produzir nada para ninguém.",
            highlightBox: "Você não precisa de autorização externa para existir em repouso.",
            footerNote: "Passos práticos 👉",
          },
          {
            id: "slide-6",
            slideNumber: 6,
            slideRole: "content",
            badge: "06 • NA PRÁTICA",
            title: "3 micromovimentos para tolerar a pausa:",
            body: "Pequenos treinos diários de desaceleração para reeducar o sistema nervoso:",
            items: [
              "Pratique 5 minutos de respiração sem celular ao acordar",
              "Nomeie em voz alta: 'Estou em segurança, posso descansar'",
              "Permita-se não responder mensagens instantaneamente",
            ],
            footerNote: "Salve esta reflexão 👉",
          },
          {
            id: "slide-7",
            slideNumber: 7,
            slideRole: "cta",
            badge: "07 • SALVE & COMPARTILHE",
            title: "Gostou desta reflexão? Salve para ler quando a mente acelerar",
            subtitle: "A psicoterapia te ajuda a construir uma relação de paz com o descanso.",
            body: "Compartilhe este carrossel com alguém que precisa de acolhimento e permissão para respirar hoje.",
            items: [
              "💾 Salve este post para consultar durante a semana",
              "🔄 Compartilhe nos seus Stories para espalhar essa reflexão",
              "💬 Nos comentários: você consegue descansar sem culpa?",
              "🗓️ Atendimentos clínicos disponíveis (Link na bio)",
            ],
            highlightBox: "Cuidar da sua mente é o compromisso mais urgente da sua vida.",
            footerNote: "Espalhe reflexão terapêutica ✨",
          },
        ],
      },
    }),
  },
  {
    id: "tpl-matrix-autocobranca",
    name: "Mitos vs. Realidade da Autocobrança",
    category: "Matriz Comparativa • ACP",
    icon: "⚖️",
    format: "matrix",
    topLevelFormat: "carousel",
    approach: "ACP (Abordagem Centrada na Pessoa - Carl Rogers)",
    paletteId: "deep_forest",
    description: "Tabela comparativa direta desmistificando 4 cobranças irreais que paralisam a autoestima.",
    applyState: (prev) => ({
      ...prev,
      format: "matrix",
      themeTitle: "Mitos vs. Realidade da Autocobrança Severa",
      matrix: {
        tag: "ACP • CONDIÇÕES DE VALOR",
        title: "O que te disseram vs. O que a psicologia ensina",
        subtitle: "Desatando a ilusão de que você só tem valor quando é perfeito:",
        mythHeader: "SENSO COMUM / AUTOCRÍTICA",
        mythItems: [
          "Se eu não for exigente, vou me acomodar",
          "Errar é sinal de incompetência definitiva",
          "Preciso agradar a todos para ser aceito",
          "Demonstrar limites é egoísmo",
        ],
        realityHeader: "VISÃO CLÍNICA TERAPÊUTICA",
        realityItems: [
          "A autocompaixão sustenta a evolução; a culpa paralisa",
          "O erro é dado de realidade para o aprendizado organísmico",
          "Condições de valor impostas geram sofrimento crônico",
          "Dizer 'não' é o primeiro passo para o autorrespeito",
        ],
        takeaway: "Carl Rogers ensina: o paradoxo curioso é que quando me aceito como sou, então posso mudar.",
      },
    }),
  },
  {
    id: "tpl-checklist-burnout",
    name: "5 Sinais Sutis de Sobrecarga e Burnout",
    category: "Checklist • Autopercepção",
    icon: "📋",
    format: "checklist",
    topLevelFormat: "carousel",
    approach: "TCC (Terapia Cognitivo-Comportamental)",
    paletteId: "lavender_mist",
    description: "Formato checklist de alta retenção no Instagram com 5 sinais de esgotamento e acolhimento.",
    applyState: (prev) => ({
      ...prev,
      format: "checklist",
      themeTitle: "5 Sinais Sutis de Sobrecarga Emocional",
      checklist: {
        tag: "CHECKLIST CLÍNICO • ESGOTAMENTO",
        title: "5 sinais de que o seu cansaço não é preguiça",
        subtitle: "Sinais sutis de que a sua mente está operando na reserva de emergência:",
        items: [
          {
            id: "chk-1",
            text: "Irritabilidade súbita com pequenos imprevistos",
            subtext: "Quando a paciência zera, é o sistema límbico sobrecarregado.",
          },
          {
            id: "chk-2",
            text: "Dificuldade de tomar decisões simples no cotidiano",
            subtext: "A fadiga mental bloqueia o córtex pré-frontal e a clareza.",
          },
          {
            id: "chk-3",
            text: "Sensação de acordar tão exausto quanto foi dormir",
            subtext: "O sono não repara quando a mente continua em estado de alerta.",
          },
          {
            id: "chk-4",
            text: "Distanciamento emocional de conversas e amigos",
            subtext: "Mecanismo de proteção instintivo para poupar energia.",
          },
          {
            id: "chk-5",
            text: "Culpa crônica por precisar de pausas",
            subtext: "A exigência interna que impede a desaceleração natural.",
          },
        ],
        conclusion: "Reconhecer a exaustão não é fraqueza. A psicoterapia oferece um espaço de escuta sem cobranças.",
      },
    }),
  },
  {
    id: "tpl-cycle-procrastinacao",
    name: "Ciclo da Mente: O Nó da Procrastinação",
    category: "Ciclo da Mente • Ansiedade",
    icon: "🔄",
    format: "cycle",
    topLevelFormat: "carousel",
    approach: "TCC (Terapia Cognitivo-Comportamental)",
    paletteId: "nordic_slate",
    description: "Diagrama visual de 4 etapas mostrando como a esquiva gera alívio momentâneo e angústia tardia.",
    applyState: (prev) => ({
      ...prev,
      format: "cycle",
      themeTitle: "O Ciclo Oculto da Procrastinação por Ansiedade",
      cycle: {
        tag: "TCC • CICLO DO SINTOMA",
        title: "Por que você procrastina o que é importante?",
        subtitle: "A procrastinação quase nunca é sobre má gestão de tempo; é sobre regulação emocional:",
        steps: [
          {
            number: "1",
            label: "Gatilho & Medo de Falhar",
            description: "Uma tarefa desafiadora ativa pensamentos automáticos de incompetência ou perfeccionismo.",
          },
          {
            number: "2",
            label: "Ansiedade & Esquiva",
            description: "Para aliviar o desconforto imediato, você se distrai com redes sociais ou tarefas irrelevantes.",
          },
          {
            number: "3",
            label: "Alívio Rápido & Falsa Paz",
            description: "O cérebro aprende que evitar a dor traz alívio imediato, reforçando o hábito disfuncional.",
          },
          {
            number: "4",
            label: "Culpa & Urgência Crítica",
            description: "O prazo aperta, a autocrítica ataca com violência e o estresse triplica para a próxima tarefa.",
          },
        ],
        breakingPoint: "O Ponto de Ruptura: Quebrar a tarefa em passos de 5 minutos e acolher a imperfeição da primeira versão.",
      },
    }),
  },
  {
    id: "tpl-quote-carlrogers",
    name: "Citação Editorial: O Eu Real e Autenticidade",
    category: "Frase Editorial • Carl Rogers",
    icon: "💬",
    format: "quote",
    topLevelFormat: "carousel",
    approach: "ACP (Abordagem Centrada na Pessoa - Carl Rogers)",
    paletteId: "warm_sand",
    description: "Card editorial minimalista e reflexivo com autoridade clássica da psicologia humanista.",
    applyState: (prev) => ({
      ...prev,
      format: "quote",
      themeTitle: "O Paradoxo da Autoaceitação",
      quote: {
        tag: "CLÁSSICOS DA PSICOLOGIA • CARL ROGERS",
        quote: "O curioso paradoxo é que quando me aceito exatamente como sou, então posso mudar.",
        author: "Carl Rogers • Tornar-se Pessoa",
        reflection: "Passamos a vida tentando nos transformar a partir da rejeição de quem somos. Mas o verdadeiro crescimento só floresce quando acolhemos o Eu Real com profunda empatia.",
        callToAction: "Você costuma se cobrar a partir da culpa ou do acolhimento? Deixe sua reflexão nos comentários.",
      },
    }),
  },
  {
    id: "tpl-coping-desfusao",
    name: "Cartão SOS: Desfusão em Momentos de Crise",
    category: "Cartão SOS • ACT",
    icon: "🩹",
    format: "coping_card",
    topLevelFormat: "carousel",
    approach: "ACT (Terapia de Aceitação e Compromisso)",
    paletteId: "dark_charcoal",
    description: "Passo a passo rápido para desatar pensamentos catastróficos e ancorar no presente.",
    applyState: (prev) => ({
      ...prev,
      format: "coping_card",
      themeTitle: "Cartão SOS: Desfusão de Pensamentos Ansiosos",
      copingCard: {
        tag: "SOS CLÍNICO • DESFUSÃO COGNITIVA",
        title: "Protocolo de 4 passos quando a mente acelerar",
        subtitle: "Guarde este cartão para quando os pensamentos parecerem ameaças reais:",
        steps: [
          {
            number: "1",
            title: "Faça uma Pausa Física",
            description: "Sente-se, apoie os dois pés firmes no chão e sinta o peso do seu corpo sustentado.",
          },
          {
            number: "2",
            title: "Nomeie o Processo Mental",
            description: "Em vez de dizer 'está tudo dando errado', diga: 'minha mente está tendo o pensamento de que...'.",
          },
          {
            number: "3",
            title: "Respire com o Diafragma",
            description: "Inspire pelo nariz em 4 segundos e solte suavemente pela boca em 6 segundos (3 repetições).",
          },
          {
            number: "4",
            title: "Volte a uma Ação Pequena",
            description: "Pergunte-se: qual é a coisa mais gentil e útil que posso fazer por mim nos próximos 5 minutos?",
          },
        ],
        mantra: "Pensamentos são eventos mentais passageiros, não ordens nem verdades absolutas.",
        note: "Se o sofrimento for intenso e frequente, o acompanhamento com psicólogo é fundamental.",
      },
    }),
  },
  {
    id: "tpl-qa-provocacao",
    name: "Pergunta Reflexiva: De Quem É a Expectativa?",
    category: "Pergunta Reflexiva • Psicanálise",
    icon: "❓",
    format: "qa_provocation",
    topLevelFormat: "carousel",
    approach: "Psicanálise / Psicanalítica (Freud & Lacan)",
    paletteId: "deep_forest",
    description: "Pergunta disparadora profunda que instiga comentários e reflexão de alta densidade.",
    applyState: (prev) => ({
      ...prev,
      format: "qa_provocation",
      themeTitle: "De Quem É a Expectativa que Você Tenta Cumprir?",
      qaProvocation: {
        tag: "PSICANÁLISE • REFLEXÃO CLÍNICA",
        question: "A vida que você está tentando sustentar é o seu desejo ou a expectativa de outra pessoa?",
        context: "Muitas vezes carregamos o fardo do que nossos pais, parceiros ou a sociedade esperavam de nós, esquecendo de nos perguntar o que de fato nos move.",
        subQuestions: [
          "Quando você se cobra tanto, qual voz você escuta na sua mente?",
          "O que aconteceria se você decepcionasse quem você sempre tentou agradar?",
          "Quem sobra quando você tira as exigências que não são suas?",
        ],
        therapeuticTakeaway: "A escuta clínica convida você a se implicar na sua história e resgatar o seu próprio desejo.",
        invitation: "Se essa pergunta tocou algum lugar aí dentro, escreva nos comentários: o que você gostaria de soltar hoje?",
      },
    }),
  },
  {
    id: "tpl-reels-3s",
    name: "Roteiro de Reels: Ansiedade vs. Intuição (3s)",
    category: "Roteiro de Reels • 9:16",
    icon: "🎬",
    format: "carousel",
    topLevelFormat: "reels_script",
    approach: "TCC (Terapia Cognitivo-Comportamental)",
    paletteId: "warm_terracotta",
    description: "Roteiro gravável com gancho dos primeiros 3 segundos, direção de gravação e teleprompter.",
    applyState: (prev) => ({
      ...prev,
      topLevelFormat: "reels_script",
      themeTitle: "Como diferenciar Ansiedade de Intuição",
      reelsScript: {
        hookVisual3s: "Olhar sério para a câmera com expressão compreensiva. Texto na tela: 'Pare de chamar ansiedade de intuição'.",
        hookAudioSpeech: "A sua intuição nunca grita. Se tem urgência, desespero e medo de catástrofe, não é intuição: é ansiedade.",
        teleprompterScript: `A intuição é calma, silenciosa e centrada. Ela te diz: 'preste atenção nisso'.\n\nA ansiedade é rápida, caótica e catastrófica. Ela grita: 'resolva agora ou algo terrível vai acontecer!'.\n\nQuando você confunde as duas coisas, você toma decisões impulsivas baseadas no medo, acreditando que está seguindo o seu coração.\n\nNa próxima vez que sentir aquele aperto no peito, pause. Respire fundo e pergunte: essa voz está me protegendo ou está apenas em pânico?\n\nLeia o texto na legenda para entender como regular essa resposta.`,
        visualDirections: [
          "Take 1 (0-5s): Plano médio olhando direto nos olhos do público.",
          "Take 2 (5-18s): Corte sutil para ângulo lateral leve com gestos calmos.",
          "Take 3 (18-35s): Plano próximo ao explicar a diferença de ritmo entre as duas.",
          "Take 4 (35-45s): Apontar para baixo convidando a ler a legenda reflexiva.",
        ],
        subtleCta: "Salve este vídeo para rever antes de tomar decisões precipitadas.",
        durationEstimate: "38 a 45 segundos",
        audioVibe: "Piano suave, compassado e sem batidas agressivas.",
      },
    }),
  },
];

export const ReadyTemplatesGallery: React.FC<ReadyTemplatesGalleryProps> = ({
  onApplyTemplate,
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#1C1A17] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
          Modelos Prontos (1 Clique)
        </label>
        <span className="text-[10px] text-[#8B5E3C] font-semibold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#D4CDBA]">
          Sem complicação
        </span>
      </div>

      <p className="text-[11px] text-[#78716C] leading-snug">
        Escolha um modelo pré-configurado por psicólogos para começar com o conteúdo completo e visual alinhado:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {READY_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onApplyTemplate(tpl)}
            className="p-2.5 bg-white hover:bg-[#FAF7F2] border border-[#D4CDBA] hover:border-[#8B5E3C] rounded-xl text-left transition cursor-pointer flex flex-col justify-between group shadow-2xs"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base shrink-0">{tpl.icon}</span>
                <span className="text-[11px] font-bold text-[#1C1A17] group-hover:text-[#8B5E3C] transition line-clamp-1">
                  {tpl.name}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-[#8B5E3C] block mb-1">
                {tpl.category}
              </span>
              <p className="text-[9.5px] text-[#78716C] line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#F0ECE1] text-[10px] text-[#8B5E3C] font-bold">
              <span>Usar este modelo</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
