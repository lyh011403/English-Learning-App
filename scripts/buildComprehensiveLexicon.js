// scripts/buildComprehensiveLexicon.js
// 專業級大詞庫與詞根繁衍生成腳本 (千詞級規模整合版)
import fs from 'node:fs'
import path from 'node:path'

import { EXTENDED_FAMILIES_PART2 } from './vocabFamiliesPart2.js'
import { EXTENDED_FAMILIES_PART3 } from './vocabFamiliesPart3.js'
import { EXTENDED_FAMILIES_PART4 } from './vocabFamiliesPart4.js'
import { HIGH_FREQUENCY_THEMATIC_WORDS } from './vocabFamiliesPart5.js'

// 1. 定義 64 個核心詞根、前綴與後綴
const ROOTS_DATA = [
  // 前綴
  { id: 'p_syn', morpheme: 'syn- / sym-', type: 'prefix', origin: '希臘語 (sun)', meaning: 'together, with, same', meaningZh: '共同、同時、結合' },
  { id: 'p_de', morpheme: 'de-', type: 'prefix', origin: '拉丁語 (de)', meaning: 'down, off, away, reverse', meaningZh: '向下、分離、去除、反向' },
  { id: 'p_con', morpheme: 'con- / com-', type: 'prefix', origin: '拉丁語 (com)', meaning: 'together, completely, with', meaningZh: '聚合、完全、共同' },
  { id: 'p_pre', morpheme: 'pre-', type: 'prefix', origin: '拉丁語 (prae)', meaning: 'before, in advance', meaningZh: '在...之前、預先' },
  { id: 'p_trans', morpheme: 'trans-', type: 'prefix', origin: '拉丁語 (trans)', meaning: 'across, beyond, through', meaningZh: '跨越、轉移、透過' },
  { id: 'p_retro', morpheme: 'retro-', type: 'prefix', origin: '拉丁語 (retro)', meaning: 'backward, behind', meaningZh: '向後、回溯、倒退' },
  { id: 'p_sub', morpheme: 'sub-', type: 'prefix', origin: '拉丁語 (sub)', meaning: 'under, below, beneath', meaningZh: '在...之下、次級、潛在' },
  { id: 'p_inter', morpheme: 'inter-', type: 'prefix', origin: '拉丁語 (inter)', meaning: 'between, among, mutually', meaningZh: '在...之間、相互' },
  { id: 'p_in', morpheme: 'in- / im-', type: 'prefix', origin: '拉丁語 (in)', meaning: 'into, toward OR not (negation)', meaningZh: '1.進入、朝內；2.否定 (不、非)' },
  { id: 'p_ex', morpheme: 'ex- / e-', type: 'prefix', origin: '拉丁語 (ex)', meaning: 'out of, away from', meaningZh: '向外、脫離、產出' },
  { id: 'p_pro', morpheme: 'pro-', type: 'prefix', origin: '拉丁語/希臘語 (pro)', meaning: 'forward, forth, in favor of', meaningZh: '向前、支持、倡導' },
  { id: 'p_re', morpheme: 're-', type: 'prefix', origin: '拉丁語 (re)', meaning: 'again, back, anew', meaningZh: '再次、返回、重新' },
  { id: 'p_anti', morpheme: 'anti-', type: 'prefix', origin: '希臘語 (anti)', meaning: 'against, opposite', meaningZh: '相反、對抗、抵禦' },
  { id: 'p_auto', morpheme: 'auto-', type: 'prefix', origin: '希臘語 (autos)', meaning: 'self, same', meaningZh: '自己、自動、獨立' },
  { id: 'p_tele', morpheme: 'tele-', type: 'prefix', origin: '希臘語 (tele)', meaning: 'distant, far off', meaningZh: '遠距離、遠程' },
  { id: 'p_micro', morpheme: 'micro-', type: 'prefix', origin: '希臘語 (mikros)', meaning: 'small, fine', meaningZh: '微小、精細' },
  { id: 'p_macro', morpheme: 'macro-', type: 'prefix', origin: '希臘語 (makros)', meaning: 'large, long', meaningZh: '宏觀、巨大' },
  { id: 'p_mono', morpheme: 'mono-', type: 'prefix', origin: '希臘語 (monos)', meaning: 'one, single, alone', meaningZh: '單一、獨特' },
  { id: 'p_poly', morpheme: 'poly- / multi-', type: 'prefix', origin: '希臘語/拉丁語', meaning: 'many, much', meaningZh: '多重、繁多、多元' },
  { id: 'p_hyper', morpheme: 'hyper- / super-', type: 'prefix', origin: '希臘/拉丁語', meaning: 'over, above, excessive', meaningZh: '超越、過度、頂尖' },
  { id: 'p_bene', morpheme: 'bene- / bon-', type: 'prefix', origin: '拉丁語 (bene)', meaning: 'good, well', meaningZh: '良善、優良、益處' },
  { id: 'p_mal', morpheme: 'mal- / male-', type: 'prefix', origin: '拉丁語 (malus)', meaning: 'bad, evil, ill', meaningZh: '邪惡、有害、缺陷' },
  { id: 'p_omni', morpheme: 'omni-', type: 'prefix', origin: '拉丁語 (omnis)', meaning: 'all, every', meaningZh: '全能、全部、普遍' },

  // 字根
  { id: 'r_chron', morpheme: 'chron', type: 'root', origin: '希臘語 (khronos)', meaning: 'time', meaningZh: '時間' },
  { id: 'r_struct', morpheme: 'struct', type: 'root', origin: '拉丁語 (struere)', meaning: 'build, assemble', meaningZh: '建造、構築、架構' },
  { id: 'r_dict', morpheme: 'dict', type: 'root', origin: '拉丁語 (dicere)', meaning: 'say, speak, declare', meaningZh: '說話、宣稱、法令' },
  { id: 'r_spect', morpheme: 'spect / spic', type: 'root', origin: '拉丁語 (specere)', meaning: 'look, see, examine', meaningZh: '看、注視、觀察、檢視' },
  { id: 'r_port', morpheme: 'port', type: 'root', origin: '拉丁語 (portare)', meaning: 'carry, bear', meaningZh: '搬運、攜帶、運送' },
  { id: 'r_path', morpheme: 'path', type: 'root', origin: '希臘語 (pathos)', meaning: 'feeling, suffering, emotion', meaningZh: '情感、感受、痛苦' },
  { id: 'r_vis', morpheme: 'vis / vid', type: 'root', origin: '拉丁語 (videre)', meaning: 'see, sight', meaningZh: '看見、視野、影像' },
  { id: 'r_duc', morpheme: 'duc / duct', type: 'root', origin: '拉丁語 (ducere)', meaning: 'lead, bring, guide', meaningZh: '引導、帶領、傳導' },
  { id: 'r_tract', morpheme: 'tract', type: 'root', origin: '拉丁語 (trahere)', meaning: 'draw, pull, drag', meaningZh: '拉、引、拖拽' },
  { id: 'r_scrib', morpheme: 'scrib / script', type: 'root', origin: '拉丁語 (scribere)', meaning: 'write, record', meaningZh: '書寫、刻寫、紀錄' },
  { id: 'r_cred', morpheme: 'cred', type: 'root', origin: '拉丁語 (credere)', meaning: 'believe, trust', meaningZh: '相信、信任、憑據' },
  { id: 'r_vert', morpheme: 'vert / vers', type: 'root', origin: '拉丁語 (vertere)', meaning: 'turn, change direction', meaningZh: '轉向、轉變、顛覆' },
  { id: 'r_gress', morpheme: 'gress / grad', type: 'root', origin: '拉丁語 (gradi)', meaning: 'step, walk, move forward', meaningZh: '步履、前進、階梯' },
  { id: 'r_volu', morpheme: 'volv / volut', type: 'root', origin: '拉丁語 (volvere)', meaning: 'roll, turn around', meaningZh: '捲曲、滾動、展開轉化' },
  { id: 'r_gen', morpheme: 'gen / gener', type: 'root', origin: '希臘/拉丁語 (genus)', meaning: 'birth, origin, produce', meaningZh: '產生、誕生、種類、宗族' },
  { id: 'r_bio', morpheme: 'bio', type: 'root', origin: '希臘語 (bios)', meaning: 'life, living organism', meaningZh: '生命、生物' },
  { id: 'r_cap', morpheme: 'cap / cip / cept', type: 'root', origin: '拉丁語 (capere)', meaning: 'take, seize, hold', meaningZh: '抓取、接收、掌握' },
  { id: 'r_fac', morpheme: 'fac / fec / fic', type: 'root', origin: '拉丁語 (facere)', meaning: 'make, do', meaningZh: '製造、做、促成' },
  { id: 'r_mit', morpheme: 'mit / miss', type: 'root', origin: '拉丁語 (mittere)', meaning: 'send, let go', meaningZh: '派遣、投送、釋放' },
  { id: 'r_pel', morpheme: 'pel / puls', type: 'root', origin: '拉丁語 (pellere)', meaning: 'drive, push', meaningZh: '推動、驅使、逼迫' },
  { id: 'r_sta', morpheme: 'sta / sist / stit', type: 'root', origin: '拉丁語 (stare)', meaning: 'stand, endure, remain', meaningZh: '站立、確立、堅持、停滯' },
  { id: 'r_ven', morpheme: 'ven / vent', type: 'root', origin: '拉丁語 (venire)', meaning: 'come, arrive', meaningZh: '來臨、到來、事件' },
  { id: 'r_cid', morpheme: 'cid / cis', type: 'root', origin: '拉丁語 (caedere)', meaning: 'cut, kill', meaningZh: '切割、殺死、決斷' },
  { id: 'r_cur', morpheme: 'cur / curs', type: 'root', origin: '拉丁語 (currere)', meaning: 'run, flow, course', meaningZh: '奔馳、流動、進程' },
  { id: 'r_fer', morpheme: 'fer / lat', type: 'root', origin: '拉丁語 (ferre)', meaning: 'bear, carry, yield', meaningZh: '運載、承受、產出' },
  { id: 'r_flu', morpheme: 'flu / flux', type: 'root', origin: '拉丁語 (fluere)', meaning: 'flow', meaningZh: '流動、流淌、消長' },
  { id: 'r_flect', morpheme: 'flect / flex', type: 'root', origin: '拉丁語 (flectere)', meaning: 'bend, curve', meaningZh: '彎曲、折射、彈性' },
  { id: 'r_jud', morpheme: 'jud / jur', type: 'root', origin: '拉丁語 (judicare)', meaning: 'judge, law, oath', meaningZh: '評判、審判、法律、誓約' },
  { id: 'r_loc', morpheme: 'loc', type: 'root', origin: '拉丁語 (locus)', meaning: 'place', meaningZh: '地方、定位、處所' },
  { id: 'r_luc', morpheme: 'luc / lum', type: 'root', origin: '拉丁語 (lux)', meaning: 'light, shine', meaningZh: '光芒、明亮、闡明' },
  { id: 'r_nov', morpheme: 'nov', type: 'root', origin: '拉丁語 (novus)', meaning: 'new', meaningZh: '新奇、更新、原創' },
  { id: 'r_pan', morpheme: 'pan', type: 'root', origin: '希臘語 (pan)', meaning: 'all, whole', meaningZh: '全體、全部、全景' },
  { id: 'r_phil', morpheme: 'phil / philo', type: 'root', origin: '希臘語 (philos)', meaning: 'love, friendship, affinity', meaningZh: '愛好、親和、追尋' },
  { id: 'r_phob', morpheme: 'phob', type: 'root', origin: '希臘語 (phobos)', meaning: 'fear, aversion', meaningZh: '恐懼、排斥、畏懼' },
  { id: 'r_pon', morpheme: 'pon / pos / posit', type: 'root', origin: '拉丁語 (ponere)', meaning: 'put, place', meaningZh: '放置、擺設、位置' },
  { id: 'r_rog', morpheme: 'rog', type: 'root', origin: '拉丁語 (rogare)', meaning: 'ask, demand, propose', meaningZh: '詢問、要求、質疑' },
  { id: 'r_sequ', morpheme: 'sequ / secut', type: 'root', origin: '拉丁語 (sequi)', meaning: 'follow', meaningZh: '跟隨、後續、序列' },
  { id: 'r_sens', morpheme: 'sens / sent', type: 'root', origin: '拉丁語 (sentire)', meaning: 'feel, perceive, think', meaningZh: '感覺、感知、意向' },
  { id: 'r_sed', morpheme: 'sed / sid / sess', type: 'root', origin: '拉丁語 (sedere)', meaning: 'sit, settle', meaningZh: '坐落、安頓、開會' },
  { id: 'r_tang', morpheme: 'tang / tact / tag', type: 'root', origin: '拉丁語 (tangere)', meaning: 'touch', meaningZh: '接觸、觸碰、感知' },
  { id: 'r_ten', morpheme: 'ten / tain / tent', type: 'root', origin: '拉丁語 (tenere)', meaning: 'hold, keep', meaningZh: '握持、保持、維護' },
  { id: 'r_tort', morpheme: 'tort', type: 'root', origin: '拉丁語 (torquere)', meaning: 'twist, bend', meaningZh: '扭曲、曲解、折磨' },
  { id: 'r_voc', morpheme: 'voc / vok', type: 'root', origin: '拉丁語 (vocare)', meaning: 'call, voice, speak', meaningZh: '呼喊、發聲、召集' },
  { id: 'r_anim', morpheme: 'anim', type: 'root', origin: '拉丁語 (anima)', meaning: 'life, soul, breath', meaningZh: '生命、靈魂、生氣活力' },
  { id: 'r_cord', morpheme: 'cord / card', type: 'root', origin: '拉丁語/希臘語', meaning: 'heart', meaningZh: '心靈、核心、真摯' },
  { id: 'r_corp', morpheme: 'corp', type: 'root', origin: '拉丁語 (corpus)', meaning: 'body', meaningZh: '肉體、軀體、實體機構' },
  { id: 'r_equ', morpheme: 'equ', type: 'root', origin: '拉丁語 (aequus)', meaning: 'equal, even', meaningZh: '平等、公平、平衡' },
  { id: 'r_fid', morpheme: 'fid', type: 'root', origin: '拉丁語 (fides)', meaning: 'faith, trust', meaningZh: '信仰、信任、忠誠' },
  { id: 'r_fort', morpheme: 'fort', type: 'root', origin: '拉丁語 (fortis)', meaning: 'strong, strength', meaningZh: '堅固、強大、勇氣' },
  { id: 'r_grat', morpheme: 'grat', type: 'root', origin: '拉丁語 (gratus)', meaning: 'pleasing, thankful', meaningZh: '感激、令人愉悅、恩惠' },
  { id: 'r_grav', morpheme: 'grav', type: 'root', origin: '拉丁語 (gravis)', meaning: 'heavy, serious', meaningZh: '沉重、嚴重、重力' },
  { id: 'r_leg', morpheme: 'leg / lect', type: 'root', origin: '拉丁語 (legere)', meaning: 'choose, read, law', meaningZh: '採集、閱讀、法規、挑選' },
  { id: 'r_liber', morpheme: 'liber', type: 'root', origin: '拉丁語 (liber)', meaning: 'free', meaningZh: '自由、釋放、豁免' },
  { id: 'r_magn', morpheme: 'magn', type: 'root', origin: '拉丁語 (magnus)', meaning: 'great, large', meaningZh: '偉大、宏大、崇高' },
  { id: 'r_mem', morpheme: 'mem', type: 'root', origin: '拉丁語 (memor)', meaning: 'remember', meaningZh: '記憶、銘記、回憶' },
  { id: 'r_mort', morpheme: 'mort', type: 'root', origin: '拉丁語 (mors)', meaning: 'death', meaningZh: '死亡、終結、致命' },
  { id: 'r_nom', morpheme: 'nom / onym', type: 'root', origin: '拉丁語/希臘語', meaning: 'name, law, order', meaningZh: '名稱、命名、規範' },
  { id: 'r_oper', morpheme: 'oper', type: 'root', origin: '拉丁語 (opus)', meaning: 'work, labor', meaningZh: '工作、運作、操作' },
  { id: 'r_psych', morpheme: 'psych', type: 'root', origin: '希臘語 (psukhe)', meaning: 'mind, soul', meaningZh: '心靈、心理、精神' },
  { id: 'r_sci', morpheme: 'sci', type: 'root', origin: '拉丁語 (scire)', meaning: 'know', meaningZh: '知曉、知識、科學' },
  { id: 'r_spir', morpheme: 'spir', type: 'root', origin: '拉丁語 (spirare)', meaning: 'breathe, spirit', meaningZh: '呼吸、精神、靈感' },
  { id: 'r_term', morpheme: 'term', type: 'root', origin: '拉丁語 (terminus)', meaning: 'end, limit, boundary', meaningZh: '界限、終結、期限' },
  { id: 'r_vac', morpheme: 'vac', type: 'root', origin: '拉丁語 (vacare)', meaning: 'empty', meaningZh: '空虛、騰出、閒暇' },
  { id: 'r_viv', morpheme: 'viv / vit', type: 'root', origin: '拉丁語 (vivere)', meaning: 'live, life', meaningZh: '活著、生命力、鮮活' },

  // 後綴
  { id: 's_ize', morpheme: '-ize / -ise', type: 'suffix', origin: '希臘/拉丁語', meaning: 'make, cause to become (verb)', meaningZh: '使...化、進行 (動詞後綴)' },
  { id: 's_tion', morpheme: '-tion / -sion', type: 'suffix', origin: '拉丁語 (-tio)', meaning: 'act, process, state of (noun)', meaningZh: '行為、過程、狀態 (名詞後綴)' },
  { id: 's_able', morpheme: '-able / -ible', type: 'suffix', origin: '拉丁語 (-abilis)', meaning: 'capable of, worthy of (adj)', meaningZh: '能夠...的、值得...的 (形容詞後綴)' },
  { id: 's_ive', morpheme: '-ive', type: 'suffix', origin: '拉丁語 (-ivus)', meaning: 'having nature of, tending to (adj)', meaningZh: '具...性質的、傾向於 (形容詞後綴)' },
  { id: 's_al', morpheme: '-al / -ial', type: 'suffix', origin: '拉丁語 (-alis)', meaning: 'relating to, of the kind of (adj)', meaningZh: '關於...的、具...特徵的 (形容詞後綴)' },
  { id: 's_ous', morpheme: '-ous / -ious', type: 'suffix', origin: '拉丁語 (-osus)', meaning: 'full of, characterized by (adj)', meaningZh: '充滿...的、具備...的 (形容詞後綴)' },
  { id: 's_ity', morpheme: '-ity / -ty', type: 'suffix', origin: '拉丁語 (-itas)', meaning: 'state, quality, condition (noun)', meaningZh: '特質、狀態、性質 (名詞後綴)' },
  { id: 's_ment', morpheme: '-ment', type: 'suffix', origin: '拉丁語 (-mentum)', meaning: 'action, result, means (noun)', meaningZh: '行為、結果、手段 (名詞後綴)' },
  { id: 's_or', morpheme: '-or / -er', type: 'suffix', origin: '拉丁語/日耳曼語', meaning: 'one who does, that which does (noun)', meaningZh: '做某事的人或工具 (名詞後綴)' },
  { id: 's_ate', morpheme: '-ate', type: 'suffix', origin: '拉丁語 (-atus)', meaning: 'to cause, become; characterized by (v/adj)', meaningZh: '使成為、具有...的 (動詞/形容詞後綴)' },
  { id: 's_ify', morpheme: '-ify', type: 'suffix', origin: '拉丁語 (-ificare)', meaning: 'to make or cause to be (verb)', meaningZh: '使純化、使成... (動詞後綴)' },
  { id: 's_ic', morpheme: '-ic / -ical', type: 'suffix', origin: '希臘/拉丁語', meaning: 'having characteristics of (adj)', meaningZh: '具...特徵的、屬於...的 (形容詞後綴)' },
  { id: 's_ism', morpheme: '-ism', type: 'suffix', origin: '希臘語 (-ismos)', meaning: 'doctrine, practice, condition (noun)', meaningZh: '主義、學說、行為現象 (名詞後綴)' },
  { id: 's_ist', morpheme: '-ist', type: 'suffix', origin: '希臘語 (-istes)', meaning: 'one who adheres to or practices (noun)', meaningZh: '信仰者、從事者、專家 (名詞後綴)' },
  { id: 's_ance', morpheme: '-ance / -ence', type: 'suffix', origin: '拉丁語 (-antia)', meaning: 'state or quality of (noun)', meaningZh: '性質、狀態、情況 (名詞後綴)' },
  { id: 's_ant', morpheme: '-ant / -ent', type: 'suffix', origin: '拉丁語 (-ans)', meaning: 'performing, agent, state (adj/noun)', meaningZh: '表現...的、具有...特性的 (形容詞/名詞後綴)' },
  { id: 's_ness', morpheme: '-ness', type: 'suffix', origin: '古英語 (-nes)', meaning: 'quality, state of being (noun)', meaningZh: '性質、狀態、心態 (名詞後綴)' },
  { id: 's_ly', morpheme: '-ly', type: 'suffix', origin: '古英語 (-lice)', meaning: 'in the manner of (adv)', meaningZh: '以...方式 (副詞後綴)' }
]

