// Clinical Fallback Generator for Studio Psicopost Pro
// Ensures 100% operational uptime when Gemini API experiences 503 high demand spikes or 429 quota exhaustion.

export interface ApproachMetadata {
  code: string;
  name: string;
  author: string;
  lens: string;
  mechanism: string;
  trap: string;
  insight: string;
  exercise: string;
  steps: string[];
  tag: string;
}

export function getApproachMetadata(approach: string = "TCC"): ApproachMetadata {
  const a = (approach || "TCC").toLowerCase();
  if (a.includes("acp") || a.includes("pessoa") || a.includes("rogers") || a.includes("humanista")) {
    return {
      code: "ACP",
      name: "Abordagem Centrada na Pessoa",
      author: "Carl Rogers",
      lens: "autoaceitação incondicional e congruência interna",
      mechanism: "quando nos sentimos acolhidos sem exigências externas, nosso organismo recupera sua tendência natural ao crescimento e autorrealização.",
      trap: "silenciar a própria verdade interior tentando corresponder a 'condições de valor' impostas pelos outros.",
      insight: "o curioso paradoxo da mudança: quando me aceito exatamente como sou, então posso me transformar.",
      exercise: "Pausa Fenomenológica de Autoescuta e Acolhimento",
      steps: [
        "Reconheça onde você tem calado seu sentimento genuíno para agradar ou ser aceito.",
        "Dê permissão para sentir o que sente neste instante, sem tentar consertar na hora.",
        "Trate sua experiência atual com consideração positiva incondicional e empatia.",
      ],
      tag: "ACP • CARL ROGERS",
    };
  } else if (a.includes("psicanálise") || a.includes("psicanal") || a.includes("freud") || a.includes("lacan") || a.includes("winnicott")) {
    return {
      code: "Psicanálise",
      name: "Psicanálise Contemporânea",
      author: "Sigmund Freud & Jacques Lacan",
      lens: "escuta do inconsciente e elaboração do sintoma",
      mechanism: "o sintoma não é um mero defeito mecânico, mas uma mensagem do inconsciente buscando expressão simbólica.",
      trap: "a tirania do Supereu cobrando uma perfeição inatingível e gerando uma culpa inconsciente silenciosa.",
      insight: "aquilo que não pode ser dito nem elaborado pela palavra retorna como sintoma no corpo e repetição de destino.",
      exercise: "Escuta Analítica da Cobrança Interna",
      steps: [
        "Pergunte-se: de quem é essa voz severa que tanto te julga e exige perfeição?",
        "Reconheça a repetição inconsciente que você vem sustentando em seus vínculos.",
        "Coloque em palavras o que até agora só encontrou saída em forma de angústia.",
      ],
      tag: "PSICANÁLISE • ESCUTA",
    };
  } else if (a.includes("gestalt") || a.includes("perls")) {
    return {
      code: "Gestalt",
      name: "Gestalt-Terapia",
      author: "Fritz Perls",
      lens: "awareness e presença genuína no Aqui-e-Agora",
      mechanism: "o sofrimento se intensifica quando bloqueamos o contato com o presente e acumulamos assuntos emocionais inacabados (gestalts abertas).",
      trap: "retroflexão e introjeção: engolir regras rígidas e voltar a tensão e a raiva contra o próprio corpo.",
      insight: "nada existe além do agora; a transformação começa quando você se apropria de como interrompe sua própria fluidez.",
      exercise: "Prática de Awareness no Aqui-e-Agora",
      steps: [
        "Perceba onde seu corpo está acumulando tensão física exatamente neste instante.",
        "Identifique quais expectativas engolidas não pertencem à sua real necessidade.",
        "Feche ciclos emocionais inacabados permitindo-se expressar sua verdade com clareza.",
      ],
      tag: "GESTALT • AWARENESS",
    };
  } else if (a.includes("act") || a.includes("compromisso")) {
    return {
      code: "ACT",
      name: "Terapia de Aceitação e Compromisso",
      author: "Steven C. Hayes",
      lens: "flexibilidade psicológica e desfusão cognitiva",
      mechanism: "o sofrimento psicológico não nasce das emoções difíceis, mas da tentativa desesperada de lutar contra elas ou evitá-las.",
      trap: "fusão cognitiva: acreditar cegamente em tudo o que a mente ansiosa dita e adiar o que importa.",
      insight: "você não precisa vencer a discussão com a sua mente para dar passos concretos na direção do que valoriza.",
      exercise: "Desfusão Cognitiva e Ação com Valores",
      steps: [
        "Nomeie a mente: 'Estou notando que minha mente está me dizendo que não vou dar conta'.",
        "Abra espaço voluntário para a sensação desconfortável sem brigar nem fugir dela.",
        "Escolha uma ação pequena, mas significativa, alinhada com o que é precioso para você.",
      ],
      tag: "ACT • FLEXIBILIDADE",
    };
  } else if (a.includes("dbt") || a.includes("dialética")) {
    return {
      code: "DBT",
      name: "Terapia Comportamental Dialética",
      author: "Marsha Linehan",
      lens: "aceitação radical e regulação emocional dialética",
      mechanism: "quando a dor ultrapassa a janela de tolerância emocional, precisamos de habilidades práticas para manter a estabilidade sem piorar o cenário.",
      trap: "julgar a própria dor e agir sob o impulso da Mente Emocional em vez de ativar a Mente Sábia.",
      insight: "você está fazendo o melhor que pode E ao mesmo tempo pode aprender novas habilidades de regulação.",
      exercise: "Habilidade STOP e Ativação da Mente Sábia",
      steps: [
        "Pause e dê um passo atrás antes de reagir (técnica STOP).",
        "Aceite radicalmente os fatos do momento presente sem alimentar julgamentos.",
        "Acesse a Mente Sábia: encontre o equilíbrio entre emoção legítima e clareza de ação.",
      ],
      tag: "DBT • MENTE SÁBIA",
    };
  } else if (a.includes("esquema") || a.includes("young")) {
    return {
      code: "Esquema",
      name: "Terapia do Esquema",
      author: "Jeffrey Young",
      lens: "reparentalização e fortalecimento do Adulto Saudável",
      mechanism: "situações cotidianas ativam feridas de necessidades emocionais básicas negligenciadas na infância, disparando o Crítico Punitivo.",
      trap: "permitir que o modo Crítico Punitivo ou Exigente comande suas escolhas com chicote moral e medo de rejeição.",
      insight: "sua dor vem de uma ferida antiga real, mas hoje o seu Adulto Saudável pode assumir o volante e proteger sua vulnerabilidade.",
      exercise: "Proteção da Criança Vulnerável pelo Adulto Saudável",
      steps: [
        "Identifique quando o Crítico Punitivo começou a te desvalorizar ou cobrar perfeição.",
        "Coloque limites firmes nessa voz punitiva: 'Eu reconheço meu valor e recuso essa crueldade'.",
        "Acolha a sua Criança Vulnerável com o afeto, segurança e validação que ela sempre precisou.",
      ],
      tag: "ESQUEMA • ADULTO SAUDÁVEL",
    };
  } else {
    // Default: TCC
    return {
      code: "TCC",
      name: "Terapia Cognitivo-Comportamental",
      author: "Aaron Beck & Judith Beck",
      lens: "reestruturação cognitiva e evidências empíricas",
      mechanism: "não são as situações em si que provocam sofrimento, mas a interpretação e os pensamentos automáticos distorcidos sobre elas.",
      trap: "catastrofização, pensamento tudo-ou-nada e autocrítica severa retroalimentando a ansiedade.",
      insight: "pensamentos automáticos são apenas hipóteses mentais, não sentenças judiciais irrecorríveis sobre quem você é.",
      exercise: "Exame Socrático de Evidências Clínicas",
      steps: [
        "Identifique o pensamento automático que disparou a angústia ou o nó no peito.",
        "Busque evidências empíricas reais a favor e contra essa interpretação mental.",
        "Elabore uma resposta cognitiva alternativa mais flexível, realista e compassiva.",
      ],
      tag: "TCC • ESTRUTURADA",
    };
  }
}

