import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '../hooks/use-mobile';

// 供其他板块联动：dispatchEvent(new CustomEvent('select-god', { detail: godId }))
export const SELECT_GOD_EVENT = 'select-god';
export const SELECT_STORY_EVENT = 'select-story';

// ============================================================
// 诸神关系星图 —— 希腊神话家族、羁绊与故事的交互式星座图谱
// ============================================================

interface GodNode {
  id: string;
  name: string;
  latin: string;
  epithet: string;
  generation: '原始神' | '泰坦' | '奥林匹斯' | '宁芙与凡女' | '英雄';
  x: number;
  y: number;
  r: number;
  img: string;
  parents?: string[];
  spouses?: string[];
  desc: string;
}

const GODS: GodNode[] = [
  { id: 'gaia', name: '盖亚', latin: 'GAIA', epithet: '大地之母', generation: '原始神', x: 130, y: 92, r: 7,
    img: '/images/gods/gaia.jpg',
    spouses: ['uranus'],
    desc: '自混沌中诞生的原始女神，万物与大地的化身。她独自生出天空乌拉诺斯，并孕育了泰坦、独眼巨人与百臂巨人，是一切神谱的根。' },
  { id: 'uranus', name: '乌拉诺斯', latin: 'URANUS', epithet: '初代天王', generation: '原始神', x: 330, y: 68, r: 6.5,
    img: '/images/gods/uranus.jpg',
    spouses: ['gaia'],
    desc: '第一代天空之神，盖亚之子亦是其伴侣。因惧怕子女夺权而将他们囚禁于大地深处，最终被小儿子克洛诺斯用镰刀推翻。' },
  { id: 'cronus', name: '克洛诺斯', latin: 'CRONUS', epithet: '泰坦之王', generation: '泰坦', x: 470, y: 158, r: 7,
    img: '/images/gods/cronus.jpg',
    parents: ['gaia', 'uranus'], spouses: ['rhea'],
    desc: '最年轻的泰坦，推翻父亲乌拉诺斯成为第二代神王。为逃避被子女推翻的预言，他吞食了每一个新生儿——直到宙斯被母亲瑞亚用石头调包。' },
  { id: 'rhea', name: '瑞亚', latin: 'RHEA', epithet: '众神之母', generation: '泰坦', x: 628, y: 140, r: 6,
    img: '/images/gods/rhea.jpg',
    parents: ['gaia', 'uranus'], spouses: ['cronus'],
    desc: '泰坦女神，克洛诺斯的妻子。她用襁褓裹石救下襁褓中的宙斯，改变了整个神话的走向——奥林匹斯六兄妹都是她的孩子。' },

  { id: 'zeus', name: '宙斯', latin: 'ZEUS', epithet: '众神之王', generation: '奥林匹斯', x: 486, y: 316, r: 9,
    img: '/images/gods/zeus.jpg',
    parents: ['cronus', 'rhea'], spouses: ['hera', 'demeter', 'leto', 'maia', 'semele'],
    desc: '天空与雷霆之神，奥林匹斯的统治者。他带领兄姐战胜泰坦，三分天下。性情威严而风流，雅典娜、阿波罗、赫尔墨斯、赫拉克勒斯……无数神祇与英雄都是他的子嗣。' },
  { id: 'hera', name: '赫拉', latin: 'HERA', epithet: '天后', generation: '奥林匹斯', x: 676, y: 296, r: 7,
    img: '/images/gods/hera.jpg',
    parents: ['cronus', 'rhea'], spouses: ['zeus'],
    desc: '婚姻与家庭的守护神，宙斯的姐姐与妻子。她的圣鸟是孔雀。神话中她以善妒著称，屡屡惩戒宙斯的情人与私生子。' },
  { id: 'poseidon', name: '波塞冬', latin: 'POSEIDON', epithet: '海洋之主', generation: '奥林匹斯', x: 258, y: 252, r: 7.5,
    img: '/images/gods/poseidon.jpg',
    parents: ['cronus', 'rhea'], spouses: ['amphitrite'],
    desc: '海洋、地震与马匹之神，手持三叉戟，一怒可掀起滔天巨浪。娶海之宁芙安菲特里忒为后。曾与雅典娜争夺雅典城的守护权，落败后仍以马与泉水赠予人类。' },
  { id: 'hades', name: '哈迪斯', latin: 'HADES', epithet: '冥王', generation: '奥林匹斯', x: 118, y: 372, r: 7,
    img: '/images/gods/hades.jpg',
    parents: ['cronus', 'rhea'], spouses: ['persephone'],
    desc: '冥界与亡者财富的统治者，三头犬刻耳柏洛斯的主人。他并非恶魔，只是沉默而公正地守望着死亡的国度。' },
  { id: 'demeter', name: '得墨忒耳', latin: 'DEMETER', epithet: '丰收女神', generation: '奥林匹斯', x: 322, y: 424, r: 6.5,
    img: '/images/gods/demeter.jpg',
    parents: ['cronus', 'rhea'], spouses: ['zeus'],
    desc: '农业与丰收女神。女儿珀耳塞福涅被掳入冥界后，她的哀恸令大地荒芜——希腊人以此解释四季的更替。' },
  { id: 'hestia', name: '赫斯提亚', latin: 'HESTIA', epithet: '灶火女神', generation: '奥林匹斯', x: 828, y: 208, r: 6,
    img: '/images/gods/hestia.jpg',
    parents: ['cronus', 'rhea'],
    desc: '家庭灶火女神，六兄妹中的长姐。她主动让出十二主神之位，远离纷争，守护每一个家庭的炉火——城邦的圣火为她而燃。' },

  { id: 'athena', name: '雅典娜', latin: 'ATHENA', epithet: '智慧女神', generation: '奥林匹斯', x: 528, y: 470, r: 7.5,
    img: '/images/gods/athena.jpg',
    parents: ['zeus'],
    desc: '智慧、战争策略与工艺女神，全副武装地从宙斯的头颅中诞生。她的圣物是猫头鹰与橄榄树，雅典城因她而得名。' },
  { id: 'apollo', name: '阿波罗', latin: 'APOLLO', epithet: '光明之神', generation: '奥林匹斯', x: 690, y: 448, r: 7.5,
    img: '/images/gods/apollo.jpg',
    parents: ['zeus', 'leto'],
    desc: '光明、音乐、预言与医药之神，宙斯与勒托之子，手持里拉琴，头戴桂冠。德尔斐神庙的神谕由他传达，阿尔忒弥斯是他的孪生姐姐。' },
  { id: 'artemis', name: '阿尔忒弥斯', latin: 'ARTEMIS', epithet: '狩猎女神', generation: '奥林匹斯', x: 830, y: 384, r: 7,
    img: '/images/gods/artemis.jpg',
    parents: ['zeus', 'leto'],
    desc: '狩猎、月亮与荒野女神，宙斯与勒托之女，手持银弓，与鹿群和猎犬为伴。传说她出生时便为母亲接生阿波罗。她发誓终身不嫁，是少女与分娩的守护者。' },
  { id: 'ares', name: '阿瑞斯', latin: 'ARES', epithet: '战神', generation: '奥林匹斯', x: 788, y: 542, r: 6.5,
    img: '/images/gods/ares.jpg',
    parents: ['zeus', 'hera'],
    desc: '战争与暴力之神，宙斯与赫拉之子。他象征战争的残酷一面，嗜血而鲁莽——连父母都不喜欢他，却深得阿佛洛狄忒倾心。' },
  { id: 'aphrodite', name: '阿佛洛狄忒', latin: 'APHRODITE', epithet: '爱与美之神', generation: '奥林匹斯', x: 924, y: 478, r: 7.5,
    img: '/images/gods/aphrodite.jpg',
    spouses: ['hephaestus', 'ares'],
    desc: '爱与美之神，自乌拉诺斯之血溅落的浪花泡沫中诞生。她嫁予火神赫菲斯托斯，却与战神阿瑞斯相爱，金苹果之争更点燃了特洛伊战争。' },
  { id: 'hephaestus', name: '赫菲斯托斯', latin: 'HEPHAESTUS', epithet: '火与锻造之神', generation: '奥林匹斯', x: 908, y: 596, r: 6.5,
    img: '/images/gods/hephaestus.jpg',
    parents: ['zeus', 'hera'], spouses: ['aphrodite'],
    desc: '火焰与锻造之神，奥林匹斯的工匠。生来跛足被抛下神山，却以巧手打造出宙斯的雷霆、阿喀琉斯的铠甲与潘多拉的魔盒。' },
  { id: 'hermes', name: '赫尔墨斯', latin: 'HERMES', epithet: '神使', generation: '奥林匹斯', x: 596, y: 586, r: 6.5,
    img: '/images/gods/hermes.jpg',
    parents: ['zeus', 'maia'],
    desc: '诸神的信使，宙斯与迈亚之子，商业、旅人与机敏之神，脚蹬飞翼凉鞋，手持双蛇杖。他出生当天就偷走了阿波罗的牛群，也负责引渡亡魂入冥界。' },
  { id: 'dionysus', name: '狄俄尼索斯', latin: 'DIONYSUS', epithet: '酒神', generation: '奥林匹斯', x: 400, y: 560, r: 6.5,
    img: '/images/gods/dionysus.jpg',
    parents: ['zeus', 'semele'],
    desc: '葡萄酒、狂欢与戏剧之神，曾两次诞生——先由母亲塞墨勒腹中早产，再从宙斯的大腿中足月而生。他的追随者在狂喜中歌舞，悲剧艺术因他而起。' },
  { id: 'persephone', name: '珀耳塞福涅', latin: 'PERSEPHONE', epithet: '冥后', generation: '奥林匹斯', x: 176, y: 528, r: 6,
    img: '/images/gods/persephone.jpg',
    parents: ['zeus', 'demeter'], spouses: ['hades'],
    desc: '春之女神，得墨忒耳之女，被哈迪斯掳往冥界为后。因吃下六粒石榴籽，她每年六个月居于冥界，六个月重返人间——她归来时，万物生长。' },

  { id: 'leto', name: '勒托', latin: 'LETO', epithet: '泰坦之女', generation: '宁芙与凡女', x: 766, y: 392, r: 5.5,
    img: '/images/gods/leto.jpg',
    spouses: ['zeus'],
    desc: '泰坦女神，阿波罗与阿尔忒弥斯的母亲。因赫拉的嫉妒，她被放逐流浪，直到漂流的得洛斯岛接纳了她，孪生神兄妹才得以降生。' },
  { id: 'amphitrite', name: '安菲特里忒', latin: 'AMPHITRITE', epithet: '海后', generation: '宁芙与凡女', x: 168, y: 160, r: 5.5,
    img: '/images/gods/amphitrite.jpg',
    spouses: ['poseidon'],
    desc: '海之宁芙，波塞冬的妻子、海洋的女王。传说她起初躲避海神的追求，是海豚说动了她——波塞冬因此将海豚的形象升上星空。' },
  { id: 'maia', name: '迈亚', latin: 'MAIA', epithet: '山林宁芙', generation: '宁芙与凡女', x: 512, y: 618, r: 5.5,
    img: '/images/gods/maia.jpg',
    spouses: ['zeus'],
    desc: '阿特拉斯之女，七姊妹普勒阿得斯中最年长的宁芙。她与宙斯在阿卡迪亚的山洞中生下赫尔墨斯——那个出生当天就会偷牛的婴孩。' },
  { id: 'semele', name: '塞墨勒', latin: 'SEMELE', epithet: '忒拜公主', generation: '宁芙与凡女', x: 300, y: 620, r: 5.5,
    img: '/images/gods/semele.jpg',
    spouses: ['zeus'],
    desc: '忒拜公主，宙斯的爱人。受赫拉蛊惑，她执意要看神王的真身，却在雷霆与烈焰中化为灰烬。宙斯缝起未足月的狄俄尼索斯，后来又将她接上奥林匹斯。' },
  { id: 'heracles', name: '赫拉克勒斯', latin: 'HERACLES', epithet: '最伟大的英雄', generation: '英雄', x: 418, y: 460, r: 6,
    img: '/images/gods/heracles.jpg',
    parents: ['zeus'],
    desc: '宙斯与凡女阿尔克墨涅之子，希腊最伟大的英雄。他完成十二项不可能的任务赎清罪孽，死后挣脱凡躯升入奥林匹斯，成为永生之神。' },
];