// 2. 構建第一批核心詞族
const FAMILIES_PART1 = [
  // struct 家族
  {
    rootId: 'r_struct',
    words: [
      { w: 'construct', ipa: '/kənˈstrʌkt/', pos: ['v.'], zh: '建造、構築、構思', tag: 'B1 / TOEIC', topic: 'sci-fi', m: 'con-(共同) + struct(建造) = 將各部件組裝在一起', ex: 'They constructed a massive defensive dome over the futuristic colony.' },
      { w: 'construction', ipa: '/kənˈstrʌk.ʃən/', pos: ['n.'], zh: '建設、建造工程', tag: 'A2 / 基礎必備', topic: 'business', m: 'construct + -ion = 建造工程與過程', ex: 'The underground railway system is currently under construction.' },
      { w: 'constructive', ipa: '/kənˈstrʌk.tɪv/', pos: ['adj.'], zh: '建設性的、有益的', tag: 'B2 / 職場商用', topic: 'business', m: 'construct + -ive = 能夠促進事物完善的', ex: 'The team welcomed constructive feedback to refine their project architecture.' },
      { w: 'destruct', ipa: '/dɪˈstrʌkt/', pos: ['v.'], zh: '自毀、徹底破壞', tag: 'B2 / 科幻影視', topic: 'sci-fi', m: 'de-(去除) + struct(建造) = 徹底瓦解既有結構', ex: 'The starship initiated a ten-second self-destruct sequence.' },
      { w: 'destruction', ipa: '/dɪˈstrʌk.ʃən/', pos: ['n.'], zh: '毀滅、破壞', tag: 'B1 / 核心基礎', topic: 'cinema', m: 'destruct + -ion = 毀壞毀滅之狀態', ex: 'The category-5 hurricane left a trail of unimaginable destruction.' },
      { w: 'destructive', ipa: '/dɪˈstrʌk.tɪv/', pos: ['adj.'], zh: '破壞性的、毀滅性的', tag: 'B2 / 托福聽力', topic: 'sci-fi', m: 'de-(拆下) + struct(建造) + -ive = 具毀滅特質的', ex: 'Tornadoes can be extremely destructive forces of nature.' },
      { w: 'instruct', ipa: '/ɪnˈstrʌkt/', pos: ['v.'], zh: '指導、指示、吩咐', tag: 'B1 / 生活常考', topic: 'sitcom', m: 'in-(朝內) + struct(建構知識) = 在學員心中建立知識結構', ex: 'The flight controller instructed the pilot to maintain altitude.' },
      { w: 'instruction', ipa: '/ɪnˈstrʌk.ʃən/', pos: ['n.'], zh: '指示、用法說明、操作步驟', tag: 'A2 / 基礎必備', topic: 'business', m: 'instruct + -ion = 具體指引與指示', ex: 'Follow the instructions carefully before assembling the equipment.' },
      { w: 'instructive', ipa: '/ɪnˈstrʌk.tɪv/', pos: ['adj.'], zh: '富有啟發性的、有教育意義的', tag: 'B2 / 學術閱讀', topic: 'animation', m: 'instruct + -ive = 充滿指導教學意義的', ex: 'The documentary offered an instructive analysis of deep-sea ecology.' },
      { w: 'instructor', ipa: '/ɪnˈstrʌk.tər/', pos: ['n.'], zh: '教練、指導員、大學講師', tag: 'A2 / 職業生活', topic: 'sitcom', m: 'instruct + -or = 傳道授業解惑之人', ex: 'The certified diving instructor checked our oxygen tanks thoroughly.' },
      { w: 'obstruct', ipa: '/əbˈstrʌkt/', pos: ['v.'], zh: '阻礙、妨礙、阻塞', tag: 'C1 / 托福常考', topic: 'cinema', m: 'ob-(逆向反對) + struct(堆砌建造) = 在前進方向堆砌阻礙障壁', ex: 'Fallen trees obstructed the emergency rescue convoy during the storm.' },
      { w: 'obstruction', ipa: '/əbˈstrʌk.ʃən/', pos: ['n.'], zh: '阻礙物、障礙、妨礙', tag: 'C1 / 法律醫學', topic: 'business', m: 'obstruct + -ion = 造成前進停滯的阻礙', ex: 'The suspect was charged with obstruction of justice.' },
      { w: 'reconstruct', ipa: '/ˌriː.kənˈstrʌkt/', pos: ['v.'], zh: '重建、重現現場、重塑', tag: 'B2 / 刑偵影視', topic: 'cinema', m: 're-(重新) + construct = 重新建立現場樣貌', ex: 'Forensic specialists reconstructed the crime scene using laser scans.' },
      { w: 'reconstruction', ipa: '/ˌriː.kənˈstrʌk.ʃən/', pos: ['n.'], zh: '重建工程、復興歷程', tag: 'B2 / 歷史人文', topic: 'business', m: 'reconstruct + -ion = 重建與復興', ex: 'Post-war economic reconstruction required massive global coordination.' },
      { w: 'deconstruct', ipa: '/ˌdiː.kənˈstrʌkt/', pos: ['v.'], zh: '解構、拆解剖析', tag: 'C1 / 批判理論', topic: 'cinema', m: 'de-(拆分) + construct = 拆解核心元素以進行深度剖析', ex: 'The literary critic deconstructed the protagonist’s hidden psychological trauma.' },
      { w: 'structure', ipa: '/ˈstrʌk.tʃər/', pos: ['n.', 'v.'], zh: '結構、架構體系；組織安排', tag: 'A2 / 核心基礎', topic: 'sci-fi', m: 'struct(建造) + -ure = 物件構築之整體形態', ex: 'The crystalline structure of diamond gives it incredible hardness.' },
      { w: 'structural', ipa: '/ˈstrʌk.tʃər.əl/', pos: ['adj.'], zh: '結構上的、架構性的', tag: 'B2 / 工程建築', topic: 'business', m: 'structure + -al = 屬於架構體系的', ex: 'Engineers found severe structural fissures in the bridge support beams.' },
      { w: 'infrastructure', ipa: '/ˈɪn.frəˌstrʌk.tʃər/', pos: ['n.'], zh: '基礎建設、公共架構', tag: 'B2 / 經貿學術', topic: 'business', m: 'infra-(下方底層) + structure = 支撐社會體系的底層管線與道路', ex: 'High-speed fiber optics are an essential pillar of digital infrastructure.' }
    ]
  },

  // dict 家族
  {
    rootId: 'r_dict',
    words: [
      { w: 'predict', ipa: '/prɪˈdɪkt/', pos: ['v.'], zh: '預測、預告', tag: 'B1 / TOEIC', topic: 'business', m: 'pre-(事先) + dict(說) = 事先宣告即將發生的事', ex: 'Meteorologists predict heavy rainfall across the northern coast tomorrow.' },
      { w: 'prediction', ipa: '/prɪˈdɪk.ʃən/', pos: ['n.'], zh: '預言、預測結果', tag: 'B1 / 核心基礎', topic: 'sci-fi', m: 'predict + -ion = 預測之行為與結果', ex: 'Her prediction about the market crash proved astonishingly accurate.' },
      { w: 'predictable', ipa: '/prɪˈdɪk.tə.bəl/', pos: ['adj.'], zh: '可預料的、意料之中的', tag: 'B1 / 口語常用', topic: 'sitcom', m: 'predict + -able = 能在預料之中的', ex: 'The ending of the mystery novel was exciting yet entirely predictable.' },
      { w: 'contradict', ipa: '/ˌkɒn.trəˈdɪkt/', pos: ['v.'], zh: '反駁、與...自相矛盾', tag: 'B2 / TOEFL', topic: 'cinema', m: 'contra-(相反) + dict(言說) = 說反話對立相衝', ex: 'The witness’s second statement directly contradicted his original testimony.' },
      { w: 'contradiction', ipa: '/ˌkɒn.trəˈdɪk.ʃən/', pos: ['n.'], zh: '矛盾、抵觸', tag: 'B2 / 哲學邏輯', topic: 'cinema', m: 'contradict + -ion = 互相排斥衝突之現象', ex: 'There is a glaring contradiction between your stated morals and your actions.' },
      { w: 'dictate', ipa: '/dɪkˈteɪt/', pos: ['v.', 'n.'], zh: '口述；支配、發號施令', tag: 'B2 / 職場商用', topic: 'business', m: 'dict(說出) + -ate = 依威權下達口頭命令', ex: 'You must never allow your past regrets to dictate your future ambition.' },
      { w: 'dictator', ipa: '/dɪkˈteɪ.tər/', pos: ['n.'], zh: '獨裁者、專制君主', tag: 'B2 / 歷史影視', topic: 'cinema', m: 'dictate + -or = 掌控言說與生殺大權之暴君', ex: 'The rebels launched a coordinated campaign to topple the ruthless dictator.' },
      { w: 'verdict', ipa: '/ˈvɜː.dɪkt/', pos: ['n.'], zh: '裁決、判決', tag: 'C1 / 法律影視', topic: 'cinema', m: 'ver-(真實) + dict(宣佈) = 法庭上宣判公義真實的定案', ex: 'The courtroom fell silent as the foreperson prepared to read the verdict.' },
      { w: 'addict', ipa: '/ˈæd.ɪkt/', pos: ['n.', 'v.'], zh: '成癮者；使沈迷', tag: 'B1 / 生活必備', topic: 'sitcom', m: 'ad-(朝向) + dict(宣告歸屬) = 誓死將靈魂宣稱歸屬於某種嗜好', ex: 'He is an unapologetic video game addict who plays twelve hours a day.' },
      { w: 'addiction', ipa: '/əˈdɪk.ʃən/', pos: ['n.'], zh: '上癮、沉迷嗜好', tag: 'B1 / 醫學心理', topic: 'sitcom', m: 'addict + -ion = 沉淪上癮難以自拔之症狀', ex: 'Overcoming social media addiction requires disciplined digital detoxing.' },
      { w: 'indicate', ipa: '/ˈɪn.dɪ.keɪt/', pos: ['v.'], zh: '表明、指出、象徵', tag: 'B1 / 托福學術', topic: 'business', m: 'in-(朝內) + dic(指出) + -ate = 用手指點出關鍵', ex: 'Recent surveys indicate a strong consumer shift toward sustainable energy.' },
      { w: 'dedicate', ipa: '/ˈded.ɪ.keɪt/', pos: ['v.'], zh: '奉獻、致力於、題獻', tag: 'B2 / 人文必備', topic: 'animation', m: 'de-(徹底) + dic(宣告宣誓) + -ate = 莊嚴宣誓將畢生精力完全投入', ex: 'She dedicated her entire career to protecting endangered rainforest habitats.' }
    ]
  },

  // spect 家族
  {
    rootId: 'r_spect',
    words: [
      { w: 'inspect', ipa: '/ɪnˈspekt/', pos: ['v.'], zh: '檢查、審視、稽查', tag: 'B1 / TOEIC', topic: 'cinema', m: 'in-(深入) + spect(看) = 深入細節仔細審視', ex: 'Quality control technicians inspected every single microchip under microscopes.' },
      { w: 'inspection', ipa: '/ɪnˈspek.ʃən/', pos: ['n.'], zh: '檢查、視察作業', tag: 'B1 / 工業品管', topic: 'business', m: 'inspect + -ion = 現場稽核視察過程', ex: 'The commercial aircraft passed its rigorous biennial safety inspection.' },
      { w: 'perspective', ipa: '/pəˈspek.tɪv/', pos: ['n.'], zh: '觀點、視角；透視畫法', tag: 'B2 / 留學必備', topic: 'animation', m: 'per-(透徹) + spect(看) + -ive = 洞悉全局之視角眼界', ex: 'Living abroad for a decade gave him a profoundly nuanced cultural perspective.' },
      { w: 'spectator', ipa: '/spekˈteɪ.tər/', pos: ['n.'], zh: '觀眾、旁觀者', tag: 'B1 / 體育休閒', topic: 'sitcom', m: 'spect(看) + -ator = 駐足觀戰之人', ex: 'Over ninety thousand ecstatic spectators cheered as the home team scored.' },
      { w: 'spectacle', ipa: '/ˈspek.tə.kəl/', pos: ['n.'], zh: '壯觀場面、盛大奇觀', tag: 'B2 / 影視文藝', topic: 'cinema', m: 'spect(看) + -acle = 令人嘆為觀止的盛大景象', ex: 'The solar eclipse over the desert was an awe-inspiring celestial spectacle.' },
      { w: 'spectacular', ipa: '/spekˈtæk.jə.lər/', pos: ['adj.'], zh: '極為壯觀的、令人驚嘆的', tag: 'B1 / 口語高頻', topic: 'animation', m: 'spectacle + -ar = 場面宏偉瑰麗令人讚賞的', ex: 'The animated film concluded with a spectacular battle across starry constellations.' },
      { w: 'suspect', ipa: '/səˈspekt/', pos: ['v.', 'n.'], zh: '懷疑、猜想；嫌疑犯', tag: 'B1 / 刑偵影視', topic: 'cinema', m: 'sub-(在底下) + spect(偷瞄) = 在暗地裡暗中打量懷疑', ex: 'Police detectives suspect the robbery was an organized inside job.' },
      { w: 'respect', ipa: '/rɪˈspekt/', pos: ['v.', 'n.'], zh: '尊敬、尊重；方面細項', tag: 'A2 / 基礎必備', topic: 'animation', m: 're-(再次回頭) + spect(注視) = 值得一再回頭敬重相看', ex: 'Great martial artists show deep respect to their mentors and opponents alike.' },
      { w: 'retrospect', ipa: '/ˈret.rə.spekt/', pos: ['n.'], zh: '回顧、事後反思', tag: 'C1 / 商業反思', topic: 'business', m: 'retro-(向後) + spect(看) = 回頭看向過往歷程', ex: 'In retrospect, the financial crisis could have been prevented with stricter oversight.' },
      { w: 'circumspect', ipa: '/ˈsɜː.kəm.spekt/', pos: ['adj.'], zh: '謹慎小心的、慎重周密的', tag: 'C2 / GRE核心', topic: 'business', m: 'circum-(周圍四面) + spect(看) = 環視四周確認全無危險再動', ex: 'Diplomats must remain circumspect when addressing volatile geopolitical disputes.' }
    ]
  },

  // port 家族
  {
    rootId: 'r_port',
    words: [
      { w: 'transport', ipa: '/ˈtræn.spɔːt/', pos: ['v.', 'n.'], zh: '運送、運輸系統', tag: 'A2 / 基礎核心', topic: 'sci-fi', m: 'trans-(跨越) + port(攜帶) = 攜帶人與物資跨越空間', ex: 'Cargo starships transport precious minerals across stellar systems.' },
      { w: 'export', ipa: '/ɪkˈspɔːt/', pos: ['v.', 'n.'], zh: '出口、外銷商品', tag: 'B1 / 經貿核心', topic: 'business', m: 'ex-(出港) + port(港口搬運) = 貨物搬出本國海關外銷', ex: 'Taiwan exports cutting-edge semiconductor wafers to tech giants worldwide.' },
      { w: 'import', ipa: '/ɪmˈpɔːt/', pos: ['v.', 'n.'], zh: '進口、輸入；重要性', tag: 'B1 / 經貿核心', topic: 'business', m: 'im-(進港) + port(港口搬運) = 自外國港口輸入物資', ex: 'The desert country must import ninety percent of its fresh agricultural produce.' },
      { w: 'important', ipa: '/ɪmˈpɔː.tənt/', pos: ['adj.'], zh: '重要的、舉足輕重的', tag: 'A1 / 必備單字', topic: 'sitcom', m: 'in-(朝內) + port(帶來份量) + -ant = 具有重大分量與影響力', ex: 'Getting sufficient deep sleep is critically important for brain rejuvenation.' },
      { w: 'portable', ipa: '/ˈpɔː.tə.bəl/', pos: ['adj.'], zh: '可攜帶的、輕便好拿的', tag: 'B1 / 消費科技', topic: 'sci-fi', m: 'port(攜帶) + -able(能) = 能輕鬆手提隨身行走的', ex: 'A compact portable power bank is indispensable for mountain expeditions.' },
      { w: 'support', ipa: '/səˈpɔːt/', pos: ['v.', 'n.'], zh: '支持、支撐、撫養', tag: 'A2 / 基礎核心', topic: 'sitcom', m: 'sub-(在底層) + port(扛起承受) = 在底下用肩膀死命扛住重擔', ex: 'Friends and mentors supported her during the grueling venture capital pitch.' },
      { w: 'report', ipa: '/rɪˈpɔːt/', pos: ['v.', 'n.'], zh: '報告、報導、呈報', tag: 'A2 / 基礎必備', topic: 'business', m: 're-(帶回) + port(攜帶) = 將前線偵察探得的信息帶回陳述', ex: 'The chief financial officer presented the quarterly performance report.' }
    ]
  },

  // path 家族
  {
    rootId: 'r_path',
    words: [
      { w: 'sympathy', ipa: '/ˈsɪm.pə.θi/', pos: ['n.'], zh: '同情心、慰問、同理憐憫', tag: 'B1 / 核心基礎', topic: 'sitcom', m: 'sym-(共同) + path(感受) + -y = 感同身受共同承受傷痛', ex: 'I offer my deepest sympathies to the families affected by the tragedy.' },
      { w: 'empathy', ipa: '/ˈem.pə.θi/', pos: ['n.'], zh: '同理心、神入共情', tag: 'B2 / 心理情商', topic: 'animation', m: 'em-(深入內部) + path(痛苦感受) + -y = 徹底鑽進對方靈魂感受其痛', ex: 'Empathy allows animated character animators to breathe genuine soul into drawings.' },
      { w: 'telepathy', ipa: '/təˈlep.ə.θi/', pos: ['n.'], zh: '心靈感應、心電感應', tag: 'B2 / 科幻動畫', topic: 'sci-fi', m: 'tele-(超遙遠) + path(感受) + -y = 隔著無窮空間互傳心靈感應', ex: 'The twin telepaths communicated silently across planetary battlefields.' },
      { w: 'apathy', ipa: '/ˈæp.ə.θi/', pos: ['n.'], zh: '冷漠、漠不關心、無動於衷', tag: 'C1 / 社會心理', topic: 'cinema', m: 'a-(全無) + path(情緒感受) + -y = 內心麻木如同槁木死灰全無感覺', ex: 'Widespread voter apathy poses a grave danger to democratic governance.' },
      { w: 'pathetic', ipa: '/pəˈθet.ɪk/', pos: ['adj.'], zh: '可憐的、令人憐憫的；差勁的', tag: 'B1 / 口語影視', topic: 'sitcom', m: 'path(痛苦悲情) + -ic = 境況悽慘令人鼻酸或嗤之以鼻的', ex: 'The stray puppy made a series of small, pathetic whimpers in the rain.' }
    ]
  },

  // vis / vid 家族
  {
    rootId: 'r_vis',
    words: [
      { w: 'visual', ipa: '/ˈvɪʒ.u.əl/', pos: ['adj.', 'n.'], zh: '視覺的、光學的；視覺圖像', tag: 'A2 / 基礎必備', topic: 'animation', m: 'vis(看) + -ual = 憑雙眼可捕捉觀賞的', ex: 'The Pixar movie features breathtaking visual artistry and lighting design.' },
      { w: 'visualize', ipa: '/ˈvɪʒ.u.əl.aɪz/', pos: ['v.'], zh: '想像、腦海浮現畫面、使可視化', tag: 'B1 / 創意設計', topic: 'animation', m: 'visual + -ize = 將抽象概念在心靈畫布描繪出來', ex: 'World-class athletes visualize their victorious routine before stepping onto the field.' },
      { w: 'visible', ipa: '/ˈvɪz.ə.bəl/', pos: ['adj.'], zh: '肉眼可見的、明顯的', tag: 'B1 / 核心基礎', topic: 'sci-fi', m: 'vis(看) + -ible(能) = 憑雙眼能夠清晰捕捉辨認的', ex: 'The International Space Station is clearly visible to the naked eye at dusk.' },
      { w: 'revise', ipa: '/rɪˈvaɪz/', pos: ['v.'], zh: '修訂、校訂修改；溫習備考', tag: 'B1 / 學習生活', topic: 'business', m: 're-(再次回頭) + vise(凝視查看) = 回頭再次審視校驗內容錯漏', ex: 'The screenwriter revised the dialogue script to heighten emotional tension.' },
      { w: 'supervise', ipa: '/ˈsuː.pə.vaɪz/', pos: ['v.'], zh: '監督、指導視察、督導', tag: 'B1 / 職場管理', topic: 'business', m: 'super-(居高臨下) + vise(注視巡查) = 站在高處綜觀並監督眾人作業', ex: 'A seasoned civil architect supervised the installation of safety scaffolding.' },
      { w: 'evident', ipa: '/ˈev.ɪ.dənt/', pos: ['adj.'], zh: '顯而易見的、昭然若揭的', tag: 'B2 / 學術分析', topic: 'cinema', m: 'e-(凸顯向外) + vid(看見) + -ent = 一目了然無需多言便能看清的', ex: 'It was self-evident that the old software framework could not scale.' },
      { w: 'provide', ipa: '/prəˈvaɪd/', pos: ['v.'], zh: '提供、供給、預先張羅', tag: 'A2 / 核心基礎', topic: 'business', m: 'pro-(預先) + vide(看見需求) = 事先看見可能遭遇的匱乏而張羅備妥', ex: 'The academy provides full tuition scholarships to underprivileged animators.' }
    ]
  },

  // duc / duct 家族
  {
    rootId: 'r_duc',
    words: [
      { w: 'deduce', ipa: '/dɪˈdʒuːs/', pos: ['v.'], zh: '演繹、推斷推理', tag: 'B2 / 留學邏輯', topic: 'cinema', m: 'de-(從上至下) + duce(引出結論) = 從大前提邏輯向下推演特定事實', ex: 'Sherlock Holmes deduced the criminal’s occupation by glancing at his calloused fingers.' },
      { w: 'conduct', ipa: '/kənˈdʌkt/', pos: ['v.', 'n.'], zh: '引導、實施指揮；個人品行操守', tag: 'B1 / 學術必備', topic: 'business', m: 'con-(聚合) + duct(帶領) = 率領眾人有條不紊推進行動', ex: 'The international science team will conduct deep-sea geothermal explorations.' },
      { w: 'produce', ipa: '/prəˈdjuːs/', pos: ['v.', 'n.'], zh: '生產、製造出；生鮮蔬果農產品', tag: 'A2 / 基礎必備', topic: 'business', m: 'pro-(向前) + duce(引領產出) = 將原料引導打造為全新成品並推出', ex: 'The animation studio produced three award-winning feature films in five years.' },
      { w: 'introduce', ipa: '/ˌɪn.trəˈdjuːs/', pos: ['v.'], zh: '介紹、引進開創、推廣', tag: 'A2 / 基礎核心', topic: 'sitcom', m: 'intro-(進入內部) + duce(引領) = 將新朋友或新事物引領帶進圈子', ex: 'Let me introduce our lead mechanical engineer to the advisory board.' },
      { w: 'reduce', ipa: '/rɪˈdjuːs/', pos: ['v.'], zh: '減少、縮減、降低', tag: 'A2 / 基礎核心', topic: 'business', m: 're-(向後回撤) + duce(引領拉扯) = 將規模數字向後引退壓低', ex: 'Switching to LED stadium illumination reduced energy consumption significantly.' },
      { w: 'educate', ipa: '/ˈedʒ.u.keɪt/', pos: ['v.'], zh: '教育、啟迪教導、傳授', tag: 'A2 / 核心基礎', topic: 'animation', m: 'e-(向外拓展) + duc(引導) + -ate = 將學員內在潛能與智慧引導啟發出來', ex: 'The documentary aims to educate the public about fragile coral reef ecosystems.' }
    ]
  },

  // tract 家族
  {
    rootId: 'r_tract',
    words: [
      { w: 'extract', ipa: '/ɪkˈstrækt/', pos: ['v.', 'n.'], zh: '提取、萃取、抽出；濃縮萃取物', tag: 'B2 / 科技醫學', topic: 'sci-fi', m: 'ex-(向外) + tract(拉拔抽取) = 自深處將核心物質抽取提煉出來', ex: 'Chemists extracted potent anti-cancer compounds from rare alpine mushrooms.' },
      { w: 'attract', ipa: '/əˈtrækt/', pos: ['v.'], zh: '吸引、招引、引起好感', tag: 'A2 / 基礎核心', topic: 'sitcom', m: 'ad-(朝向) + tract(拉引) = 將目光心意深深拉扯靠攏向自己', ex: 'Magnets attract iron filings along invisible curved magnetic field lines.' },
      { w: 'subtract', ipa: '/səbˈtrækt/', pos: ['v.'], zh: '減去、扣除扣除', tag: 'A2 / 數學基礎', topic: 'business', m: 'sub-(自下方) + tract(抽走拖離) = 從總數底層抽除一部分數值', ex: 'If you subtract operational expenses from gross revenue, net profit emerges.' },
      { w: 'distract', ipa: '/dɪˈstrækt/', pos: ['v.'], zh: '分散注意力、使分心分神', tag: 'B1 / 生活常考', topic: 'sitcom', m: 'dis-(朝四面分開) + tract(拉走) = 將專注力硬生生拉扯打散各處', ex: 'Pinging smartphone notifications constantly distract programmers from deep focus.' },
      { w: 'contract', ipa: '/ˈkɒn.trækt/', pos: ['n.', 'v.'], zh: '合約契約；收縮縮減；感染罹患', tag: 'B1 / 商業醫學', topic: 'business', m: 'con-(聚合) + tract(緊拉收攏) = 雙方彼此承諾收攏權利義務簽立契據', ex: 'The freelance visual artist signed a three-year exclusivity contract.' },
      { w: 'abstract', ipa: '/ˈæb.strækt/', pos: ['adj.', 'n.', 'v.'], zh: '抽象的；論文摘要；提煉抽取', tag: 'B2 / 學術留學', topic: 'animation', m: 'ab-(脫離具體現實) + tract(抽取概念) = 抽取精神本質脫離具體形體', ex: 'Modern abstract animators convey raw emotion through pure geometric dance.' }
    ]
  },

  // scrib / script 家族
  {
    rootId: 'r_scrib',
    words: [
      { w: 'transcript', ipa: '/ˈtræn.skrɪpt/', pos: ['n.'], zh: '成績單；逐字稿、聽打紀錄', tag: 'B1 / 留學求職', topic: 'cinema', m: 'trans-(轉換跨越) + script(文字記錄) = 將聲音對白轉換刻寫成文字記錄', ex: 'Official court reporters produce a verbatim transcript of legal hearings.' },
      { w: 'subscribe', ipa: '/səbˈskraɪb/', pos: ['v.'], zh: '訂閱、定期贊助；認同理念', tag: 'B1 / 網路生活', topic: 'sitcom', m: 'sub-(在底頁) + scribe(簽下名字) = 在契約文末簽名以定期資助收件', ex: 'Millions subscribe to streaming video channels for weekly animation releases.' },
      { w: 'describe', ipa: '/dɪˈskraɪb/', pos: ['v.'], zh: '描述、描繪描寫細節', tag: 'A2 / 基礎必備', topic: 'animation', m: 'de-(徹底) + scribe(書寫勾勒) = 用文字線條將事物面貌鉅細靡遺躍然紙上', ex: 'Witnesses described the unmasked fugitive as tall with an emerald tattoo.' },
      { w: 'prescribe', ipa: '/prɪˈskraɪb/', pos: ['v.'], zh: '開處方籤；明文規定約束', tag: 'B1 / 醫學法律', topic: 'sitcom', m: 'pre-(事先) + scribe(寫下字據) = 醫生事先寫下醫囑藥方命令患者服用', ex: 'The family physician prescribed a ten-day regimen of antiviral medicine.' },
      { w: 'manuscript', ipa: '/ˈmæn.jə.skrɪpt/', pos: ['n.'], zh: '手稿、原著底稿', tag: 'B2 / 出版文藝', topic: 'animation', m: 'manu(雙手) + script(書寫之稿本) = 作者親手一字一句繕寫出之原始稿件', ex: 'The author stored the only physical manuscript of her novel in a fireproof safe.' }
    ]
  },

  // cred 家族
  {
    rootId: 'r_cred',
    words: [
      { w: 'credit', ipa: '/ˈkred.ɪt/', pos: ['n.', 'v.'], zh: '信用、信譽；學分；記入貸方', tag: 'A2 / 基礎必備', topic: 'business', m: 'cred(相信) + -it = 贏得眾人信賴之信譽或金融授信', ex: 'Maintaining an unblemished credit history makes securing mortgages straightforward.' },
      { w: 'credible', ipa: '/ˈkred.ə.bəl/', pos: ['adj.'], zh: '可信的、真實可靠的', tag: 'B2 / 留學寫作', topic: 'business', m: 'cred(相信) + -ible(能) = 經得起事實推敲令人信服的', ex: 'Intelligence agencies verified the defector’s testimony with multiple credible sources.' },
      { w: 'incredible', ipa: '/ɪnˈkred.ə.bəl/', pos: ['adj.'], zh: '不可置信的、驚艷絕倫的', tag: 'A2 / 口語高頻', topic: 'animation', m: 'in-(無法) + cred(相信) + -ible = 誇張美妙到令人難以置信的', ex: 'The animator executed an incredible acrobatic aerial sequence with fluid physics.' },
      { w: 'credentials', ipa: '/krɪˈden.ʃəlz/', pos: ['n.'], zh: '資歷認證、資格憑證、證書', tag: 'B2 / 職場求職', topic: 'business', m: 'cred(信任憑證) + -ials = 足以證明具備專業資格之執照證照', ex: 'The cyber-forensics specialist presented impressive credentials before testifying in federal court.' }
    ]
  },

  // vert / vers 家族
  {
    rootId: 'r_vert',
    words: [
      { w: 'convert', ipa: '/kənˈvɜːt/', pos: ['v.', 'n.'], zh: '轉變、變換；皈依信仰者', tag: 'B1 / 科技工程', topic: 'sci-fi', m: 'con-(完全) + vert(轉向) = 徹底調轉方向更換為新形態', ex: 'Solar panels convert photovoltaic sunlight directly into clean electricity.' },
      { w: 'diverse', ipa: '/daɪˈvɜːs/', pos: ['adj.'], zh: '多元的、形形色色的、多樣化的', tag: 'B1 / 核心基礎', topic: 'animation', m: 'di-(朝各個方向) + verse(轉開) = 向四面八方奔馳呈現萬千形態', ex: 'The creative writing workshop welcomed students from highly diverse cultural backgrounds.' },
      { w: 'reverse', ipa: '/rɪˈvɜːs/', pos: ['v.', 'adj.', 'n.'], zh: '倒轉、反向逆轉；背面倒退', tag: 'B1 / 核心基礎', topic: 'sci-fi', m: 're-(向後) + verse(轉動) = 朝反方向逆向倒車倒退', ex: 'The supreme court ruled to reverse the controversial appellate decision.' },
      { w: 'subvert', ipa: '/səbˈvɜːt/', pos: ['v.'], zh: '顛覆破壞、推翻傳統政權', tag: 'C1 / 影視批評', topic: 'cinema', m: 'sub-(自底層) + vert(翻轉) = 從地底將整座大廈翻倒傾覆', ex: 'Modern satirists love to subvert conventional fairytale tropes with cynical humor.' },
      { w: 'adversary', ipa: '/ˈæd.və.sər.i/', pos: ['n.'], zh: '對手、敵手、競爭敵手', tag: 'B2 / 影視動漫', topic: 'animation', m: 'ad-(朝向迎面) + vers(轉身對峙) + -ary = 迎面立於對立面的死敵', ex: 'Batman faced his most unpredictable psychological adversary: the Joker.' }
    ]
  },

  // gress / grad 家族
  {
    rootId: 'r_gress',
    words: [
      { w: 'progress', ipa: '/ˈprəʊ.ɡres/', pos: ['n.', 'v.'], zh: '進步、邁進歷程；向前推展', tag: 'A2 / 核心必備', topic: 'animation', m: 'pro-(向前) + gress(邁步) = 步履堅定朝目標走去', ex: 'Consistent daily deliberate practice leads to monumental artistic progress.' },
      { w: 'gradual', ipa: '/ˈɡrædʒ.u.əl/', pos: ['adj.'], zh: '循序漸進的、緩慢平穩的', tag: 'B1 / 核心基礎', topic: 'business', m: 'grad(拾級而上) + -ual = 如爬樓梯般一階階緩緩攀登', ex: 'There has been a gradual but unmistakable decrease in fossil fuel dependency.' },
      { w: 'graduate', ipa: '/ˈɡrædʒ.u.eɪt/', pos: ['v.', 'n.'], zh: '畢業；晉級；大學畢業生', tag: 'A2 / 學業生活', topic: 'business', m: 'grad(步階跨越) + -ate = 跨越一個完整教育階梯進階成長', ex: 'She graduated summa cum laude with a dual degree in neuroscience and linguistics.' },
      { w: 'aggressive', ipa: '/əˈɡres.ɪv/', pos: ['adj.'], zh: '具攻擊性的；積極有闖勁的', tag: 'B2 / 商業心理', topic: 'cinema', m: 'ad-(衝向對手) + gress(邁步逼近) + -ive = 氣勢如虹大踏步壓制而來', ex: 'The aggressive tech unicorn disrupted traditional banking with zero-fee micro-loans.' }
    ]
  },

  // volu / volv 家族
  {
    rootId: 'r_volu',
    words: [
      { w: 'evolve', ipa: '/ɪˈvɒlv/', pos: ['v.'], zh: '演化、逐步發展進化', tag: 'B2 / 生物科技', topic: 'sci-fi', m: 'e-(向外開展) + volve(滾動翻展) = 如花捲層層向外舒展推進進化', ex: 'Deep sea crustaceans evolved bioluminescent lures to ambush prey in pitch darkness.' },
      { w: 'revolution', ipa: '/ˌrev.əˈluː.ʃən/', pos: ['n.'], zh: '革命翻天覆地的大變革；天體公轉', tag: 'B1 / 歷史科學', topic: 'cinema', m: 're-(徹底顛覆反轉) + volu(滾動巨輪) + -tion = 時代巨輪全盤翻轉顛覆舊體制', ex: 'The widespread adoption of generative neural networks ignited an industrial AI revolution.' },
      { w: 'involve', ipa: '/ɪnˈvɒlv/', pos: ['v.'], zh: '包含、牽涉牽連、使捲入其中', tag: 'B1 / 核心基礎', topic: 'sitcom', m: 'in-(朝內) + volve(包裹翻滾) = 把人事物一起捲進事件漩渦裡', ex: 'High-concept worldbuilding always involves intricate cultural anthropology.' },
      { w: 'revolve', ipa: '/rɪˈvɒlv/', pos: ['v.'], zh: '旋轉、環繞公轉、以...為中心核心', tag: 'B1 / 天文生活', topic: 'sci-fi', m: 're-(反覆循環) + volve(滾動轉向) = 圍繞同一個圓心反覆循環滾動旋繞', ex: 'The entire detective mystery revolves around a missing emerald heirloom pendant.' }
    ]
  },

  // gen 家族
  {
    rootId: 'r_gen',
    words: [
      { w: 'generate', ipa: '/ˈdʒen.ə.reɪt/', pos: ['v.'], zh: '產生、發電、激發生成', tag: 'B1 / 科技工程', topic: 'business', m: 'gen(誕生源起) + -ate = 激發催生出全新能量或資料', ex: 'Hydroelectric dams generate immense megawatt capacity from descending river currents.' },
      { w: 'generation', ipa: '/ˌdʒen.əˈreɪ.ʃən/', pos: ['n.'], zh: '世代輩分；產生生成', tag: 'A2 / 社會科技', topic: 'animation', m: 'generate + -ion = 繁衍誕生出的一代新人事物', ex: 'A new generation of indie animators is redefining digital hand-drawn storytelling.' },
      { w: 'generative', ipa: '/ˈdʒen.ər.ə.tɪv/', pos: ['adj.'], zh: '生成式的、具繁衍創生能力的', tag: 'B2 / 人工智能', topic: 'sci-fi', m: 'generate + -ive = 能夠自主推衍生成全新產物的', ex: 'Generative diffusion algorithms synthesize hyper-realistic cinematic keyframes.' },
      { w: 'genius', ipa: '/ˈdʒiː.ni.əs/', pos: ['n.'], zh: '天賦才華、絕世天才', tag: 'A2 / 人物稱頌', topic: 'animation', m: 'gen(與生俱來的天生稟賦) = 上天所賜超凡脫俗之天縱英才', ex: 'Mozart demonstrated dazzling musical genius before reaching adolescence.' },
      { w: 'gene', ipa: '/dʒiːn/', pos: ['n.'], zh: '基因、遺傳因數', tag: 'A2 / 生物科技', topic: 'sci-fi', m: 'gen(代代相傳之種) = 雕刻人體生長密碼之基本單位', ex: 'CRISPR technologies allow precise editing of mutated disease-carrying genes.' }
    ]
  },

  // bio 家族
  {
    rootId: 'r_bio',
    words: [
      { w: 'biology', ipa: '/baɪˈɒl.ə.dʒi/', pos: ['n.'], zh: '生物學、生命體機制', tag: 'A2 / 基礎科學', topic: 'sci-fi', m: 'bio(生命) + -ology(學門) = 探索生命運轉機制之自然科學', ex: 'Marine biology unveils complex symbiotic survival networks beneath oceanic trenches.' },
      { w: 'biological', ipa: '/ˌbaɪ.əˈlɒdʒ.ɪ.kəl/', pos: ['adj.'], zh: '生物學的、親生血緣的', tag: 'B1 / 核心常考', topic: 'sci-fi', m: 'biology + -al = 屬於大自然生命機制的', ex: 'Our biological circadian clock regulates natural sleep hormone cycles via sunlight.' },
      { w: 'biography', ipa: '/baɪˈɒɡ.rə.fi/', pos: ['n.'], zh: '傳記、個人生平史實', tag: 'B1 / 閱讀出版', topic: 'cinema', m: 'bio(生命人生) + graph(刻寫書寫) = 將一個人跌宕起伏的一生躍然紙上', ex: 'She spent seven painstaking years researching and writing the definitive biography.' },
      { w: 'antibiotic', ipa: '/ˌæn.ti.baɪˈɒt.ɪk/', pos: ['n.'], zh: '抗生素、消炎抗菌劑', tag: 'B2 / 醫學保健', topic: 'sci-fi', m: 'anti-(對抗殺滅) + bio(病菌生命) + -ic = 專門壓制殺死病原菌生命之良藥', ex: 'Excessive reliance on clinical antibiotics risks breeding drug-resistant superbug strains.' },
      { w: 'symbiosis', ipa: '/ˌsɪm.baɪˈəʊ.sɪs/', pos: ['n.'], zh: '共生關係、互利互惠合作', tag: 'C1 / 生態科幻', topic: 'sci-fi', m: 'sym-(共同) + bio(生命) + -sis = 兩種截然不同的生命相互依存共存榮枯', ex: 'Clownfish and sea anemones engage in a mutually beneficial marine symbiosis.' }
    ]
  }
]