// Generate complete structured post content across all formats
export function generateFallbackPostContent(
  theme: string = "Saúde Emocional",
  approach: string = "TCC",
  format: string = "carousel",
  tone: string = "Clínico e Empático",
  textDensity: string = "balanced"
): any {
  const meta = getApproachMetadata(approach);
  const cleanTheme = theme.trim() || "Saúde Emocional e Autocuidado";

  if (format === "carousel") {
    return {
      tag: `${meta.tag} • CLÍNICA`,
      mainTitle: cleanTheme,
      slides: [
        {
          slideNumber: 1,
          slideRole: "cover",
          badge: `01 • ${meta.tag}`,
          title: `Quando a mente não desacelera: o que está por trás de ${cleanTheme}?`,
          subtitle: `Uma análise fundamentada em ${meta.name} para transformar sua relação com as exigências internas.`,
          body: `Se você sente que carrega um peso silencioso no peito e nunca se sente suficiente, este carrossel foi construído para te acolher com rigor técnico.`,
          footerNote: "Deslize para desvendar ➔",
        },
        {
          slideNumber: 2,
          slideRole: "content",
          badge: "02 • IDENTIFICAÇÃO",
          title: "Como esse peso se manifesta no seu dia a dia",
          subtitle: "Sinais silenciosos de que o limite foi ultrapassado:",
          body: "Muitas vezes normalizamos o desgaste emocional achando que é apenas 'falta de organização'. Observe se você reconhece esses padrões:",
          items: [
            "Dificuldade genuína de descansar sem sentir urgência ou culpa moral.",
            "Sensação contínua de estar devendo algo para o trabalho, família ou para si.",
            "Autocrítica desproporcional: onde 9 vitórias são anuladas por 1 detalhe imperfeito.",
          ],
          footerNote: "Entenda o mecanismo por trás disso ➔",
        },
        {
          slideNumber: 3,
          slideRole: "content",
          badge: "03 • O MECANISMO",
          title: `A engrenagem sob a ótica de ${meta.code}`,
          subtitle: "Compreensão clínica sem julgamento ou culpa:",
          body: `Na perspectiva de ${meta.name}, ${meta.mechanism}`,
          highlightBox: "O sintoma não surge por fraqueza pessoal: ele é uma resposta protetiva aprendida pelo seu organismo.",
          footerNote: "Descubra a armadilha invisível ➔",
        },
        {
          slideNumber: 4,
          slideRole: "content",
          badge: "04 • AS ARMADILHAS",
          title: "A armadilha mental que alimenta o ciclo",
          subtitle: "Onde o alívio temporário se transforma em prisão:",
          body: `Frequentemente, a armadilha está em ${meta.trap} Esse mecanismo cria a ilusão de controle, mas consome sua energia vital.`,
          items: [
            "Acreditar que a severidade consigo mesmo é o único motor da sua evolução.",
            "Isolar-se emocionalmente com medo de expor cansaço ou fragilidade humana.",
            "Adiar a tranquilidade para um momento futuro idealizado que nunca chega.",
          ],
          footerNote: "Veja o ponto de virada terapêutico ➔",
        },
        {
          slideNumber: 5,
          slideRole: "content",
          badge: "05 • PONTO DE VIRADA",
          title: "O insight transformador da clínica",
          subtitle: "A mudança de perspectiva que restaura o equilíbrio:",
          body: `Para romper esse padrão, a abordagem ${meta.code} convida a uma nova postura: ${meta.insight}`,
          highlightBox: "Cuidar da sua mente não é desistir das suas metas; é construir a base ética e afetiva para sustentá-las sem adoecer.",
          footerNote: "Como aplicar na sua rotina ➔",
        },
        {
          slideNumber: 6,
          slideRole: "content",
          badge: "06 • NA PRÁTICA",
          title: meta.exercise,
          subtitle: "3 passos graduais para começar a exercitar hoje:",
          body: "A mudança sólida não exige rupturas drásticas, mas pequenos atos diários de coerência interna:",
          items: meta.steps,
          footerNote: "Salve este guia de bolso ➔",
        },
        {
          slideNumber: 7,
          slideRole: "cta",
          badge: "07 • SALVE & COMPARTILHE",
          title: "Você não precisa carregar tudo sozinho(a)",
          subtitle: "A psicoterapia é o espaço onde esse ciclo pode ser ressignificado com cuidado.",
          body: "Reconhecer seu cansaço não é capitulação. É o primeiro passo maduro em direção à sua saúde emocional.",
          items: [
            "💾 Salve este post para consultar sempre que a mente acelerar",
            "🔄 Compartilhe nos Stories para acolher mais pessoas",
            "💬 Deixe seu comentário: qual reflexão mais tocou você?",
            "🗓️ Atendimentos clínicos online e presenciais disponíveis (Link na bio)",
          ],
          highlightBox: `Atendimentos clínicos individuais e acolhedores orientados por ${meta.name}. Informações de agendamento disponíveis no link da bio.`,
          footerNote: "Compartilhe e salve este guia ✨",
        },
      ],
    };
  } else if (format === "checklist") {
    return {
      tag: `CHECKLIST CLÍNICO • ${meta.tag}`,
      title: `5 Sinais de que a Sobrecarga Emocional Ultrapassou o Limite`,
      subtitle: `Um guia de autopercepção guiado por ${meta.name}`,
      items: [
        {
          id: "chk-1",
          text: "Dificuldade em desconectar os pensamentos mesmo durante momentos de descanso",
          subtext: "A mente permanece em estado de hipervigilância, antecipando pendências futuras.",
        },
        {
          id: "chk-2",
          text: "Sensação constante de urgência e insuficiência no fim do dia",
          subtext: "Mesmo realizando múltiplas tarefas, a voz interna foca exclusivamente no que faltou.",
        },
        {
          id: "chk-3",
          text: "Reações de irritabilidade desproporcional a pequenos imprevistos",
          subtext: "Quando a reserva emocional se esgota, a tolerância à frustração cai drasticamente.",
        },
        {
          id: "chk-4",
          text: "Tensão física crônica na mandíbula, ombros ou respiração superficial",
          subtext: "O corpo registra a sobrecarga emocional através de contrações musculares contínuas.",
        },
        {
          id: "chk-5",
          text: "Adiar pedidos de ajuda por acreditar que precisa dar conta de tudo só",
          subtext: "A crença de autossuficiência rígida impede o acolhimento e aprofunda o esgotamento.",
        },
      ],
      conclusion: "Se você se identificou com ao menos 3 sinais, não se critique: encare isso como um convite compassivo do seu organismo para desacelerar e buscar apoio terapêutico.",
    };
  } else if (format === "cycle") {
    return {
      tag: `ENGENHARIA DO SINTOMA • ${meta.tag}`,
      title: `O Ciclo da Autocobrança e Exaustão Silenciosa`,
      subtitle: `Como o padrão se retroalimenta sob a ótica de ${meta.name}:`,
      steps: [
        {
          number: "1",
          title: "Gatilho Inicial",
          description: "Surgimento de uma demanda, expectativa externa ou medo de frustrar alguém importante.",
        },
        {
          number: "2",
          title: "Interpretação Severa",
          description: "A mente ativa o pensamento automático: 'Eu preciso fazer tudo com perfeição imediata'.",
        },
        {
          number: "3",
          title: "Comportamento de Defesa",
          description: "Sacrifício do sono e do lazer, aumento da vigilância e hipercontrole dos detalhes.",
        },
        {
          number: "4",
          title: "Reforço do Sintoma",
          description: "Exaustão física e emocional que alimenta a insegurança, reiniciando o ciclo de angústia.",
        },
      ],
      breakingPoint: `PONTO DE RUPTURA TERAPÊUTICA: Interromper a etapa 2 através de ${meta.lens}, reconhecendo que o valor humano não depende de uma performance impecável.`,
    };
  } else if (format === "quote") {
    return {
      tag: `EDITORIAL CLÍNICO • ${meta.tag}`,
      quote: "O paradoxo mais belo da vida é que quando me aceito exatamente como sou, então posso me transformar.",
      author: meta.author,
      reflection: `Muitas vezes passamos a vida lutando contra as nossas próprias feridas, acreditando que a rigidez nos protegerá. Porém, é na coragem de acolher nossa vulnerabilidade que encontramos a verdadeira estabilidade emocional.`,
      callToAction: "Qual parte da sua história hoje está precisando de acolhimento em vez de cobrança?",
    };
  } else if (format === "coping_card") {
    return {
      tag: `SOS ANSIEDADE • ${meta.tag}`,
      title: `Protocolo de Enfrentamento e Regulação`,
      subtitle: `Use quando a mente acelerar ou a angústia apertar o peito:`,
      steps: [
        {
          number: "1",
          title: "Ancoragem no Corpo",
          description: "Apoie os dois pés firmes no chão, sinta o contato com a terra e solte os ombros.",
        },
        {
          number: "2",
          title: "Respiração Compassada",
          description: "Puxe o ar em 4 tempos, retenha por 2 e solte longamente em 6 tempos pela boca.",
        },
        {
          number: "3",
          title: "Validação Interna",
          description: "Repita: 'Este momento é difícil, mas eu estou em segurança e posso respirar com ele'.",
        },
        {
          number: "4",
          title: "Ação de Respeito",
          description: "Dê a si mesmo a permissão de resolver uma única coisa de cada vez, sem urgência.",
        },
      ],
      mantra: "Eu não preciso controlar o incontrolável para estar em paz neste instante.",
      note: "Lembrete clínico: A ansiedade é uma onda que sobe, atinge o pico e desce se você não lutar contra ela.",
    };
  } else if (format === "matrix") {
    return {
      tag: `MITO VS. EVIDÊNCIA • ${meta.tag}`,
      title: `Autocobrança: O que a Cultura Diz vs. O que a Clínica Mostra`,
      subtitle: `Desmistificando crenças prejudiciais com base em ${meta.name}`,
      mythHeader: "SENSO COMUM (MITOS)",
      mythItems: [
        "Se eu não for extremamente duro comigo, vou relaxar e fracassar.",
        "Pessoas fortes nunca demonstram cansaço ou pedem ajuda.",
        "Descansar antes de terminar todas as pendências é sinal de preguiça.",
      ],
      realityHeader: `EVIDÊNCIA CLÍNICA (${meta.code})`,
      realityItems: [
        "A autocrítica severa gera paralisia por ansiedade; a autocompaixão sustenta a consistência.",
        "A vulnerabilidade consciente é o maior indicador de maturidade e saúde emocional.",
        "O descanso programado não é prêmio por bater metas: é pré-requisito biológico para viver.",
      ],
      takeaway: "Substituir a punição pela lucidez técnica é o verdadeiro caminho para uma vida produtiva e saudável.",
    };
  } else {
    // qa_provocation
    return {
      tag: `QUESTIONAMENTO CLÍNICO • ${meta.tag}`,
      question: `Quem você seria se não estivesse o tempo todo tentando provar seu valor?`,
      context: `Desde cedo, aprendemos a vincular nosso merecimento de afeto e respeito à quantidade de entregas e à capacidade de suportar dor sem reclamar.`,
      subQuestions: [
        "Quais decisões do seu dia a dia são tomadas pelo medo de desapontar os outros?",
        "Quanto da sua exaustão atual vem de carregar responsabilidades que não são suas?",
        "O que você faria hoje se soubesse que já é suficientemente digno de respeito?",
      ],
      therapeuticTakeaway: `Na clínica ${meta.code}, aprendemos que o descanso e a paz de espírito não são troféus de chegada, mas o solo necessário para cultivar qualquer relação saudável.`,
      invitation: "Deixe nos comentários: o que essa pergunta desperta em você hoje? 🤍",
    };
  }
}