// ============================================================
// 神话故事集 —— 每个故事都锚定在两位神祇之间，化作连线上的印记
// ============================================================

interface MythStory {
  id: string;
  title: string;
  subtitle: string;
  era: string;
  gods: string[];
  pair: [string, string];
  themes: string[];
  paragraphs: string[];
}

const STORIES: MythStory[] = [
  {
    id: 'titanomachy', title: '泰坦之战', subtitle: '旧神退场，新神登基', era: '创世纪元',
    gods: ['zeus', 'cronus', 'rhea', 'poseidon', 'hades', 'hera', 'demeter', 'hestia'],
    pair: ['zeus', 'cronus'],
    themes: '勇气 · 新生'.split(' · '),
    paragraphs: [
      '宙斯长大后，逼迫父亲克洛诺斯吐出了被吞下的五位兄姐。六神聚首，向统治宇宙的泰坦神族宣战。这场战争持续了整整十年，天地为之震颤，海洋为之沸腾——史称泰坦之战。',
      '战局的转折来自两位古老的盟友：盖亚指点宙斯释放了被囚禁的独眼巨人与百臂巨人。独眼巨人为宙斯锻造了雷霆，为波塞冬打造了三叉戟，为哈迪斯造了隐身头盔；百臂巨人则以一百只手同时投掷山岳般的巨石。',
      '泰坦最终战败，被打入深渊塔尔塔罗斯，由百臂巨人世代看守；大力神阿特拉斯被罚以双肩擎起苍天。旧神的纪元落幕，奥林匹斯的时代自此开启。',
    ],
  },
  {
    id: 'three-realms', title: '三分天下', subtitle: '天空、海洋与冥界的归属', era: '奥林匹斯纪元',
    gods: ['zeus', 'poseidon', 'hades'],
    pair: ['zeus', 'poseidon'],
    themes: '秩序 · 制衡'.split(' · '),
    paragraphs: [
      '泰坦之战结束后，宙斯三兄弟抓阄划分宇宙的统治权：宙斯抽中天空，成为众神与凡人的王；波塞冬抽中海洋，统御万顷波涛；哈迪斯抽中冥界，从此沉默地守望亡者的国度。',
      '大地与奥林匹斯山则为三兄弟共有。这次分封奠定了希腊神话的宇宙秩序——雷在天上，浪在海中，而每一个凡人最终都将走向哈迪斯的领地。三兄弟的力量彼此制衡，连宙斯也不敢轻易得罪另两位。',
    ],
  },
  {
    id: 'athena-birth', title: '雅典娜的诞生', subtitle: '从头颅中跃出的全副武装的女神', era: '奥林匹斯纪元',
    gods: ['zeus', 'athena'],
    pair: ['zeus', 'athena'],
    themes: '智慧 · 挣脱'.split(' · '),
    paragraphs: [
      '宙斯爱上了智慧女神墨提斯，却听到预言：墨提斯将生下一个比父亲更强大的孩子。重蹈祖父覆辙的恐惧让宙斯一口吞下了已有身孕的墨提斯。',
      '不久后，宙斯头痛欲裂，赫菲斯托斯（一说普罗米修斯）用斧子劈开他的头颅——一位身披铠甲、手持长矛的女神呐喊着跃出，她就是雅典娜。因生于父亲的头颅，她继承了墨提斯的智慧与宙斯的威仪，成为奥林匹斯最受敬畏的女神之一。',
    ],
  },
  {
    id: 'athens-contest', title: '雅典城之争', subtitle: '橄榄树胜过咸泉水', era: '英雄纪元',
    gods: ['athena', 'poseidon'],
    pair: ['athena', 'poseidon'],
    themes: '和平 · 抉择'.split(' · '),
    paragraphs: [
      '雅典卫城初建之时，雅典娜与波塞冬争夺这座城市的守护权。双方约定：谁送给市民的礼物更有用，城市就归谁。波塞冬以三叉戟击石，涌出一眼咸泉（一说战马），象征海上的霸权；雅典娜则让一株橄榄树破土而出，带来果实、油脂与木材，象征和平与富足。',
      '市民选择了橄榄树，城市从此名为雅典。落败的波塞冬怒而掀起洪水，却终究承认了这一裁决——至今雅典卫城上仍供奉着那株传说中的橄榄树。',
    ],
  },
  {
    id: 'delos-twins', title: '得洛斯岛的孪生神', subtitle: '漂泊之岛上的光明降生', era: '奥林匹斯纪元',
    gods: ['leto', 'apollo', 'artemis', 'hera'],
    pair: ['leto', 'apollo'],
    themes: '母爱 · 庇护'.split(' · '),
    paragraphs: [
      '勒托怀上宙斯的孩子后，赫拉的嫉妒令全大地都不敢收留她——天后下令，凡阳光所照之地皆不得为勒托提供分娩之所。勒托流浪九天九夜，直到漂流的得洛斯岛向她敞开怀抱。',
      '在棕榈树下，勒托先诞下阿尔忒弥斯；刚出生的狩猎女神随即为母亲接生，迎来了弟弟阿波罗。得洛斯岛自此生根，成为爱琴海上的圣地，而这对孪生神兄妹一个执掌光明与音乐，一个执掌月亮与狩猎。',
    ],
  },
  {
    id: 'cattle-theft', title: '赫尔墨斯偷牛', subtitle: '出生第一天的天才罪犯', era: '奥林匹斯纪元',
    gods: ['hermes', 'apollo', 'maia'],
    pair: ['hermes', 'apollo'],
    themes: '机敏 · 和解'.split(' · '),
    paragraphs: [
      '赫尔墨斯出生在阿卡迪亚的山洞里。出生当天黄昏，这个婴孩就溜出摇篮，偷走了哥哥阿波罗的五十头神牛——他还让牛倒着走、自己脚穿反编的草鞋，把脚印弄得面目全非。途中他顺手发明了里拉琴：用龟壳和琴弦做出了第一件乐器。',
      '阿波罗循着线索找上门来，小赫尔墨斯却躺回摇篮装睡。官司打到宙斯面前，神王大笑，命赫尔墨斯归还牛群。赫尔墨斯弹奏起新发明的里拉琴，阿波罗听得入迷，当场用神牛换下了这把琴——一场盗窃案，以音乐成交，两兄弟从此结为挚友。',
    ],
  },
  {
    id: 'twice-born', title: '酒神的两次诞生', subtitle: '从灰烬与神王大腿中重生的神', era: '奥林匹斯纪元',
    gods: ['zeus', 'semele', 'dionysus', 'hera'],
    pair: ['zeus', 'semele'],
    themes: '重生 · 狂喜'.split(' · '),
    paragraphs: [
      '忒拜公主塞墨勒是宙斯的爱人。赫拉化身老妪蛊惑她："让他以见天后的真容来见你，才证明他是神王。"塞墨勒执意要求，宙斯曾向斯提克斯河起誓有求必应，只得显现雷霆真身——凡人之躯顷刻化为灰烬。',
      '宙斯抢出腹中未足月的胎儿，缝进自己的大腿，足月后第二次诞下——他就是狄俄尼索斯，唯一一位母亲为凡人的奥林匹斯主神。成年后的酒神把母亲的灵魂从冥界接上奥林匹斯，让她成为永生女神。死亡未能终结的爱，也酿进了每一滴葡萄酒里。',
    ],
  },
  {
    id: 'abduction', title: '珀耳塞福涅之劫', subtitle: '大地裂开的那个午后', era: '奥林匹斯纪元',
    gods: ['hades', 'persephone', 'demeter', 'zeus'],
    pair: ['hades', 'persephone'],
    themes: '占有 · 妥协'.split(' · '),
    paragraphs: [
      '春之女神珀耳塞福涅在西西里的草地上采花，大地突然裂开——冥王哈迪斯驾着黑色战车冲出，将她掳入冥界为后。这一切得到了宙斯的默许，唯独瞒着她的母亲得墨忒耳。',
      '哈迪斯并非暴虐的劫掠者：在冥界，他为珀耳塞福涅加冕为冥后，与她共治亡者的国度。临别前，他让她吃下六粒石榴籽——冥界的法则规定，食过冥界之物者不得长留人间，这为四季的轮回埋下了伏笔。',
    ],
  },
  {
    id: 'seasons', title: '四季的由来', subtitle: '一位母亲的哀恸与重逢', era: '奥林匹斯纪元',
    gods: ['demeter', 'persephone', 'hades'],
    pair: ['demeter', 'persephone'],
    themes: '母爱 · 轮回'.split(' · '),
    paragraphs: [
      '女儿失踪后，得墨忒耳手持火把寻遍大地，九天九夜不进饮食。当她得知真相，悲愤地离开奥林匹斯，任由大地荒芜、颗粒无收——饥荒威胁着人类，也惊动了宙斯。',
      '宙斯命赫尔墨斯入冥界交涉，最终达成和解：因吃下六粒石榴籽，珀耳塞福涅每年六个月居于冥界为后，六个月重返人间。女儿归来时，母亲令万物生长，是为春夏；女儿离去时，大地萧瑟，是为秋冬。希腊人用一个母亲的思念，解释了四季的轮回。',
    ],
  },
  {
    id: 'pandora', title: '潘多拉的魔盒', subtitle: '众神赠礼与最后的希望', era: '英雄纪元',
    gods: ['hephaestus', 'zeus', 'hera', 'athena', 'poseidon'],
    pair: ['zeus', 'hephaestus'],
    themes: '好奇 · 希望'.split(' · '),
    paragraphs: [
      '普罗米修斯为人类盗来天火后，震怒的宙斯决定降下惩罚。他命赫菲斯托斯用泥土塑造出第一个女人——潘多拉，意为"被赠予一切者"：雅典娜赠她巧艺，阿佛洛狄忒赠她魅力，赫尔墨斯赠她辩才，每位神祇都留下了自己的"礼物"。',
      '宙斯将潘多拉送往人间，附赠一只严令禁止开启的陶罐。好奇心终究占了上风——罐盖开启，疾病、衰老、悲伤与灾祸倾巢而出，飞散人间。潘多拉慌忙合盖，罐底只剩下一样东西：希望。从此人间多舛，但希望从未离开。',
    ],
  },
  {
    id: 'golden-apple', title: '帕里斯的审判', subtitle: '一颗金苹果埋下的战争引线', era: '英雄纪元',
    gods: ['aphrodite', 'athena', 'hera', 'zeus', 'ares'],
    pair: ['athena', 'aphrodite'],
    themes: '虚荣 · 纷争'.split(' · '),
    paragraphs: [
      '海洋女神忒提斯的婚宴上，未被邀请的不和女神厄里斯掷下一颗金苹果，上书"献给最美者"。赫拉、雅典娜、阿佛洛狄忒争执不下，宙斯谁也不敢得罪，把裁决推给了凡间牧羊人——特洛伊王子帕里斯。',
      '三位女神各自开价：赫拉许以权势，雅典娜许以战功与智慧，阿佛洛狄忒许以世上最美女子的爱情。帕里斯把金苹果判给了爱与美之神——而那位"最美的女子"，是斯巴达王后海伦。一颗苹果，就此点燃了特洛伊十年的烽火。',
    ],
  },
  {
    id: 'trojan-war', title: '特洛伊战争', subtitle: '诸神亲自下场的十年鏖战', era: '英雄纪元',
    gods: ['aphrodite', 'ares', 'athena', 'apollo', 'artemis', 'hera', 'zeus', 'poseidon'],
    pair: ['aphrodite', 'ares'],
    themes: '荣耀 · 愤怒'.split(' · '),
    paragraphs: [
      '海伦被帕里斯带往特洛伊，希腊联军扬帆远征，围城十年。这场战争最独特之处在于：奥林匹斯诸神亲自选边下场——赫拉与雅典娜支持希腊人，阿佛洛狄忒与阿瑞斯庇护特洛伊，阿波罗以瘟疫之箭惩罚联军，宙斯则在天秤上称量英雄的命运。',
      '荷马的《伊利亚特》唱尽了这十年：阿喀琉斯的愤怒、赫克托耳的荣光、帕特罗克洛斯之死。最终，希腊人以木马计破城——那是雅典娜的谋略，也是凡人对神意的最后一次借用。特洛伊化为灰烬，而诸神的赌局从未真正结束。',
    ],
  },
  {
    id: 'odyssey', title: '奥德赛', subtitle: '十年漂泊，只为回家', era: '英雄纪元',
    gods: ['athena', 'poseidon', 'zeus', 'hermes'],
    pair: ['athena', 'poseidon'],
    themes: '坚韧 · 归乡'.split(' · '),
    paragraphs: [
      '特洛伊城破后，智将奥德修斯启程返回伊萨卡，却因刺瞎海神之子独眼巨人波吕斐摩斯而触怒波塞冬，被诅咒漂泊十年。独眼巨人、食莲人、女巫喀耳刻、海妖塞壬、六头怪斯库拉与卡律布狄斯大漩涡……他的航程几乎集齐了希腊神话的全部险境。',
      '一路守护他的，是雅典娜——她化身凡人 Mentor 指引奥德修斯之子寻父，又在关键时刻为归乡者遮风挡雨。最终奥德修斯孤身回到伊萨卡，乔装乞丐，弯弓射穿十二斧孔，诛尽纠缠妻子珀涅罗珀的求婚者。诸神的恩怨落笔处，是一个凡人"回家"二字的重量。',
    ],
  },
  {
    id: 'labors', title: '十二伟业', subtitle: '从罪孽到永生的英雄之路', era: '英雄纪元',
    gods: ['heracles', 'zeus', 'hera', 'athena', 'hades'],
    pair: ['zeus', 'heracles'],
    themes: '赎罪 · 意志'.split(' · '),
    paragraphs: [
      '赫拉克勒斯是宙斯与凡女阿尔克墨涅之子，自襁褓起就遭赫拉迫害。天后令他陷入狂怒、铸下大错，德尔斐神谕判他为迈锡尼国王服役，完成十二项不可能的任务以赎其罪。',
      '涅墨亚的狮子、九头蛇许德拉、金角鹿、厄律曼托斯野猪、奥吉亚斯牛圈、食人鸟、克里特公牛、狄俄墨得斯烈马、亚马逊女王腰带、革律翁牛群、赫斯珀里得斯金苹果，最后一项——直入冥界，赤手擒回三头犬刻耳柏洛斯，连哈迪斯也为之侧目。十二伟业完成后，他挣脱凡躯升入奥林匹斯，赫拉终于与他冰释，将女儿青春女神许配给他。',
    ],
  },
  {
    id: 'golden-net', title: '赫菲斯托斯的金网', subtitle: '奥林匹斯最著名的捉奸现场', era: '奥林匹斯纪元',
    gods: ['hephaestus', 'aphrodite', 'ares'],
    pair: ['hephaestus', 'aphrodite'],
    themes: '自尊 · 背叛'.split(' · '),
    paragraphs: [
      '宙斯把最美的女神阿佛洛狄忒嫁给了跛足的火神赫菲斯托斯，爱神却与战神阿瑞斯暗中相恋。太阳神赫利俄斯窥见私情，告到了工匠之神那里。',
      '赫菲斯托斯不动声色，锻造出一张肉眼难辨的金丝细网罩在床榻上。当两人再度幽会，金网骤然收紧，将他们困在网中。火神召来众神围观，奥林匹斯哄堂大笑——波塞冬出面担保，才解开了这张网。这是神话里少有的喜剧，也是工匠之神用巧手赢回尊严的方式。',
    ],
  },
  {
    id: 'orpheus', title: '俄耳甫斯与欧律狄刻', subtitle: '一次回头，万劫不复', era: '英雄纪元',
    gods: ['apollo', 'hades', 'persephone', 'dionysus'],
    pair: ['apollo', 'hades'],
    themes: '爱 · 失去'.split(' · '),
    paragraphs: [
      '俄耳甫斯是阿波罗与缪斯之子，他的琴声能令顽石点头、猛兽俯首。新婚之日，妻子欧律狄刻被毒蛇夺去生命。俄耳甫斯抱着里拉琴独闯冥界，琴声令复仇女神垂泪、令三头犬伏地，铁石心肠的哈迪斯与珀耳塞福涅破例应允：带她走吧，但回到人间之前，绝不可回头。',
      '漫长的归途上，身后的脚步若有似无。在即将踏出冥界的最后一刻，俄耳甫斯忍不住回头——妻子的身影瞬间坠回黑暗，永不再来。后来他因拒绝酒神的狂女而被撕碎，头颅仍在河水中歌唱。希腊人用最痛的方式说：有些规则，连爱情也不能回头试探。',
    ],
  },
  {
    id: 'prometheus', title: '普罗米修斯盗火', subtitle: '为人类背叛诸神的泰坦', era: '创世纪元',
    gods: ['zeus', 'cronus'],
    pair: ['zeus', 'cronus'],
    themes: '牺牲 · 反抗'.split(' · '),
    paragraphs: [
      '泰坦之战后，先知先觉的泰坦普罗米修斯用泥土造人，并深深爱着这个脆弱的造物。当宙斯决定不给人类火种——没有火，人类只能在黑暗与寒冷中茹毛饮血——普罗米修斯用一根茴香秆，从太阳神的车轮上窃来天火，藏在秆芯里带给了人间。',
      '震怒的宙斯将他锁在高加索山的悬崖上，派恶鹰每天啄食他的肝脏，而肝脏每夜重新长出——刑罚周而复始，长达三万年。他始终不肯说出那个"宙斯将被自己孩子推翻"的预言。',
      '最终，路过的英雄赫拉克勒斯射落恶鹰、砸碎锁链，宙斯也默许了这场释放。盗火者成为人类文明最古老的象征：为了光明，总有人愿意替众生承受雷霆。',
    ],
  },
  {
    id: 'golden-fleece', title: '伊阿宋与金羊毛', subtitle: '阿尔戈号的远征', era: '英雄纪元',
    gods: ['hera', 'athena', 'aphrodite'],
    pair: ['hera', 'athena'],
    themes: '冒险 · 背弃'.split(' · '),
    paragraphs: [
      '为夺回被叔叔篡走的王位，伊阿宋奉命前往遥远的科尔喀斯，取回挂在毒龙守护的圣树上的金羊毛。他召集了全希腊的英雄——赫拉克勒斯、俄耳甫斯皆在其列——乘上雅典娜亲自督造的神船阿尔戈号，横渡未知的黑海。',
      '赫拉一路庇护着这次远征，她说动阿佛洛狄忒，让科尔喀斯公主美狄亚爱上伊阿宋。公主以巫术帮他制服喷火的神牛、种下龙牙武士、催眠不眠的毒龙，金羊毛终于到手。',
      '然而英雄史诗在这里拐向了悲剧：归途中伊阿宋背弃誓言另娶他人，美狄亚的复仇成为欧里庇得斯笔下最惊心动魄的悲剧。金羊毛的光芒，终究没能照亮英雄的承诺。',
    ],
  },
  {
    id: 'medusa', title: '珀尔修斯与美杜莎', subtitle: '一面盾牌里的致命凝视', era: '英雄纪元',
    gods: ['athena', 'hermes', 'zeus', 'poseidon'],
    pair: ['athena', 'hermes'],
    themes: '智取 · 守护'.split(' · '),
    paragraphs: [
      '珀尔修斯是宙斯化作金雨与凡女达那厄所生的儿子。为解救被国王逼迫的母亲，他许下诺言：带回蛇发女妖美杜莎的头颅——任何直视她眼睛的人都会化为石头。',
      '雅典娜赠他磨得如镜的青铜盾，赫尔墨斯赠他斩妖的弯刀，再加上隐身头盔、飞翼凉鞋与魔袋，珀尔修斯成为神话里装备最豪华的英雄。他只用盾面的倒影锁定目标，一刀斩下美杜莎的头颅——从她的血泊中跃出飞马珀伽索斯。',
      '归途中，他用美杜莎的头颅石化了海怪，救下被献祭的公主安德洛墨达并娶她为妻。雅典娜将这颗头颅镶在自己的神盾上，又把珀尔修斯升上夜空——英仙座至今仍高举着那颗头颅。',
    ],
  },
  {
    id: 'theseus', title: '忒修斯与弥诺陶洛斯', subtitle: '一团线，走出不可能的迷宫', era: '英雄纪元',
    gods: ['poseidon', 'zeus'],
    pair: ['poseidon', 'zeus'],
    themes: '智谋 · 遗忘'.split(' · '),
    paragraphs: [
      '克里特岛的迷宫深处住着牛头人身的怪物弥诺陶洛斯，雅典每隔九年就要进贡七对少男少女供它吞食。雅典王子忒修斯自愿加入贡品队伍，决意终结这场耻辱。',
      '克里特公主阿里阿德涅对他一见钟情，送给他一把利剑和一团线球——进迷宫时把线头系在门上，边走边放线。忒修斯在迷宫深处杀死怪物，又循着线团原路走出。一团线，成为人类智慧战胜蛮荒的隐喻。',
      '然而故事的尾声并不圆满：归航时忒修斯忘记换上约定的白帆，父亲埃勾斯望见黑帆，以为儿子已死，投海而亡——那片海从此叫爱琴海。',
    ],
  },
  {
    id: 'icarus', title: '伊卡洛斯的坠落', subtitle: '离太阳最近的一秒钟', era: '英雄纪元',
    gods: ['apollo'],
    pair: ['apollo', 'artemis'],
    themes: '傲慢 · 自由'.split(' · '),
    paragraphs: [
      '工匠代达罗斯与儿子伊卡洛斯被囚禁在克里特的高塔上。代达罗斯用羽毛和蜂蜡造出两对翅膀，临行前反复叮嘱：飞得太低，海水会打湿羽毛；飞得太高，太阳会融化蜂蜡。',
      '起飞的瞬间，少年被天空的自由俘获了。他越飞越高，全然忘记了父亲的警告——直到阳光熔化了蜡，羽毛四散，伊卡洛斯坠入爱琴海。代达罗斯在远处目睹了这一切，却无能为力。',
      '这片海域从此名为伊卡利亚海。而太阳神阿波罗日日驾着金车掠过那片天空，见证着每一代年轻人的野心与代价——德尔斐神庙的那句箴言再次应验：凡事勿过度。',
    ],
  },
  {
    id: 'echo-narcissus', title: '回声与水仙', subtitle: '爱上倒影的少年', era: '英雄纪元',
    gods: ['aphrodite', 'artemis', 'hera'],
    pair: ['aphrodite', 'artemis'],
    themes: '孤独 · 自恋'.split(' · '),
    paragraphs: [
      '山林宁芙厄科（回声）因替宙斯的情人打掩护，被赫拉夺去了说话的能力——从此她只能重复别人话语的最后几个字。她爱上了美少年纳西索斯，却无法先开口表白，只能在林中一遍遍重复他的话语，最终憔悴到只剩下声音。',
      '纳西索斯拒绝了所有爱慕者。被拒绝的宁芙们向复仇女神祈祷，阿佛洛狄忒应允了这个诅咒：让他爱上一个永远无法得到的人。少年在泉边俯身饮水时，看见了自己的倒影——他爱上了它，日夜守候，最终憔悴而死，化作一株水边的水仙花。',
      '直到今天，山谷里的回声仍是厄科的声音，水边的水仙仍低垂着头——一个只能重复别人的话，一个永远看着自己的影子。这是希腊神话里最凄美的一则寓言：无法爱人者，与只能爱己者。',
    ],
  },
];

