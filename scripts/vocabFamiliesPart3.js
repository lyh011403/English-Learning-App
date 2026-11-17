// scripts/vocabFamiliesPart3.js
// 擴充詞根家族數據庫 Part 3 (leg, liber, magn, mem, mort, nom, oper, psych, sci, spir, term, vac, cord, corp, equ, fid, fort, grat, grav, sequ, sens, sed, tang, tort)

export const EXTENDED_FAMILIES_PART3 = [
  // 1. leg / lect (挑選/閱讀/法規)
  {
    rootId: 'r_leg',
    words: [
      { w: 'collect', ipa: '/kəˈlekt/', pos: ['v.'], zh: '收集蒐集；聚集匯集', tag: 'A2 / 基礎必備', topic: 'sitcom', m: 'con-(聚合) + lect(挑選拾起) = 挑選心儀之物彙整於一處', ex: 'He collects vintage first-edition Japanese anime cels and production sketches.' },
      { w: 'collection', ipa: '/kəˈlek.ʃən/', pos: ['n.'], zh: '收藏品系列；募捐收集', tag: 'A2 / 基礎生活', topic: 'animation', m: 'collect + -ion = 傾注心力蒐羅而成之珍藏', ex: 'The art museum unveiled its priceless collection of impressionist oils.' },
      { w: 'collective', ipa: '/kəˈlek.tɪv/', pos: ['adj.', 'n.'], zh: '集體的共同的；集合團體', tag: 'B2 / 社會學術', topic: 'business', m: 'collect + -ive = 眾志成城凝聚全體智慧力量的', ex: 'Tackling global warming requires coordinated international collective action.' },
      { w: 'elect', ipa: '/iˈlekt/', pos: ['v.', 'adj.'], zh: '選舉選出；當選的', tag: 'A2 / 政治社會', topic: 'cinema', m: 'e-(從中挑出) + lect(挑選) = 萬中選一公推代表國家人民', ex: 'Citizens cast their democratic ballots to elect parliament representatives.' },
      { w: 'election', ipa: '/iˈlek.ʃən/', pos: ['n.'], zh: '選舉、大選投票', tag: 'A2 / 政治生活', topic: 'cinema', m: 'elect + -ion = 投票選賢與能之大典', ex: 'The presidential election debates dominated prime-time television ratings.' },
      { w: 'select', ipa: '/sɪˈlekt/', pos: ['v.', 'adj.'], zh: '挑選選拔；嚴選精挑細選的', tag: 'A2 / 核心基礎', topic: 'business', m: 'se-(獨立劃分) + lect(挑選) = 經層層嚴選脫穎而出的', ex: 'The animation director personally selected the background palette artists.' },
      { w: 'selection', ipa: '/sɪˈlek.ʃən/', pos: ['n.'], zh: '選品精選、挑選抉擇', tag: 'B1 / 生活商務', topic: 'business', m: 'select + -ion = 萬里挑一精選出之品項', ex: 'The specialty boutique carries a curated selection of artisanal teas.' },
      { w: 'selective', ipa: '/sɪˈlek.tɪv/', pos: ['adj.'], zh: '選擇性的、挑剔嚴格的', tag: 'B2 / 留學評量', topic: 'business', m: 'select + -ive = 門檻極高挑三揀四極為嚴格的', ex: 'Ivy League graduate physics programs are exceptionally selective in admissions.' },
      { w: 'lecture', ipa: '/ˈlek.tʃər/', pos: ['n.', 'v.'], zh: '演講專題講座；說教訓誡', tag: 'A2 / 校園學術', topic: 'business', m: 'lect(宣讀手稿) + -ure = 教授在講台宣讀學問啟迪後進', ex: 'The distinguished physicist delivered a guest lecture on quantum entanglement.' },
      { w: 'legend', ipa: '/ˈledʒ.ənd/', pos: ['n.'], zh: '傳奇傳說；地圖圖例說明', tag: 'A2 / 影視動漫', topic: 'animation', m: 'leg(值得千古誦讀之事) + -end = 世代口耳相傳的不朽神話', ex: 'King Arthur and his Knights of the Round Table form an immortal legend.' },
      { w: 'legendary', ipa: '/ˈledʒ.ən.dri/', pos: ['adj.'], zh: '傳奇的、名垂青史的', tag: 'B1 / 英雄誇讚', topic: 'animation', m: 'legend + -ary = 威名赫赫如同神話般震爍古今的', ex: 'The legendary swordsman deflected hundred incoming arrows with fluid grace.' },
      { w: 'intellect', ipa: '/ˈɪn.təl.ekt/', pos: ['n.'], zh: '智力才智、智慧大腦', tag: 'B2 / 心理學術', topic: 'sci-fi', m: 'inter-(事物之間) + lect(看出條理挑選) = 能洞穿事物本質的卓越思辨智商', ex: 'Albert Einstein possessed an unmatched mathematical and philosophical intellect.' },
      { w: 'intellectual', ipa: '/ˌɪn.təlˈek.tʃu.əl/', pos: ['adj.', 'n.'], zh: '智力的腦力的；知識分子學者', tag: 'B2 / 文化學界', topic: 'business', m: 'intellect + -ual = 沉浸在學術思辨與真理探索中的', ex: 'Protecting intellectual property rights fosters worldwide software innovation.' },
      { w: 'intelligence', ipa: '/ɪnˈtel.ɪ.dʒəns/', pos: ['n.'], zh: '智慧聰慧；機密情報情資', tag: 'A2 / 科技軍事', topic: 'sci-fi', m: 'intellect + -ence = 靈巧解決複雜問題之能力或國家機密情資', ex: 'Defense satellite reconnaissance provides real-time military tactical intelligence.' },
      { w: 'intelligent', ipa: '/ɪnˈtel.ɪ.dʒənt/', pos: ['adj.'], zh: '聰穎的智慧的；具自主運算能力的', tag: 'A2 / 科技生活', topic: 'sci-fi', m: 'intelligence 的形容詞 = 具備邏輯推理分析本領的', ex: 'Dolphins and orcas are profoundly intelligent marine mammals with dialect songs.' },
      { w: 'neglect', ipa: '/nɪˈɡlekt/', pos: ['v.', 'n.'], zh: '疏忽忽視、荒廢未予理會', tag: 'B2 / 生活警示', topic: 'sitcom', m: 'neg-(未曾) + lect(挑選照料) = 扔在一旁不聞不問任其荒蕪', ex: 'Do not neglect regular postural stretching when working long sedentary shifts.' },
      { w: 'diligent', ipa: '/ˈdɪl.ɪ.dʒənt/', pos: ['adj.'], zh: '勤勉勤奮的、兢兢業業的', tag: 'B1 / 美德性格', topic: 'animation', m: 'di-(朝向熱愛) + lig(挑選投入) + -ent = 懷抱熱忱孜孜不倦全神貫注的', ex: 'Thanks to diligent proofreading, the final printed manuscript contained zero typographical errata.' },
      { w: 'legal', ipa: '/ˈliː.ɡəl/', pos: ['adj.'], zh: '法律的合法的、法定正當的', tag: 'A2 / 法律生活', topic: 'business', m: 'leg(法規) + -al = 經由成文法典白紙黑字保障許可的', ex: 'Consult licensed corporate legal counsel before executing overseas acquisition mergers.' },
      { w: 'delegate', ipa: '/ˈdel.ɪ.ɡeɪt/', pos: ['v.', 'n.'], zh: '委派授權下放；正式代表團員', tag: 'B2 / 職場管理', topic: 'business', m: 'de-(下放) + leg(法規任命) + -ate = 將權力正式指派下放給得力幹將', ex: 'Effective founders learn to delegate routine operational logistics to capable department leads.' }
    ]
  },

  // 2. liber (自由/釋放)
  {
    rootId: 'r_liber',
    words: [
      { w: 'liberty', ipa: '/ˈlɪb.ə.ti/', pos: ['n.'], zh: '自由自由權；自由女神像', tag: 'B1 / 政治哲學', topic: 'cinema', m: 'liber(自由) + -ty = 掙脫枷鎖無拘無束享有天賦人權之境界', ex: 'The French Revolution proclaimed the immortal rallying cry: Liberty, Equality, Fraternity.' },
      { w: 'liberate', ipa: '/ˈlɪb.ər.eɪt/', pos: ['v.'], zh: '解放釋放、擺脫奴役禁錮', tag: 'B2 / 歷史影視', topic: 'cinema', m: 'liber + -ate = 砸爛鎖鏈引領囚徒重見天日', ex: 'Allied armoured divisions pushed through Normandy to liberate occupied French villages.' },
      { w: 'liberation', ipa: '/ˌlɪb.ərˈeɪ.ʃən/', pos: ['n.'], zh: '解放運動、重獲自由', tag: 'B2 / 歷史人文', topic: 'cinema', m: 'liberate + -ion = 擺脫壓迫重獲新生之偉大時刻', ex: 'The national museum preserves photographic archives commemorating the capital’s liberation.' },
      { w: 'liberal', ipa: '/ˈlɪb.ər.əl/', pos: ['adj.'], zh: '思想開明的；寬宏大度的；博雅人文的', tag: 'B2 / 政治教育', topic: 'business', m: 'liber + -al = 不受教條束縛海納百川的', ex: 'Liberal arts curriculums cultivate critical thinking and empathetic philosophical inquiry.' },
      { w: 'deliver', ipa: '/dɪˈlɪv.ər/', pos: ['v.'], zh: '遞送送達；發表精彩演說；接生接引', tag: 'A2 / 基礎必備', topic: 'business', m: 'de-(完全) + liver(釋放交出) = 將貨品或承諾百分之百送達對方手中', ex: 'Electric cargo vans deliver parcel packages silently through congested suburban avenues.' },
      { w: 'delivery', ipa: '/dɪˈlɪv.ər.i/', pos: ['n.'], zh: '外送外賣；演講語氣節奏；分娩', tag: 'A2 / 生活常考', topic: 'sitcom', m: 'deliver + -y = 包裹送貨到府或脫口秀演出之語速節奏掌控', ex: 'The stand-up comic’s deadpan delivery had the audience roaring with helpless laughter.' }
    ]
  },

  // 3. magn (宏大/非凡)
  {
    rootId: 'r_magn',
    words: [
      { w: 'magnificent', ipa: '/mæɡˈnɪf.ɪ.sənt/', pos: ['adj.'], zh: '壯麗宏偉的、無與倫比極其華美的', tag: 'B1 / 讚美誇獎', topic: 'animation', m: 'magn(宏大) + fic(製造呈現) + -ent = 氣勢恢弘令人嘆為觀止的', ex: 'The animated palace was rendered with magnificent stained glass and towering gold spires.' },
      { w: 'magnificence', ipa: '/mæɡˈnɪf.ɪ.səns/', pos: ['n.'], zh: '壯麗宏偉、奢華氣派', tag: 'B2 / 藝術文雅', topic: 'cinema', m: 'magnificent + -ce = 震懾全場之非凡氣魄', ex: 'Tourists gasped in awe at the sheer architectural magnificence of the cathedral.' },
      { w: 'magnify', ipa: '/ˈmæɡ.nɪ.faɪ/', pos: ['v.'], zh: '放大光學放大；誇大加深問題', tag: 'B2 / 光學心理', topic: 'sci-fi', m: 'magn(變大) + -ify(使動) = 透過凸透鏡將微觀粒子放大千百倍', ex: 'High-power optical lenses magnify the microscopic wing scales of the swallowtail butterfly.' },
      { w: 'magnitude', ipa: '/ˈmæɡ.nɪ.tʃuːd/', pos: ['n.'], zh: '地震震級規模；重大影響力重要程度', tag: 'B2 / 地震學術', topic: 'sci-fi', m: 'magn(宏大) + -itude = 衡量浩劫量級或事件分量之指標', ex: 'Scientists warned that a disaster of this immense magnitude required coordinated global relief.' }
    ]
  },

  // 4. mem (記憶/銘記)
  {
    rootId: 'r_mem',
    words: [
      { w: 'memory', ipa: '/ˈmem.ər.i/', pos: ['n.'], zh: '記憶記憶力；電腦快閃記憶體', tag: 'A1 / 必備核心', topic: 'sitcom', m: 'mem(不忘記) + -ory = 鐫刻於腦海或晶片深處的往昔資訊', ex: 'Childhood animated theme songs evoke indelible nostalgic memories of Saturday mornings.' },
      { w: 'memorize', ipa: '/ˈmem.ə.raɪz/', pos: ['v.'], zh: '熟記默背、牢記於心', tag: 'A2 / 學習技能', topic: 'sitcom', m: 'memory + -ize = 透過反覆複誦將字句深刻印在腦海', ex: 'Actors memorize hundreds of script lines before staging live theatrical performances.' },
      { w: 'memorial', ipa: '/məˈmɔː.ri.əl/', pos: ['n.', 'adj.'], zh: '紀念館紀念碑；紀念性質的', tag: 'B1 / 歷史緬懷', topic: 'cinema', m: 'memory + -ial = 供後人緬懷致敬烈士英魂之崇高碑石', ex: 'Veterans laid laurel wreaths at the stone national memorial in solemn silence.' },
      { w: 'commemorate', ipa: '/kəˈmem.ə.reɪt/', pos: ['v.'], zh: '紀念慶祝、緬懷先烈事蹟', tag: 'B2 / 典禮歷史', topic: 'cinema', m: 'con-(聚合) + memor(銘記) + -ate = 萬民共同集會肅立銘記歷史功勳', ex: 'The city erected an obsidian monument to commemorate the fallen firehouse heroes.' },
      { w: 'memorable', ipa: '/ˈmem.ər.ə.bəl/', pos: ['adj.'], zh: '難以忘懷的、令人回味銘記的', tag: 'B1 / 生活讚揚', topic: 'animation', m: 'memory + -able = 精彩絕倫永生難忘的', ex: 'The film’s climax delivers one of the most memorable emotional twists in modern cinema.' }
    ]
  },

  // 5. mort (死亡/凋零)
  {
    rootId: 'r_mort',
    words: [
      { w: 'mortal', ipa: '/ˈmɔː.təl/', pos: ['adj.', 'n.'], zh: '凡人終有一死的；致命的；肉體凡胎', tag: 'B2 / 哲學奇幻', topic: 'animation', m: 'mort(死亡) + -al = 生老病死必有終結之凡胎肉身', ex: 'Even immortal ancient Greek deities meddled recklessly in fragile mortal destinies.' },
      { w: 'mortality', ipa: '/mɔːˈtæl.ə.ti/', pos: ['n.'], zh: '死亡率；終有一死之凡人屬性', tag: 'B2 / 醫學社會', topic: 'business', m: 'mortal + -ity = 凡人面對生離死別之無奈或疾病致死指標', ex: 'Sanitary water infrastructure slashed infant mortality across developing rural regions.' },
      { w: 'immortal', ipa: '/ɪˈmɔː.təl/', pos: ['adj.', 'n.'], zh: '不朽的長生不老的；神祇先賢', tag: 'B2 / 神話奇幻', topic: 'animation', m: 'in-(無) + mortal(死亡) = 歷經萬古歲月依然長存於世的不死傳奇', ex: 'Beethoven’s Ninth Symphony earned the composer an immortal place in artistic history.' },
      { w: 'immortality', ipa: '/ˌɪm.ɔːˈtæl.ə.ti/', pos: ['n.'], zh: '永生長生不老、千古不朽名聲', tag: 'C1 / 奇幻哲學', topic: 'sci-fi', m: 'immortal + -ity = 戰勝死神永世長存之神蹟', ex: 'The rogue alchemist searched across forbidden continents to brew the elixir of immortality.' }
    ]
  },

  // 6. nom / onym (名稱/命名)
  {
    rootId: 'r_nom',
    words: [
      { w: 'nominate', ipa: '/ˈnɒm.ɪ.neɪt/', pos: ['v.'], zh: '提名入圍；任命官員', tag: 'B1 / 影視政治', topic: 'cinema', m: 'nom(名字) + -in + -ate = 正式寫下名字推薦角逐奧斯卡或官職', ex: 'The Academy voted to nominate the indie animation for Best Original Screenplay.' },
      { w: 'nomination', ipa: '/ˌnɒm.ɪˈneɪ.ʃən/', pos: ['n.'], zh: '提名入圍資格、提名名單', tag: 'B1 / 影視娛樂', topic: 'cinema', m: 'nominate + -ion = 角逐殿堂大獎之提名資格', ex: 'Winning five Emmy nominations validated the streaming series’ creative ambition.' },
      { w: 'synonym', ipa: '/ˈsɪn.ə.nɪm/', pos: ['n.'], zh: '同義詞、近義字', tag: 'B1 / 英語詞彙', topic: 'business', m: 'syn-(相同) + onym(名稱名字) = 意思相近可互相代換之詞彙', ex: 'The words courageous and intrepid are close synonyms denoting fearless bravery.' },
      { w: 'antonym', ipa: '/ˈæn.tə.nɪm/', pos: ['n.'], zh: '反義詞、反義字', tag: 'B1 / 英語詞彙', topic: 'business', m: 'anti-(相反) + onym(名字) = 涵義背道而馳之相對詞彙', ex: 'Light and darkness serve as classic poetic antonyms illustrating moral conflict.' },
      { w: 'pseudonym', ipa: '/ˈsjuː.də.nɪm/', pos: ['n.'], zh: '筆名、假名化名', tag: 'B2 / 文學出版', topic: 'cinema', m: 'pseudo-(虛假偽裝) + onym(名字) = 隱匿真名另立江湖行頭之化名', ex: 'George Orwell was the celebrated literary pseudonym of Eric Arthur Blair.' },
      { w: 'anonymous', ipa: '/əˈnɒn.ɪ.məs/', pos: ['adj.'], zh: '匿名的、不具名的', tag: 'B2 / 網路資安', topic: 'cinema', m: 'an-(無) + onym(名字) + -ous = 刻意抹去身分痕跡深藏功與名的', ex: 'An anonymous benefactor donated ten million dollars to endow the children’s ward.' }
    ]
  },

  // 7. sci (認知/知曉/科學)
  {
    rootId: 'r_sci',
    words: [
      { w: 'science', ipa: '/ˈsaɪ.əns/', pos: ['n.'], zh: '自然科學、系統化知識實證', tag: 'A1 / 必備核心', topic: 'sci-fi', m: 'sci(知曉探索) + -ence = 透過嚴謹實驗實證撥開迷霧探求宇宙真理之學門', ex: 'Science advances through rigorous hypothesis falsification, not unquestioned dogma.' },
      { w: 'scientific', ipa: '/ˌsaɪ.ənˈtɪf.ɪk/', pos: ['adj.'], zh: '科學的、符合科學方法的', tag: 'B1 / 核心基礎', topic: 'sci-fi', m: 'science + -ic = 依循嚴謹實證數據與邏輯推演的', ex: 'Peer-reviewed scientific journals scrutinize submitted methodology with ruthless rigor.' },
      { w: 'scientist', ipa: '/ˈsaɪ.ən.tɪst/', pos: ['n.'], zh: '科學家、研究學者', tag: 'A2 / 職業名詞', topic: 'sci-fi', m: 'science + -ist = 站在探索宇宙邊疆最前沿之求道者', ex: 'Astronomers and planetary scientists calibrated deep-space infrared sensors.' },
      { w: 'conscious', ipa: '/ˈkɒn.ʃəs/', pos: ['adj.'], zh: '神志清醒有知覺的；意識到的', tag: 'B1 / 心理生理', topic: 'cinema', m: 'con-(完全) + sci(明瞭感知) + -ous = 對周遭外界事物具有清晰自主意識的', ex: 'The injured driver remained fully conscious and spoke lucidly with paramedics.' },
      { w: 'consciousness', ipa: '/ˈkɒn.ʃəs.nəs/', pos: ['n.'], zh: '意識自主靈性；自覺省思', tag: 'B2 / 哲學AI', topic: 'sci-fi', m: 'conscious + -ness = 智慧生命自我凝視之靈性火花', ex: 'Cognitive theorists still grapple with how biological wetware gives birth to subjective consciousness.' },
      { w: 'subconscious', ipa: '/ˌsʌbˈkɒn.ʃəs/', pos: ['adj.', 'n.'], zh: '下意識的潛意識的；潛意識深層', tag: 'B2 / 心理造夢', topic: 'animation', m: 'sub-(深埋底下) + conscious(表層意識) = 隱匿在冰山底層暗中支配情感的潛意識', ex: 'Surrealist animated visuals tap into the mysterious landscape of the human subconscious.' },
      { w: 'conscience', ipa: '/ˈkɒn.ʃəns/', pos: ['n.'], zh: '道德良知、良心審判', tag: 'B2 / 道德反思', topic: 'cinema', m: 'con-(全面) + sci(明辨善惡) + -ence = 靈魂深處守護公義與是非的微小聲音', ex: 'His troubled conscience prevented him from pocketing the lost envelope of cash.' }
    ]
  },

  // 8. spir (呼吸/精神/氣息)
  {
    rootId: 'r_spir',
    words: [
      { w: 'inspire', ipa: '/ɪnˈspaɪər/', pos: ['v.'], zh: '激發靈感；鼓舞激勵人心', tag: 'B1 / 創意勵志', topic: 'animation', m: 'in-(朝靈魂注入) + spire(神聖氣息) = 上帝朝凡人胸膛吹入神聖靈感', ex: 'Visiting the ancient Kyoto bamboo groves inspired the director’s dreamlike environment art.' },
      { w: 'inspiration', ipa: '/ˌɪn.spɪˈreɪ.ʃən/', pos: ['n.'], zh: '靈感繆斯；楷模榜樣', tag: 'B1 / 創意必備', topic: 'animation', m: 'inspire + -ation = 靈光乍現電光石火之靈感湧泉', ex: 'Nature’s structural biomimicry provides endless architectural design inspiration.' },
      { w: 'inspirational', ipa: '/ˌɪn.spɪˈreɪ.ʃən.əl/', pos: ['adj.'], zh: '鼓舞人心的、令人熱血沸騰的', tag: 'B2 / 勵志褒獎', topic: 'animation', m: 'inspiration + -al = 能點燃他人心靈希望之火的', ex: 'The underdog protagonist delivered an inspirational locker room halftime speech.' },
      { w: 'aspire', ipa: '/əˈspaɪər/', pos: ['v.'], zh: '立志追求、抱有雄心壯志', tag: 'B2 / 奮鬥成長', topic: 'business', m: 'ad-(朝向高處) + spire(昂首吐氣) = 昂首挺胸將目光鎖定在最高巔峰', ex: 'Many junior programmers aspire to found their own disruptive software enterprise.' },
      { w: 'aspiration', ipa: '/ˌæs.pɪˈreɪ.ʃən/', pos: ['n.'], zh: '抱負雄心、宏圖遠大志向', tag: 'B2 / 職場人生', topic: 'business', m: 'aspire + -ation = 指引一生奮鬥向前的崇高目標', ex: 'Her youthful career aspiration was to direct a feature-length hand-drawn anime.' },
      { w: 'conspire', ipa: '/kənˈspaɪər/', pos: ['v.'], zh: '密謀策劃陰謀；天意弄人共同促成', tag: 'C1 / 影視懸疑', topic: 'cinema', m: 'con-(咬耳朵) + spire(吐氣竊竊私語) = 暗地裡湊在一起耳語密謀推翻政權', ex: 'Corrupt corporate executives conspired to manipulate regional energy spot prices.' },
      { w: 'conspiracy', ipa: '/kənˈspɪr.ə.si/', pos: ['n.'], zh: '陰謀暗算、密謀集團', tag: 'B2 / 懸疑諜戰', topic: 'cinema', m: 'conspire + -cy = 盤根錯節暗中運作之密謀', ex: 'The political thriller uncovers a military-industrial conspiracy to ignite proxy conflict.' },
      { w: 'spirit', ipa: '/ˈspɪr.ɪt/', pos: ['n.'], zh: '精神靈魂；勇氣氣魄；烈酒', tag: 'A2 / 核心核心', topic: 'animation', m: 'spir(生命氣息) + -it = 肉體雖逝但精神永恆不滅之靈魂火花', ex: 'The pioneer spirit of relentless curiosity propels robotic interplanetary exploration.' }
    ]
  },

  // 9. term (界限/終端/期限)
  {
    rootId: 'r_term',
    words: [
      { w: 'terminal', ipa: '/ˈtɜː.mɪ.nəl/', pos: ['n.', 'adj.'], zh: '機場航廈；終端機介面；末期致命的', tag: 'B1 / 科技航空', topic: 'sci-fi', m: 'term(終點界限) + -inal = 鐵路航線的最後端點，或命令列終端機', ex: 'The international departure terminal hummed with multilingual announcements.' },
      { w: 'terminate', ipa: '/ˈtɜː.mɪ.neɪt/', pos: ['v.'], zh: '終止結束、解聘合約、終結生命', tag: 'B2 / 商業影視', topic: 'cinema', m: 'term(邊界終局) + -ate = 畫下休止符宣告徹底結束', ex: 'Management exercised its contractual clause to terminate the vendor agreement.' },
      { w: 'termination', ipa: '/ˌtɜː.mɪˈneɪ.ʃən/', pos: ['n.'], zh: '解約終止、終結劃下句點', tag: 'B2 / 法律商業', topic: 'business', m: 'terminate + -ion = 契約或服務正式終結之手續', ex: 'Employee contract termination must comply with statutory severance guidelines.' },
      { w: 'determine', ipa: '/dɪˈtɜː.mɪn/', pos: ['v.'], zh: '決定裁定；下定堅定決心；查明真相', tag: 'B1 / 核心基礎', topic: 'cinema', m: 'de-(斬斷所有界線) + termine(劃下邊界定案) = 勘定界限做出定論痛下決心', ex: 'Ballistic trajectory analysis helped detectives determine the sniper’s firing angle.' },
      { w: 'determination', ipa: '/dɪˌtɜː.mɪˈneɪ.ʃən/', pos: ['n.'], zh: '堅定決心毅力；查明確定', tag: 'B1 / 勵志美德', topic: 'animation', m: 'determine + -ion = 縱有萬難亦絕不動搖之鋼鐵意志', ex: 'Her fierce determination to master 3D rigging carried her through sleepless nights.' }
    ]
  },

  // 10. vac (虛空/騰出)
  {
    rootId: 'r_vac',
    words: [
      { w: 'vacant', ipa: '/ˈveɪ.kənt/', pos: ['adj.'], zh: '空置的無人的；神情空洞茫然的', tag: 'B1 / 生活常考', topic: 'sitcom', m: 'vac(空蕩無人) + -ant = 房屋騰空無人居住，或眼神空洞', ex: 'Several prime commercial retail storefronts remained vacant after the downtown rent hike.' },
      { w: 'vacancy', ipa: '/ˈveɪ.kən.si/', pos: ['n.'], zh: '職缺職位空缺；飯店空房', tag: 'B1 / 職場生活', topic: 'business', m: 'vacant + -cy = 待聘之職位或待入住之客房', ex: 'The studio posted an urgent vacancy for a senior lighting technical director.' },
      { w: 'vacate', ipa: '/vəˈkeɪt/', pos: ['v.'], zh: '騰空搬離、清空讓出職位', tag: 'B2 / 法律生活', topic: 'business', m: 'vac(清空) + -ate = 打包家當騰出空間交還房東', ex: 'Tenants were formally ordered to vacate the premises due to structural condemned status.' },
      { w: 'vacation', ipa: '/veɪˈkeɪ.ʃən/', pos: ['n.'], zh: '休假度假、長假', tag: 'A1 / 必備生活', topic: 'sitcom', m: 'vac(把腦袋公事清空) + -ation = 卸下所有工作重擔盡情放鬆之假期', ex: 'The family planned a fortnight summer vacation traversing the Rocky Mountains.' },
      { w: 'evacuate', ipa: '/ɪˈvæk.ju.eɪt/', pos: ['v.'], zh: '疏散撤離、清空人員避難', tag: 'B2 / 防災安全', topic: 'cinema', m: 'e-(向外) + vac(清空) + -ate = 將建築內所有人員迅速引導清空撤離', ex: 'Authorities ordered coastal residents to evacuate inland ahead of the tsunami warning.' },
      { w: 'evacuation', ipa: '/ɪˌvæk.juˈeɪ.ʃən/', pos: ['n.'], zh: '緊急疏散撤離行動', tag: 'B2 / 防災救難', topic: 'cinema', m: 'evacuate + -ion = 有條不紊的大規模撤退逃生作業', ex: 'The stadium conducted a flawless five-minute emergency fire evacuation drill.' }
    ]
  }
]
