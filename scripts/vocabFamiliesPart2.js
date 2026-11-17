// scripts/vocabFamiliesPart2.js
// 擴充詞根家族數據庫 Part 2 (ven, cid, cur, fer, flu, flect, jud, loc, luc, nov, pan, phil, phob, pon, rog, sequ, sens, sed, tang, ten, tort, voc, anim, cord, corp, equ, fid, fort, grat, grav, leg, liber, magn, mem, mort, nom, oper, psych, sci, spir, term, vac, viv)

export const EXTENDED_FAMILIES_PART2 = [
  // 1. ven / vent (來臨/事件)
  {
    rootId: 'r_ven',
    words: [
      { w: 'invent', ipa: '/ɪnˈvent/', pos: ['v.'], zh: '發明、創造發想', tag: 'A2 / 基礎必備', topic: 'sci-fi', m: 'in-(朝內心) + vent(來到) = 靈感降臨腦海化為全新發明', ex: 'Nikola Tesla invented the alternating current induction motor.' },
      { w: 'invention', ipa: '/ɪnˈven.ʃən/', pos: ['n.'], zh: '發明物、開創性發明', tag: 'A2 / 基礎必備', topic: 'sci-fi', m: 'invent + -ion = 改變世界之原創發明', ex: 'The invention of movable type printing revolutionized literacy.' },
      { w: 'inventor', ipa: '/ɪnˈven.tər/', pos: ['n.'], zh: '發明家、開拓者', tag: 'A2 / 職業稱頌', topic: 'sci-fi', m: 'invent + -or = 專門催生全新科技之先驅', ex: 'The eccentric inventor spent decades perfecting his humanoid automaton.' },
      { w: 'inventive', ipa: '/ɪnˈven.tɪv/', pos: ['adj.'], zh: '富有創意獨創性的', tag: 'B2 / 創新褒獎', topic: 'animation', m: 'invent + -ive = 靈感激盪層出不窮的', ex: 'The animator developed an inventive rigging method for feathered creatures.' },
      { w: 'event', ipa: '/ɪˈvent/', pos: ['n.'], zh: '事件、重大活動；比賽項目', tag: 'A1 / 必備名詞', topic: 'sitcom', m: 'e-(向外凸顯) + vent(到來) = 在時空舞台上隆重登場的重大事件', ex: 'The summer animation film festival is the premier cultural event of the year.' },
      { w: 'eventual', ipa: '/ɪˈven.tʃu.əl/', pos: ['adj.'], zh: '最終的、終將到來的', tag: 'B2 / 歷史推演', topic: 'business', m: 'event + -ual = 歷經波折後最終必將降臨的', ex: 'Consistent investment in clean technology led to eventual market dominance.' },
      { w: 'eventually', ipa: '/ɪˈven.tʃu.ə.li/', pos: ['adv.'], zh: '終於、最後終究', tag: 'A2 / 核心副詞', topic: 'sitcom', m: 'eventual + -ly = 歷經滄桑終能成真地', ex: 'After years of rejection, the determined author eventually signed a publishing deal.' },
      { w: 'prevent', ipa: '/prɪˈvent/', pos: ['v.'], zh: '預防、防止阻礙', tag: 'A2 / 核心基礎', topic: 'business', m: 'pre-(事先) + vent(來到) = 事先站在必經之路上阻擋災禍', ex: 'Regular software audits prevent catastrophic database security breaches.' },
      { w: 'prevention', ipa: '/prɪˈven.ʃən/', pos: ['n.'], zh: '預防預防措施、防疫作業', tag: 'B1 / 醫學安全', topic: 'business', m: 'prevent + -ion = 防患於未然之預防機制', ex: 'Public health campaigns emphasize preventive hygiene over reactive cures.' },
      { w: 'intervene', ipa: '/ˌɪn.təˈviːn/', pos: ['v.'], zh: '介入干預、調停斡旋', tag: 'B2 / 外交政治', topic: 'cinema', m: 'inter-(兩者之間) + vene(走入來到) = 走進交鋒雙方中央阻止衝突', ex: 'UN peacekeepers had to intervene to safeguard the humanitarian corridor.' },
      { w: 'intervention', ipa: '/ˌɪn.təˈven.ʃən/', pos: ['n.'], zh: '介入干預、心理輔導介入', tag: 'B2 / 醫學心理', topic: 'cinema', m: 'intervene + -ion = 官方或醫療力量的實質介入', ex: 'Early clinical intervention significantly improves speech development in toddlers.' },
      { w: 'convenient', ipa: '/kənˈviː.ni.ənt/', pos: ['adj.'], zh: '便利的、方便省事的', tag: 'A1 / 必備生活', topic: 'sitcom', m: 'con-(共同) + ven(走到一起) + -ient = 各項條件齊備極其順手順路的', ex: 'Mobile payments make shopping abroad remarkably fast and convenient.' },
      { w: 'convenience', ipa: '/kənˈviː.ni.əns/', pos: ['n.'], zh: '便利便利性；便利商店', tag: 'A2 / 生活商務', topic: 'sitcom', m: 'convenient + -ce = 享受省心便捷的生活機能', ex: 'Living near a subway line offers unrivaled urban convenience.' },
      { w: 'convention', ipa: '/kənˈven.ʃən/', pos: ['n.'], zh: '大型年會；傳統常規習俗', tag: 'B1 / 職場文藝', topic: 'animation', m: 'con-(聚合) + vent(來聚) + -ion = 眾人共聚一堂之盛會，或約定俗成之規則', ex: 'Thousands of cosplayers attended the international comic convention.' },
      { w: 'conventional', ipa: '/kənˈven.ʃən.əl/', pos: ['adj.'], zh: '傳統常規的、因循守舊的', tag: 'B2 / 思考評價', topic: 'business', m: 'convention + -al = 墨守傳統成規不加思索的', ex: 'The bold startup discarded conventional hierarchical corporate ladders.' },
      { w: 'unconventional', ipa: '/ˌʌn.kənˈven.ʃən.əl/', pos: ['adj.'], zh: '非傳統的、不落窠臼別出心裁的', tag: 'B2 / 藝術創新', topic: 'animation', m: 'un-(非) + conventional = 獨樹一幟大膽跳脫常規的', ex: 'The animator used unconventional watercolor textures for the cyberpunk city.' },
      { w: 'revenue', ipa: '/ˈrev.ən.juː/', pos: ['n.'], zh: '總營收、國家稅收', tag: 'B2 / 財務金融', topic: 'business', m: 're-(回到帳戶) + venue(到來之財富) = 經由銷售滾滾流回口袋的收入', ex: 'Subscription streaming platforms recorded record annual software revenue.' },
      { w: 'avenue', ipa: '/ˈæv.ə.njuː/', pos: ['n.'], zh: '林蔭大道；途徑可能方案', tag: 'A2 / 都市生活', topic: 'business', m: 'ad-(朝向) + venue(走至之處) = 寬廣筆直的大道或邁向成功的途徑', ex: 'Researchers are exploring promising new avenues in genetic immunotherapy.' },
      { w: 'venture', ipa: '/ˈven.tʃər/', pos: ['n.', 'v.'], zh: '創投冒險投資；冒險前行', tag: 'B2 / 商業新創', topic: 'business', m: 'advent(迎向未知而來) = 承擔風險勇闖藍海之新創冒險', ex: 'Venture capitalists poured millions into the generative audio AI startup.' },
      { w: 'advent', ipa: '/ˈæd.vent/', pos: ['n.'], zh: '劃時代來臨、問世降臨', tag: 'C1 / 歷史文化', topic: 'sci-fi', m: 'ad-(朝著世間) + vent(降臨走來) = 重大科技或時代劃時代的來臨', ex: 'The advent of mobile broadband permanently transformed human communication.' },
      { w: 'circumvent', ipa: '/ˌsɜː.kəmˈvent/', pos: ['v.'], zh: '規避繞開法規審查', tag: 'C1 / 法律黑客', topic: 'business', m: 'circum-(環繞周圍) + vent(繞著走過去) = 巧妙繞過正面關卡迂迴前進', ex: 'Hackers exploited an unpatched buffer vulnerability to circumvent security firewalls.' }
    ]
  },

  // 2. cid / cis (切割/殺死/決斷)
  {
    rootId: 'r_cid',
    words: [
      { w: 'decide', ipa: '/dɪˈsaɪd/', pos: ['v.'], zh: '決定、裁奪斷定', tag: 'A1 / 必備核心', topic: 'sitcom', m: 'de-(斬斷退路) + cide(切除) = 一刀斬斷猶豫不決痛下決心', ex: 'The judges deliberated for three hours before deciding the grand prize winner.' },
      { w: 'decision', ipa: '/dɪˈsɪʒ.ən/', pos: ['n.'], zh: '決定、決心判斷', tag: 'A2 / 基礎必備', topic: 'business', m: 'decide + -ion = 斬釘截鐵做出的重大決擇', ex: 'Executive leadership backed the strategic decision to open an overseas branch.' },
      { w: 'decisive', ipa: '/dɪˈsaɪ.sɪv/', pos: ['adj.'], zh: '果敢決斷的；決定性的', tag: 'B2 / 領導氣質', topic: 'business', m: 'decide + -ive = 臨危不亂快刀斬亂麻的', ex: 'A decisive counterattack by the defending fleet turned the tide of battle.' },
      { w: 'indecisive', ipa: '/ˌɪn.dɪˈsaɪ.sɪv/', pos: ['adj.'], zh: '優柔寡斷的、搖擺不定的', tag: 'B2 / 人格性格', topic: 'sitcom', m: 'in-(不) + decisive = 舉棋不定遲遲無法下決心的', ex: 'An indecisive battlefield commander endangers the lives of his soldiers.' },
      { w: 'precise', ipa: '/prɪˈsaɪs/', pos: ['adj.'], zh: '精確的、嚴絲合縫的', tag: 'B1 / 科技工藝', topic: 'sci-fi', m: 'pre-(事先) + cise(切削修整) = 預先修剪多餘毛邊做到分毫不差', ex: 'The brain surgeon made a micro-precise laser incision to remove the cyst.' },
      { w: 'precision', ipa: '/prɪˈsɪʒ.ən/', pos: ['n.'], zh: '精準度、精密度', tag: 'B2 / 高端科技', topic: 'sci-fi', m: 'precise + -ion = 工業與科學對極致精準之追求', ex: 'High-precision computer numerical control lathes manufacture aerospace turbine blades.' },
      { w: 'concise', ipa: '/kənˈsaɪs/', pos: ['adj.'], zh: '簡潔明瞭的、言簡意賅的', tag: 'B2 / 寫作表達', topic: 'business', m: 'con-(完全) + cise(切除贅字) = 剪除所有廢話直指核心之文字', ex: 'Please provide a concise three-sentence executive summary of your thesis.' },
      { w: 'scissors', ipa: '/ˈsɪz.əz/', pos: ['n.'], zh: '剪刀 (雙刃切割器具)', tag: 'A1 / 必備生活', topic: 'sitcom', m: 'cise(剪裁切割) = 生活中不可或缺之裁縫剪紙器具', ex: 'Keep sharp shears and scissors out of reach of curious young children.' },
      { w: 'pesticide', ipa: '/ˈpes.tɪ.saɪd/', pos: ['n.'], zh: '農藥、殺蟲劑', tag: 'B2 / 農業生態', topic: 'business', m: 'pest(害蟲) + cide(殺滅滅絕) = 專門殺滅病蟲害之化學藥劑', ex: 'Organic organic farms prohibit synthetic chemical pesticides and artificial fertilizers.' },
      { w: 'homicide', ipa: '/ˈhɒm.ɪ.saɪd/', pos: ['n.'], zh: '殺人罪、兇殺案件', tag: 'B2 / 警匪刑偵', topic: 'cinema', m: 'homi(人類) + cide(殺害) = 奪取同類性命之刑事重罪', ex: 'Veteran homicide detectives arrived to cordon off the downtown crime scene.' },
      { w: 'suicide', ipa: '/ˈsuː.ɪ.saɪd/', pos: ['n.', 'v.'], zh: '自殺；自毀前程', tag: 'B1 / 心理社會', topic: 'cinema', m: 'sui(自己) + cide(殺死) = 殘酷終結自身性命之悲劇', ex: 'National hotlines provide 24/7 confidential crisis counseling to prevent suicide.' },
      { w: 'incision', ipa: '/ɪnˈsɪʒ.ən/', pos: ['n.'], zh: '切口、手術刀口', tag: 'C1 / 外科醫學', topic: 'cinema', m: 'in-(深入肉體) + cis(切割) + -ion = 外科手術中精確劃開之創口', ex: 'Minimally invasive laparoscopy requires only three tiny centimeter incisions.' }
    ]
  },

  // 3. cur / curs (奔馳/流動)
  {
    rootId: 'r_cur',
    words: [
      { w: 'occur', ipa: '/əˈkɜːr/', pos: ['v.'], zh: '發生、出現；浮現腦海', tag: 'A2 / 核心基礎', topic: 'sitcom', m: 'ob-(迎面) + cur(奔跑而來) = 突發事件迎面撞向現實而發生', ex: 'Earthquakes frequently occur along active tectonic subduction boundaries.' },
      { w: 'occurrence', ipa: '/əˈkʌr.əns/', pos: ['n.'], zh: '發生的事、罕見事件', tag: 'B2 / 論文常考', topic: 'business', m: 'occur + -ence = 時空當中發生之特定事蹟', ex: 'Total solar eclipses are a rare and magnificent astronomical occurrence.' },
      { w: 'recur', ipa: '/rɪˈkɜːr/', pos: ['v.'], zh: '反覆出現、再次發生', tag: 'B2 / 醫學程式', topic: 'sci-fi', m: 're-(反覆) + cur(奔回) = 如同浪潮退去後再度奔馳席捲而來', ex: 'The strange digital audio glitch recurred every time the server rebooted.' },
      { w: 'recurrent', ipa: '/rɪˈkʌr.ənt/', pos: ['adj.'], zh: '反覆出現的、週期發作的', tag: 'B2 / 醫學心理', topic: 'cinema', m: 'recur + -ent = 揮之不去反覆盤旋的', ex: 'The troubled detective suffered from recurrent vivid nightmares of the explosion.' },
      { w: 'current', ipa: '/ˈkʌr.ənt/', pos: ['adj.', 'n.'], zh: '當前的現行的；洋流水流、電流', tag: 'A2 / 核心基礎', topic: 'sci-fi', m: 'cur(奔流前進) + -ent = 奔騰不息的電流或當下正在發生的事物', ex: 'Cold sub-surface Antarctic currents carry rich oxygen toward equatorial waters.' },
      { w: 'currently', ipa: '/ˈkʌr.ənt.li/', pos: ['adv.'], zh: '目前現下、當前', tag: 'A2 / 核心副詞', topic: 'business', m: 'current + -ly = 站在當下這一刻地', ex: 'The software engineering team is currently testing version 3.0 in staging.' },
      { w: 'currency', ipa: '/ˈkʌr.ən.si/', pos: ['n.'], zh: '法定貨幣；流通性普及率', tag: 'B1 / 金融商務', topic: 'business', m: 'cur(流通奔馳) + -cy = 在市場中萬人輾轉流通之金錢交易媒介', ex: 'Cryptocurrency volatility prompts central banks to study sovereign digital currencies.' },
      { w: 'curriculum', ipa: '/kəˈrɪk.jə.ləm/', pos: ['n.'], zh: '學校課程規劃、全套教程', tag: 'B2 / 教育校園', topic: 'business', m: 'cur(奔跑賽道) + -ulum = 學生求學歷程中沿途跑過的全套跑道', ex: 'The academy overhauled its animation curriculum to integrate real-time rendering engines.' },
      { w: 'courier', ipa: '/ˈkʊr.i.ər/', pos: ['n.'], zh: '快遞信差、機密特使', tag: 'B1 / 物流諜戰', topic: 'cinema', m: 'cur(飛奔) + -ier = 腳步如飛攜帶密信奔馳遞送之特派使節', ex: 'A diplomatic courier delivered the sealed treaty under heavy armed guard.' },
      { w: 'precursor', ipa: '/priːˈkɜː.sər/', pos: ['n.'], zh: '前驅、先驅原型、前兆', tag: 'C1 / 科技化學', topic: 'sci-fi', m: 'pre-(事先) + cursor(在前方奔跑者) = 在大部隊到來前先奔至的前驅物', ex: 'Early telegraph lines were the primitive physical precursor of the modern internet.' },
      { w: 'excursion', ipa: '/ɪkˈskɜː.ʃən/', pos: ['n.'], zh: '遠足小旅行、短途考察', tag: 'B1 / 旅遊休閒', topic: 'sitcom', m: 'ex-(走出常軌) + curs(奔跑散心) + -ion = 暫別日常奔向郊野之愜意旅行', ex: 'The school organized a weekend botanical excursion into the redwood forest.' },
      { w: 'discourse', ipa: '/ˈdɪs.kɔːs/', pos: ['n.'], zh: '論述對話、學術話語體系', tag: 'C1 / 哲學批判', topic: 'business', m: 'dis-(朝各方) + course(思路奔流) = 思想在多元對話中奔騰激盪形成的篇章', ex: 'Civil public discourse is essential to bridging deep ideological divides.' }
    ]
  },

  // 4. fer / lat (承載/帶來/產出)
  {
    rootId: 'r_fer',
    words: [
      { w: 'transfer', ipa: '/trænsˈfɜːr/', pos: ['v.', 'n.'], zh: '轉移調任；轉帳；轉機', tag: 'B1 / 核心常考', topic: 'business', m: 'trans-(跨越) + fer(運載) = 將人、資金或資料搬運跨越至新地點', ex: 'She requested a lateral corporate transfer to the London regional office.' },
      { w: 'transferable', ipa: '/trænsˈfɜː.rə.bəl/', pos: ['adj.'], zh: '可轉移的、可轉讓通用的', tag: 'B2 / 職場職能', topic: 'business', m: 'transfer + -able = 跨行業依然能隨身帶走發揮效能的', ex: 'Critical analytical thinking is a universally transferable workplace superpower.' },
      { w: 'refer', ipa: '/rɪˈfɜːr/', pos: ['v.'], zh: '提及談到；查閱參考；轉診', tag: 'B1 / 學術生活', topic: 'business', m: 're-(向後回溯) + fer(引帶) = 將思路引領帶回至先前的資料文獻', ex: 'The keynote speaker referred repeatedly to recent behavioral economics datasets.' },
      { w: 'reference', ipa: '/ˈref.ər.əns/', pos: ['n.'], zh: '參考文獻；推薦函；對照基準', tag: 'B1 / 寫作求職', topic: 'animation', m: 'refer + -ence = 畫師對照的原片參考鏡頭或學術附錄', ex: 'Character animators filmed live-action martial arts footage as visual movement reference.' },
      { w: 'referral', ipa: '/rɪˈfɜː.rəl/', pos: ['n.'], zh: '推薦轉介、轉診單', tag: 'B2 / 醫療求職', topic: 'business', m: 'refer + -al = 熟人引薦或專科醫師轉診介紹', ex: 'Our startup acquired its first enterprise client through a warm alumni referral.' },
      { w: 'prefer', ipa: '/prɪˈfɜːr/', pos: ['v.'], zh: '偏好、更喜愛', tag: 'A2 / 基礎必備', topic: 'sitcom', m: 'pre-(放在最前方) + fer(拿取端出) = 在心秤上將某事物挑出置於最前列', ex: 'Independent comic artists often prefer digital drawing tablets to messy inks.' },
      { w: 'preference', ipa: '/ˈpref.ər.əns/', pos: ['n.'], zh: '偏好嗜好、優先權', tag: 'B1 / 生活常考', topic: 'sitcom', m: 'prefer + -ce = 獨特而專屬的個人愛好喜向', ex: 'Users can customize their UI color and audio preferences in the settings drawer.' },
      { w: 'infer', ipa: '/ɪnˈfɜːr/', pos: ['v.'], zh: '推論推斷出、由線索悟出', tag: 'B2 / 閱讀理解', topic: 'cinema', m: 'in-(深入內部) + fer(帶出真相) = 穿透字裡行間把隱藏的意涵打撈出來', ex: 'From the villain’s trembling fingers, the detective inferred profound fear.' },
      { w: 'inference', ipa: '/ˈɪn.fər.əns/', pos: ['n.'], zh: '推論結果、機器學習模型推論', tag: 'B2 / 人工智能', topic: 'sci-fi', m: 'infer + -ence = 神經網路將輸入特徵轉化產出的預測運算', ex: 'Optimizing tensor quantization accelerates deep neural network model inference.' },
      { w: 'confer', ipa: '/kənˈfɜːr/', pos: ['v.'], zh: '商議商討；授予頒發學位勳章', tag: 'B2 / 會議典禮', topic: 'business', m: 'con-(聚合) + fer(帶出智慧) = 眾人將意見匯聚商討，或將榮譽賦予學者', ex: 'The jury retired behind closed mahogany doors to confer on the final verdict.' },
      { w: 'conference', ipa: '/ˈkɒn.fər.əns/', pos: ['n.'], zh: '大型研討會、正式會議', tag: 'A2 / 職場商務', topic: 'business', m: 'confer + -ce = 產業界產官學聚集交流之高峰會', ex: 'The annual game developers conference unveiled real-time photorealistic tech demos.' },
      { w: 'defer', ipa: '/dɪˈfɜːr/', pos: ['v.'], zh: '推遲延期；聽從服從長者意見', tag: 'B2 / 留學決策', topic: 'business', m: 'de-(擱置一邊) + fer(挪動) = 暫緩開學時程，或恭敬尊重對方的專業判斷', ex: 'The committee voted to defer the campus expansion decision until next autumn.' },
      { w: 'differ', ipa: '/ˈdɪf.ər/', pos: ['v.'], zh: '相異有別、持不同看法', tag: 'B1 / 核心基礎', topic: 'sitcom', m: 'dis-(分開) + fer(承載前行) = 雙方背負的見解各奔東西截然不同', ex: 'Brothers though they were, their worldviews differed on almost every topic.' },
      { w: 'difference', ipa: '/ˈdɪf.ər.əns/', pos: ['n.'], zh: '差異差異處；差額分歧', tag: 'A1 / 必備名詞', topic: 'sitcom', m: 'differ + -ce = 彼此之間顯著的不同之處', ex: 'Even small daily habits make a colossal difference over a span of ten years.' },
      { w: 'different', ipa: '/ˈdɪf.ər.ənt/', pos: ['adj.'], zh: '不同的、與眾不同的', tag: 'A1 / 必備形容詞', topic: 'sitcom', m: 'differ + -ent = 展現多樣樣貌不千篇一律的', ex: 'Explore different storytelling lenses before committing to an animation script.' },
      { w: 'differentiate', ipa: '/ˌdɪf.əˈren.ʃi.eɪt/', pos: ['v.'], zh: '區分辨別；創造產品差異化', tag: 'B2 / 商業行銷', topic: 'business', m: 'different + -iate = 在競爭激烈的紅海市場中開創獨家辨識度', ex: 'Innovative ergonomics differentiated their gaming mouse from standard budget peripherals.' },
      { w: 'suffer', ipa: '/ˈsʌf.ər/', pos: ['v.'], zh: '受苦遭罪、承受挫折損害', tag: 'A2 / 核心基礎', topic: 'cinema', m: 'sub-(在底層) + fer(痛苦承載) = 在命運底下死命扛著煎熬折磨', ex: 'Refugees suffered unimaginable deprivation during the bitter mountain crossing.' },
      { w: 'fertile', ipa: '/ˈfɜː.taɪl/', pos: ['adj.'], zh: '肥沃的豐饒的；靈感源源不絕的', tag: 'B2 / 農業創意', topic: 'animation', m: 'fer(產出結實) + -tile = 能孕育出豐碩果實與絕妙創意的', ex: 'Ancient volcanic ash silt provided exceptionally fertile farmland along the riverbanks.' },
      { w: 'fertility', ipa: '/fəˈtɪl.ə.ti/', pos: ['n.'], zh: '土地肥力；生育率生殖力', tag: 'B2 / 人口地理', topic: 'business', m: 'fertile + -ity = 滋養生命開枝散葉之能量', ex: 'Falling global human fertility rates will dramatically shift twentieth-century demographics.' },
      { w: 'translate', ipa: '/trænzˈleɪt/', pos: ['v.'], zh: '翻譯對譯；轉化為實質行動', tag: 'A2 / 基礎必備', topic: 'cinema', m: 'trans-(跨越語言) + late(搬運過來) = 將意思原汁原味跨越語言藩籬搬運過來', ex: 'Translating nuanced poetry requires poetic mastery in both languages.' },
      { w: 'translation', ipa: '/trænzˈleɪ.ʃən/', pos: ['n.'], zh: '翻譯作品、譯本；細胞蛋白質轉譯', tag: 'A2 / 語言出版', topic: 'cinema', m: 'translate + -ion = 語言文字跨越轉換之成品', ex: 'The authorized Chinese translation captured the dry irony of the British humor.' },
      { w: 'translator', ipa: '/trænzˈleɪ.tər/', pos: ['n.'], zh: '口譯員筆譯家；編譯轉換器', tag: 'A2 / 職業名詞', topic: 'business', m: 'translate + -or = 搭建文明溝通金橋之語言大師', ex: 'The summit translator flawlessly delivered real-time simultaneous French interpretation.' },
      { w: 'relate', ipa: '/rɪˈleɪt/', pos: ['v.'], zh: '關聯相關；感同身受產生共鳴；敘述', tag: 'B1 / 核心基礎', topic: 'sitcom', m: 're-(回到彼此) + late(帶來連結) = 彼此息息相關並能觸動心弦', ex: 'Teenage viewers easily relate to the animated protagonist’s awkward social blunders.' },
      { w: 'relation', ipa: '/rɪˈleɪ.ʃən/', pos: ['n.'], zh: '關係關聯；親戚親族', tag: 'B1 / 社會人際', topic: 'business', m: 'relate + -ion = 人與人或國與國之間的紐帶', ex: 'Bilateral trade relations between the neighboring nations expanded dramatically.' },
      { w: 'relationship', ipa: '/rɪˈleɪ.ʃən.ʃɪp/', pos: ['n.'], zh: '人際情感關係、親密關係', tag: 'A2 / 生活常考', topic: 'sitcom', m: 'relation + -ship = 彼此用心經營的情感連結', ex: 'Honest vulnerability is the bedrock of any lasting healthy partnership.' },
      { w: 'correlate', ipa: '/ˈkɒr.ə.leɪt/', pos: ['v.'], zh: '相互關聯、呈現正負相關', tag: 'B2 / 統計科學', topic: 'business', m: 'con-(共同) + relate = 兩組變數攜手同步波動漲跌', ex: 'High physical aerobic fitness correlates strongly with reduced cognitive decline in elderly populations.' }
    ]
  },

  // 5. flu / flux (流淌/波動)
  {
    rootId: 'r_flu',
    words: [
      { w: 'fluent', ipa: '/ˈfluː.ənt/', pos: ['adj.'], zh: '流利的、流暢優雅的', tag: 'B1 / 語言核心', topic: 'sitcom', m: 'flu(水流潺潺) + -ent = 話語如同清泉飛瀑般自然流淌毫無滯礙', ex: 'Within three immersion years, she was completely fluent in conversational Japanese.' },
      { w: 'fluency', ipa: '/ˈfluː.ən.si/', pos: ['n.'], zh: '流暢度、熟練流利度', tag: 'B1 / 語言學習', topic: 'business', m: 'fluent + -cy = 出口成章行雲流水之功力', ex: 'Achieving conversational fluency requires daily vocal practice with native audio.' },
      { w: 'fluid', ipa: '/ˈfluː.ɪd/', pos: ['adj.', 'n.'], zh: '流動不拘的、靈動自如的；流體液體', tag: 'B2 / 物理藝術', topic: 'animation', m: 'flu(流動) + -id = 如水般靈動隨形無拘無束的', ex: 'Hand-drawn anime fight choreography requires breathtakingly fluid camera arcs.' },
      { w: 'fluidity', ipa: '/fluːˈɪd.ə.ti/', pos: ['n.'], zh: '流暢感、可塑性流動性', tag: 'B2 / 舞蹈美學', topic: 'animation', m: 'fluid + -ity = 動作如行雲流水絲滑轉折之美', ex: 'The animator polished the frames to infuse extraordinary fluidity into the dancer’s spin.' },
      { w: 'influence', ipa: '/ˈɪn.flu.əns/', pos: ['n.', 'v.'], zh: '影響力、感化引導；支配作用', tag: 'B1 / 核心基礎', topic: 'cinema', m: 'in-(朝內心深處) + flu(涓涓流淌) + -ce = 如春風化雨般潛移默化流淌進心坎', ex: 'Akira Kurosawa’s framing exerted an immense influence on modern Hollywood epics.' },
      { w: 'influential', ipa: '/ˌɪn.fluˈen.ʃəl/', pos: ['adj.'], zh: '舉足輕重的、極具影響力的', tag: 'B2 / 讚美評價', topic: 'business', m: 'influence + -ial = 在行業中一言九鼎受人景仰的', ex: 'Time Magazine recognized the AI ethicist as one of the century’s most influential innovators.' },
      { w: 'influx', ipa: '/ˈɪn.flʌks/', pos: ['n.'], zh: '大量湧入、大批湧現 (人口、資金)', tag: 'C1 / 經貿社會', topic: 'business', m: 'in-(朝向內部) + flux(洶湧流動) = 資金或遊客如洪流般灌入', ex: 'The seaside resort town prepares for a massive influx of tourists every July.' },
      { w: 'fluctuate', ipa: '/ˈflʌk.tʃu.eɪt/', pos: ['v.'], zh: '起伏不定、上下波動', tag: 'B2 / 經貿氣候', topic: 'business', m: 'fluct(如波浪般翻湧) + -ate = 數值忽高忽低如海浪顛簸', ex: 'Global crude petroleum prices fluctuate wildly in response to OPEC geopolitical posturing.' },
      { w: 'fluctuation', ipa: '/ˌflʌk.tʃuˈeɪ.ʃən/', pos: ['n.'], zh: '波動起伏、震盪走勢', tag: 'B2 / 數據分析', topic: 'business', m: 'fluctuate + -ion = 曲線忽上忽下的震盪型態', ex: 'Minor currency fluctuations are factored into international shipping tariff models.' },
      { w: 'affluent', ipa: '/ˈæf.lu.ənt/', pos: ['adj.'], zh: '富裕的、腰纏萬貫的、充裕的', tag: 'C1 / 社會經濟', topic: 'sitcom', m: 'ad-(朝向) + flu(如水奔流) + -ent = 財富如同滾滾江水奔湧進家門', ex: 'The family relocated to an affluent historic neighborhood overlooking the harbor.' },
      { w: 'affluence', ipa: '/ˈæf.lu.əns/', pos: ['n.'], zh: '富足繁榮、優渥家境', tag: 'C1 / 社會學術', topic: 'business', m: 'affluent + -ce = 錦衣玉食無虞之富足', ex: 'Material affluence does not automatically confer authentic mental serenity or happiness.' },
      { w: 'superfluous', ipa: '/suːˈpɜː.flu.əs/', pos: ['adj.'], zh: '多餘的、累贅不必要的', tag: 'C2 / 文風精修', topic: 'animation', m: 'super-(滿溢超出) + flu(往外流洩) + -ous = 水桶早已溢出還在倒水的無謂浪費', ex: 'The strict film editor excised all superfluous dialogue to quicken narrative pacing.' }
    ]
  },

  // 6. flect / flex (彎曲/折射)
  {
    rootId: 'r_flect',
    words: [
      { w: 'reflect', ipa: '/rɪˈflekt/', pos: ['v.'], zh: '反射倒映；深思反省、反映事實', tag: 'B1 / 核心基礎', topic: 'cinema', m: 're-(向後回送) + flect(折射回彈) = 光線打在鏡面上折返回彈映出倒影', ex: 'The tranquil mirror lake reflected snow-capped jagged alpine summits.' },
      { w: 'reflection', ipa: '/rɪˈflek.ʃən/', pos: ['n.'], zh: '倒影鏡像；深層沉思省思', tag: 'B1 / 哲學文藝', topic: 'animation', m: 'reflect + -ion = 水中清澈的倒影，或靈魂深處的靜心沉思', ex: 'Quiet journaling affords crucial moments for daily honest self-reflection.' },
      { w: 'reflective', ipa: '/rɪˈflek.tɪv/', pos: ['adj.'], zh: '反射反光的；沉思深省的', tag: 'B2 / 安全文藝', topic: 'sci-fi', m: 'reflect + -ive = 能反光示警或思想深沉的', ex: 'Night runners must don neon jackets equipped with high-visibility reflective bands.' },
      { w: 'deflect', ipa: '/dɪˈflekt/', pos: ['v.'], zh: '偏轉偏折；轉移彈開攻擊批評', tag: 'B2 / 戰術辯論', topic: 'cinema', m: 'de-(彈向一旁) + flect(彎折) = 揮盾將劈斬而來的利箭偏折開去', ex: 'Energy force shields deflected incoming plasma barrage rounds harmlessly.' },
      { w: 'deflection', ipa: '/dɪˈflek.ʃən/', pos: ['n.'], zh: '偏斜偏轉；轉移注意力', tag: 'B2 / 物理心理', topic: 'cinema', m: 'deflect + -ion = 偏轉的角度或避重就輕的轉移手法', ex: 'The soccer goalkeeper’s brilliant finger deflection preserved the championship draw.' },
      { w: 'flexible', ipa: '/ˈflek.sə.bəl/', pos: ['adj.'], zh: '有彈性的、柔韌的；靈活機動的', tag: 'A2 / 職場生活', topic: 'business', m: 'flex(彎曲) + -ible = 能屈能伸遇外力彎折而不斷裂的', ex: 'Modern tech enterprises embrace flexible remote work and asynchronous hours.' },
      { w: 'flexibility', ipa: '/ˌflek.səˈbɪl.ə.ti/', pos: ['n.'], zh: '靈活性、彈性韌性', tag: 'B1 / 體能職場', topic: 'business', m: 'flexible + -ity = 隨局勢靈活調整排布之本領', ex: 'Yoga stretches enhance spinal flexibility and core athletic endurance.' },
      { w: 'inflexible', ipa: '/ɪnˈflek.sə.bəl/', pos: ['adj.'], zh: '僵化的頑固不化的、不可彎曲的', tag: 'B2 / 人格批評', topic: 'business', m: 'in-(不) + flexible = 食古不化不知變通的', ex: 'His inflexible refusal to adopt digital pipeline tools doomed the boutique studio.' },
      { w: 'reflex', ipa: '/ˈriː.fleks/', pos: ['n.'], zh: '本能反應、條件反射', tag: 'B1 / 生理運動', topic: 'animation', m: 're-(本能回彈) + flex(神經反射) = 遇險時未經大腦瞬間啟動的自保反應', ex: 'Professional esports players boast blindingly fast ocular-manual reflexes.' }
    ]
  },

  // 7. jud / jur (評判/法律)
  {
    rootId: 'r_jud',
    words: [
      { w: 'judge', ipa: '/dʒʌdʒ/', pos: ['n.', 'v.'], zh: '法官裁判員；審判評判', tag: 'A2 / 基礎必備', topic: 'cinema', m: 'jud(持法而裁) = 端坐公堂主持正義評斷是非者', ex: 'Do not hastily judge a masterpiece by its unconventional opening sequence.' },
      { w: 'judgment', ipa: '/ˈdʒʌdʒ.mənt/', pos: ['n.'], zh: '判斷力；法庭裁決宣判', tag: 'B1 / 核心基礎', topic: 'business', m: 'judge + -ment = 衡量情勢後做出的成熟明智裁奪', ex: 'Sound executive judgment is demonstrated during volatile corporate crises.' },
      { w: 'judgmental', ipa: '/dʒʌdʒˈmen.təl/', pos: ['adj.'], zh: '動輒批評指責人的、審判式的', tag: 'B2 / 人際性格', topic: 'sitcom', m: 'judgment + -al = 自居道德高點隨意苛責他人的', ex: 'Healthy friendship thrives in an environment free from judgmental gossip.' },
      { w: 'judicious', ipa: '/dʒuːˈdɪʃ.əs/', pos: ['adj.'], zh: '明智審慎的、深思熟慮的', tag: 'C1 / 讚美褒揚', topic: 'business', m: 'jud(睿智裁奪) + -ious = 權衡全局做出最妥當安排的', ex: 'Through judicious deployment of capital reserves, the startup weathered the recession.' },
      { w: 'prejudice', ipa: '/ˈpredʒ.ə.dɪs/', pos: ['n.', 'v.'], zh: '偏見、成見歧視；使蒙受損害', tag: 'B2 / 社會人文', topic: 'cinema', m: 'pre-(未看事先) + judice(下判決) = 尚未了解事實便心存成見妄下定論', ex: 'Education and intercultural empathy serve as the ultimate antidotes to racial prejudice.' },
      { w: 'prejudicial', ipa: '/ˌpredʒ.əˈdɪʃ.əl/', pos: ['adj.'], zh: '有害的、產生損害偏頗的', tag: 'C1 / 法律正式', topic: 'cinema', m: 'prejudice + -ial = 造成不公平偏袒偏見損害的', ex: 'The judge excluded inflammatory hearsay evidence as unduly prejudicial.' },
      { w: 'jury', ipa: '/ˈdʒʊə.ri/', pos: ['n.'], zh: '陪審團、大賽評審委員會', tag: 'B1 / 法律文藝', topic: 'cinema', m: 'jur(宣誓守法) + -y = 誓言憑良知裁決案情的十二公民團體', ex: 'The jury deliberated sequestered in hotel rooms until reaching unanimity.' },
      { w: 'justice', ipa: '/ˈdʒʌs.tɪs/', pos: ['n.'], zh: '正義公理；司法審判官', tag: 'A2 / 核心核心', topic: 'cinema', m: 'just(公義正直) + -ice = 天理昭昭正義必得伸張之大道', ex: 'Superheroes dedicate their eternal vigilance to fighting for truth and justice.' },
      { w: 'justify', ipa: '/ˈdʒʌs.tɪ.faɪ/', pos: ['v.'], zh: '為...辯護證明正當；排版齊行', tag: 'B2 / 論文商務', topic: 'business', m: 'just(正義) + -ify(使成) = 提出無懈可擊的論據證明其正當合理', ex: 'No short-term financial quarterly gain can justify compromising consumer privacy.' },
      { w: 'justification', ipa: '/ˌdʒʌs.tɪ.fɪˈkeɪ.ʃən/', pos: ['n.'], zh: '正當理由、辯解根據', tag: 'B2 / 法律學術', topic: 'business', m: 'justify + -ation = 合理合法的立足根據', ex: 'Self-defense serves as an absolute legal justification against assault charges.' }
    ]
  },

  // 8. loc (地方/定位)
  {
    rootId: 'r_loc',
    words: [
      { w: 'local', ipa: '/ˈləʊ.kəl/', pos: ['adj.', 'n.'], zh: '當地的在地的；本地居民', tag: 'A1 / 必備生活', topic: 'sitcom', m: 'loc(地方) + -al = 屬於周遭在地風土民情的', ex: 'Support local artisan bakeries and sustainable farmers markets.' },
      { w: 'locate', ipa: '/ləʊˈkeɪt/', pos: ['v.'], zh: '查出位置定址；座落設立於', tag: 'A2 / 基礎必備', topic: 'sci-fi', m: 'loc(地點) + -ate = 經由衛星或地圖精確鎖定所在地', ex: 'Search-and-rescue radar drones located the lost hikers in a deep gorge.' },
      { w: 'location', ipa: '/ləʊˈkeɪ.ʃən/', pos: ['n.'], zh: '位置地點；外景拍攝地', tag: 'A1 / 核心基礎', topic: 'cinema', m: 'locate + -ion = 劇組遠赴千里拍攝名場面的實景地', ex: 'The fantasy series was filmed on location across Iceland’s glaciers.' },
      { w: 'relocate', ipa: '/ˌriː.ləʊˈkeɪt/', pos: ['v.'], zh: '遷移搬遷、重新安置', tag: 'B1 / 職場生活', topic: 'business', m: 're-(再次) + locate(落腳) = 將辦公室或家當搬至全新城市', ex: 'The game studio relocated its headquarters to Vancouver for tax incentives.' },
      { w: 'allocate', ipa: '/ˈæl.ə.keɪt/', pos: ['v.'], zh: '撥給分配、配置預算資源', tag: 'B2 / 職場管理', topic: 'business', m: 'ad-(朝向分配) + loc(特定點) + -ate = 將資源精準投放在各專案配額上', ex: 'The board allocated ten percent of revenue to quantum computing research.' },
      { w: 'allocation', ipa: '/ˌæl.əˈkeɪ.ʃən/', pos: ['n.'], zh: '分配額度、資金配置比例', tag: 'B2 / 金融投資', topic: 'business', m: 'allocate + -ion = 資源或資本分配之結構', ex: 'Prudent portfolio asset allocation minimizes downside risk during market crashes.' },
      { w: 'dislocate', ipa: '/ˈdɪs.lə.keɪt/', pos: ['v.'], zh: '使脫臼關節錯位；擾亂打亂常規', tag: 'B2 / 醫學生活', topic: 'sitcom', m: 'dis-(移開分離) + loc(原位) + -ate = 骨節脫離關節窩，或經濟秩序被打亂', ex: 'The stunt performer dislocated his shoulder during a high-wire fall.' }
    ]
  },

  // 9. luc / lum (光亮/闡明)
  {
    rootId: 'r_luc',
    words: [
      { w: 'lucid', ipa: '/ˈluː.sɪd/', pos: ['adj.'], zh: '清晰明瞭的；神志清醒的', tag: 'B2 / 留學寫作', topic: 'animation', m: 'luc(光芒明亮) + -id = 如水晶般清澈通透毫無渾濁的', ex: 'The professor gave an exceptionally lucid explanation of general relativity.' },
      { w: 'elucidate', ipa: '/iˈluː.sɪ.deɪt/', pos: ['v.'], zh: '闡明說明、撥雲見日講清楚', tag: 'C1 / 論文學術', topic: 'business', m: 'e-(向外打亮) + lucid(光芒) + -ate = 將聚光燈打在幽暗的謎團上徹底說分明', ex: 'The research monograph aims to elucidate the neural mechanisms of sleep.' },
      { w: 'illuminate', ipa: '/ɪˈluː.mɪ.neɪt/', pos: ['v.'], zh: '照亮照明；闡明啟發思維', tag: 'B2 / 影視文藝', topic: 'animation', m: 'in-(朝內注入) + lum(光輝) + -ate = 將璀璨光輝灑滿空間照亮黑暗', ex: 'Lanterns floated across the midnight river, illuminating ancient bridges.' },
      { w: 'illumination', ipa: '/ɪˌluː.mɪˈneɪ.ʃən/', pos: ['n.'], zh: '燈光照明；頓悟啟示', tag: 'B2 / 藝術宗教', topic: 'animation', m: 'illuminate + -ion = 燈火輝煌之光照或頓悟得道的智慧光芒', ex: 'Cinematographers prioritize naturalistic directional illumination in shadow play.' },
      { w: 'luminous', ipa: '/ˈluː.mɪ.nəs/', pos: ['adj.'], zh: '發光的明亮的；容光煥發璀璨的', tag: 'B2 / 詩意描繪', topic: 'sci-fi', m: 'lum(光華) + -inous = 自身能綻放柔和光暈令人讚嘆的', ex: 'The avatar donned armor etched with luminous glowing cyan energy conduits.' }
    ]
  },

  // 10. nov (新奇/更新)
  {
    rootId: 'r_nov',
    words: [
      { w: 'novel', ipa: '/ˈnɒv.əl/', pos: ['n.', 'adj.'], zh: '長篇小說；新穎新奇獨創的', tag: 'A2 / 文藝必備', topic: 'cinema', m: 'nov(新奇) + -el = 前所未見讓人耳目一新的奇思妙想，或鴻篇巨著', ex: 'Engineers proposed a novel magnetic suspension system for bullet trains.' },
      { w: 'novelty', ipa: '/ˈnɒv.əl.ti/', pos: ['n.'], zh: '新奇感、新鮮事物；小飾品', tag: 'B2 / 行銷心理', topic: 'sitcom', m: 'novel + -ty = 令人驚艷的新鮮刺激感', ex: 'The novelty of touchscreens has worn off, giving way to ubiquitous expectation.' },
      { w: 'innovate', ipa: '/ˈɪn.ə.veɪt/', pos: ['v.'], zh: '創新革新、推陳出新', tag: 'B2 / 商業前沿', topic: 'business', m: 'in-(朝向核心) + nov(破舊立新) + -ate = 在傳統框架注入新思維', ex: 'Enterprises that refuse to innovate inevitably surrender market share to startups.' },
      { w: 'innovation', ipa: '/ˌɪn.əˈveɪ.ʃən/', pos: ['n.'], zh: '科技創新革新成果', tag: 'B1 / 經貿科技', topic: 'business', m: 'innovate + -ion = 顛覆陳舊體驗之偉大創新', ex: 'Technological innovation in battery density powers electric aviation dreams.' },
      { w: 'innovative', ipa: '/ˈɪn.ə.və.tɪv/', pos: ['adj.'], zh: '革新創新的、富創意的', tag: 'B1 / 職場讚賞', topic: 'business', m: 'innovate + -ive = 敢為人先大膽突破的', ex: 'The studio won praise for its innovative hybrid 2D and 3D rendering pipeline.' },
      { w: 'renovate', ipa: '/ˈren.ə.veɪt/', pos: ['v.'], zh: '翻新裝修、整修修繕老屋', tag: 'B1 / 生活建築', topic: 'business', m: 're-(重新) + nov(換上新顏) + -ate = 拂去歷史塵埃讓老建築煥然一新', ex: 'The historical municipal theater was renovated to incorporate modern acoustics.' }
    ]
  },

  // 11. pon / pos (放置/擺設/位置)
  {
    rootId: 'r_pon',
    words: [
      { w: 'position', ipa: '/pəˈzɪʃ.ən/', pos: ['n.', 'v.'], zh: '位置方位；職位；立場；放置擺設', tag: 'A2 / 基礎必備', topic: 'business', m: 'posit(放置) + -ion = 物件或人在棋局中所座落之座標', ex: 'The scout took up an advantageous sniper position atop the clock tower.' },
      { w: 'positive', ipa: '/ˈpɒz.ə.tɪv/', pos: ['adj.'], zh: '積極樂觀的；陽性的；確信篤定的', tag: 'A2 / 基礎必備', topic: 'sitcom', m: 'posit(確立放置好的) + -ive = 腳步站穩抱持積極昂揚心態的', ex: 'Maintaining a positive mental attitude fortifies psychological resilience.' },
      { w: 'pose', ipa: '/pəʊz/', pos: ['v.', 'n.'], zh: '擺姿勢；造成引起 (威脅、危險)', tag: 'A2 / 動漫繪畫', topic: 'animation', m: 'pos(擺放固定) = 擺出角色站位體態，或帶來巨大威脅', ex: 'The animated villain struck a dramatic silhouette pose on the moonlit gargoyle.' },
      { w: 'expose', ipa: '/ɪkˈspəʊz/', pos: ['v.'], zh: '暴露揭露；使接觸暴曬曝光', tag: 'B1 / 攝影新聞', topic: 'cinema', m: 'ex-(向外置於光天化日之下) + pose = 掀開遮羞布揭發不可告人的醜聞', ex: 'Investigative reporters exposed corrupt dealings between senators and oil lobbyists.' },
      { w: 'exposure', ipa: '/ɪkˈspəʊ.ʒər/', pos: ['n.'], zh: '曝光曝光度；接觸險境；揭發', tag: 'B2 / 傳媒攝影', topic: 'business', m: 'expose + -ure = 鏡頭進光量或知名度的大幅提升', ex: 'Viral short videos provide unprecedented marketing exposure for indie musicians.' },
      { w: 'propose', ipa: '/prəˈpəʊz/', pos: ['v.'], zh: '提出提案；求婚', tag: 'B1 / 職場生活', topic: 'business', m: 'pro-(在眾人面前) + pose(擺出想法) = 呈上企劃案或跪地奉上婚戒', ex: 'The design lead proposed a unified token design system across mobile platforms.' },
      { w: 'proposal', ipa: '/prəˈpəʊ.zəl/', pos: ['n.'], zh: '提案企劃書；求婚', tag: 'B1 / 商業職場', topic: 'business', m: 'propose + -al = 經過縝密論證的企劃大綱', ex: 'The municipal committee approved the light-rail transit budget proposal.' },
      { w: 'suppose', ipa: '/səˈpəʊz/', pos: ['v.'], zh: '假定猜想、料想；理應', tag: 'A2 / 基礎日常', topic: 'sitcom', m: 'sub-(置於底層做基石) + pose = 先假設此前提成立再來推論', ex: 'I suppose we can reschedule the retrospective sprint meeting to tomorrow.' },
      { w: 'oppose', ipa: '/əˈpəʊz/', pos: ['v.'], zh: '反對、與...抗衡對壘', tag: 'B1 / 政治對立', topic: 'cinema', m: 'ob-(迎面對峙) + pose(擺開陣勢) = 誓死站在對立面全力抵制', ex: 'Environmental alliances fiercely opposed constructing pipelines through wetlands.' },
      { w: 'opposite', ipa: '/ˈɒp.ə.zɪt/', pos: ['adj.', 'n.', 'prep.'], zh: '相反的對立的；對面；反義詞', tag: 'A2 / 基礎生活', topic: 'sitcom', m: 'oppose + -ite = 遙遙相望處在截然相反端點的', ex: 'Black and white stand at opposite ends of the visual grayscale spectrum.' },
      { w: 'compose', ipa: '/kəmˈpəʊz/', pos: ['v.'], zh: '作曲譜曲；撰寫信函；由...組成；使平靜', tag: 'B1 / 音樂藝術', topic: 'animation', m: 'con-(聚合) + pose(擺放組合) = 將音符文字天衣無縫編織成藝術結晶', ex: 'Hans Zimmer composed the earth-shaking pipe organ score for Interstellar.' },
      { w: 'composer', ipa: '/kəmˈpəʊ.zər/', pos: ['n.'], zh: '作曲家、音樂總監', tag: 'A2 / 職業名詞', topic: 'animation', m: 'compose + -er = 專門揮灑靈感譜寫交響曲之人', ex: 'The animation series hired an award-winning orchestral video game composer.' },
      { w: 'composition', ipa: '/ˌkɒm.pəˈzɪʃ.ən/', pos: ['n.'], zh: '構圖美學；樂曲作品；成分構成', tag: 'B2 / 視覺設計', topic: 'animation', m: 'compose + -ion = 畫面色彩比例或化學成分之組成結構', ex: 'Rule-of-thirds composition guides the spectator’s focus toward the focal protagonist.' },
      { w: 'deposit', ipa: '/dɪˈpɒz.ɪt/', pos: ['v.', 'n.'], zh: '存入款項；押金定金；沉積礦床', tag: 'A2 / 金融生活', topic: 'business', m: 'de-(往下放) + posit = 將錢幣妥善存入保險箱或沈積泥沙', ex: 'You must transfer a twenty percent refundable damage deposit to reserve the studio.' },
      { w: 'dispose', ipa: '/dɪˈspəʊz/', pos: ['v.'], zh: '處理廢棄處置；使傾向於', tag: 'B2 / 環保心理', topic: 'business', m: 'dis-(朝各方移走) + pose(擺放清空) = 將廢棄物妥善清運丟棄', ex: 'Nuclear power plants must dispose of spent fuel rods in deep geological vaults.' },
      { w: 'disposable', ipa: '/dɪˈspəʊ.zə.bəl/', pos: ['adj.'], zh: '一次性的免洗的；可自由支配的 (所得)', tag: 'B1 / 消費生活', topic: 'business', m: 'dispose + -able = 用完即丟的便利包裝或扣稅後可動用薪水', ex: 'Single-use disposable plastic cutlery contributes heavily to ocean pollution.' },
      { w: 'impose', ipa: '/ɪmˈpəʊz/', pos: ['v.'], zh: '強制實施徵收；把...強加於人', tag: 'B2 / 政策法律', topic: 'business', m: 'in-(強行壓入) + pose(放下重擔) = 以強權將重稅或價值觀強壓在他人頭上', ex: 'International financial regulators imposed strict embargoes on wartime exports.' },
      { w: 'postpone', ipa: '/pəʊstˈpəʊn/', pos: ['v.'], zh: '延期延後、推遲', tag: 'B1 / 職場生活', topic: 'business', m: 'post-(在後面) + pone(擺放) = 將原定日程挪移至後方日期', ex: 'Torrential thunderstorms forced organizers to postpone the outdoor concert.' },
      { w: 'component', ipa: '/kəmˈpəʊ.nənt/', pos: ['n.'], zh: '零件元件、核心組成要素', tag: 'B1 / 科技工程', topic: 'sci-fi', m: 'con-(聚合) + pon(放進去) + -ent = 組裝完整機械不可或缺的單一模組', ex: 'The GPU is a mission-critical computational component of the gaming workstation.' }
    ]
  },

  // 12. ten / tain (握持/保持/維持)
  {
    rootId: 'r_ten',
    words: [
      { w: 'maintain', ipa: '/meɪnˈteɪn/', pos: ['v.'], zh: '維持保持；保養維修；堅稱主張', tag: 'B1 / 核心基礎', topic: 'business', m: 'main(手握) + tain(保持握緊) = 親手緊緊握牢不讓其滑落變質', ex: 'Regular firmware updates help maintain optimal network firewall security.' },
      { w: 'maintenance', ipa: '/ˈmeɪn.tən.əns/', pos: ['n.'], zh: '保養維修維護工程', tag: 'B1 / 工業工程', topic: 'business', m: 'maintain + -ance = 機械設施定期檢修保養之常軌', ex: 'Scheduled aircraft maintenance prevented potentially catastrophic hydraulic failures.' },
      { w: 'contain', ipa: '/kənˈteɪn/', pos: ['v.'], zh: '包含容納；遏制控制局勢', tag: 'A2 / 核心基礎', topic: 'sci-fi', m: 'con-(收攏一起) + tain(包住握牢) = 將外溢事物收攏在容器中全面控制', ex: 'Containment protocols successfully contained the radioactive coolant leak.' },
      { w: 'container', ipa: '/kənˈteɪ.nər/', pos: ['n.'], zh: '貨櫃集裝箱；保鮮盒容器', tag: 'A2 / 航運生活', topic: 'business', m: 'contain + -er = 裝載貨品之鋼鐵巨箱或器皿', ex: 'Standardized intermodal shipping containers revolutionized global maritime commerce.' },
      { w: 'obtain', ipa: '/əbˈteɪn/', pos: ['v.'], zh: '獲得取得、費心爭取到', tag: 'B1 / 學術必備', topic: 'business', m: 'ob-(迎頭上前) + tain(牢牢握住) = 奮力爭取終將資格或專利握入手心', ex: 'Researchers must obtain formal institutional ethics approval before animal trials.' },
      { w: 'retain', ipa: '/rɪˈteɪn/', pos: ['v.'], zh: '保留保有；留任人才；記住記憶', tag: 'B2 / 職場管理', topic: 'business', m: 're-(留在身邊) + tain(握住不放) = 珍惜優秀戰友留在公司不讓其流失', ex: 'Competitive equity packages help tech firms retain tier-one algorithmic engineers.' },
      { w: 'retention', ipa: '/rɪˈten.ʃən/', pos: ['n.'], zh: '留存率留住人才；記憶保持', tag: 'B2 / 商業數據', topic: 'business', m: 'retain + -tion = 用戶黏著度或員工留任指標', ex: 'Improving onboarding UX doubled 30-day mobile gaming app retention.' },
      { w: 'sustain', ipa: '/səˈsteɪn/', pos: ['v.'], zh: '維持支撐；承受打擊損害', tag: 'B2 / 環保經貿', topic: 'sci-fi', m: 'sub-(在底層) + tain(死死撐住) = 在下方用全力把沉重擔子托住不垮', ex: 'Without emergency water supplies, the besieged stronghold could not sustain defense.' },
      { w: 'sustainable', ipa: '/səˈsteɪ.nə.bəl/', pos: ['adj.'], zh: '永續的、可持續發展的', tag: 'B1 / 環保核心', topic: 'business', m: 'sustain + -able = 經得起數百年循環消耗不枯竭的', ex: 'Transitioning to sustainable solar energy curtails ecological depletion.' },
      { w: 'sustainability', ipa: '/səˌsteɪ.nəˈbɪl.ə.ti/', pos: ['n.'], zh: '永續性、生態永續經營', tag: 'B2 / 經貿顯學', topic: 'business', m: 'sustainable + -ity = 守護子孫後代資源環境之大計', ex: 'Corporate ESG audits place immense scrutiny on supply-chain carbon sustainability.' },
      { w: 'attain', ipa: '/əˈteɪn/', pos: ['v.'], zh: '達到實現、攀登登頂目標', tag: 'B2 / 勵志目標', topic: 'animation', m: 'ad-(衝向頂點) + tain(牢牢抓住) = 披荊斬棘終將最高榮譽攬入懷中', ex: 'Through unflagging discipline, she attained the rank of chief concept artist.' }
    ]
  },

  // 13. voc / vok (呼喊/發聲/召集)
  {
    rootId: 'r_voc',
    words: [
      { w: 'vocal', ipa: '/ˈvəʊ.kəl/', pos: ['adj.', 'n.'], zh: '聲音的、發聲的；直言不諱的；人聲演唱', tag: 'B1 / 音樂生活', topic: 'sitcom', m: 'voc(聲音) + -al = 發自喉嚨之真切歌聲或直言敢諫', ex: 'Lead vocal tracks in modern pop music undergo subtle pitch correction.' },
      { w: 'vocalist', ipa: '/ˈvəʊ.kəl.ɪst/', pos: ['n.'], zh: '主唱、聲樂歌手', tag: 'B1 / 音樂演藝', topic: 'animation', m: 'vocal + -ist = 用天籟嗓音打動世人之演唱家', ex: 'The rock band scouted an energetic lead vocalist with an electrifying high register.' },
      { w: 'vocation', ipa: '/vəʊˈkeɪ.ʃən/', pos: ['n.'], zh: '天職使命；職業本行', tag: 'B2 / 人生哲學', topic: 'animation', m: 'voc(天意召喚) + -tion = 上蒼在靈魂深處召喚你去奉獻一生的志業', ex: 'For Miyazaki, hand-crafted cel animation was never a mere job, but a lifelong vocation.' },
      { w: 'advocate', ipa: '/ˈæd.və.keɪt/', pos: ['v.', 'n.'], zh: '倡導擁護、為...發聲；提倡者', tag: 'B2 / 公共政策', topic: 'business', m: 'ad-(朝向大眾) + voc(大聲呼喊) + -ate = 站上肥皂箱為弱勢爭取權益', ex: 'Civil liberties attorneys passionately advocate for digital privacy protections.' },
      { w: 'advocacy', ipa: '/ˈæd.və.kə.si/', pos: ['n.'], zh: '倡議宣導行動、為人仗義執言', tag: 'B2 / 社會公益', topic: 'business', m: 'advocate + -cy = 爭取社會改革之長期倡議', ex: 'Her grass-roots marine advocacy spurred legislation banning plastic microbeads.' },
      { w: 'evoke', ipa: '/ɪˈvəʊk/', pos: ['v.'], zh: '喚起引起、勾起回憶思緒', tag: 'B2 / 藝術情感', topic: 'animation', m: 'e-(自心靈深處向外) + voke(呼喚引出) = 勾起沉睡已久的童年溫暖回憶', ex: 'The melancholic violin solo evoked memories of long-forgotten autumn afternoons.' },
      { w: 'evocative', ipa: '/ɪˈvɒk.ə.tɪv/', pos: ['adj.'], zh: '極富感染力的、扣人心弦勾起回憶的', tag: 'B2 / 藝評文采', topic: 'cinema', m: 'evoke + -ive = 散發濃烈情緒渲染力令人動容的', ex: 'The cinematic soundtrack is deeply evocative of vintage 1980s retro synthwave.' },
      { w: 'provoke', ipa: '/prəˈvəʊk/', pos: ['v.'], zh: '挑釁激怒；引發挑起大戰', tag: 'B2 / 衝突心理', topic: 'cinema', m: 'pro-(在面前) + voke(叫囂喊陣) = 當面公然叫板挑釁逼對方出手', ex: 'Do not allow hot-headed taunts to provoke you into rash, reckless retaliation.' },
      { w: 'provocative', ipa: '/prəˈvɒk.ə.tɪv/', pos: ['adj.'], zh: '挑釁煽動的；發人深省大膽的', tag: 'B2 / 思想藝術', topic: 'cinema', m: 'provoke + -ive = 大膽觸碰敏感議題引發激烈辯論的', ex: 'The documentary delivered a provocative critique of surveillance capitalism.' },
      { w: 'revoke', ipa: '/rɪˈvəʊk/', pos: ['v.'], zh: '撤銷廢除、吊銷執照', tag: 'B2 / 法律行政', topic: 'business', m: 're-(向後回聲) + voke(喊叫召回) = 官府頒令收回先前核發的許可執照', ex: 'The transportation ministry voted to revoke the reckless driver’s pilot license.' }
    ]
  },

  // 14. anim (生命/靈魂/生氣)
  {
    rootId: 'r_anim',
    words: [
      { w: 'animate', ipa: '/ˈæn.ɪ.meɪt/', pos: ['v.', 'adj.'], zh: '賦予生命使靈動；活生生的', tag: 'A2 / 動畫專業', topic: 'animation', m: 'anim(吹入靈魂生命) + -ate = 讓靜態畫稿活靈活現躍動起來', ex: 'Artists animate 24 distinct sequential frames per second for classic films.' },
      { w: 'animation', ipa: '/ˌæn.ɪˈmeɪ.ʃən/', pos: ['n.'], zh: '動畫片、動畫影視；生氣活力', tag: 'A1 / 必備領域', topic: 'animation', m: 'animate + -ion = 創造虛擬生命與動態奇觀之神聖藝術', ex: 'Studio Ghibli’s animation captures sublime natural realism with breathtaking grace.' },
      { w: 'animator', ipa: '/ˈæn.ɪ.meɪ.tər/', pos: ['n.'], zh: '動畫師、動態魔法師', tag: 'A2 / 職業名詞', topic: 'animation', m: 'animate + -or = 賦予線條骨骼生命與情感之造夢師', ex: 'The senior 3D character animator refined the dragon’s facial expression nuances.' },
      { w: 'animated', ipa: '/ˈæn.ɪ.meɪ.tɪd/', pos: ['adj.'], zh: '動畫製作的；熱烈生動神采飛揚的', tag: 'A2 / 口語影視', topic: 'sitcom', m: 'animate + -ed = 神情生動手舞足蹈神采飛揚的', ex: 'They engaged in an animated, lively debate regarding time-travel paradoxes.' },
      { w: 'unanimous', ipa: '/juːˈnæn.ɪ.məs/', pos: ['adj.'], zh: '全體一致的、無異議全數通過的', tag: 'B2 / 會議投票', topic: 'business', m: 'uni-(同一) + anim(心靈意志) + -ous = 萬眾一心如同同一個靈魂發聲', ex: 'The appellate court reached a unanimous decision upholding the civil injunction.' }
    ]
  },

  // 15. viv / vit (生命/活著/鮮活)
  {
    rootId: 'r_viv',
    words: [
      { w: 'survive', ipa: '/səˈvaɪv/', pos: ['v.'], zh: '倖免於難存活；渡過難關', tag: 'A2 / 核心必備', topic: 'sci-fi', m: 'super-(超脫於外) + vive(活著) = 超脫浩劫災難依然頑強存活於世', ex: 'Ancient tardigrades can survive freezing vacuums and intense ionizing radiation.' },
      { w: 'survivor', ipa: '/səˈvaɪ.vər/', pos: ['n.'], zh: '倖存者、生還者、堅強熬過來的人', tag: 'A2 / 影視新聞', topic: 'cinema', m: 'survive + -or = 大難不死從瓦礫堆爬出的勇者', ex: 'Search dogs successfully pulled an earthquake survivor from the collapsed mezzanine.' },
      { w: 'survival', ipa: '/səˈvaɪ.vəl/', pos: ['n.'], zh: '生存、求生技能', tag: 'B1 / 核心基礎', topic: 'sci-fi', m: 'survive + -al = 絕境中頑強活下去的生存之道', ex: 'Wilderness survival training teaches purifying murky water and improvising shelter.' },
      { w: 'revive', ipa: '/rɪˈvaɪv/', pos: ['v.'], zh: '甦醒復活；復興振興舊經典', tag: 'B2 / 醫學文藝', topic: 'animation', m: 're-(重新) + vive(注入生命) = 喚醒休眠心跳，或重現昔日榮光', ex: 'Paramedics deployed CPR to revive the unconscious diver on the pier.' },
      { w: 'revival', ipa: '/rɪˈvaɪ.vəl/', pos: ['n.'], zh: '文藝復興；重演風潮', tag: 'B2 / 文化藝術', topic: 'cinema', m: 'revive + -al = 經典風潮捲土重來再度風靡全球', ex: 'Broadway is experiencing a vibrant revival of classic Golden Age musical theatre.' },
      { w: 'vivid', ipa: '/ˈvɪv.ɪd/', pos: ['adj.'], zh: '生動逼真的；鮮明耀眼的', tag: 'B1 / 文學描繪', topic: 'animation', m: 'viv(鮮活) + -id = 躍然紙上如同在眼前活生生上演般逼真', ex: 'The graphic novel features vivid jewel tones and dynamic cinematic perspectives.' },
      { w: 'vital', ipa: '/ˈvaɪ.təl/', pos: ['adj.'], zh: '生死攸關極其關鍵的；生命活力旺盛的', tag: 'B1 / 核心基礎', topic: 'business', m: 'vit(生命本源) + -al = 牽涉身家性命不可或缺的核心關鍵', ex: 'Reliable coolant pumps are of vital importance to nuclear reactor cores.' },
      { w: 'vitality', ipa: '/vaɪˈtæl.ə.ti/', pos: ['n.'], zh: '生命力、朝氣蓬勃之活力', tag: 'B2 / 勵志健康', topic: 'animation', m: 'vital + -ity = 散發無窮活力與朝氣之狀態', ex: 'Regular aerobic exercise infuses vigorous youthfulness and cognitive vitality.' }
    ]
  }
]