// Repurpose Carousel into Reels, Single Card & Stories
export function generateFallbackRepurposed(
  theme: string = "Saúde Mental",
  mainTitle: string = "",
  approach: string = "TCC",
  slides: any[] = []
): any {
  const meta = getApproachMetadata(approach);
  const cleanTheme = theme.trim() || "Saúde Emocional";
  const title = mainTitle || slides[0]?.title || cleanTheme;
  const cover = slides[0];
  const second = slides[1] || cover;
  const last = slides[slides.length - 1] || cover;

  return {
    reelsScript: {
      hookVisual3s: `Olhar acolhedor e seguro direto para a câmera. Segurando uma xícara ou apoiando as mãos na mesa com postura serena. Texto centralizado na tela: '${title}'.`,
      hookAudioSpeech: cover?.subtitle || "Se a sua mente não tem te dado descanso ultimamente, pare 30 segundos para me ouvir.",
      teleprompterScript: `Muitas vezes acreditamos que precisamos dar conta de tudo sozinhos e que descansar é sinal de fraqueza.\n\nMas a verdade clínica é outra: a exaustão acumulada não é falta de capacidade. É um aviso do seu corpo de que o seu limite já foi ultrapassado.\n\n${second?.body || "Sob a ótica de " + meta.name + ", quando você tenta agradar o mundo inteiro, a primeira pessoa que você abandona é você mesmo."}\n\nReconhecer seu limite não é desistir. É o primeiro ato de respeito e maturidade consigo mesmo.`,
      visualDirections: [
        "Cena 1 (0-3s): Plano frontal médio, contato visual empático e texto magnético na tela.",
        "Cena 2 (4-18s): Corte sutil para ângulo lateral com fala reflexiva e ritmo calmo.",
        "Cena 3 (19-35s): Retorno ao enquadramento frontal com pausa intencional de 1 segundo antes do insight.",
        "Cena 4 (36-42s): Encerramento acolhedor, respiração calma e convite discreto para a legenda.",
      ],
      subtleCta: "Se essa mensagem fez sentido para o seu momento, salve para revisitar e compartilhe com quem precisa respirar hoje.",
      durationEstimate: "35 a 45 segundos",
      audioVibe: "Trilha instrumental serena de piano acústico ou violoncelo suave em volume baixo (12%).",
    },
    singleCard: {
      badge: `REFLEXÃO DO DIA • ${meta.tag}`,
      quote: cover?.title || "Reconhecer seu limite não é fraqueza. É o primeiro ato de respeito consigo mesmo.",
      authorOrRef: meta.name,
      reflection: cover?.subtitle || "Dê a si mesmo a permissão de respirar e desacelerar antes de reagir às cobranças do mundo.",
      subtleTag: "PSICOLOGIA CLÍNICA • SAÚDE MENTAL",
    },
    storiesSequence: {
      theme: cleanTheme,
      objective: "Conscientização empática, validação de sintomas cotidianos e acolhimento com CTA ético para a bio.",
      screens: [
        {
          id: `story-gen-1-${Date.now()}`,
          stepNumber: 1,
          type: "enquete",
          tag: "TELA 01 • QUEBRA DE PADRÃO",
          title: cover?.title || "Você costuma se cobrar além do limite?",
          subtitle: "Uma reflexão honesta para o seu dia:",
          stickerType: "enquete",
          stickerQuestion: "Você sente essa cobrança pesando no peito?",
          stickerOptions: ["Sim, constantemente 🥺", "Às vezes ✨"],
          bodyText: "A autocrítica severa quase sempre se disfarça de 'busca por excelência'. Mas na verdade, é apenas o medo silencioso de não ser suficiente.",
          speakerNote: "Grave olhando diretamente nos olhos do espectador com postura acolhedora e deixe a enquete centralizada.",
        },
        {
          id: `story-gen-2-${Date.now()}`,
          stepNumber: 2,
          type: "identificacao",
          tag: "TELA 02 • SINAIS",
          title: second?.title || "Como isso se manifesta na rotina?",
          subtitle: "Veja se você se reconhece nestes 3 padrões:",
          stickerType: "termometro",
          stickerQuestion: "Nível de identificação com isso hoje:",
          bodyText: "• Culpa imediata ao tentar descansar ou fazer uma pausa.\n• Sensação de estar sempre em atraso com a própria vida.\n• Medo de decepcionar as expectativas dos outros.",
          speakerNote: "Aponte para os pontos na tela sem usar tom acusatório, validando o cansaço do seguidor.",
        },
        {
          id: `story-gen-3-${Date.now()}`,
          stepNumber: 3,
          type: "caixinha",
          tag: "TELA 03 • CAIXINHA DE ESCUTA",
          title: "Espaço Seguro de Escuta",
          subtitle: "Vou responder com cuidado clínico:",
          stickerType: "caixinha",
          stickerQuestion: "Qual cobrança mais tem pesado para você ultimamente?",
          bodyText: "Colocar a angústia em palavras é o primeiro passo para desatar o nó da sobrecarga emocional.",
          speakerNote: "Abra a caixinha com acolhimento genuíno e selecione perguntas para responder com embasamento técnico.",
        },
        {
          id: `story-gen-4-${Date.now()}`,
          stepNumber: 4,
          type: "conclusao_bio",
          tag: "TELA 04 • CONCLUSÃO & BIO",
          title: "Você não precisa carregar tudo só",
          subtitle: "A psicoterapia é o espaço onde esse ciclo pode ser cuidado.",
          stickerType: "link",
          stickerQuestion: "Conheça o espaço de atendimento clínico 🤍",
          bodyText: "Se você sente que é hora de cuidar da sua saúde mental com profundidade e acolhimento, as informações de agendamento estão no link da minha bio.",
          speakerNote: "Chamada ética, tranquila e sem apelo comercial, em estrito acordo com as normas do CFP.",
        },
      ],
    },
  };
}