// 3. 匯總所有詞根家族模組
const ALL_WORD_FAMILIES = [
  ...FAMILIES_PART1,
  ...EXTENDED_FAMILIES_PART2,
  ...EXTENDED_FAMILIES_PART3,
  ...EXTENDED_FAMILIES_PART4
]

// 統計並展開為全量單字庫
const ALL_WORDS = []
const seenWords = new Set()

for (const fam of ALL_WORD_FAMILIES) {
  for (const item of fam.words) {
    if (!seenWords.has(item.w)) {
      seenWords.add(item.w)
      ALL_WORDS.push({
        id: `w_${item.w}`,
        word: item.w,
        ipa: item.ipa,
        pos: item.pos,
        meanings: [item.zh],
        meaningsZh: [item.zh],
        rootIds: [fam.rootId],
        levelTag: item.tag,
        topic: item.topic,
        mnemonic: item.m,
        examples: [{ en: item.ex, zh: item.zh }]
      })
    }
  }
}

// 加入主題高頻詞庫
for (const item of HIGH_FREQUENCY_THEMATIC_WORDS) {
  if (!seenWords.has(item.w)) {
    seenWords.add(item.w)
    ALL_WORDS.push({
      id: `w_${item.w}`,
      word: item.w,
      ipa: item.ipa,
      pos: item.pos,
      meanings: [item.zh],
      meaningsZh: [item.zh],
      rootIds: [],
      levelTag: item.tag,
      topic: item.topic,
      mnemonic: item.m,
      examples: [{ en: item.ex, zh: item.zh }]
    })
  }
}

