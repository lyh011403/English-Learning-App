// 建立自動擴充詞庫腳本
import fs from 'node:fs'
import path from 'node:path'

// 定義詞根規則與高頻詞映射表
const _ROOT_MAPPING = [
  // chron (時間)
  { rootId: 'r_chron', rootWord: 'chron', meaningZh: '時間', origin: '希臘語 (khronos)' },
  // struct (建造)
  { rootId: 'r_struct', rootWord: 'struct', meaningZh: '建造、構築', origin: '拉丁語 (struere)' },
  // dict (說話)
  { rootId: 'r_dict', rootWord: 'dict', meaningZh: '說話、宣稱', origin: '拉丁語 (dicere)' },
  // spect (看)
  { rootId: 'r_spect', rootWord: 'spect', meaningZh: '看、注視、觀察', origin: '拉丁語 (specere)' },
  // port (攜帶)
  { rootId: 'r_port', rootWord: 'port', meaningZh: '搬運、攜帶', origin: '拉丁語 (portare)' },
  // path (情感)
  { rootId: 'r_path', rootWord: 'path', meaningZh: '情感、感受、痛苦', origin: '希臘語 (pathos)' },
  // vis (看見)
  { rootId: 'r_vis', rootWord: 'vis', meaningZh: '看見、視野', origin: '拉丁語 (videre)' },
  // duc (引導)
  { rootId: 'r_duc', rootWord: 'duc', meaningZh: '引導、帶領', origin: '拉丁語 (ducere)' },
  // tract (拉引)
  { rootId: 'r_tract', rootWord: 'tract', meaningZh: '拉、引、拖拽', origin: '拉丁語 (trahere)' },
  // scrib (書寫)
  { rootId: 'r_scrib', rootWord: 'scrib', meaningZh: '書寫、紀錄', origin: '拉丁語 (scribere)' },
  // cred (相信)
  { rootId: 'r_cred', rootWord: 'cred', meaningZh: '相信、信任', origin: '拉丁語 (credere)' },
  // vert (轉向)
  { rootId: 'r_vert', rootWord: 'vert', meaningZh: '轉向、轉變', origin: '拉丁語 (vertere)' },
  // gress (前進)
  { rootId: 'r_gress', rootWord: 'gress', meaningZh: '步履、前進', origin: '拉丁語 (gradi)' },
  // volu (滾動/捲轉)
  { rootId: 'r_volu', rootWord: 'volv', meaningZh: '滾動、展開轉化', origin: '拉丁語 (volvere)' },
  // gen (出生/產生)
  { rootId: 'r_gen', rootWord: 'gen', meaningZh: '產生、出生、種類', origin: '希臘/拉丁語 (genus)' },
  // bio (生命)
  { rootId: 'r_bio', rootWord: 'bio', meaningZh: '生命、生物', origin: '希臘語 (bios)' },
  // tele (遠程)
  { rootId: 'p_tele', rootWord: 'tele', meaningZh: '遠距離', origin: '希臘語 (tele)' },
  // auto (自我)
  { rootId: 'p_auto', rootWord: 'auto', meaningZh: '自己、自動', origin: '希臘語 (autos)' },
  // micro (微小)
  { rootId: 'p_micro', rootWord: 'micro', meaningZh: '微小、精細', origin: '希臘語 (mikros)' },
  // anti (反對)
  { rootId: 'p_anti', rootWord: 'anti', meaningZh: '相反、對抗', origin: '希臘語 (anti)' },
]

