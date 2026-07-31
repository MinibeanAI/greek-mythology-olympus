// ============================================================
// Site Configuration — 奥林匹斯 · 希腊神话志
// ============================================================

export interface SiteConfig {
  language: string;
  brandName: string;
}

export const siteConfig: SiteConfig = {
  language: "zh-CN",
  brandName: "OLYMPUS · 神话志",
};

// ============================================================
// Navigation
// ============================================================

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  links: NavLink[];
  ctaText: string;
}

export const navigationConfig: NavigationConfig = {
  links: [
    { label: "神话篇章", href: "#curriculum" },
    { label: "神谕", href: "#cinematic" },
    { label: "十二主神", href: "#alumni" },
    { label: "诸神星图", href: "#pantheon" },
  ],
  ctaText: "",
};

// ============================================================
// Hero
// ============================================================

export interface HeroConfig {
  title: string;
  subtitleLine1: string;
  subtitleLine2: string;
  ctaText: string;
}

export const heroConfig: HeroConfig = {
  title: "奥林匹斯",
  subtitleLine1:
    "从混沌初开到特洛伊的烽火，希腊神话是西方文明三千年不绝的回响——它关乎神力，更关乎人性。",
  subtitleLine2: "星雨尽头，猎户、天琴与天鹰在夜空里若隐若现——那是诸神留在天上的故事。",
  ctaText: "启程 · 神话之旅",
};

// ============================================================
// Capabilities (四大神话篇章)
// ============================================================

export interface CapabilityItem {
  title: string;
  slug: string;
  description: string;
  image: string;
}

export interface CapabilitiesConfig {
  sectionLabel: string;
  items: CapabilityItem[];
}

export const capabilitiesConfig: CapabilitiesConfig = {
  sectionLabel: "神话篇章 · THE SAGAS",
  items: [
    {
      title: "创世与泰坦之战",
      slug: "genesis",
      description:
        "从混沌卡俄斯到大地盖亚，从乌拉诺斯的统治到克洛诺斯推翻父神，再到宙斯率领奥林匹斯诸神与泰坦展开十年鏖战——这是一部关于秩序如何从蛮荒中诞生的宇宙史诗。",
      image: "./images/genesis.jpg",
    },
    {
      title: "奥林匹斯十二主神",
      slug: "olympians",
      description:
        "云层之上的大理石宫殿里，十二位主神各掌一方权柄：雷霆、海洋、智慧、爱与美、火焰与信使。他们会嫉妒、会爱慕、会报复——希腊人的神，是放大了的人。",
      image: "./images/olympians.jpg",
    },
    {
      title: "英雄史诗",
      slug: "heroes",
      description:
        "赫拉克勒斯的十二项伟业、珀尔修斯斩杀美杜莎、忒修斯走出迷宫、奥德修斯十年漂泊——半神与凡人以血肉之躯对抗命运，书写下人类最早的英雄主义。",
      image: "./images/heroes.jpg",
    },
    {
      title: "冥界·命运与轮回",
      slug: "underworld",
      description:
        "斯提克斯河上卡戎摆渡亡魂，三位摩伊赖纺出每个人的生命线。在希腊人的想象里，死亡不是终点，而是另一段必须安然走完的旅程——连诸神也无法违逆命运。",
      image: "./images/underworld.jpg",
    },
  ],
};

// ============================================================
// Capability Detail (篇章详情页)
// ============================================================

export interface CapabilityDetailData {
  title: string;
  subtitle: string;
  paragraphs: string[];
}

export interface CapabilityDetailConfig {
  sectionLabel: string;
  backLinkText: string;
  prevLabel: string;
  nextLabel: string;
  notFoundText: string;
  capabilities: Record<string, CapabilityDetailData>;
}