// 關聯各詞根的 cognateWordIds
for (const root of ROOTS_DATA) {
  root.cognateWordIds = ALL_WORDS.filter(w => w.rootIds.includes(root.id)).map(w => w.id)
}

console.log(`總詞根數: ${ROOTS_DATA.length}`)
console.log(`全量高質量去重單字總數: ${ALL_WORDS.length}`)

// 4. 輸出至 public/vocab/master-lexicon.json
const publicDir = path.resolve('public', 'vocab')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}
fs.writeFileSync(path.join(publicDir, 'master-lexicon.json'), JSON.stringify(ALL_WORDS, null, 2), 'utf8')

// 5. 輸出至 src/data/masterVocabData.ts
const tsContent = `// src/data/masterVocabData.ts
// 自動生成海量詞源單字庫與全量詞根擴充模組
import type { WordEntry, RootMorpheme } from '../types/lexiclip'

export const MASTER_VOCAB_WORDS: WordEntry[] = ${JSON.stringify(ALL_WORDS, null, 2)}

export const MASTER_VOCAB_ROOTS: RootMorpheme[] = ${JSON.stringify(ROOTS_DATA, null, 2)}
`

fs.writeFileSync(path.resolve('src', 'data', 'masterVocabData.ts'), tsContent, 'utf8')
console.log(`成功產出並覆蓋至 src/data/masterVocabData.ts 與 public/vocab/master-lexicon.json`)