// Generate Instagram Caption with Hashtags
export function generateFallbackCaption(
  theme: string = "Saúde Mental",
  approach: string = "TCC",
  authorName: string = "Psicólogo(a)",
  mainPoints: string[] = []
): any {
  const meta = getApproachMetadata(approach);
  const cleanTheme = theme.trim() || "Saúde Emocional";

  const hook = `Você já sentiu que, por mais que faça, parece que nunca é o suficiente? 💭`;
  const body = `Muitas vezes entramos em um ritmo automático de cobrança e esquecemos de perguntar ao nosso corpo como ele está se sentindo.\n\nSob a ótica de ${meta.name}, ${meta.mechanism}\n\nA verdade que precisamos relembrar todos os dias é simples: o cansaço acumulado não é uma falha de caráter. É o organismo sinalizando que o limite de tolerância foi excedido.\n\nQuando você se permite pausar sem culpa, não está perdendo tempo; está recuperando a energia essencial para viver com saúde mental e dignidade.`;
  const cta = `✨ Salve este post para consultar sempre que a mente acelerar.\n💬 Deixe nos comentários: qual parte desta reflexão mais fez sentido para você hoje?`;

  const trending = [
    "#saudemental",
    "#psicologia",
    "#autoconhecimento",
    "#ansiedade",
    "#autocuidado",
    "#saudeemocional",
    "#desenvolvimentopessoal",
  ];

  const themeSpecific = [
    "#autocobranca",
    "#perfeccionismo",
    "#cansacoemocional",
    "#esgotamentomental",
    "#pazinterior",
  ];

  const approachSpecific = [
    `#${meta.code.toLowerCase()}`,
    `#${meta.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    "#psicologiaclinica",
    "#psicoterapia",
  ];

  const clinicalCall = [
    "#atendimentoonline",
    "#terapiaonline",
    "#facaterapia",
    "#psicologoonline",
  ];

  const allHashtags = Array.from(new Set([...trending, ...themeSpecific, ...approachSpecific, ...clinicalCall]));

  const fullFormattedCaption = `${hook}\n\n${body}\n\n${cta}\n\n—\n${authorName} | ${meta.name}\nAtendimentos clínicos disponíveis (Link na bio 🤍)\n\n${allHashtags.join(" ")}`;

  return {
    hook,
    body,
    cta,
    hashtags: allHashtags,
    trendingClusters: {
      trending,
      themeSpecific,
      approachSpecific,
      clinicalCall,
    },
    fullFormattedCaption,
  };
}

// Generate Cover Hooks
export function generateFallbackHooks(theme: string = "Saúde Mental", approach: string = "TCC"): any {
  const meta = getApproachMetadata(approach);
  const cleanTheme = theme.trim() || "Saúde Emocional";

  return {
    variations: [
      {
        type: "empathic",
        label: "Abordagem Empática & Acolhedora",
        badge: "01 • ACOLHIMENTO",
        title: `Se você sente esse peso no peito, pare 1 minuto para ler isto`,
        subtitle: `Uma reflexão acolhedora fundamentada em ${meta.code} sobre ${cleanTheme}.`,
        rationale: "Valida a dor do leitor sem julgamento moral, gerando identificação imediata e sensação de segurança.",
      },
      {
        type: "pattern_breaker",
        label: "Quebra de Padrão & Provocação Reflexiva",
        badge: "01 • QUEBRA DE PADRÃO",
        title: `O perigo invisível de confundir autocobrança com competência`,
        subtitle: `Por que insistir nesse ritmo está esgotando sua saúde mental.`,
        rationale: "Desafia uma crença disfuncional comum, forçando a interrupção da rolagem do feed nos primeiros 2 segundos.",
      },
      {
        type: "scientific_didactic",
        label: "Didática Clínica & Autoridade Técnica",
        badge: "01 • PSICOEDUCAÇÃO",
        title: `A engrenagem psicológica por trás de ${cleanTheme}`,
        subtitle: `O que ${meta.name} nos ensina sobre o mecanismo do sintoma.`,
        rationale: "Transmite forte autoridade profissional e rigor conceitual para o público que valoriza conteúdo aprofundado.",
      },
    ],
  };
}

// Generate CFP Ethics Check
export function generateFallbackEthics(text: string = ""): any {
  const lower = (text || "").toLowerCase();
  const issues: string[] = [];

  if (/cure|cura\s+r[aá]pida|cura\s+definitiva|curar\s+em/i.test(lower)) {
    issues.push("Promessa de cura rápida ou definitiva (vedada pela Resolução CFP nº 010/2005).");
  }
  if (/elimine\s+(de\s+vez|para\s+sempre|em\s+\d+\s+dias)/i.test(lower)) {
    issues.push("Garantia de resultado infalível ou eliminação total de sintomas inerentes à experiência humana.");
  }
  if (/m[eé]todo\s+infal[ií]vel|segredo\s+revelado|f[oó]rmula\s+m[aá]gica/i.test(lower)) {
    issues.push("Sensacionalismo e autopromoção inadequada.");
  }
  if (/voc[eê]\s+tem\s+(depress[aã]o|borderline|tdah)\s+se/i.test(lower)) {
    issues.push("Indução a autodiagnóstico precipitado sem avaliação clínica individual.");
  }
  if (/garantido|100%\s+eficaz|resultado\s+garantido/i.test(lower)) {
    issues.push("Garantia indevida de eficácia absoluta.");
  }

  const isCompliant = issues.length === 0;
  const score = isCompliant ? 96 : Math.max(45, 90 - issues.length * 20);
  const verdict = isCompliant ? "Excelente Conformidade Ética" : "Ajustes Recomendados";
  const feedback = isCompliant
    ? "O texto apresenta postura psicoeducativa responsável, linguagem empática e total alinhamento com as diretrizes do Conselho Federal de Psicologia."
    : "Identificamos expressões que podem soar como promessa exagerada ou diagnóstico fechado. Recomenda-se suavizar para termos de acolhimento e compreensão clínica.";

  const suggestions = isCompliant
    ? ["Mantenha o tom reflexivo e certifique-se de indicar sua assinatura profissional e número de CRP na postagem."]
    : [
        "Substitua expressões como 'cura definitiva' por 'compreensão e regulação emocional'.",
        "Enfatize que cada processo terapêutico é singular e depende de avaliação profissional individualizada.",
      ];

  return {
    isCompliant,
    score,
    verdict,
    feedback,
    suggestions,
  };
}

// Generate Refined Caption
export function generateFallbackRefineCaption(
  currentCaption: string = "",
  actionType: string = "make_concise",
  approach: string = "TCC"
): any {
  const meta = getApproachMetadata(approach);
  let refined = currentCaption.trim();
  let summary = "Legenda refinada com sucesso.";

  if (actionType === "make_concise") {
    const paragraphs = refined.split("\n\n").filter(Boolean);
    if (paragraphs.length > 3) {
      refined = [paragraphs[0], paragraphs[1], paragraphs[paragraphs.length - 1]].join("\n\n");
    }
    summary = "Texto sintetizado para parágrafos mais dinâmicos e leitura rápida no feed.";
  } else if (actionType === "expand_theory") {
    refined = `${refined}\n\n💡 Fundamentação clínica: Sob a perspectiva de ${meta.name}, o cuidado com o bem-estar requer reconhecer como nossos processos internos se estruturam, permitindo intervenções mais gentis e eficazes.`;
    summary = `Aprofundada a fundamentação conceitual em ${meta.name}.`;
  } else if (actionType === "make_empathic") {
    refined = `Respire fundo antes de ler isto: você está fazendo o seu melhor. 🤍\n\n${refined}`;
    summary = "Adicionado acolhimento afetivo e validação emocional inicial.";
  } else if (actionType === "stronger_cta") {
    refined = `${refined}\n\n👉 Salve este post na sua coleção de autocuidado e compartilhe nos Stories com quem precisa dessa reflexão hoje.`;
    summary = "Chamada para ação (CTA) final fortalecida de maneira ética.";
  } else if (actionType === "layman_terms") {
    summary = "Termos técnicos suavizados para linguagem acessível e acolhedora.";
  } else {
    summary = "Revisão ortográfica e ajuste de espaçamento realizados.";
  }

  return {
    refinedCaption: refined,
    summaryOfChanges: summary,
  };
}