export const capabilityDetailConfig: CapabilityDetailConfig = {
  sectionLabel: "神话篇章",
  backLinkText: "返回首页",
  prevLabel: "上一篇章",
  nextLabel: "下一篇章",
  notFoundText: "这一页神话尚未被书写。",
  capabilities: {
    genesis: {
      title: "创世与泰坦之战",
      subtitle: "在万物之前，唯有混沌",
      paragraphs: [
        "希腊人相信，宇宙的开端是一片无边无际的混沌——卡俄斯（Chaos）。从混沌中诞生了大地女神盖亚、深渊塔尔塔罗斯、黑暗厄瑞玻斯与爱神厄洛斯。盖亚独自生出了天空乌拉诺斯，并与他结合，诞下十二泰坦、独眼巨人与百臂巨人。这是神的第一代谱系，也是一切故事的源头。",
        "乌拉诺斯惧怕子女夺取权力，将他们囚禁于大地深处。盖亚愤而打造一柄金刚石镰刀，交给最小的儿子克洛诺斯。克洛诺斯趁夜阉割并推翻了父亲，乌拉诺斯的血滴落大地，生出复仇女神与巨人族。然而克洛诺斯重蹈覆辙——他吞食自己的每一个新生儿，直到妻子瑞亚用一块襁褓中的石头调包，将宙斯藏进克里特岛的山洞。",
        "长大后的宙斯迫使父亲吐出五位兄姐，随后率领奥林匹斯诸神与泰坦神族展开了长达十年的战争——泰坦之战（Titanomachy）。最终，独眼巨人为宙斯锻造了雷霆，百臂巨人投出山岳般的巨石，泰坦战败，被打入深渊塔尔塔罗斯。阿特拉斯被罚以双肩擎起苍天。自此，宙斯、波塞冬与哈迪斯三分天下：天空、海洋与冥界，奥林匹斯的时代开始了。",
        "创世神话远不止于打打杀杀。它回答了古希腊人最执着的追问：秩序从何而来？正义（忒弥斯）、记忆（谟涅摩绪涅）、命运（摩伊赖）这些抽象力量如何成为宇宙的一部分？读懂了创世，便读懂了整个希腊神话的底层逻辑。",
      ],
    },
    olympians: {
      title: "奥林匹斯十二主神",
      subtitle: "神的谱系，人的镜像",
      paragraphs: [
        "奥林匹斯山是希腊最高的山峰，终年云雾缭绕，古希腊人相信众神就住在云层之上的大理石宫殿中。十二主神的核心成员包括：众神之王宙斯、天后赫拉、海神波塞冬、智慧女神雅典娜、光明之神阿波罗、狩猎女神阿尔忒弥斯、战神阿瑞斯、爱与美之神阿佛洛狄忒、火神赫菲斯托斯、神使赫尔墨斯、农业女神得墨忒耳与酒神狄俄尼索斯（一说为灶神赫斯提亚）。",
        "每位主神都执掌一方权柄，也都有自己鲜明的性格与象征。雅典娜从宙斯的头颅中全副武装地诞生，她的圣物是猫头鹰与橄榄树；阿波罗手持里拉琴，既是音乐与诗歌之神，也掌管预言与医药；阿佛洛狄忒从海浪的泡沫中升起，所到之处百花盛开。他们的符号——宙斯的雷霆、波塞冬的三叉戟、赫尔墨斯的双蛇杖——至今仍出现在现代文化的每个角落。",
        "与众不同的是，希腊诸神并非完美无缺的存在。赫拉善妒，阿瑞斯鲁莽，宙斯风流成性，诸神之间充斥着争吵、阴谋与和解。这正是希腊神话最迷人的地方：神是人的放大，神话是人性在苍穹上的投影。诸神的故事，其实是希腊人讲述自己命运的方式。",
      ],
    },
    heroes: {
      title: "英雄史诗",
      subtitle: "凡人以血肉之躯挑战神明的剧本",
      paragraphs: [
        "希腊英雄大多是神与凡人的后代——他们拥有超凡的力量，却终有一死，正是这种夹在神性与人性之间的张力造就了最伟大的悲剧与壮举。赫拉克勒斯是宙斯与凡人女子之子，因赫拉的诅咒在狂怒中铸成大错，为赎罪完成了十二项不可能的任务：杀死刀枪不入的涅墨亚狮子、九头蛇许德拉、活捉地狱三头犬刻耳柏洛斯……最终他挣脱凡躯，升入奥林匹斯。",
        "珀尔修斯在雅典娜与赫尔墨斯的帮助下，用青铜盾的倒影避开美杜莎的石化目光，斩下她的头颅，又在归途从海怪口中救下公主安德洛墨达。忒修斯带着线团走入克里特的迷宫，杀死了牛头怪弥诺陶洛斯——一团线，成为人类智慧战胜蛮荒的隐喻。伊阿宋率领阿尔戈英雄远征科尔喀斯夺取金羊毛，却在美狄亚的爱情与背叛中走向幻灭。",
        "荷马的《奥德赛》则把英雄的定义推向另一面：奥德修斯没有赫拉克勒斯的神力，他靠的是狡黠与坚韧。特洛伊战后，他漂泊十年——独眼巨人、女妖塞壬、女巫喀耳刻——只为回到伊萨卡的妻子身边。希腊英雄史诗歌颂的从来不只是力量，而是人在命运面前不肯低头的姿态。",
      ],
    },
    underworld: {
      title: "冥界·命运与轮回",
      subtitle: "连诸神也无法违逆的剧本",
      paragraphs: [
        "在希腊人的想象中，亡者的灵魂要渡过斯提克斯河才能抵达冥界，摆渡人卡戎只收受葬时含在死者口中的钱币。冥王哈迪斯统治着这片沉默的国度，三头犬刻耳柏洛斯守在门口——许进不许出。善者前往至福乐土，恶者在塔尔塔罗斯受刑：坦塔罗斯永远够不到头顶的水与果，西西弗斯永远推着那块必将滚落的巨石。",
        "凌驾于一切之上的，是命运三女神摩伊赖：克罗托纺出生命之线，拉克西斯丈量线的长短，阿特洛波斯挥剪将其剪断。连宙斯都对命运保持敬畏——这正是希腊神话最深刻的命题：神可以强大，但无人能逃脱命运。俄耳甫斯为救亡妻独闯冥界，琴声令铁石心肠的冥王落泪，却在回头的瞬间永远失去了欧律狄刻——爱情终究没有赢过那一条规则。",
        "得墨忒耳的女儿珀耳塞福涅被哈迪斯掳入冥界，母亲寻女的哀恸令大地荒芜。宙斯调停之下，珀耳塞福涅每年六个月回到人间——她归来时万物生长，离去时寒冬降临。希腊人用这个神话解释四季轮回，也把死亡写成了循环的一部分：告别不是终点，而是来年春天重逢的约定。",
      ],
    },
  },
};