// ============================================================
// 图谱几何
// ============================================================

const NODE_MAP = new Map(GODS.map((g) => [g.id, g]));

const BLOOD = 'rgba(150, 132, 235, 0.22)';
const BLOOD_HI = 'rgba(200, 186, 255, 0.95)';
const UNION = 'rgba(212, 140, 190, 0.32)';
const UNION_HI = 'rgba(255, 176, 216, 0.95)';
const FATE = 'rgba(110, 160, 255, 0.14)';
const FATE_HI = 'rgba(140, 200, 255, 0.7)';
const STORY_DOT = 'rgba(150, 222, 255, 0.95)';
const STORY_DOT_DIM = 'rgba(120, 170, 220, 0.35)';

interface Edge { from: string; to: string; type: 'blood' | 'union'; key: string }

function buildEdges(): Edge[] {
  const edges: Edge[] = [];
  for (const g of GODS) {
    for (const p of g.parents ?? []) {
      edges.push({ from: p, to: g.id, type: 'blood', key: `${p}->${g.id}` });
    }
    for (const s of g.spouses ?? []) {
      if (g.id < s) edges.push({ from: g.id, to: s, type: 'union', key: `${g.id}~${s}` });
    }
  }
  return edges;
}

const EDGES = buildEdges();

const pairKey = (a: string, b: string) => (a < b ? `${a}~${b}` : `${b}~${a}`);
const EDGE_PAIRS = new Set(EDGES.map((e) => pairKey(e.from, e.to)));