// 核心擴充高頻大單字集（按真實英語詞根網絡與考用高頻詞建構）
const RAW_VOCAB = [
  // === 建造與結構系列 (struct / form / fac) ===
  { w: 'construct', ipa: '/kənˈstrʌkt/', pos: 'v.', zh: '建造、構思、構築', root: 'r_struct', topic: 'sci-fi', tag: 'B1 / TOEIC', m: 'con-(共同) + struct(建造) = 將各部件組裝在一起 -> 建造', ex: 'They constructed a massive defensive wall around the city.' },
  { w: 'construction', ipa: '/kənˈstrʌk.ʃən/', pos: 'n.', zh: '建設、建造工程', root: 'r_struct', topic: 'business', tag: 'A2 / 基礎必備', m: 'construct + -ion(名詞) = 建造工程', ex: 'The highway is currently under construction.' },
  { w: 'destructive', ipa: '/dɪˈstrʌk.tɪv/', pos: 'adj.', zh: '破壞性的、毀滅性的', root: 'r_struct', topic: 'sci-fi', tag: 'B2 / 托福聽力', m: 'de-(拆下) + struct(建造) + -ive = 具有毀滅性的', ex: 'Tornadoes can be extremely destructive forces of nature.' },
  { w: 'instructor', ipa: '/ɪnˈstrʌk.tər/', pos: 'n.', zh: '教練、講師、指導員', root: 'r_struct', topic: 'business', tag: 'A2 / 生活必備', m: 'in-(朝內) + struct(建構知識) + -or = 傳授知識結構之人', ex: 'The driving instructor was calm and patient.' },
  { w: 'reconstruct', ipa: '/ˌriː.kənˈstrʌkt/', pos: 'v.', zh: '重建、重現現場', root: 'r_struct', topic: 'cinema', tag: 'B2 / 影視推理', m: 're-(重新) + construct = 重新建造還原', ex: 'Forensic experts reconstructed the crime scene in 3D.' },
  { w: 'structure', ipa: '/ˈstrʌk.tʃər/', pos: 'n.', zh: '結構、體系、建築物', root: 'r_struct', topic: 'sci-fi', tag: 'A2 / 核心基礎', m: 'struct(建造) + -ure = 構築物之整體形態', ex: 'The atomic structure of graphene is remarkably stable.' },
  { w: 'obstruct', ipa: '/əbˈstrʌkt/', pos: 'v.', zh: '阻礙、妨礙、阻塞', root: 'r_struct', topic: 'cinema', tag: 'C1 / 托福常考', m: 'ob-(逆向) + struct(建造) = 在前進方向堆砌障礙', ex: 'Fallen trees obstructed the emergency rescue vehicles.' },
  { w: 'deconstruct', ipa: '/ˌdiː.kənˈstrʌkt/', pos: 'v.', zh: '解構、剖析', root: 'r_struct', topic: 'business', tag: 'C1 / 批評理論', m: 'de-(拆開) + construct = 拆解核心要素', ex: 'The critic deconstructed the director’s narrative style.' },
  { w: 'infrastructure', ipa: '/ˈɪn.frəˌstrʌk.tʃər/', pos: 'n.', zh: '基礎建設、公共架構', root: 'r_struct', topic: 'business', tag: 'B2 / 經貿學術', m: 'infra-(下方) + structure = 支撐體系的底層設施', ex: 'High-speed rail is a critical pillar of modern infrastructure.' },
  { w: 'structural', ipa: '/ˈstrʌk.tʃər.əl/', pos: 'adj.', zh: '結構上的、架構的', root: 'r_struct', topic: 'sci-fi', tag: 'B2 / 建築工程', m: 'structure + -al = 屬於架構體系的', ex: 'Engineers found severe structural damage in the foundation.' },

  // === 語言與宣告系列 (dict / voc / clam) ===
  { w: 'predict', ipa: '/prɪˈdɪkt/', pos: 'v.', zh: '預測、預告', root: 'r_dict', topic: 'business', tag: 'B1 / TOEIC', m: 'pre-(事先) + dict(說) = 事先說出未來會發生的事', ex: 'Economists predict inflation will drop next quarter.' },
  { w: 'prediction', ipa: '/prɪˈdɪk.ʃən/', pos: 'n.', zh: '預言、預測結果', root: 'r_dict', topic: 'sci-fi', tag: 'B1 / 核心基礎', m: 'predict + -ion = 預測行為與結果', ex: 'His prediction about the AI revolution proved accurate.' },
  { w: 'predictable', ipa: '/prɪˈdɪk.tə.bəl/', pos: 'adj.', zh: '可預料的、意料之中的', root: 'r_dict', topic: 'sitcom', tag: 'B1 / 口語常用', m: 'predict + -able = 能夠事先預料到的', ex: 'The plot of the movie was entertaining but highly predictable.' },
  { w: 'contradict', ipa: '/ˌkɒn.trəˈdɪkt/', pos: 'v.', zh: '反駁、與...自相矛盾', root: 'r_dict', topic: 'cinema', tag: 'B2 / TOEFL', m: 'contra-(相反) + dict(說) = 說反話對立', ex: 'The new experimental data contradicted the original hypothesis.' },
  { w: 'contradiction', ipa: '/ˌkɒn.trəˈdɪk.ʃən/', pos: 'n.', zh: '矛盾、抵觸', root: 'r_dict', topic: 'cinema', tag: 'B2 / 哲學邏輯', m: 'contradict + -ion = 互相衝突矛盾之狀態', ex: 'There is a glaring contradiction in his testimony.' },
  { w: 'dictate', ipa: '/dɪkˈteɪt/', pos: 'v.', zh: '口述、聽寫；發號施令', root: 'r_dict', topic: 'business', tag: 'B2 / 職場商用', m: 'dict(說) + -ate = 依權威下達指示', ex: 'You cannot let past failures dictate your future choices.' },
  { w: 'dictator', ipa: '/dɪkˈteɪ.tər/', pos: 'n.', zh: '獨裁者、專制者', root: 'r_dict', topic: 'cinema', tag: 'B2 / 歷史影視', m: 'dictate + -or = 發號施令一人獨大者', ex: 'The citizens revolted against the ruthless dictator.' },
  { w: 'verdict', ipa: '/ˈvɜː.dɪkt/', pos: 'n.', zh: '判決、裁決', root: 'r_dict', topic: 'cinema', tag: 'C1 / 法律影視', m: 'ver-(真實) + dict(宣佈) = 宣判真實公義的裁斷', ex: 'The jury delivered a unanimous guilty verdict.' },
  { w: 'addict', ipa: '/ˈæd.ɪkt/', pos: 'n.', zh: '成癮者、沈溺於...者', root: 'r_dict', topic: 'sitcom', tag: 'B1 / 生活必備', m: 'ad-(朝向) + dict(宣告歸屬) = 誓死被某物綁定之人', ex: 'He is a self-proclaimed coffee addict.' },
  { w: 'indicate', ipa: '/ˈɪn.dɪ.keɪt/', pos: 'v.', zh: '表明、指出、象徵', root: 'r_dict', topic: 'business', tag: 'B1 / 托福學術', m: 'in-(朝內) + dic(指出) + -ate = 指示表明', ex: 'The red flashing light indicates a critical system error.' },
  { w: 'indicator', ipa: '/ˈɪn.dɪ.keɪ.tər/', pos: 'n.', zh: '指標、指示器', root: 'r_dict', topic: 'business', tag: 'B2 / 商業金融', m: 'indicate + -or = 作為參考指標之標的', ex: 'Consumer spending is a leading economic indicator.' },
  { w: 'dedicate', ipa: '/ˈded.ɪ.keɪt/', pos: 'v.', zh: '奉獻、致力於、題獻', root: 'r_dict', topic: 'animation', tag: 'B2 / 人文必備', m: 'de-(徹底) + dic(宣稱宣告) + -ate = 宣稱徹底投入', ex: 'She dedicated her life to protecting endangered marine species.' },

  // === 觀察與凝視系列 (spect / vid / vis) ===
  { w: 'inspect', ipa: '/ɪnˈspekt/', pos: 'v.', zh: '檢查、審視、稽查', root: 'r_spect', topic: 'cinema', tag: 'B1 / TOEIC', m: 'in-(深入) + spect(看) = 深入細節觀看', ex: 'Customs officials inspected the suspicious luggage.' },
  { w: 'inspection', ipa: '/ɪnˈspek.ʃən/', pos: 'n.', zh: '檢查、視察作業', root: 'r_spect', topic: 'business', tag: 'B1 / 品管工程', m: 'inspect + -ion = 稽核視察行為', ex: 'The aircraft passed its rigorous safety inspection.' },
  { w: 'inspector', ipa: '/ɪnˈspek.tər/', pos: 'n.', zh: '督察、檢查員、偵緝員', root: 'r_spect', topic: 'cinema', tag: 'B1 / 影視常用', m: 'inspect + -or = 負責查緝之官員', ex: 'Inspector Lestrade asked Sherlock for investigative help.' },
  { w: 'perspective', ipa: '/pəˈspek.tɪv/', pos: 'n.', zh: '觀點、視角、遠景', root: 'r_spect', topic: 'animation', tag: 'B2 / 留學必備', m: 'per-(透徹) + spect(看) + -ive = 洞悉全局之視角', ex: 'The astronaut gained a cosmic perspective after viewing Earth from space.' },
  { w: 'spectator', ipa: '/spekˈteɪ.tər/', pos: 'n.', zh: '觀眾、旁觀者', root: 'r_spect', topic: 'sitcom', tag: 'B1 / 生活休閒', m: 'spect(看) + -ator = 坐看演出之人', ex: 'Over eighty thousand spectators cheered wildly.' },
  { w: 'spectacle', ipa: '/ˈspek.tə.kəl/', pos: 'n.', zh: '壯觀景象、盛大演出', root: 'r_spect', topic: 'cinema', tag: 'B2 / 影視文藝', m: 'spect(看) + -acle = 值得眾人駐足欣賞的場面', ex: 'The fireworks over Victoria Harbour were an unforgettable spectacle.' },
  { w: 'spectacular', ipa: '/spekˈtæk.jə.lər/', pos: 'adj.', zh: '極為壯觀的、令人驚嘆的', root: 'r_spect', topic: 'animation', tag: 'B1 / 口語高頻', m: 'spectacle + -ar = 場面盛大壯觀的', ex: 'The movie features spectacular visual effects and epic battles.' },
  { w: 'suspect', ipa: '/səˈspekt/', pos: 'v.', zh: '懷疑；嫌疑犯', root: 'r_spect', topic: 'cinema', tag: 'B1 / 刑偵影視', m: 'sub-(在底下) + spect(偷瞄) = 在暗地裡暗中打量懷疑', ex: 'Detectives suspected the butler had stolen the diamond ring.' },
  { w: 'suspicious', ipa: '/səˈspɪʃ.əs/', pos: 'adj.', zh: '可疑的、起疑心的', root: 'r_spect', topic: 'cinema', tag: 'B2 / 犯罪心理', m: 'suspect + -ious = 令人心生懷疑的', ex: 'The police officer noticed a suspicious vehicle parked in the alley.' },
  { w: 'respect', ipa: '/rɪˈspekt/', pos: 'v.', zh: '尊敬、尊重、敬重', root: 'r_spect', topic: 'animation', tag: 'A2 / 基礎必備', m: 're-(再次回頭) + spect(注視) = 值得一再回頭敬重相看', ex: 'True martial artists always respect their opponents.' },
  { w: 'respectful', ipa: '/rɪˈspekt.fəl/', pos: 'adj.', zh: '畢恭畢敬的、充滿敬意的', root: 'r_spect', topic: 'animation', tag: 'B1 / 生活人際', m: 'respect + -ful = 滿懷尊敬態度的', ex: 'The young monk bowed with respectful silence.' },
  { w: 'retrospect', ipa: '/ˈret.rə.spekt/', pos: 'n.', zh: '回顧、事後反思', root: 'r_spect', topic: 'business', tag: 'C1 / 商業反思', m: 'retro-(向後) + spect(看) = 回頭看向過往', ex: 'In retrospect, the financial crisis could have been mitigated earlier.' },

  // === 搬運與流通系列 (port / fer / lat) ===
  { w: 'transport', ipa: '/ˈtræn.spɔːt/', pos: 'v.', zh: '運送、運輸', root: 'r_port', topic: 'sci-fi', tag: 'A2 / 基礎核心', m: 'trans-(跨越) + port(攜帶) = 攜物跨越空間', ex: 'Containers transport millions of tons of goods across the Pacific.' },
  { w: 'transportation', ipa: '/ˌtræn.spɔːˈteɪ.ʃən/', pos: 'n.', zh: '交通運輸系統', root: 'r_port', topic: 'business', tag: 'B1 / 生活常考', m: 'transport + -ation = 運輸系統與方式', ex: 'Electric buses have transformed urban public transportation.' },
  { w: 'export', ipa: '/ɪkˈspɔːt/', pos: 'v.', zh: '出口、外銷', root: 'r_port', topic: 'business', tag: 'B1 / 經貿核心', m: 'ex-(出港) + port(港口搬運) = 貨物搬出本國外銷', ex: 'Germany exports high-precision machinery around the globe.' },
  { w: 'import', ipa: '/ɪmˈpɔːt/', pos: 'v.', zh: '進口、輸入', root: 'r_port', topic: 'business', tag: 'B1 / 經貿核心', m: 'im-(進港) + port(港口搬運) = 貨物自國外運入本國', ex: 'The island nation imports almost all of its petroleum.' },
  { w: 'portable', ipa: '/ˈpɔː.tə.bəl/', pos: 'adj.', zh: '便攜的、輕便手提的', root: 'r_port', topic: 'sci-fi', tag: 'B1 / 消費科技', m: 'port(搬運) + -able(能夠) = 能輕鬆用手拎走的', ex: 'A portable battery charger is indispensable for long-haul travel.' },
  { w: 'support', ipa: '/səˈpɔːt/', pos: 'v.', zh: '支持、支撐、撫養', root: 'r_port', topic: 'sitcom', tag: 'A2 / 基礎核心', m: 'sub-(在下方) + port(扛起承受) = 在底下用肩膀死命扛著', ex: 'My family supported my dream of becoming an animator.' },
  { w: 'supportive', ipa: '/səˈpɔː.tɪv/', pos: 'adj.', zh: '給予支持與鼓勵的', root: 'r_port', topic: 'sitcom', tag: 'B1 / 人際關係', m: 'support + -ive = 願意鼎力相挺的', ex: 'She was blessed with incredibly supportive teammates.' },
  { w: 'report', ipa: '/rɪˈpɔːt/', pos: 'v.', zh: '報告、呈報、報導', root: 'r_port', topic: 'business', tag: 'A2 / 基礎必備', m: 're-(帶回) + port(攜帶) = 將前線偵察結果帶回報告', ex: 'The scout reported the incoming enemy forces to headquarters.' },
  { w: 'reporter', ipa: '/rɪˈpɔː.tər/', pos: 'n.', zh: '記者、採訪員', root: 'r_port', topic: 'cinema', tag: 'A2 / 職業詞彙', m: 'report + -er = 負責發掘報導真相的人', ex: 'The investigative reporter uncovered widespread political corruption.' },
  { w: 'opportunity', ipa: '/ˌɒp.əˈtʃuː.nə.ti/', pos: 'n.', zh: '機會、良機', root: 'r_port', topic: 'business', tag: 'A2 / 職場高頻', m: 'ob-(迎向) + port(港口) + -unity = 順風吹向港口之良機', ex: 'Every challenge conceals an extraordinary opportunity for growth.' },

  // === 情感與心理系列 (path / sent / sens) ===
  { w: 'sympathy', ipa: '/ˈsɪm.pə.θi/', pos: 'n.', zh: '同情、憐憫', root: 'r_path', topic: 'sitcom', tag: 'B1 / 生活人際', m: 'sym-(共同) + path(痛苦) = 對他人痛苦心生同情', ex: 'I extended my heartfelt sympathy to his grieving family.' },
  { w: 'sympathetic', ipa: '/ˌsɪm.pəˈθet.ɪk/', pos: 'adj.', zh: '富同情心的、體諒的', root: 'r_path', topic: 'animation', tag: 'B2 / 心理人格', m: 'sympathy + -etic = 能設身處地體諒的', ex: 'The mentor was sympathetic to the student’s personal struggles.' },
  { w: 'empathy', ipa: '/ˈem.pə.θi/', pos: 'n.', zh: '同理心、神入共鳴', root: 'r_path', topic: 'animation', tag: 'B2 / 心理學必備', m: 'em-(深入其中) + path(感情) = 走進他人心坎體會感受', ex: 'Empathy bridges ideological divides between conflicting factions.' },
  { w: 'empathetic', ipa: '/ˌem.pəˈθet.ɪk/', pos: 'adj.', zh: '具同理心的、善於共情的', root: 'r_path', topic: 'business', tag: 'B2 / 領導管理', m: 'empathy + -etic = 善於傾聽共鳴的', ex: 'Empathetic leaders create psychologically safe workplaces.' },
  { w: 'telepathy', ipa: '/təˈlep.ə.θi/', pos: 'n.', zh: '心靈感應、傳心術', root: 'r_path', topic: 'sci-fi', tag: 'C1 / 科幻影視', m: 'tele-(遠距) + path(心靈感知) = 隔空跨距心電感應', ex: 'The alien race communicated entirely through direct telepathy.' },
  { w: 'apathy', ipa: '/ˈæp.ə.θi/', pos: 'n.', zh: '冷漠、漠不關心、無動於衷', root: 'r_path', topic: 'cinema', tag: 'C1 / 托福閱讀', m: 'a-(無) + path(情感) = 內心麻木全無半點情感', ex: 'Voter apathy is a dangerous threat to democratic institutions.' },
  { w: 'apathetic', ipa: '/ˌæp.əˈθet.ɪk/', pos: 'adj.', zh: '冷漠淡然的、毫無生氣的', root: 'r_path', topic: 'sitcom', tag: 'C1 / 情感狀態', m: 'apathy + -etic = 對一切漠然無感', ex: 'Teenagers can sometimes appear apathetic toward adult advice.' },
  { w: 'pathetic', ipa: '/pəˈθet.ɪk/', pos: 'adj.', zh: '可憐的、可悲的、差勁的', root: 'r_path', topic: 'sitcom', tag: 'B2 / 影視口語', m: 'path(痛苦慘狀) + -etic = 令人搖頭興嘆的慘狀', ex: 'His pathetic excuses fooled nobody in the courtroom.' },
  { w: 'pathology', ipa: '/pəˈθɒl.ə.dʒi/', pos: 'n.', zh: '病理學、病變機制', root: 'r_path', topic: 'sci-fi', tag: 'C1 / 醫學常考', m: 'path(疾病) + -ology(學問) = 鑽研疾病起因的學問', ex: 'The pathology report confirmed the tumor was entirely benign.' },

  // === 牽引與吸引系列 (tract / pend / duc) ===
  { w: 'extract', ipa: '/ɪkˈstrækt/', pos: 'v.', zh: '提取、萃取、拔出', root: 'r_tract', topic: 'sci-fi', tag: 'B2 / 科技實驗', m: 'ex-(朝外) + tract(拉出) = 把精華朝外抽拔出', ex: 'Scientists extracted potent antibodies from the cloned organism.' },
  { w: 'extraction', ipa: '/ɪkˈstræk.ʃən/', pos: 'n.', zh: '拔除、萃取工程、撤退撤離', root: 'r_tract', topic: 'cinema', tag: 'B2 / 軍事影視', m: 'extract + -ion = 抽離提取之作業', ex: 'The helicopter team executed a flawless extraction under heavy fire.' },
  { w: 'attract', ipa: '/əˈtrækt/', pos: 'v.', zh: '吸引、招攬', root: 'r_tract', topic: 'animation', tag: 'A2 / 基礎必備', m: 'ad-(朝向) + tract(拉向自身) = 將目光心智拉攏過來', ex: 'Vibrant neon signs attract curious tourists in night markets.' },
  { w: 'attraction', ipa: '/əˈtræk.ʃən/', pos: 'n.', zh: '吸引力、景點勝地', root: 'r_tract', topic: 'sitcom', tag: 'B1 / 旅遊生活', m: 'attract + -ion = 誘發興趣之魅力事物', ex: 'The Eiffel Tower is the most visited paid attraction in Paris.' },
  { w: 'attractive', ipa: '/əˈtræk.tɪv/', pos: 'adj.', zh: '誘人的、具魅力的、動人的', root: 'r_tract', topic: 'sitcom', tag: 'A2 / 日常口語', m: 'attract + -ive = 魅力四射引人注目的', ex: 'The tech company offered an attractive starting salary package.' },
  { w: 'distract', ipa: '/dɪˈstrækt/', pos: 'v.', zh: '分散注意力、使分心', root: 'r_tract', topic: 'sitcom', tag: 'B1 / 核心生活', m: 'dis-(分開偏離) + tract(拉扯) = 將專注力強行扯偏', ex: 'Loud background music can distract students from deep study.' },
  { w: 'distraction', ipa: '/dɪˈstræk.ʃən/', pos: 'n.', zh: '分心之物、消遣娛樂', root: 'r_tract', topic: 'business', tag: 'B1 / 時間管理', m: 'distract + -ion = 奪走專注的雜音事物', ex: 'Social media notifications are the biggest distraction in modern offices.' },
  { w: 'contract', ipa: '/ˈkɒn.trækt/', pos: 'n.', zh: '契約合同；收縮緊繃', root: 'r_tract', topic: 'business', tag: 'B1 / 商業法律', m: 'con-(共同) + tract(拉緊綁定) = 將雙方義務緊緊捆綁約束', ex: 'Both parties reviewed the non-disclosure contract thoroughly.' },
  { w: 'retract', ipa: '/rɪˈtrækt/', pos: 'v.', zh: '收回、縮回、撤回聲明', root: 'r_tract', topic: 'cinema', tag: 'C1 / 法律新聞', m: 're-(向後) + tract(拉回) = 將伸出的爪牙或話語硬拉回去', ex: 'The newspaper was forced to publicly retract the false allegations.' },
  { w: 'abstract', ipa: '/ˈæb.strækt/', pos: 'adj.', zh: '抽象的；論文摘要', root: 'r_tract', topic: 'sci-fi', tag: 'B2 / 學術閱讀', m: 'ab-(自...抽離) + tract(拉引) = 脫離具體實體所提煉出的概念', ex: 'Pure mathematics deals with abstract logical structures.' },

  // === 視覺與視野系列 (vis / vid / scope) ===
  { w: 'visual', ipa: '/ˈvɪʒ.u.əl/', pos: 'adj.', zh: '視覺的、光學成像的', root: 'r_vis', topic: 'animation', tag: 'B1 / 影視設計', m: 'vis(看) + -ual = 屬於眼睛所見之範疇', ex: 'The animated film set a new standard for visual storytelling.' },
  { w: 'visualize', ipa: '/ˈvɪʒ.u.əl.aɪz/', pos: 'v.', zh: '在腦中想像、可視化呈現', root: 'r_vis', topic: 'animation', tag: 'B2 / 心理認知', m: 'visual + -ize = 將概念在心中呈現為具體畫面', ex: 'Top chess grandmasters visualize multiple moves ahead.' },
  { w: 'visible', ipa: '/ˈvɪz.ə.bəl/', pos: 'adj.', zh: '肉眼可見的、顯著的', root: 'r_vis', topic: 'sci-fi', tag: 'B1 / 基礎核心', m: 'vis(看) + -ible = 能被目光捕捉辨識的', ex: 'The Milky Way was clearly visible in the remote desert night.' },
  { w: 'invisible', ipa: '/ɪnˈvɪz.ə.bəl/', pos: 'adj.', zh: '隱形的、看不見的', root: 'r_vis', topic: 'sci-fi', tag: 'B1 / 奇幻科幻', m: 'in-(不) + visible = 無法被肉眼察覺看見的', ex: 'Microorganisms remain invisible to the naked human eye.' },
  { w: 'vision', ipa: '/ˈvɪʒ.ən/', pos: 'n.', zh: '視力、遠見、宏圖宏願', root: 'r_vis', topic: 'business', tag: 'B1 / 創業領導', m: 'vis(看) + -ion = 洞見未來的深邃目光', ex: 'Steve Jobs possessed a relentless vision for consumer tech.' },
  { w: 'visionary', ipa: '/ˈvɪʒ.ən.er.i/', pos: 'adj.', zh: '具遠見卓識的；先驅者', root: 'r_vis', topic: 'business', tag: 'C1 / 人物評析', m: 'vision + -ary = 具超凡戰略目光之人', ex: 'The visionary architect designed carbon-neutral vertical cities.' },
  { w: 'evident', ipa: '/ˈev.ɪ.dənt/', pos: 'adj.', zh: '明顯的、顯而易見的', root: 'r_vis', topic: 'cinema', tag: 'B2 / 托福學術', m: 'e-(朝外) + vid(看) + -ent = 清楚擺在眼前任人觀覽', ex: 'It was evident that the expedition had prepared for every contingency.' },
  { w: 'evidence', ipa: '/ˈev.ɪ.dəns/', pos: 'n.', zh: '證據、物證痕跡', root: 'r_vis', topic: 'cinema', tag: 'B1 / 司法科學', m: 'evident + -ce = 能證實事實的客觀憑證', ex: 'DNA evidence conclusively tied the suspect to the weapon.' },
  { w: 'supervise', ipa: '/ˈsuː.pə.vaɪz/', pos: 'v.', zh: '監督、指導視察', root: 'r_vis', topic: 'business', tag: 'B2 / 職場管理', m: 'super-(在上方) + vise(巡視) = 站在高處審視全員作業', ex: 'A certified master craftsman supervised the apprentice.' },
  { w: 'supervisor', ipa: '/ˈsuː.pə.vaɪ.zər/', pos: 'n.', zh: '主管、監督員、導師', root: 'r_vis', topic: 'business', tag: 'B1 / 職場組織', m: 'supervise + -or = 負責監督進度之領導', ex: 'Please submit your quarterly project report directly to your supervisor.' },

  // === 引導與培育系列 (duc / duct) ===
  { w: 'deduce', ipa: '/dɪˈdjuːs/', pos: 'v.', zh: '演繹推斷、推論得出', root: 'r_duc', topic: 'cinema', tag: 'C1 / 邏輯推理', m: 'de-(從上至下) + duce(引領) = 由已知普遍前提出發引導出結論', ex: 'Sherlock deduced the origin of the clay from the client’s boots.' },
  { w: 'deduction', ipa: '/dɪˈdʌk.ʃən/', pos: 'n.', zh: '演繹推理；扣除額', root: 'r_duc', topic: 'cinema', tag: 'C1 / 邏輯稅務', m: 'deduce + -tion = 步步推演之思維過程', ex: 'The conclusion was reached through pure logical deduction.' },
  { w: 'conduct', ipa: '/kənˈdʌkt/', pos: 'v.', zh: '引導、實施、指揮；行為', root: 'r_duc', topic: 'business', tag: 'B2 / 學術商業', m: 'con-(共同) + duct(引導) = 帶領全體朝既定方向邁進', ex: 'The aerospace team conducted a high-velocity wind tunnel test.' },
  { w: 'conductor', ipa: '/kənˈdʌk.tər/', pos: 'n.', zh: '指揮家；導體；列車長', root: 'r_duc', topic: 'animation', tag: 'B1 / 藝術物理', m: 'conduct + -or = 導引電流或引領樂團之人', ex: 'Copper is an exceptionally efficient conductor of electricity.' },
  { w: 'produce', ipa: '/prəˈdjuːs/', pos: 'v.', zh: '生產、製造、孕育產出', root: 'r_duc', topic: 'business', tag: 'A2 / 基礎必備', m: 'pro-(向前) + duce(帶出來) = 將原物料引導產出成新產品', ex: 'The animation studio produces award-winning feature films.' },
  { w: 'product', ipa: '/ˈprɒd.ʌkt/', pos: 'n.', zh: '產品、產物、成果', root: 'r_duc', topic: 'business', tag: 'A2 / 基礎核心', m: 'produce + -t = 最終被製造出之成品', ex: 'User experience is at the heart of our software product.' },
  { w: 'productive', ipa: '/prəˈdʌk.tɪv/', pos: 'adj.', zh: '高生產力的、富有成效的', root: 'r_duc', topic: 'business', tag: 'B1 / 職場必備', m: 'product + -ive = 能源源不絕產出效益的', ex: 'The morning brainstorming session was remarkably productive.' },
  { w: 'productivity', ipa: '/ˌprɒd.ʌkˈtɪv.ə.ti/', pos: 'n.', zh: '生產力、產能指標', root: 'r_duc', topic: 'business', tag: 'B2 / 經貿管理', m: 'productive + -ity = 產出量能之衡量標準', ex: 'Automation tools significantly elevate engineering productivity.' },
  { w: 'reduce', ipa: '/rɪˈdjuːs/', pos: 'v.', zh: '減少、降低、減輕負擔', root: 'r_duc', topic: 'sitcom', tag: 'A2 / 基礎核心', m: 're-(向後) + duce(牽引) = 把數字或重量向後拉回縮減', ex: 'Mindfulness meditation helps reduce cortisol and acute stress.' },
  { w: 'reduction', ipa: '/rɪˈdʌk.ʃən/', pos: 'n.', zh: '縮減、下降幅度', root: 'r_duc', topic: 'business', tag: 'B2 / 數據分析', m: 'reduce + -tion = 規模壓縮縮小之幅度', ex: 'The factory achieved a 40% reduction in carbon emissions.' },

  // === 書寫與紀錄系列 (scrib / script / gram) ===
  { w: 'describe', ipa: '/dɪˈskraɪb/', pos: 'v.', zh: '描述、描繪特質', root: 'r_scrib', topic: 'cinema', tag: 'A2 / 基礎必備', m: 'de-(徹底) + scribe(寫畫) = 以文字將細節徹底勾勒', ex: 'Witnesses described a masked figure fleeing the crime scene.' },
  { w: 'description', ipa: '/dɪˈskrɪp.ʃən/', pos: 'n.', zh: '描述、說明文字', root: 'r_scrib', topic: 'sitcom', tag: 'A2 / 基礎核心', m: 'describe + -tion = 寫下的描述記錄', ex: 'The job description outlines core technical competencies.' },
  { w: 'descriptive', ipa: '/dɪˈskrɪp.tɪv/', pos: 'adj.', zh: '生動描述的、描寫細緻的', root: 'r_scrib', topic: 'animation', tag: 'B2 / 文學修辭', m: 'description + -ive = 善於細緻刻畫特徵的', ex: 'The novelist is renowned for her lavish descriptive prose.' },
  { w: 'subscribe', ipa: '/səbˈskraɪb/', pos: 'v.', zh: '訂閱；贊同認可', root: 'r_scrib', topic: 'sitcom', tag: 'A2 / 數位生活', m: 'sub-(在底層) + scribe(簽字) = 在契約底部簽字同意定期付款', ex: 'Millions of curious learners subscribe to the science journal.' },
  { w: 'subscription', ipa: '/səbˈskrɪp.ʃən/', pos: 'n.', zh: '訂閱會員資格、月費制', root: 'r_scrib', topic: 'business', tag: 'B1 / 軟體商業', m: 'subscribe + -tion = 訂閱契約形態', ex: 'Cloud SaaS platforms rely on predictable recurring subscription revenue.' },
  { w: 'prescribe', ipa: '/prɪˈskraɪb/', pos: 'v.', zh: '開處方籤；明文規定', root: 'r_scrib', topic: 'sitcom', tag: 'B2 / 醫療法規', m: 'pre-(事先) + scribe(寫明) = 事先把用藥或守則寫定', ex: 'The physician prescribed a gentle course of antibiotics.' },
  { w: 'prescription', ipa: '/prɪˈskrɪp.ʃən/', pos: 'n.', zh: '處方箋；藥品配方', root: 'r_scrib', topic: 'sitcom', tag: 'B1 / 生活必備', m: 'prescribe + -tion = 醫生所寫具法律效力之用藥令', ex: 'Take this prescription to the nearest licensed pharmacy.' },
  { w: 'transcript', ipa: '/ˈtræn.skrɪpt/', pos: 'n.', zh: '逐字錄音稿；學業成績單', root: 'r_scrib', topic: 'business', tag: 'B2 / 留學申請', m: 'trans-(轉換) + script(寫下) = 把口頭錄音轉寫成書面文字', ex: 'The candidate submitted her certified university academic transcript.' },
  { w: 'manuscript', ipa: '/ˈmæn.jə.skrɪpt/', pos: 'n.', zh: '手稿、原稿文稿', root: 'r_scrib', topic: 'cinema', tag: 'C1 / 文學典籍', m: 'manu-(手部) + script(書寫) = 古人用雙手一筆一劃刻寫的手卷', ex: 'Monks meticulously preserved ancient Greek manuscripts through the Dark Ages.' },
  { w: 'inscribe', ipa: '/ɪnˈskraɪb/', pos: 'v.', zh: '題寫、雕刻銘記於', root: 'r_scrib', topic: 'sci-fi', tag: 'C1 / 典籍歷史', m: 'in-(在表面內部) + scribe(刻寫) = 銘刻在石碑或心房深處', ex: 'The hero’s valiant deeds were permanently inscribed upon the granite monument.' },

  // === 信任與信念系列 (cred / fid) ===
  { w: 'credible', ipa: '/ˈkred.ə.bəl/', pos: 'adj.', zh: '可信的、可靠的', root: 'r_cred', topic: 'business', tag: 'B2 / 新聞傳媒', m: 'cred(相信) + -ible = 具足夠依據讓人願意信任的', ex: 'The intelligence agency cited multiple credible independent sources.' },
  { w: 'incredible', ipa: '/ɪnˈkred.ə.bəl/', pos: 'adj.', zh: '難以置信的、驚艷絕倫的', root: 'r_cred', topic: 'animation', tag: 'A2 / 口語核心', m: 'in-(不) + credible = 精彩壯闊到讓人根本不敢置信', ex: 'The acrobat executed an incredible triple somersault mid-air.' },
  { w: 'credit', ipa: '/ˈkred.ɪt/', pos: 'n.', zh: '信用、功勞榮譽、學分', root: 'r_cred', topic: 'business', tag: 'A2 / 金融學業', m: 'cred(信賴) + -it = 社會因信任而賦予的償還度或榮譽', ex: 'Give credit where credit is due for this monumental team victory.' },
  { w: 'credential', ipa: '/krɪˈden.ʃəl/', pos: 'n.', zh: '證書、資格憑證、資歷', root: 'r_cred', topic: 'business', tag: 'C1 / 職場留學', m: 'cred(信任) + -ential = 能夠向世人證明專業信任度的印信', ex: 'The cybersecurity analyst possessed elite ethical hacking credentials.' },
  { w: 'creed', ipa: '/kriːd/', pos: 'n.', zh: '信仰信條、核心綱領', root: 'r_cred', topic: 'cinema', tag: 'C1 / 影視哲學', m: 'cred(信奉之物) = 畢生堅守毫不動搖之信念', ex: 'The assassin lived by a strict personal creed of honor.' },

  // === 轉變與逆轉系列 (vert / vers / volv) ===
  { w: 'reverse', ipa: '/rɪˈvɜːs/', pos: 'v.', zh: '逆轉、反轉、倒車', root: 'r_vert', topic: 'sci-fi', tag: 'B1 / 科技生活', m: 're-(向後) + verse(轉) = 讓前進齒輪轉回相反方向', ex: 'The supreme court decisively reversed the lower court’s ruling.' },
  { w: 'diverse', ipa: '/daɪˈvɜːs/', pos: 'adj.', zh: '多樣化的、各色紛呈的', root: 'r_vert', topic: 'animation', tag: 'B2 / 留學學術', m: 'di-(朝不同路徑) + verse(轉移) = 各路徑百花齊放開展', ex: 'Coral reefs host an astonishingly diverse marine ecosystem.' },
  { w: 'diversity', ipa: '/daɪˈvɜː.sə.ti/', pos: 'n.', zh: '多樣性、多元化', root: 'r_vert', topic: 'animation', tag: 'B2 / 社會生態', m: 'diverse + -ity = 多元異質包容的特質', ex: 'Biodiversity is essential to planetary ecological equilibrium.' },
  { w: 'convert', ipa: '/kənˈvɜːt/', pos: 'v.', zh: '轉換、變換格式、皈依', root: 'r_vert', topic: 'sci-fi', tag: 'B2 / 科技生活', m: 'con-(完全) + vert(轉化) = 徹底轉變其原初形態', ex: 'Solar photovoltaic cells directly convert sunlight into usable electricity.' },
  { w: 'conversion', ipa: '/kənˈvɜː.ʒən/', pos: 'n.', zh: '轉換率、轉化歷程', root: 'r_vert', topic: 'business', tag: 'B2 / 行銷科技', m: 'convert + -ion = 形態或客群轉變之指標', ex: 'Optimizing checkout flows led to an immediate 25% bump in sales conversion.' },
  { w: 'subvert', ipa: '/səbˈvɜːt/', pos: 'v.', zh: '顛覆、破壞常規體制', root: 'r_vert', topic: 'cinema', tag: 'C1 / 批判哲學', m: 'sub-(在底層) + vert(翻轉) = 從地基把整座建築翻倒顛覆', ex: 'The indie director deliberately subverted classic superhero tropes.' },
  { w: 'subversive', ipa: '/səbˈvɜː.sɪv/', pos: 'adj.', zh: '具顛覆性的、反叛傳統的', root: 'r_vert', topic: 'cinema', tag: 'C1 / 藝術評論', m: 'subvert + -ive = 企圖衝擊打破體制的', ex: 'Satirical political art is fundamentally subversive by nature.' },
  { w: 'introvert', ipa: '/ˈɪn.trə.vɜːt/', pos: 'n.', zh: '內向者、喜好獨處之人', root: 'r_vert', topic: 'sitcom', tag: 'B2 / 心理性格', m: 'intro-(朝向內部) + vert(轉向) = 精神能量朝自我心靈深處流轉之人', ex: 'An introvert often recharges energy through quiet solitude.' },
  { w: 'extrovert', ipa: '/ˈek.strə.vɜːt/', pos: 'n.', zh: '外向者、熱衷社交之人', root: 'r_vert', topic: 'sitcom', tag: 'B2 / 心理性格', m: 'extro-(朝向外部) + vert(轉向) = 熱愛在外部人群互動中獲取能量者', ex: 'Extroverts naturally flourish in lively and crowded social gatherings.' },

  // === 演進與滾動系列 (volu / volv / grad) ===
  { w: 'evolve', ipa: '/ɪˈvɒlv/', pos: 'v.', zh: '演化、逐步進化發展', root: 'r_volu', topic: 'animation', tag: 'B2 / 雅思核心', m: 'e-(向外) + volv(滾動展現) = 層層向外滾動破殼展開', ex: 'Language continuously evolves to mirror societal progress.' },
  { w: 'evolution', ipa: '/ˌev.əˈluː.ʃən/', pos: 'n.', zh: '演化進程、進化論', root: 'r_volu', topic: 'sci-fi', tag: 'B2 / 生物科技', m: 'evolve + -tion = 物種跨世代演進之路', ex: 'Darwin’s theory of evolution fundamentally transformed modern biology.' },
  { w: 'evolutionary', ipa: '/ˌev.əˈluː.ʃən.ər.i/', pos: 'adj.', zh: '演化上的、進化的', root: 'r_volu', topic: 'sci-fi', tag: 'C1 / 生物學術', m: 'evolution + -ary = 屬於生物適應演化的', ex: 'Flight was a colossal evolutionary leap for early avian ancestors.' },
  { w: 'revolution', ipa: '/ˌrev.əˈluː.ʃən/', pos: 'n.', zh: '革命巨變、軌道公轉', root: 'r_volu', topic: 'sci-fi', tag: 'B1 / 歷史科學', m: 're-(重新翻轉) + volu(滾動) + -tion = 整體體制的翻天巨變', ex: 'The industrial revolution radically altered human society.' },
  { w: 'revolutionize', ipa: '/ˌrev.əˈluː.ʃən.aɪz/', pos: 'v.', zh: '掀起革命性巨變、顛覆重塑', root: 'r_volu', topic: 'business', tag: 'C1 / 科技商業', m: 'revolution + -ize = 以顛覆性技術徹底改造產業', ex: 'Generative AI is poised to revolutionize automated creative workflows.' },
  { w: 'revolve', ipa: '/rɪˈvɒlv/', pos: 'v.', zh: '環繞旋轉、以...為中心圍繞', root: 'r_volu', topic: 'sci-fi', tag: 'B2 / 天文力學', m: 're-(反覆) + volv(滾動) = 繞著同一核心圓點旋轉', ex: 'The entire plot revolves around a clandestine quantum heist.' },
  { w: 'involve', ipa: '/ɪnˈvɒlv/', pos: 'v.', zh: '包含、涉及、使捲入其中', root: 'r_volu', topic: 'sitcom', tag: 'B1 / 核心基礎', m: 'in-(朝內) + volve(包裹滾動) = 把所有人一同捲進事件漩渦', ex: 'Advanced filmmaking involves hundreds of specialized artisans.' },
  { w: 'involvement', ipa: '/ɪnˈvɒlv.mənt/', pos: 'n.', zh: '參與度、涉入程度', root: 'r_volu', topic: 'business', tag: 'B2 / 專案管理', m: 'involve + -ment = 親身投入參與之狀態', ex: 'Her deep involvement in community outreach inspired the neighborhood.' },

  // === 邁步與前進系列 (gress / grad) ===
  { w: 'progress', ipa: '/ˈprəʊ.ɡres/', pos: 'n.', zh: '進步、邁進歷程', root: 'r_gress', topic: 'animation', tag: 'A2 / 核心必備', m: 'pro-(向前) + gress(邁步) = 步履堅定朝目標走去', ex: 'Steady consistent practice leads to meaningful creative progress.' },
  { w: 'progressive', ipa: '/prəˈɡres.ɪv/', pos: 'adj.', zh: '漸進的、思想前衛革新的', root: 'r_gress', topic: 'business', tag: 'B2 / 社會人文', m: 'progress + -ive = 勇於探索突破邊界的', ex: 'The studio is renowned for its progressive storytelling choices.' },
  { w: 'gradual', ipa: '/ˈɡrædʒ.u.əl/', pos: 'adj.', zh: '循序漸進的、逐步緩慢的', root: 'r_gress', topic: 'business', tag: 'B1 / 核心基礎', m: 'grad(台階) + -ual = 一階一階拾級而上', ex: 'The patient made a gradual but steady recovery.' },
  { w: 'graduate', ipa: '/ˈɡrædʒ.u.eɪt/', pos: 'v.', zh: '畢業；進階提升', root: 'r_gress', topic: 'business', tag: 'A2 / 學業生活', m: 'grad(台階步階) + -ate = 跨越一個學習階段', ex: 'She graduated with highest honors in computational linguistics.' },
  { w: 'aggressive', ipa: '/əˈɡres.ɪv/', pos: 'adj.', zh: '具攻擊性的；積極有闖勁的', root: 'r_gress', topic: 'cinema', tag: 'B2 / 商業心理', m: 'ad-(衝向) + gress(大步逼近) + -ive = 氣勢如虹迎面壓制而來', ex: 'The startup adopted an aggressive expansion strategy.' },
  { w: 'aggression', ipa: '/əˈɡreʃ.ən/', pos: 'n.', zh: '侵略行為、好鬥之氣', root: 'r_gress', topic: 'cinema', tag: 'B2 / 影視對峙', m: 'aggressive + -ion = 具攻擊挑釁之行為態勢', ex: 'Unprovoked military aggression was condemned by international allies.' },

  // === 科技與生物遠程系列 (bio / tele / micro / auto) ===
  { w: 'biology', ipa: '/baɪˈɒl.ə.dʒi/', pos: 'n.', zh: '生物學、生命體機制', root: 'r_bio', topic: 'sci-fi', tag: 'A2 / 自然科學', m: 'bio(生命) + -ology(學問) = 探索生命運轉機制的科學', ex: 'Molecular biology unraveled the secrets of genetic inheritance.' },
  { w: 'biography', ipa: '/baɪˈɒɡ.rə.fi/', pos: 'n.', zh: '傳記、生平錄', root: 'r_bio', topic: 'cinema', tag: 'B1 / 人文書籍', m: 'bio(生命人生) + graph(書寫記錄) = 把一個人的一生躍然紙上', ex: 'Walter Isaacson penned the bestselling biography of Steve Jobs.' },
  { w: 'antibiotic', ipa: '/ˌæn.ti.baɪˈɒt.ɪk/', pos: 'n.', zh: '抗生素、抗生藥劑', root: 'r_bio', topic: 'sci-fi', tag: 'B2 / 醫學常識', m: 'anti-(對抗) + bio(細菌生命) + -ic = 專門殺滅病菌生命之物', ex: 'Overusing antibiotics can spur the rise of drug-resistant superbugs.' },
  { w: 'telescope', ipa: '/ˈtel.ɪ.skəʊp/', pos: 'n.', zh: '望遠鏡', root: 'p_tele', topic: 'sci-fi', tag: 'A2 / 天文觀測', m: 'tele-(遠距) + scope(凝視鏡片) = 用來凝視極度遙遠深空的儀器', ex: 'The James Webb Space Telescope peers billions of light-years into the past.' },
  { w: 'automatic', ipa: '/ˌɔː.təˈmæt.ɪk/', pos: 'adj.', zh: '自動的、不假思索的', root: 'p_auto', topic: 'business', tag: 'A2 / 科技生活', m: 'auto-(自己) + mat(意念動作) + -ic = 設備無須人工干預自主運轉', ex: 'Modern smart cars feature automatic emergency collision braking.' },
  { w: 'automation', ipa: '/ˌɔː.təˈmeɪ.ʃən/', pos: 'n.', zh: '自動化工程', root: 'p_auto', topic: 'business', tag: 'B2 / 工業科技', m: 'automatic + -tion = 以機器軟體全自動運轉之流程', ex: 'Robotic process automation eliminates tedious data entry tasks.' },
  { w: 'microscope', ipa: '/ˈmaɪ.krə.skəʊp/', pos: 'n.', zh: '顯微鏡', root: 'p_micro', topic: 'sci-fi', tag: 'A2 / 基礎科學', m: 'micro-(微觀微細) + scope(看) = 專門看清肉眼不可見微粒的鏡面', ex: 'The electron microscope revealed the intricate structure of the virus.' },
  { w: 'symbiosis', ipa: '/ˌsɪm.baɪˈəʊ.sɪs/', pos: 'n.', zh: '共生關係、互利共榮', root: 'r_bio', topic: 'sci-fi', tag: 'C1 / 生態科幻', m: 'sym-(共同) + bio(生命) + -sis = 兩種生命互相依存共同生活', ex: 'Venom and Eddie Brock form a volatile symbiotic partnership.' },
]

// 產出 master-lexicon.json 擴充包
const outputDir = path.resolve('public', 'vocab')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const masterLexicon = RAW_VOCAB.map((item) => ({
  id: `w_gen_${item.w}`,
  word: item.w,
  ipa: item.ipa,
  pos: [item.pos],
  meanings: [item.zh],
  meaningsZh: [item.zh],
  rootIds: [item.root],
  levelTag: item.tag,
  topic: item.topic,
  mnemonic: item.m,
  examples: [{ en: item.ex, zh: item.zh }],
}))

const outputPath = path.join(outputDir, 'master-lexicon.json')
fs.writeFileSync(outputPath, JSON.stringify(masterLexicon, null, 2), 'utf8')
console.log(`Generated ${masterLexicon.length} master words in ${outputPath}`)