// ============================================================
// Architecture (神谕视频区)
// ============================================================

export interface ArchitectureConfig {
  sectionLabel: string;
  videoPath: string;
  title: string;
  description: string;
}

export const architectureConfig: ArchitectureConfig = {
  sectionLabel: "神谕 · THE ORACLE",
  videoPath: "./videos/olympus.gif",
  title: "云层之上，众神的宫殿仍在闪耀",
  description:
    "德尔斐神庙的门楣上刻着两句箴言：认识你自己，凡事勿过度。女祭司皮提亚在月桂与蒸汽中传达阿波罗的神谕，城邦的兴废、战争的抉择都曾系于一言。希腊人相信，神从不直接给出答案——他们只在你望向内心的瞬间低语。正如这片云海之上的宫殿：它既在远方，也在每个仰望者的头顶。",
};

// ============================================================
// Research (十二主神档案)
// ============================================================

export interface ResearchProject {
  title: string;
  year: string;
  discipline: string;
  image: string;
  godId?: string;
}

export interface ResearchConfig {
  sectionLabel: string;
  projects: ResearchProject[];
}

export const researchConfig: ResearchConfig = {
  sectionLabel: "十二主神 · THE TWELVE OLYMPIANS",
  projects: [
    { title: "宙斯 · Zeus", year: "JUPITER", discipline: "天空与雷霆 · 众神之王", image: "./images/gods/zeus.jpg", godId: "zeus" },
    { title: "赫拉 · Hera", year: "JUNO", discipline: "婚姻与家庭 · 天后", image: "./images/gods/hera.jpg", godId: "hera" },
    { title: "波塞冬 · Poseidon", year: "NEPTUNE", discipline: "海洋与地震 · 三叉戟", image: "./images/gods/poseidon.jpg", godId: "poseidon" },
    { title: "雅典娜 · Athena", year: "MINERVA", discipline: "智慧与战争 · 猫头鹰", image: "./images/gods/athena.jpg", godId: "athena" },
    { title: "阿波罗 · Apollo", year: "APOLLO", discipline: "光明·音乐·预言", image: "./images/gods/apollo.jpg", godId: "apollo" },
    { title: "阿尔忒弥斯 · Artemis", year: "DIANA", discipline: "狩猎与月亮 · 银弓", image: "./images/gods/artemis.jpg", godId: "artemis" },
    { title: "阿瑞斯 · Ares", year: "MARS", discipline: "战争与勇气", image: "./images/gods/ares.jpg", godId: "ares" },
    { title: "阿佛洛狄忒 · Aphrodite", year: "VENUS", discipline: "爱与美 · 诞生于海沫", image: "./images/gods/aphrodite.jpg", godId: "aphrodite" },
    { title: "赫菲斯托斯 · Hephaestus", year: "VULCAN", discipline: "火焰与锻造 · 工匠之神", image: "./images/gods/hephaestus.jpg", godId: "hephaestus" },
    { title: "赫尔墨斯 · Hermes", year: "MERCURY", discipline: "信使·商业·旅人", image: "./images/gods/hermes.jpg", godId: "hermes" },
    { title: "得墨忒耳 · Demeter", year: "CERES", discipline: "农业与丰收", image: "./images/gods/demeter.jpg", godId: "demeter" },
    { title: "狄俄尼索斯 · Dionysus", year: "BACCHUS", discipline: "葡萄酒·狂欢·戏剧", image: "./images/gods/dionysus.jpg", godId: "dionysus" },
  ],
};

// ============================================================
// Footer
// ============================================================

export interface FooterLinkColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterBottomLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  heading: string;
  columns: FooterLinkColumn[];
  copyright: string;
  bottomLinks: FooterBottomLink[];
}

export const footerConfig: FooterConfig = {
  heading: "神话永不落幕",
  columns: [
    {
      title: "项目",
      links: [
        { label: "诸神星图", href: "#pantheon" },
        { label: "神话篇章", href: "#curriculum" },
        { label: "主神档案", href: "#alumni" },
        { label: "神谕影像", href: "#cinematic" },
      ],
    },
    {
      title: "源码",
      links: [
        { label: "GitHub", href: "https://github.com/MinibeanAI/greek-mythology-olympus" },
      ],
    },
  ],
  copyright: "© 2026 奥林匹斯·神话志 — 献给所有仰望星空的人",
  bottomLinks: [
    { label: "GitHub 源码", href: "https://github.com/MinibeanAI/greek-mythology-olympus" },
  ],
};