// 背景星尘（确定性伪随机，保证构建稳定）
function makeStars(count: number, seed = 42) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return Array.from({ length: count }, (_, i) => ({
    x: rand() * 1000, y: rand() * 680, r: rand() * 1.1 + 0.3,
    delay: (i % 17) * 0.35, dur: 2.4 + rand() * 2.8,
  }));
}

// 弧线控制点：中点向法线方向偏移，避免穿过别的节点
function arcControl(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bend = Math.min(64, len * 0.22);
  return { x: mx + nx * bend, y: my + ny * bend - 14 };
}

function bezierPoint(t: number, a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

// 每个故事的几何位置：同一 pair 上的多个故事沿线均匀错开
interface StoryPlacement {
  story: MythStory;
  hasEdge: boolean;
  arc?: { c: { x: number; y: number }; d: string };
  pos: { x: number; y: number };
}

function buildPlacements(): StoryPlacement[] {
  const byPair = new Map<string, MythStory[]>();
  for (const s of STORIES) {
    const k = pairKey(s.pair[0], s.pair[1]);
    byPair.set(k, [...(byPair.get(k) ?? []), s]);
  }
  const placements: StoryPlacement[] = [];
  for (const [, stories] of byPair) {
    stories.forEach((story, i) => {
      const a = NODE_MAP.get(story.pair[0])!;
      const b = NODE_MAP.get(story.pair[1])!;
      const hasEdge = EDGE_PAIRS.has(pairKey(story.pair[0], story.pair[1]));
      const t = stories.length === 1 ? 0.5 : 0.36 + (i * (0.28 / (stories.length - 1)));
      if (hasEdge) {
        placements.push({
          story, hasEdge,
          pos: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
        });
      } else {
        const c = arcControl(a, b);
        const d = `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
        placements.push({ story, hasEdge, arc: { c, d }, pos: bezierPoint(t, a, c, b) });
      }
    });
  }
  return placements;
}

const STORY_PLACEMENTS = buildPlacements();

// 供搜索层使用的目录
export const SEARCH_INDEX = [
  ...GODS.map((g) => ({
    id: g.id, kind: 'god' as const, title: g.name, latin: g.latin, tag: g.epithet,
  })),
  ...STORIES.map((s) => ({
    id: s.id, kind: 'story' as const, title: s.title, latin: s.subtitle, tag: `${s.era} · ${s.themes.join(' ')}`,
  })),
];
const STORY_MAP = new Map(STORIES.map((s) => [s.id, s]));

export default function PantheonGraph() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loadedImgs, setLoadedImgs] = useState<Set<string>>(new Set());
  useMemo(() => {
    GODS.forEach((g) => {
      const im = new Image();
      im.onload = () => setLoadedImgs((prev) => {
        if (prev.has(g.id)) return prev;
        const next = new Set(prev);
        next.add(g.id);
        return next;
      });
      im.src = g.img;
    });
  }, []);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [hoveredStoryId, setHoveredStoryId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // ── 拖拽与缩放 ──
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const wasDraggingRef = useRef(false);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const viewBox = useMemo(() => {
    const w = 1000 / zoom;
    const h = 680 / zoom;
    return `${-panX} ${-panY} ${w} ${h}`;
  }, [panX, panY, zoom]);

  const onDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX, y: clientY, panX, panY };
  }, [panX, panY]);

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragStart.current || !svgContainerRef.current) return;
    const svg = svgContainerRef.current.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const vbW = 1000 / zoom;
    const vbH = 680 / zoom;
    const scaleX = vbW / rect.width;
    const scaleY = vbH / rect.height;
    const dx = (clientX - dragStart.current.x) * scaleX;
    const dy = (clientY - dragStart.current.y) * scaleY;
    setPanX(dragStart.current.panX - dx);
    setPanY(dragStart.current.panY - dy);
  }, [zoom]);

  const onDragEnd = useCallback(() => {
    if (isDragging) wasDraggingRef.current = true;
    setIsDragging(false);
    dragStart.current = null;
  }, [isDragging]);

  // 鼠标拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 只对中键或按住空格时左键拖拽生效，或者直接用左键拖拽
    if (e.button === 0 || e.button === 1) {
      e.preventDefault();
      onDragStart(e.clientX, e.clientY);
    }
  }, [onDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    onDragMove(e.clientX, e.clientY);
  }, [onDragMove]);

  const handleMouseUp = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  // 触摸拖拽（移动端）
  const touchIdRef = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchIdRef.current = t.identifier;
      onDragStart(t.clientX, t.clientY);
    }
  }, [onDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchIdRef.current) return;
    const t = Array.from(e.changedTouches).find(tt => tt.identifier === touchIdRef.current);
    if (t) onDragMove(t.clientX, t.clientY);
  }, [onDragMove]);

  const handleTouchEnd = useCallback(() => {
    touchIdRef.current = null;
    onDragEnd();
  }, [onDragEnd]);

  // 缩放 & 触控板平移（wheel 事件）
  // Mac 触控板：两指拖动 → wheel 无 ctrlKey → 平移；捏合缩放 → wheel 有 ctrlKey → 缩放
  // 鼠标：滚轮 → 缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    if (!svgContainerRef.current) return;
    const svg = svgContainerRef.current.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const vbW = 1000 / zoom;
    const vbH = 680 / zoom;
    const scaleX = vbW / rect.width;
    const scaleY = vbH / rect.height;

    if (e.ctrlKey || e.metaKey) {
      // 触控板捏合缩放（Mac）或 Ctrl+滚轮缩放
      const factor = 1 - e.deltaY * 0.005; // deltaY 在捏合时是浮点数，幅度较小
      const newZoom = Math.min(3, Math.max(0.5, zoom * factor));
      const mouseX = (e.clientX - rect.left) * scaleX + (-panX);
      const mouseY = (e.clientY - rect.top) * scaleY + (-panY);
      const ratio = newZoom / zoom;
      setPanX(panX + mouseX * (1 - ratio));
      setPanY(panY + mouseY * (1 - ratio));
      setZoom(newZoom);
    } else {
      // 触控板两指拖动平移，或鼠标滚轮平移
      setPanX(panX + e.deltaX * scaleX);
      setPanY(panY + e.deltaY * scaleY);
    }
  }, [zoom, panX, panY]);

  // 监听其他板块（如十二主神卡片）的联动选神事件
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id && NODE_MAP.has(id)) {
        setSelected(id);
        setHovered(null);
      }
    };
    window.addEventListener(SELECT_GOD_EVENT, handler);
    return () => window.removeEventListener(SELECT_GOD_EVENT, handler);
  }, []);

  // 监听搜索层的故事直达事件
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id && STORY_MAP.has(id)) {
        setActiveStoryId(id);
      }
    };
    window.addEventListener(SELECT_STORY_EVENT, handler);
    return () => window.removeEventListener(SELECT_STORY_EVENT, handler);
  }, []);

  const stars = useMemo(() => makeStars(90), []);
  const active = hovered ?? selected;

  const neighbors = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active]);
    for (const e of EDGES) {
      if (e.from === active) set.add(e.to);
      if (e.to === active) set.add(e.from);
    }
    // 同故事出场的神也应点亮（命运之线连接的神可能没有直接 edge）
    for (const s of STORIES) {
      if (s.gods.includes(active)) {
        for (const g of s.gods) set.add(g);
      }
    }
    return set;
  }, [active]);

  const activeGod = active ? NODE_MAP.get(active) ?? null : null;
  const activeStory = activeStoryId ? STORY_MAP.get(activeStoryId) ?? null : null;
  const childrenOf = (id: string) => GODS.filter((g) => g.parents?.includes(id));
  const siblingsOf = (id: string) => {
    const me = NODE_MAP.get(id);
    if (!me?.parents?.length) return [];
    return GODS.filter((g) => g.id !== id && g.parents?.some((p) => me.parents!.includes(p)));
  };
  const storiesOf = (id: string) => STORIES.filter((s) => s.gods.includes(id));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll('[data-reveal]');
    gsap.set(targets, { opacity: 0, y: 40 });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(targets, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' });
          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
    }
  }, [activeGod?.id]);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    }
  }, [activeStoryId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveStoryId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const nodeOpacity = (id: string) => (!active || neighbors.has(id) ? 1 : 0.18);
  const storyDotLit = (s: MythStory) => {
    if (hoveredStoryId === s.id || activeStoryId === s.id) return 'full';
    if (active) return s.gods.includes(active) ? 'lit' : 'dim';
    return 'lit';
  };

  const openStory = (id: string) => {
    setActiveStoryId(id);
    setHoveredStoryId(null);
  };

  return (
    <section
      id="pantheon"
      ref={sectionRef}
      style={{ padding: '150px 5vw', background: 'transparent', position: 'relative', zIndex: 2 }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div
          data-reveal
          className="mb-6"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 300, letterSpacing: '3px', textTransform: 'uppercase', color: '#c8c8e0', opacity: 0.6 }}
        >
          诸神星图 · THE FAMILY CONSTELLATION
        </div>
        <div data-reveal className="mb-10" style={{ width: '100%', height: 1, background: 'rgba(160, 150, 230, 0.14)' }} />

        <div data-reveal className="flex flex-col lg:flex-row" style={{ gap: 40, marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: 'clamp(32px, 4vw, 60px)',
              lineHeight: 1.15, letterSpacing: '-1px', color: '#ffffff', margin: 0, flex: '0 0 46%', textWrap: 'balance',
            }}
          >
            一张被点亮的神谱， 一段血脉交织的宇宙
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: 16, lineHeight: 1.85,
              color: '#c8c8e0', margin: 0, flex: '1 1 50%', textWrap: 'pretty',
            }}
          >
            希腊神话不是孤立的传说，而是一张横跨三代的家族巨网。紫罗兰色的连线是血脉的传承，蔷薇色的虚线是爱与盟约，
            淡蓝色的命运之线牵起那些没有血缘却彼此纠缠的神祇。每一段羁绊上的
            <span style={{ color: 'rgba(150, 222, 255, 1)' }}>发光圆点</span>
            ，都是一则等待被讲述的故事——
            <span style={{ color: 'rgba(200, 186, 255, 1)' }}>点击星辰或圆点</span>
            ，展开神话的全貌。
          </p>
        </div>

        <div
          data-reveal
          ref={svgContainerRef}
          style={{
            position: 'relative', border: '1px solid rgba(150, 140, 230, 0.14)', borderRadius: 12,
            background: 'radial-gradient(ellipse at 50% 30%, rgba(30, 24, 62, 0.5), rgba(6, 6, 18, 0.92) 70%)',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          {/* 操作提示 */}
          <div
            style={{
              position: 'absolute', top: 12, right: 16, zIndex: 3,
              fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(200,190,255,0.7)',
              display: 'flex', alignItems: 'center', gap: 6,
              pointerEvents: 'none',
            }}
          >
            {isMobile ? '⟵ 拖动探索 ⟶' : '拖动/触控板平移 · 滚轮/捏合缩放'}
          </div>
          <svg
            viewBox={viewBox}
            style={{
              display: 'block', height: 'auto',
              width: '100%',
              minWidth: undefined,
              maxWidth: 'none',
              pointerEvents: isDragging ? 'none' : 'auto',
            }}
            role="img"
            aria-label="希腊诸神关系星图"
          >
            <defs>
              <radialGradient id="godGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(210, 200, 255, 0.85)" />
                <stop offset="45%" stopColor="rgba(160, 140, 240, 0.25)" />
                <stop offset="100%" stopColor="rgba(160, 140, 240, 0)" />
              </radialGradient>
              <radialGradient id="storyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(170, 228, 255, 0.9)" />
                <stop offset="50%" stopColor="rgba(110, 180, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(110, 180, 255, 0)" />
              </radialGradient>
              <filter id="softBlur" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.6" />
              </filter>
            </defs>

            {/* 背景星尘 */}
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="rgba(220,225,255,0.5)">
                <animate attributeName="opacity" values="0.1;0.65;0.1" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}

            {/* 命运之线（故事弧线，位于血脉连线之下） */}
            {STORY_PLACEMENTS.filter((p) => !p.hasEdge).map((p) => {
              const k = pairKey(p.story.pair[0], p.story.pair[1]);
              const isHi = !!active && p.story.gods.includes(active);
              return (
                <path
                  key={`arc-${k}`}
                  d={p.arc!.d}
                  fill="none"
                  stroke={isHi ? FATE_HI : FATE}
                  strokeWidth={isHi ? 1.1 : 0.7}
                  strokeDasharray="2 7"
                  opacity={active && !isHi ? 0.35 : 1}
                  style={{ transition: 'opacity 0.35s ease, stroke 0.35s ease' }}
                />
              );
            })}

            {/* 血脉与盟约连线 */}
            {EDGES.map((e) => {
              const a = NODE_MAP.get(e.from)!;
              const b = NODE_MAP.get(e.to)!;
              const isHi = !!active && (e.from === active || e.to === active);
              const dim = !!active && !isHi;
              return (
                <line
                  key={e.key}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={e.type === 'blood' ? (isHi ? BLOOD_HI : BLOOD) : (isHi ? UNION_HI : UNION)}
                  strokeWidth={isHi ? 1.6 : 0.8}
                  strokeDasharray={e.type === 'union' ? '5 6' : undefined}
                  opacity={dim ? 0.06 : 1}
                  style={{ transition: 'opacity 0.35s ease, stroke 0.35s ease' }}
                />
              );
            })}

            {/* 故事印记圆点 */}
            {STORY_PLACEMENTS.map((p) => {
              const state = storyDotLit(p.story);
              const isFocus = state === 'full';
              return (
                <g
                  key={p.story.id}
                  transform={`translate(${p.pos.x}, ${p.pos.y})`}
                  opacity={state === 'dim' ? 0.15 : 1}
                  style={{ cursor: 'pointer', transition: 'opacity 0.35s ease' }}
                  onClick={(e) => {
                    if (wasDraggingRef.current) { wasDraggingRef.current = false; e.stopPropagation(); return; }
                    e.stopPropagation(); openStory(p.story.id);
                  }}
                  onMouseEnter={() => setHoveredStoryId(p.story.id)}
                  onMouseLeave={() => setHoveredStoryId(null)}
                >
                  <circle r={isFocus ? 13 : 10} fill="url(#storyGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  <circle r={isFocus ? 3.6 : 2.8} fill={state === 'lit' || isFocus ? STORY_DOT : STORY_DOT_DIM} filter="url(#softBlur)" />
                  <circle r={1.3} fill="#f0faff" />
                  {(isFocus || hoveredStoryId === p.story.id) && (
                    <text
                      y={-16} textAnchor="middle"
                      style={{
                        fontFamily: "'EB Garamond', serif", fontSize: 12.5,
                        fill: 'rgba(200, 235, 255, 0.98)', pointerEvents: 'none',
                        paintOrder: 'stroke', stroke: 'rgba(5,5,16,0.9)', strokeWidth: 3,
                      }}
                    >
                      {p.story.title}
                    </text>
                  )}
                </g>
              );
            })}

            {/* 神祇节点 */}
            {GODS.map((g) => {
              const isActive = active === g.id;
              const isNeighbor = !!active && neighbors.has(g.id) && !isActive;
              const R = g.r * 2.1; // 头像半径
              return (
                <g
                  key={g.id}
                  transform={`translate(${g.x}, ${g.y})`}
                  opacity={nodeOpacity(g.id)}
                  style={{ cursor: 'pointer', transition: 'opacity 0.35s ease' }}
                  onClick={() => {
                    if (wasDraggingRef.current) { wasDraggingRef.current = false; return; }
                    setSelected(selected === g.id ? null : g.id);
                  }}
                  onMouseEnter={() => setHovered(g.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <defs>
                    <clipPath id={`clip-${g.id}`}>
                      <circle r={R} />
                    </clipPath>
                  </defs>
                  <circle r={R * 1.9} fill="url(#godGlow)" opacity={isActive ? 1 : isNeighbor ? 0.75 : 0.45}>
                    <animate attributeName="opacity" values={`${isActive ? 0.8 : 0.4};${isActive ? 1 : 0.7};${isActive ? 0.8 : 0.4}`} dur="3.2s" repeatCount="indefinite" />
                  </circle>
                  <circle r={R} fill="rgba(12, 10, 28, 0.9)" />
                  {loadedImgs.has(g.id) && (
                    <image
                      href={g.img}
                      x={-R} y={-R}
                      width={R * 2} height={R * 2}
                      clipPath={`url(#clip-${g.id})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  )}
                  <circle
                    r={R} fill="none"
                    stroke={isActive ? 'rgba(216,204,255,0.95)' : 'rgba(168,152,238,0.5)'}
                    strokeWidth={isActive ? 1.6 : 1}
                  />
                  {(isActive || g.r >= 7) && (
                    <circle r={R + 4.5} fill="none" stroke={isActive ? 'rgba(210,198,255,0.55)' : 'rgba(190,175,255,0.22)'} strokeWidth={isActive ? 1 : 0.7} strokeDasharray="2 4" />
                  )}
                  <text
                    y={R + 19} textAnchor="middle"
                    style={{
                      fontFamily: "'EB Garamond', serif", fontSize: 15,
                      fill: isActive ? '#e6dcff' : '#d9d4ee', pointerEvents: 'none',
                      paintOrder: 'stroke', stroke: 'rgba(5,5,16,0.85)', strokeWidth: 3,
                    }}
                  >
                    {g.name}
                  </text>
                  <text
                    y={R + 33} textAnchor="middle"
                    style={{
                      fontFamily: "'Fira Code', monospace", fontSize: 8.5, letterSpacing: 1.5,
                      fill: 'rgba(165,150,230,0.75)', pointerEvents: 'none',
                      paintOrder: 'stroke', stroke: 'rgba(5,5,16,0.85)', strokeWidth: 2.5,
                    }}
                  >
                    {g.latin}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 图例 */}
          <div
            className="flex flex-wrap items-center"
            style={{
              position: 'absolute',
              left: 18, bottom: 14, gap: 22, width: 'fit-content',
              fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#c8c8e0', opacity: 0.85,
            }}
          >
            <span className="flex items-center" style={{ gap: 8 }}>
              <svg width="34" height="10"><line x1="0" y1="5" x2="34" y2="5" stroke={BLOOD_HI} strokeWidth="1.4" /></svg>
              血脉传承
            </span>
            <span className="flex items-center" style={{ gap: 8 }}>
              <svg width="34" height="10"><line x1="0" y1="5" x2="34" y2="5" stroke={UNION_HI} strokeWidth="1.4" strokeDasharray="5 5" /></svg>
              爱与盟约
            </span>
            <span className="flex items-center" style={{ gap: 8 }}>
              <svg width="34" height="10"><line x1="0" y1="5" x2="34" y2="5" stroke={FATE_HI} strokeWidth="1" strokeDasharray="2 4" /></svg>
              命运之线
            </span>
            <span className="flex items-center" style={{ gap: 8 }}>
              <svg width="12" height="12"><circle cx="6" cy="6" r="3" fill={STORY_DOT} /></svg>
              故事印记（可点击）
            </span>
          </div>

          {/* 神祇信息面板 */}
          {activeGod && (
            <div
              ref={panelRef}
              style={{
                position: isMobile ? 'fixed' : 'absolute',
                top: isMobile ? 'auto' : 0,
                bottom: 0,
                right: 0,
                height: isMobile ? 'auto' : '100%',
                maxHeight: isMobile ? '72vh' : undefined,
                zIndex: isMobile ? 50 : undefined,
                width: isMobile ? '100%' : 'min(370px, 92%)',
                background: 'rgba(10, 9, 24, 0.92)',
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                borderLeft: '1px solid rgba(200, 186, 255, 0.22)',
                padding: '34px 30px', overflowY: 'auto',
              }}
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="关闭"
                style={{
                  position: 'absolute', top: 14, right: 16, background: 'none', border: 'none',
                  color: '#c8c8e0', fontSize: 22, cursor: 'pointer', opacity: 0.6, lineHeight: 1,
                }}
              >
                ×
              </button>

              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(200,186,255,0.9)', marginBottom: 10 }}>
                {activeGod.generation} · {activeGod.epithet}
              </div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 34, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>
                {activeGod.name}
              </div>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: 2, color: 'rgba(165,150,230,0.85)', marginBottom: 18 }}>
                {activeGod.latin}
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: 14, lineHeight: 1.9, color: '#c8c8e0', margin: '0 0 22px 0' }}>
                {activeGod.desc}
              </p>

              {/* 相关故事 */}
              {storiesOf(activeGod.id).length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(150,222,255,0.85)', marginBottom: 8 }}>
                    ✦ 相关故事
                  </div>
                  <div className="flex flex-col" style={{ gap: 7 }}>
                    {storiesOf(activeGod.id).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => openStory(s.id)}
                        style={{
                          textAlign: 'left', background: 'rgba(110, 170, 255, 0.07)',
                          border: '1px solid rgba(120, 180, 255, 0.25)', borderRadius: 8,
                          padding: '8px 14px', cursor: 'pointer',
                          fontFamily: "'EB Garamond', serif", fontSize: 15, color: '#bfe4ff',
                          transition: 'background 0.25s ease',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(110, 170, 255, 0.18)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(110, 170, 255, 0.07)'; }}
                      >
                        <span style={{ color: STORY_DOT, fontSize: 10 }}>✦</span>
                        {s.title}
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: 'rgba(150, 210, 255, 0.75)' }}>
                          · {s.themes.join(' ')}
                        </span>
                        <span style={{ marginLeft: 'auto', fontFamily: "'Inter', sans-serif", fontSize: 10.5, color: 'rgba(150,200,255,0.55)', whiteSpace: 'nowrap' }}>
                          {s.era}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {[
                { label: '父母', ids: activeGod.parents ?? [] },
                { label: '伴侣 / 羁绊', ids: activeGod.spouses ?? [] },
                { label: '子女', ids: childrenOf(activeGod.id).map((c) => c.id) },
                { label: '兄弟姐妹', ids: siblingsOf(activeGod.id).map((s) => s.id) },
              ].map(({ label, ids }) =>
                ids.length > 0 ? (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8c8e0', opacity: 0.55, marginBottom: 8 }}>
                      {label}
                    </div>
                    <div className="flex flex-wrap" style={{ gap: 8 }}>
                      {ids.map((id) => {
                        const g = NODE_MAP.get(id)!;
                        return (
                          <button
                            key={id}
                            onClick={() => { setSelected(id); setHovered(null); }}
                            style={{
                              background: 'rgba(200,186,255,0.08)', border: '1px solid rgba(200,186,255,0.3)',
                              borderRadius: 999, padding: '5px 14px', cursor: 'pointer',
                              fontFamily: "'EB Garamond', serif", fontSize: 14, color: '#d8ccff',
                              transition: 'background 0.25s ease',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,186,255,0.22)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,186,255,0.08)'; }}
                          >
                            {g.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* 故事详情弹窗 */}
      {activeStory && (
        <div
          onClick={() => setActiveStoryId(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(3, 3, 12, 0.72)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '5vh 5vw',
          }}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(680px, 100%)', maxHeight: '86vh', overflowY: 'auto',
              background: 'linear-gradient(160deg, rgba(24, 20, 52, 0.96), rgba(9, 9, 24, 0.98))',
              border: '1px solid rgba(150, 200, 255, 0.22)',
              borderRadius: 14,
              boxShadow: '0 0 80px rgba(90, 80, 200, 0.25), 0 30px 60px rgba(0,0,0,0.5)',
              padding: 'clamp(28px, 4vw, 48px)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setActiveStoryId(null)}
              aria-label="关闭"
              style={{
                position: 'absolute', top: 16, right: 20, background: 'none', border: 'none',
                color: '#c8c8e0', fontSize: 26, cursor: 'pointer', opacity: 0.6, lineHeight: 1,
              }}
            >
              ×
            </button>

            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(150,222,255,0.9)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9 }}>✦</span> {activeStory.era} · 神话故事
            </div>
            <h3 style={{ fontFamily: "'EB Garamond', serif", fontWeight: 400, fontSize: 'clamp(30px, 4vw, 42px)', color: '#ffffff', margin: '0 0 6px 0', lineHeight: 1.15 }}>
              {activeStory.title}
            </h3>
            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 17, color: 'rgba(200,186,255,0.85)', marginBottom: 16, fontStyle: 'italic' }}>
              {activeStory.subtitle}
            </div>

            {/* 故事主题 */}
            <div className="flex flex-wrap items-center" style={{ gap: 8, marginBottom: 26 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, letterSpacing: '2px', color: 'rgba(150,200,255,0.6)', textTransform: 'uppercase' }}>
                主题
              </span>
              {activeStory.themes.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'EB Garamond', serif", fontSize: 13.5, color: '#bfe4ff',
                    border: '1px solid rgba(150, 222, 255, 0.4)', borderRadius: 999,
                    padding: '3px 13px',
                    background: 'linear-gradient(120deg, rgba(110,170,255,0.16), rgba(150,120,255,0.10))',
                    boxShadow: '0 0 12px rgba(110, 170, 255, 0.12)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {activeStory.paragraphs.map((p, i) => (
              <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 200, fontSize: 15, lineHeight: 2, color: '#d5d5ea', margin: '0 0 18px 0', textWrap: 'pretty' }}>
                {p}
              </p>
            ))}

            <div style={{ borderTop: '1px solid rgba(150, 200, 255, 0.14)', paddingTop: 20, marginTop: 8 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8c8e0', opacity: 0.55, marginBottom: 10 }}>
                出场神祇 · 点击回到星图
              </div>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {activeStory.gods.map((id) => {
                  const g = NODE_MAP.get(id);
                  if (!g) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => { setSelected(id); setHovered(null); setActiveStoryId(null); }}
                      style={{
                        background: 'rgba(200,186,255,0.08)', border: '1px solid rgba(200,186,255,0.3)',
                        borderRadius: 999, padding: '5px 14px', cursor: 'pointer',
                        fontFamily: "'EB Garamond', serif", fontSize: 14, color: '#d8ccff',
                        transition: 'background 0.25s ease',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,186,255,0.22)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,186,255,0.08)'; }}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
