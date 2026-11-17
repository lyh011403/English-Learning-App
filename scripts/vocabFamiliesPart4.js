// scripts/vocabFamiliesPart4.js
// 擴充詞根家族數據庫 Part 4 (cord, corp, equ, fid, fort, grat, grav, sequ, sens, sed, tang, tort)

export const EXTENDED_FAMILIES_PART4 = [
  // 1. cord / card (心臟/心靈/核心)
  {
    rootId: 'r_cord',
    words: [
      { w: 'accord', ipa: '/əˈkɔːd/', pos: ['n.', 'v.'], zh: '協議公約；符合一致；給予', tag: 'B2 / 外交政治', topic: 'cinema', m: 'ad-(朝向) + cord(心意相通) = 兩國推心置腹達成和平協議', ex: 'Diplomats signed a landmark nuclear non-proliferation accord.' },
      { w: 'accordance', ipa: '/əˈkɔː.dəns/', pos: ['n.'], zh: '依照依據、符合一致', tag: 'B2 / 官方公文', topic: 'business', m: 'accord + -ance = 與既定法律條文心意契合', ex: 'Building construction must proceed in strict accordance with municipal safety codes.' },
      { w: 'discord', ipa: '/ˈdɪs.kɔːd/', pos: ['n.'], zh: '不和內鬨、意見分歧；不和諧音', tag: 'B2 / 音樂人際', topic: 'cinema', m: 'dis-(分歧) + cord(心意反目) = 各懷鬼胎引發同袍反目內鬨', ex: 'Political propaganda sows seeds of bitter ethnic and social discord.' },
      { w: 'cordial', ipa: '/ˈkɔː.di.əl/', pos: ['adj.'], zh: '熱情友善的、發自肺腑真誠的', tag: 'B2 / 社交禮節', topic: 'sitcom', m: 'cord(滿腔真心) + -ial = 發自內心熱切款待賓客的', ex: 'The host extended a cordial, warm greeting to foreign dignitaries.' },
      { w: 'courage', ipa: '/ˈkʌr.ɪdʒ/', pos: ['n.'], zh: '勇氣膽量、無畏氣魄', tag: 'A2 / 核心美德', topic: 'animation', m: 'cour(一顆滾燙的心) + -age = 哪怕雙腿發抖依然迎難而上的鋼鐵雄心', ex: 'It takes immense moral courage to stand up against injustice alone.' },
      { w: 'courageous', ipa: '/kəˈreɪ.dʒəs/', pos: ['adj.'], zh: '英勇無畏的、豪情壯志的', tag: 'B1 / 讚美褒獎', topic: 'animation', m: 'courage + -ous = 勇往直前視死如歸的', ex: 'The courageous firecrew rushed into the burning collapsed apartment to rescue trapped infants.' },
      { w: 'encourage', ipa: '/ɪnˈkʌr.ɪdʒ/', pos: ['v.'], zh: '鼓勵勉勵、激發信心', tag: 'A2 / 基礎必備', topic: 'sitcom', m: 'en-(注入) + courage(勇氣膽量) = 為失意之人注入無畏前進的信心', ex: 'Mentors actively encourage young animators to experiment with bold visual styles.' },
      { w: 'encouragement', ipa: '/ɪnˈkʌr.ɪdʒ.mənt/', pos: ['n.'], zh: '鼓勵勉勵、精神支柱', tag: 'B1 / 生活人際', topic: 'sitcom', m: 'encourage + -ment = 暖人肺腑的打氣關懷', ex: 'Her heartfelt words of encouragement restored my faith during creative burnout.' }
    ]
  },

  // 2. corp (肉體/軀體/實體機構)
  {
    rootId: 'r_corp',
    words: [
      { w: 'corporation', ipa: '/ˌkɔː.pərˈeɪ.ʃən/', pos: ['n.'], zh: '跨國大企業、法人實體機構', tag: 'B1 / 經貿商業', topic: 'business', m: 'corp(將眾人聚成單一法人肉體) + -ation = 龐大的商業集團組織', ex: 'Multinational technology corporations drive massive capital expenditure in AI clusters.' },
      { w: 'corporate', ipa: '/ˈkɔː.pər.ət/', pos: ['adj.'], zh: '企業的公司的；整體的共同的', tag: 'B1 / 職場商用', topic: 'business', m: 'corporation 的形容詞 = 屬於商業組織體系的', ex: 'Corporate governance reforms require independent outside directors on boards.' },
      { w: 'incorporate', ipa: '/ɪnˈkɔː.pər.eɪt/', pos: ['v.'], zh: '將...納入編入；登記成立法人', tag: 'B2 / 商業整合', topic: 'business', m: 'in-(朝內部注入) + corp(肉體) + -ate = 將新想法有機融入既有架構裡', ex: 'The updated design system incorporates fluid physics and variable typographic fonts.' },
      { w: 'incorporation', ipa: '/ɪnˌkɔː.pərˈeɪ.ʃən/', pos: ['n.'], zh: '納入整合；公司立案設立', tag: 'B2 / 法律商業', topic: 'business', m: 'incorporate + -ion = 完成商業登記或系統整併', ex: 'Articles of incorporation were filed with the state commerce department.' },
      { w: 'corpse', ipa: '/kɔːps/', pos: ['n.'], zh: '遺體、屍首', tag: 'B2 / 刑偵影視', topic: 'cinema', m: 'corp(失去靈魂的冰冷軀體) = 刑偵法醫解剖之證物', ex: 'Coroners examined the mysterious frozen corpse recovered from the alpine ravine.' }
    ]
  },

  // 3. equ (平等/平衡/相當)
  {
    rootId: 'r_equ',
    words: [
      { w: 'equal', ipa: '/ˈiː.kwəl/', pos: ['adj.', 'n.', 'v.'], zh: '平等的相等的；勢均力敵者；等同於', tag: 'A2 / 核心基礎', topic: 'sitcom', m: 'equ(天秤平水不偏不倚) = 權益分量全然相同的', ex: 'All citizens are born with equal inalienable democratic rights under law.' },
      { w: 'equality', ipa: '/iˈkwɒl.ə.ti/', pos: ['n.'], zh: '平等公義、均等機會', tag: 'B1 / 人權社會', topic: 'business', m: 'equal + -ity = 追求無歧視階級之天下為公', ex: 'Gender wage equality in executive leadership remains a pressing societal priority.' },
      { w: 'equation', ipa: '/ɪˈkweɪ.ʒən/', pos: ['n.'], zh: '方程式等式；錯綜複雜的局勢變數', tag: 'B1 / 數學科學', topic: 'sci-fi', m: 'equal + -tion = 等號兩端分毫不差之數學算式', ex: 'Einstein’s famous mass-energy equation unlocked the secrets of nuclear fission.' },
      { w: 'equity', ipa: '/ˈek.wɪ.ti/', pos: ['n.'], zh: '公平公正；公司股權股票淨值', tag: 'B2 / 金融商業', topic: 'business', m: 'equ(公正不偏) + -ity = 持有企業之核心股份資本', ex: 'Early startup software engineers received generous equity stock grants.' },
      { w: 'equivalent', ipa: '/ɪˈkwɪv.əl.ənt/', pos: ['adj.', 'n.'], zh: '等同等價的；等價對應物', tag: 'B2 / 學術比對', topic: 'business', m: 'equ(相當) + valent(價值價值觀) = 在分量與功效上完全平起平坐的', ex: 'Ten kilometers of daily cycling is equivalent to an hour of vigorous cardio.' },
      { w: 'equilibrium', ipa: '/ˌek.wɪˈlɪb.ri.əm/', pos: ['n.'], zh: '平衡狀態、均衡和諧', tag: 'C1 / 物理經濟', topic: 'sci-fi', m: 'equ(相等) + libri(天秤平衡) = 天秤兩端穩如泰山的分毫不差', ex: 'Thermodynamic equilibrium is reached when heat ceases flowing between systems.' }
    ]
  },

  // 4. fid (信仰/信任/忠誠)
  {
    rootId: 'r_fid',
    words: [
      { w: 'confident', ipa: '/ˈkɒn.fɪ.dənt/', pos: ['adj.'], zh: '充滿自信的；深信不疑的', tag: 'A2 / 人格特質', topic: 'sitcom', m: 'con-(完全) + fid(信賴) + -ent = 對自身實力深信不疑散發強大氣場的', ex: 'She walked onto the TED stage feeling calm, centered, and confident.' },
      { w: 'confidence', ipa: '/ˈkɒn.fɪ.dəns/', pos: ['n.'], zh: '自信自信心；信任感', tag: 'A2 / 心理美德', topic: 'business', m: 'confident + -ce = 戰勝恐懼昂首挺胸之力量泉源', ex: 'Mastering conversational English instills soaring confidence in international students.' },
      { w: 'confidential', ipa: '/ˌkɒn.fɪˈden.ʃəl/', pos: ['adj.'], zh: '機密保密的、不可外洩的', tag: 'B2 / 商業情報', topic: 'cinema', m: 'confidence(基於高度信任私相託付) + -ial = 絕不容許外洩之絕密公文', ex: 'Personnel performance reviews are strictly confidential internal documentation.' },
      { w: 'fidelity', ipa: '/fɪˈdel.ə.ti/', pos: ['n.'], zh: '忠誠忠心；高傳真音質 (Hi-Fi)', tag: 'B2 / 科技影視', topic: 'animation', m: 'fid(忠信實踐) + -ity = 忠於誓約，或音訊畫質原汁原味高傳真還原', ex: 'Audiophiles invest in lossless high-fidelity magnetic planar headphones.' }
    ]
  },

  // 5. fort (強壯/堡壘/勇氣)
  {
    rootId: 'r_fort',
    words: [
      { w: 'fortress', ipa: '/ˈfɔː.trəs/', pos: ['n.'], zh: '鋼鐵堡壘、固若金湯的要塞', tag: 'B1 / 影視動漫', topic: 'cinema', m: 'fort(堅不可摧) + -ress = 抵擋萬馬奔騰狂攻之防禦巨城', ex: 'The medieval mountain fortress withstood catapult barrages for six months.' },
      { w: 'fortify', ipa: '/ˈfɔː.tɪ.faɪ/', pos: ['v.'], zh: '築堡加固；強化體魄補給營養', tag: 'B2 / 軍事健康', topic: 'sci-fi', m: 'fort(強壯) + -ify(使動) = 築高城牆厚植防線，或補充維生素強化抗體', ex: 'Breakfast oat cereals are frequently fortified with essential dietary iron.' },
      { w: 'fortitude', ipa: '/ˈfɔː.tɪ.tʃuːd/', pos: ['n.'], zh: '剛毅堅忍、臨危不亂的氣魄', tag: 'C1 / 英雄品德', topic: 'animation', m: 'fort(剛強如鐵) + -itude = 面對滔天苦難泰山崩於前色不變之氣度', ex: 'The survivors demonstrated extraordinary spiritual fortitude in the bitter arctic wastes.' },
      { w: 'effort', ipa: '/ˈef.ət/', pos: ['n.'], zh: '努力辛勞、全力以赴的付出', tag: 'A2 / 基礎必備', topic: 'sitcom', m: 'ex-(迸發出) + fort(渾身力氣) = 將全身力量百分百釋放揮灑而出', ex: 'Flawless artistic mastery is born of sustained daily creative effort.' },
      { w: 'effortless', ipa: '/ˈef.ət.ləs/', pos: ['adj.'], zh: '毫不費力的、輕巧流暢遊刃有餘的', tag: 'B2 / 讚美誇獎', topic: 'animation', m: 'effort + -less = 台下苦練十年台上舉重若輕宛如毫不費力的', ex: 'The master swordsman dispatched the attacking bandits with effortless grace.' },
      { w: 'comfort', ipa: '/ˈkʌm.fət/', pos: ['n.', 'v.'], zh: '舒適安逸；安慰撫慰心靈', tag: 'A2 / 生活核心', topic: 'sitcom', m: 'con-(完全) + fort(賦予力量) = 在人失意軟弱時陪伴身旁重新給予前進力量', ex: 'Hot herbal chamomile tea offers soothing comfort after an exhausting workday.' },
      { w: 'comfortable', ipa: '/ˈkʌm.fə.tə.bəl/', pos: ['adj.'], zh: '舒適自在的、稱心舒坦的', tag: 'A1 / 必備生活', topic: 'sitcom', m: 'comfort + -able = 讓人身心彻底放鬆毫無拘束壓力的', ex: 'Ergonomic mesh chairs keep coders comfortable through multi-hour debugging sprints.' },
      { w: 'reinforce', ipa: '/ˌriː.ɪnˈfɔːs/', pos: ['v.'], zh: '強化加固防禦；增援軍隊', tag: 'B2 / 工程軍事', topic: 'business', m: 're-(再次) + in-(注入) + force(剛強力量) = 增添鋼筋水泥或兵力讓防線堅不可摧', ex: 'Engineers reinforced the subterranean concrete pillars to withstand seismic shockwaves.' }
    ]
  },

  // 6. grat (感恩/愉悅/恩惠)
  {
    rootId: 'r_grat',
    words: [
      { w: 'grateful', ipa: '/ˈɡreɪt.fəl/', pos: ['adj.'], zh: '心懷感激的、感恩戴德的', tag: 'A2 / 生活禮儀', topic: 'sitcom', m: 'grat(令人愉悅之恩德) + -ful = 滿懷感激銘記他人援手的', ex: 'I am profoundly grateful for your generous guidance throughout my apprenticeship.' },
      { w: 'gratitude', ipa: '/ˈɡræt.ɪ.tʃuːd/', pos: ['n.'], zh: '感激之情、感恩之心', tag: 'B1 / 核心美德', topic: 'animation', m: 'grat + -itude = 人性中最為溫暖純淨之感恩美德', ex: 'Keeping a daily gratitude journal cultivates inner tranquility and joy.' },
      { w: 'congratulate', ipa: '/kənˈɡrætʃ.ə.leɪt/', pos: ['v.'], zh: '恭賀祝賀、道喜', tag: 'A2 / 社交必備', topic: 'sitcom', m: 'con-(聚合) + grat(同喜同樂) + -ate = 眾人一同拍手為對方的重大成就歡呼', ex: 'Friends gathered to congratulate the animator on winning the golden festival trophy.' },
      { w: 'congratulation', ipa: '/kənˌɡrætʃ.əˈleɪ.ʃən/', pos: ['n.'], zh: '祝賀賀詞、恭喜', tag: 'A2 / 生活慶典', topic: 'sitcom', m: 'congratulate + -ion = 獻給成功勇士的熱情掌聲與祝賀', ex: 'Warm congratulations poured in from alumni studios across the continent.' },
      { w: 'gratify', ipa: '/ˈɡræt.ɪ.faɪ/', pos: ['v.'], zh: '使心滿意足、撫慰快慰', tag: 'C1 / 心理滿足', topic: 'business', m: 'grat + -ify(使動) = 讓長久以來的渴望獲得圓滿回報與快慰', ex: 'It is deeply gratifying to see students surpass their teacher in artistic technique.' },
      { w: 'grace', ipa: '/ɡreɪs/', pos: ['n.'], zh: '優雅氣質；恩典寬恕', tag: 'B1 / 讚美文雅', topic: 'animation', m: 'grat(令人由衷喜愛之美) = 舉手投足宛如天鵝漫步的優美風範', ex: 'The ballerina leaped across the spotlight with breathtaking ethereal grace.' },
      { w: 'gracious', ipa: '/ˈɡreɪ.ʃəs/', pos: ['adj.'], zh: '慈祥和藹的；優雅大度的', tag: 'B2 / 風範美德', topic: 'sitcom', m: 'grace + -ious = 待人接物溫良恭儉謙遜有禮的', ex: 'The veteran champion was exceptionally gracious in defeat, praising his young rival.' }
    ]
  },

  // 7. grav (沉重/重力/莊嚴)
  {
    rootId: 'r_grav',
    words: [
      { w: 'gravity', ipa: '/ˈɡræv.ə.ti/', pos: ['n.'], zh: '萬有引力重力；事態極度嚴重性', tag: 'B1 / 物理科幻', topic: 'sci-fi', m: 'grav(沉甸甸的分量) + -ity = 將群星吸聚牽引之宇宙法則，或大禍臨頭之分量', ex: 'The astronaut floated weightlessly outside the station in micro-gravity.' },
      { w: 'gravitational', ipa: '/ˌɡræv.ɪˈteɪ.ʃən.əl/', pos: ['adj.'], zh: '重力的、萬有引力的', tag: 'B2 / 天文物理', topic: 'sci-fi', m: 'gravity + -al = 屬於空間幾何彎曲重力場域的', ex: 'Laser interferometers detected ripples in spacetime caused by gravitational waves.' },
      { w: 'grave', ipa: '/ɡreɪv/', pos: ['n.', 'adj.'], zh: '墳墓墓穴；嚴肅凝重的、危急重大的', tag: 'B1 / 描繪修辭', topic: 'cinema', m: 'grav(萬分沉重之大事) = 安息之地，或局勢兇險面露極其凝重之色', ex: 'The prime minister addressed the nation with an exceptionally grave expression.' },
      { w: 'aggravate', ipa: '/ˈæɡ.rə.veɪt/', pos: ['v.'], zh: '使病情惡化加重；惹惱火上澆油', tag: 'B2 / 醫學心理', topic: 'sitcom', m: 'ad-(朝向) + grav(沉重) + -ate = 雪上加霜讓本就糟糕的傷口或局勢更為沉重', ex: 'Running long marathon distances will aggravate pre-existing cartilage knee strain.' },
      { w: 'grief', ipa: '/ɡriːf/', pos: ['n.'], zh: '悲慟哀痛、撕心裂肺之悲傷', tag: 'B2 / 情感宣洩', topic: 'cinema', m: 'grav(壓在心頭沉甸甸的大石) = 痛失至親至愛令人喘不過氣的至痛', ex: 'Therapy groups provide a supportive refuge for those processing profound sudden grief.' }
    ]
  },

  // 8. sequ / secut (跟隨/序列/後續)
  {
    rootId: 'r_sequ',
    words: [
      { w: 'sequence', ipa: '/ˈsiː.kwəns/', pos: ['n.'], zh: '連續順序、序列；電影關鍵段落', tag: 'B1 / 程式影視', topic: 'animation', m: 'sequ(緊緊跟隨) + -ence = 環環相扣按時序推進的影視高潮片段', ex: 'The animated film’s opening flight sequence took six months of painstaking 3D layout.' },
      { w: 'sequential', ipa: '/sɪˈkwen.ʃəl/', pos: ['adj.'], zh: '循序相連的、依序排列的', tag: 'B2 / 程式工程', topic: 'business', m: 'sequence + -ial = 遵循特定順序一個接著一個執行的', ex: 'Storyboards are sequential illustrated panels visualizing narrative drama.' },
      { w: 'consequence', ipa: '/ˈkɒn.sɪ.kwəns/', pos: ['n.'], zh: '後果結果；重要性重大影響', tag: 'B1 / 核心基礎', topic: 'cinema', m: 'con-(聚合) + sequ(隨之而來) + -ence = 種下因緣之後必然隨之降臨的後果', ex: 'Careless cybersecurity oversights can trigger ruinous financial consequences.' },
      { w: 'consequently', ipa: '/ˈkɒn.sɪ.kwənt.li/', pos: ['adv.'], zh: '因此所以、結果必然地', tag: 'B2 / 寫作邏輯', topic: 'business', m: 'consequence + -ly = 遵循因果水到渠成地', ex: 'The prototype failed extreme thermal stress tests; consequently, the launch was scrubbed.' },
      { w: 'subsequent', ipa: '/ˈsʌb.sɪ.kwənt/', pos: ['adj.'], zh: '隨後的、接踵而來的後續的', tag: 'B2 / 學術論文', topic: 'business', m: 'sub-(緊貼在後) + sequ(跟上) + -ent = 緊接著上一事件發生接踵而至的', ex: 'Subsequent archaeological excavations uncovered the lost Roman aqueduct foundation.' },
      { w: 'execute', ipa: '/ˈek.sɪ.kjuːt/', pos: ['v.'], zh: '執行實施指令；處決死刑', tag: 'B1 / 科技法律', topic: 'business', m: 'ex-(貫徹到底) + secut(跟隨到底) = 將規劃方針不折不扣貫徹落實執行到底', ex: 'The software processor can execute billions of floating-point operations per millisecond.' },
      { w: 'execution', ipa: '/ˌek.sɪˈkjuː.ʃən/', pos: ['n.'], zh: '執行力完成度；處死死刑', tag: 'B2 / 商業專案', topic: 'business', m: 'execute + -ion = 將天馬行空的想法化為完美現實的精準執行', ex: 'Great cinematic concepts are worthless without relentless and disciplined execution.' },
      { w: 'executive', ipa: '/ɪɡˈzek.jə.tɪv/', pos: ['n.', 'adj.'], zh: '高階主管決策者；行政決策的', tag: 'B1 / 職場商務', topic: 'business', m: 'execute + -ive = 掌舵企業引領大軍前進之高層統帥', ex: 'The chief executive officer delivered an ambitious five-year green roadmap.' },
      { w: 'prosecute', ipa: '/ˈprɒs.ɪ.kjuːt/', pos: ['v.'], zh: '起訴告發、追訴犯罪', tag: 'B2 / 刑偵法律', topic: 'cinema', m: 'pro-(向前追查到底) + secut(窮追不捨) = 檢察官將不法之徒追查到底送上法庭', ex: 'Federal prosecutors filed charges against the insider trading conspiracy.' }
    ]
  },

  // 9. sens / sent (感覺/感知/思維)
  {
    rootId: 'r_sens',
    words: [
      { w: 'sense', ipa: '/sens/', pos: ['n.', 'v.'], zh: '感官感知；情理理智；察覺意識到', tag: 'A2 / 核心核心', topic: 'sitcom', m: 'sens(五官感受) = 觸碰世界之敏銳雷達，或合情合理的常識', ex: 'Dogs possess an uncanny sense of smell twenty thousand times sharper than ours.' },
      { w: 'sensible', ipa: '/ˈsen.sə.bəl/', pos: ['adj.'], zh: '明智理性的、合情合理的', tag: 'B1 / 人格智慧', topic: 'sitcom', m: 'sense + -ible = 腳踏實地不感情用事懂得權衡利弊的', ex: 'Packing a warm waterproof thermal parka is a sensible precaution in Scotland.' },
      { w: 'sensitive', ipa: '/ˈsen.sɪ.tɪv/', pos: ['adj.'], zh: '敏感細膩的；靈敏的；機密的', tag: 'B1 / 性格科技', topic: 'animation', m: 'sense + -itive = 內心情感極其細膩或感應器靈敏度極高的', ex: 'Infrared satellite sensors are sensitive enough to detect campfires from orbit.' },
      { w: 'sensitivity', ipa: '/ˌsen.sɪˈtɪv.ə.ti/', pos: ['n.'], zh: '敏銳度、靈敏度；同理感受力', tag: 'B2 / 儀器心理', topic: 'animation', m: 'sensitive + -ity = 能捕捉微小波瀾之極致敏銳', ex: 'Concept storyboard artists display extraordinary psychological sensitivity to character emotion.' },
      { w: 'sensor', ipa: '/ˈsen.sər/', pos: ['n.'], zh: '感應器、傳感器探頭', tag: 'A2 / 科技生活', topic: 'sci-fi', m: 'sense + -or = 專門感知光熱震動之高科技元件', ex: 'Autonomous driving vehicles rely on LiDAR, radar, and optical camera sensors.' },
      { w: 'sentiment', ipa: '/ˈsen.tɪ.mənt/', pos: ['n.'], zh: '情懷情緒；觀點態度；多愁善感', tag: 'B2 / 心理經貿', topic: 'cinema', m: 'sent(內心感觸) + -ment = 縈繞於胸膛的真摯情懷或市場群眾心態', ex: 'Consumer sentiment surged following announcements of lowered interest rates.' },
      { w: 'consent', ipa: '/kənˈsent/', pos: ['v.', 'n.'], zh: '同意贊同；首肯准許', tag: 'B2 / 法律道德', topic: 'sitcom', m: 'con-(心意相合) + sent(感覺) = 雙方心意完全對齊欣然點頭答應', ex: 'Medical surgical protocols mandate explicit, informed written patient consent.' },
      { w: 'dissent', ipa: '/dɪˈsent/', pos: ['n.', 'v.'], zh: '異議反對、持不同政見', tag: 'C1 / 民主法律', topic: 'cinema', m: 'dis-(分開不同) + sent(感覺) = 勇於對主流盲從說不的良知異議', ex: 'In a famous judicial dissent, the supreme court justice defended digital whistleblowers.' },
      { w: 'consensus', ipa: '/kənˈsen.səs/', pos: ['n.'], zh: '共識一致意見、全體合意', tag: 'B2 / 團隊決策', topic: 'business', m: 'con-(聚合) + sens(共同感受) + -us = 全體團隊共同敲定認可的共識', ex: 'The engineering team reached a consensus on adopting TypeScript for type safety.' }
    ]
  },

  // 10. sed / sid / sess (坐落/安頓/會議)
  {
    rootId: 'r_sed',
    words: [
      { w: 'session', ipa: '/ˈseʃ.ən/', pos: ['n.'], zh: '會議課節；訓練時段；錄音排練期', tag: 'A2 / 職場學習', topic: 'business', m: 'sess(圍坐討論) + -ion = 眾人坐在一起專注推展特定專題之時段', ex: 'The animators scheduled a two-hour brainstorming session to flesh out Act II.' },
      { w: 'obsess', ipa: '/əbˈses/', pos: ['v.'], zh: '著迷迷戀、朝思暮想執迷不悟', tag: 'B2 / 心理生活', topic: 'animation', m: 'ob-(在心頭盤踞) + sess(死坐不走) = 某種熱情或執念如盤踞心頭揮之不去', ex: 'Perfectionist directors obsess over subtle lighting gradients in every keyframe.' },
      { w: 'obsession', ipa: '/əbˈseʃ.ən/', pos: ['n.'], zh: '執念著魔；難以自拔的狂熱', tag: 'B2 / 心理描寫', topic: 'cinema', m: 'obsess + -ion = 燃燒靈魂深處的狂熱執念', ex: 'His lifelong obsession with clockwork automatons inspired his award-winning steampunk animation.' },
      { w: 'possess', ipa: '/pəˈzes/', pos: ['v.'], zh: '擁有具備；靈魂附體控制', tag: 'B1 / 核心基礎', topic: 'cinema', m: 'potis(有能力的君王) + sess(坐擁江山) = 穩坐寶座將寶物盡數納入囊中', ex: 'Great character animators possess an extraordinary intuition for comedic pantomime.' },
      { w: 'possession', ipa: '/pəˈzeʃ.ən/', pos: ['n.'], zh: '所有物財產；擁有佔有', tag: 'B1 / 生活常考', topic: 'cinema', m: 'possess + -ion = 個人珍視之財物或佔有狀態', ex: 'The wandering knight carried all his worldly possessions in a single leather rucksack.' },
      { w: 'assess', ipa: '/əˈses/', pos: ['v.'], zh: '評估估算、審查鑑定價值', tag: 'B2 / 職場商務', topic: 'business', m: 'ad-(靠近身旁) + sess(坐下審定) = 坐在官員身邊嚴格評鑑資產價值', ex: 'Insurance claims adjusters assessed structural flood damage to the coastal warehouse.' },
      { w: 'assessment', ipa: '/əˈses.mənt/', pos: ['n.'], zh: '評估報告、審定鑑定結論', tag: 'B2 / 職場必備', topic: 'business', m: 'assess + -ment = 嚴謹客觀的綜合評審分析報告', ex: 'The risk assessment recommended doubling thermal cooling redundancy in data racks.' },
      { w: 'president', ipa: '/ˈprez.ɪ.dənt/', pos: ['n.'], zh: '總統國家元首；大學校長；企業總裁', tag: 'A2 / 政治職場', topic: 'business', m: 'pre-(在最前列) + sid(端坐引領) + -ent = 端坐在眾人最前方執掌權杖者', ex: 'The university president greeted the incoming freshman class in the quadrangle.' },
      { w: 'subside', ipa: '/səbˈsaɪd/', pos: ['v.'], zh: '平息消退、下沉平靜下來', tag: 'C1 / 自然氣象', topic: 'cinema', m: 'sub-(沉向底層) + side(坐下平伏) = 滔天巨浪或狂暴風雨逐漸平息回歸寧靜', ex: 'Wait until the raging river floodwaters subside before crossing the wooden trestle.' }
    ]
  },

  // 11. tang / tact (觸摸/接觸/感知)
  {
    rootId: 'r_tang',
    words: [
      { w: 'contact', ipa: '/ˈkɒn.tækt/', pos: ['n.', 'v.'], zh: '聯繫聯絡；接觸交往；隱形眼鏡', tag: 'A2 / 基礎必備', topic: 'sitcom', m: 'con-(聚合) + tact(觸碰指針) = 彼此伸出手觸摸連繫心意', ex: 'Emergency coordinators lost radio contact with the polar survey vessel.' },
      { w: 'intact', ipa: '/ɪnˈtækt/', pos: ['adj.'], zh: '完好無損的、完整無缺毫髮無傷的', tag: 'B2 / 歷史考古', topic: 'sci-fi', m: 'in-(未曾) + tact(被觸碰破壞) = 歷經萬難依然完完整整沒有絲毫破損', ex: 'Amazingly, the fragile porcelain vase remained entirely intact after the earthquake.' },
      { w: 'tangible', ipa: '/ˈtæn.dʒə.bəl/', pos: ['adj.'], zh: '實質看得見摸得著的、有形的', tag: 'B2 / 商業留學', topic: 'business', m: 'tang(觸碰) + -ible = 雙手能夠真實觸摸感受到非空洞口號的', ex: 'Investing in agile team tooling produced tangible productivity dividends within months.' },
      { w: 'intangible', ipa: '/ɪnˈtæn.dʒə.bəl/', pos: ['adj.'], zh: '無形的摸不到的 (資產、品牌價值)', tag: 'C1 / 商業經貿', topic: 'business', m: 'in-(不) + tangible = 雖不可捉摸但價值千金的商譽與文化', ex: 'Brand equity and customer loyalty are powerful intangible enterprise assets.' }
    ]
  },

  // 12. tort (扭轉/曲解/折磨)
  {
    rootId: 'r_tort',
    words: [
      { w: 'torture', ipa: '/ˈtɔː.tʃər/', pos: ['n.', 'v.'], zh: '酷刑拷問；令人受盡折磨之苦痛', tag: 'B2 / 刑偵影視', topic: 'cinema', m: 'tort(扭絞撕扯) + -ure = 如絞肉機般撕心裂肺之折磨痛苦', ex: 'Watching a painfully slow, unedited three-hour rough cut was pure creative torture.' },
      { w: 'distort', ipa: '/dɪˈstɔːt/', pos: ['v.'], zh: '扭曲變形；曲解捏造事實', tag: 'B2 / 科技影視', topic: 'cinema', m: 'dis-(朝各方撕扯) + tort(扭轉) = 將原汁原味的真相惡意扭曲編造', ex: 'Fish-eye wide lenses distort straight architectural lines into exaggerated circular curves.' },
      { w: 'distortion', ipa: '/dɪˈstɔː.ʃən/', pos: ['n.'], zh: '扭曲失真；音訊破音破壞失真效果器', tag: 'B2 / 音樂聲學', topic: 'animation', m: 'distort + -ion = 電吉他狂放嘶吼之破音失真音色', ex: 'Heavy metal rock guitar relies on warm vacuum tube harmonic distortion.' }
    ]
  }
]
