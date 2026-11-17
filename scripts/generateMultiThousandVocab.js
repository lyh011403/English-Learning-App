// scripts/generateMultiThousandVocab.js
// 數千詞級 (6,000+ 詞) 全量詞庫建構腳本，專項深度擴充生活日常 (daily) 常用詞庫
import fs from 'node:fs'
import path from 'node:path'
import OpenCC from 'opencc-js'

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })

// 絕對日常生活詞白名單 (命中則 100% 歸入 daily)
const DAILY_EXACT_WORDS = new Set([
  'breakfast', 'lunch', 'dinner', 'supper', 'meal', 'snack', 'food', 'drink', 'water', 'tea', 'coffee',
  'juice', 'milk', 'bread', 'butter', 'cheese', 'egg', 'meat', 'beef', 'pork', 'chicken', 'fish', 'rice',
  'noodle', 'soup', 'salad', 'fruit', 'apple', 'banana', 'orange', 'grape', 'lemon', 'vegetable', 'tomato',
  'potato', 'onion', 'carrot', 'sugar', 'salt', 'pepper', 'oil', 'sauce', 'cake', 'cookie', 'candy', 'ice',
  'cook', 'bake', 'boil', 'fry', 'taste', 'delicious', 'sweet', 'sour', 'bitter', 'spicy', 'salty', 'fresh',
  'hungry', 'thirsty', 'restaurant', 'cafe', 'menu', 'waiter', 'order', 'bill', 'receipt', 'tip', 'dessert',
  'home', 'house', 'room', 'kitchen', 'bedroom', 'bathroom', 'toilet', 'living', 'balcony', 'garden', 'door',
  'window', 'wall', 'floor', 'roof', 'bed', 'blanket', 'pillow', 'sheet', 'table', 'chair', 'sofa', 'desk',
  'lamp', 'clock', 'fridge', 'refrigerator', 'oven', 'stove', 'sink', 'mirror', 'towel', 'soap', 'shampoo',
  'brush', 'comb', 'laundry', 'wash', 'clean', 'tidy', 'sweep', 'vacuum', 'iron', 'trash', 'garbage', 'rubbish',
  'wake', 'sleep', 'dream', 'rest', 'morning', 'afternoon', 'evening', 'night', 'noon', 'midnight', 'daily',
  'clothes', 'clothing', 'shirt', 'pants', 'trousers', 'jeans', 'dress', 'skirt', 'coat', 'jacket',
  'sweater', 'suit', 'shoes', 'boots', 'sneakers', 'socks', 'hat', 'cap', 'gloves', 'scarf', 'belt',
  'bag', 'pocket', 'wallet', 'purse', 'umbrella', 'wear', 'fit', 'size', 'cotton',
  'bus', 'car', 'taxi', 'cab', 'train', 'subway', 'metro', 'plane', 'airplane', 'flight', 'bike', 'bicycle',
  'station', 'airport', 'stop', 'ticket', 'passenger', 'driver', 'commute', 'traffic', 'road', 'street',
  'avenue', 'path', 'bridge', 'corner', 'intersection', 'cross', 'turn', 'left', 'right', 'straight', 'map',
  'shop', 'shopping', 'store', 'market', 'supermarket', 'mall', 'buy', 'sell', 'pay', 'cost', 'price',
  'cheap', 'expensive', 'affordable', 'discount', 'sale', 'cash', 'coin', 'card', 'change', 'spend',
  'family', 'parent', 'father', 'mother', 'brother', 'sister', 'son', 'daughter', 'baby', 'child', 'children',
  'friend', 'neighbor', 'colleague', 'classmate', 'guest', 'visitor', 'meet', 'greet', 'hello', 'goodbye',
  'thanks', 'please', 'sorry', 'welcome', 'smile', 'laugh', 'cry', 'happy',
  'sad', 'angry', 'afraid', 'tired', 'bored', 'busy', 'lazy', 'kind', 'polite', 'honest', 'friendly',
  'body', 'head', 'face', 'hair', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'teeth', 'neck', 'shoulder', 'arm',
  'hand', 'finger', 'leg', 'foot', 'feet', 'knee', 'stomach', 'back', 'heart', 'health', 'healthy', 'sick',
  'ill', 'cold', 'fever', 'cough', 'headache', 'pain', 'hurt', 'wound', 'medicine', 'pill', 'doctor', 'nurse',
  'hospital', 'clinic', 'dentist', 'cure', 'bandage',
  'city', 'town', 'village', 'park', 'hotel', 'bank', 'library', 'pharmacy', 'convenience', 'weather'
])

// 主題分類關鍵字字典 (去除歧義單字，daily 優先)
const TOPIC_KEYWORDS = {
  daily: [
    '生活', '日常', '家庭', '居家', '廚房', '臥室', '衛生間', '洗衣', '穿著', '衣物', '鞋子',
    '早午晚', '餐飲', '吃喝', '飯菜', '蔬菜', '水果', '料理', '超市', '購物', '折扣', '特價',
    '收據', '公車', '捷運', '地鐵', '單車', '步行', '路口', '車票', '機票', '身體', '頭痛',
    '感冒', '發燒', '藥丸', '藥物', '診所', '醫生', '生病', '護理', '聊天', '問候', '朋友',
    '鄰居', '天氣', '下雨', '晴天', '休息', '早晨', '睡覺', '清晨'
  ],
  'sci-fi': ['量子', '太空', '星際', '宇宙', '原子', '基因', '細胞', '奈米', '物理學', '化學反應', '人工智慧', '計算機', '演算法', '飛行器', '機器人'],
  'animation': ['動漫', '動畫', '插畫', '神話', '傳奇', '妖精', '魔幻', '奇幻世界', '繪本', '卡通', '手繪'],
  'cinema': ['電影', '劇本', '導演', '演技', '反派', '主角', '懸疑', '法庭', '訴訟', '犯罪', '偵探', '復仇'],
  'business': ['投資', '融資', '股東', '股票', '董事會', '營運', '利潤', '財報', '審計', '兼併', '合約', '貿易', '商務', '併購'],
  'sitcom': ['情境喜劇', '喜劇', '笑話', '脫口秀', '搞笑', '逗趣', '鬧劇']
}

function detectTopic(word, meaningsZh, isDailySource = false) {
  const lower = word.toLowerCase()
  // 1. 若在生活日常高頻詞白名單中，直接命中 daily
  if (DAILY_EXACT_WORDS.has(lower)) {
    return 'daily'
  }

  const text = meaningsZh.join(' ')

  // 2. 若來自初中日常生活詞庫，除非有硬核科技/商業/動漫關鍵字，否則一律判定為 daily
  if (isDailySource) {
    if (TOPIC_KEYWORDS['sci-fi'].some(kw => text.includes(kw))) return 'sci-fi'
    if (TOPIC_KEYWORDS['business'].some(kw => text.includes(kw))) return 'business'
    if (TOPIC_KEYWORDS['cinema'].some(kw => text.includes(kw))) return 'cinema'
    return 'daily'
  }

  // 3. 檢查 daily 關鍵字
  if (TOPIC_KEYWORDS['daily'].some(kw => text.includes(kw))) {
    return 'daily'
  }

  // 4. 檢查其他專業主題
  for (const [topic, kws] of Object.entries(TOPIC_KEYWORDS)) {
    if (topic !== 'daily' && kws.some(kw => text.includes(kw))) {
      return topic
    }
  }

  // 5. 依字母哈希分流
  const topics = ['daily', 'sitcom', 'business', 'cinema', 'sci-fi', 'animation']
  const hash = lower.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return topics[hash % topics.length]
}

async function run() {
  console.log('開始下載權威詞庫與詞根數據 (初中日常、高中進階、CET4、托福、ECDICT)...')

  // 1. 讀取現有 master-lexicon.json
  let existingWords = []
  const existingPath = path.resolve('public', 'vocab', 'master-lexicon.json')
  if (fs.existsSync(existingPath)) {
    existingWords = JSON.parse(fs.readFileSync(existingPath, 'utf8'))
    console.log(`已載入現有單字: ${existingWords.length} 個`)
  }

  // 重校正現有單字的主題 (將符合日常生活的重新標註為 daily)
  for (const w of existingWords) {
    if (DAILY_EXACT_WORDS.has(w.word.toLowerCase())) {
      w.topic = 'daily'
    } else {
      const reTopic = detectTopic(w.word, w.meaningsZh || w.meanings, false)
      if (reTopic === 'daily') {
        w.topic = 'daily'
      }
    }
  }

  const existingWordSet = new Set(existingWords.map(w => w.word.toLowerCase()))

  // 2. 下載詞庫來源
  const [juniorRes, highRes, cet4Res, toeflRes, rootRes] = await Promise.all([
    fetch('https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/1-初中-顺序.json'),
    fetch('https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/2-高中-顺序.json'),
    fetch('https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/3-CET4-顺序.json'),
    fetch('https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/6-托福-顺序.json'),
    fetch('https://raw.githubusercontent.com/skywind3000/ECDICT/master/wordroot.txt')
  ])

  const juniorData = await juniorRes.json()
  const highData = await highRes.json()
  const cet4Data = await cet4Res.json()
  const toeflData = await toeflRes.json()
  const rootData = await rootRes.json()

  console.log(`詞庫來源就緒: 初中日常 (${juniorData.length} 詞), 高中生活 (${highData.length} 詞), CET4 (${cet4Data.length} 詞), 托福 (${toeflData.length} 詞), 詞根 (${Object.keys(rootData).length} 個)`)

  // 3. 建立詞根反查索引
  const wordToRootsMap = new Map()
  for (const [rootKey, rootInfo] of Object.entries(rootData)) {
    if (rootInfo.example && Array.isArray(rootInfo.example)) {
      for (const exWord of rootInfo.example) {
        const clean = exWord.trim().toLowerCase()
        if (!wordToRootsMap.has(clean)) {
          wordToRootsMap.set(clean, [])
        }
        wordToRootsMap.get(clean).push(`r_${rootKey.replace(/[^a-zA-Z0-9]/g, '')}`)
      }
    }
  }

  // 4. 優先抽取初中與高中生活日常單字
  const newCandidates = []

  function processDataset(items, defaultSourceTag, isDailySource = false, targetLimit = 1500) {
    let addedCount = 0
    for (const item of items) {
      if (!item.word) continue
      const w = item.word.trim().toLowerCase()

      if (existingWordSet.has(w)) continue
      if (!/^[a-z]{2,20}$/.test(w)) continue
      if (!item.translations || item.translations.length === 0) continue

      const posSet = new Set()
      const meaningsZhList = []

      for (const t of item.translations) {
        if (t.type) {
          const cleanPos = t.type.trim()
          posSet.add(cleanPos.endsWith('.') ? cleanPos : `${cleanPos}.`)
        }
        if (t.translation) {
          const tw = converter(t.translation.trim())
          meaningsZhList.push(tw)
        }
      }

      if (meaningsZhList.length === 0) continue

      const topic = detectTopic(w, meaningsZhList, isDailySource)
      const matchedRootIds = wordToRootsMap.get(w) || []

      // 片語提煉為例句
      const examples = []
      if (item.phrases && item.phrases.length > 0) {
        const p = item.phrases[0]
        examples.push({
          en: p.phrase,
          zh: converter(p.translation)
        })
      } else {
        examples.push({
          en: `I use "${w}" frequently in daily conversations and situations.`,
          zh: `我在日常對話與日常情境中經常使用「${w}」。`
        })
      }

      let mnemonic = ''
      if (matchedRootIds.length > 0) {
        mnemonic = `關聯字根族群：${matchedRootIds.join(', ')}`
      } else if (isDailySource) {
        mnemonic = '生活日常高頻高感度核心單字'
      }

      existingWordSet.add(w)
      newCandidates.push({
        id: `w_${w}`,
        word: w,
        pos: Array.from(posSet).length > 0 ? Array.from(posSet) : ['n.'],
        meanings: meaningsZhList,
        meaningsZh: meaningsZhList,
        rootIds: matchedRootIds,
        levelTag: defaultSourceTag,
        topic,
        mnemonic,
        examples
      })

      addedCount++
      if (addedCount >= targetLimit) {
        break
      }
    }
    return addedCount
  }

  // (A) 先從初中詞庫抽取日常基石詞 (目標 1,400 詞)
  const juniorAdded = processDataset(juniorData, 'A1/A2 · 生活必備基石', true, 1400)
  console.log(`從初中生活詞庫抽取新增: ${juniorAdded} 個日常基石詞`)

  // (B) 再從高中詞庫抽取日常生活進階詞 (目標 1,000 詞)
  const highAdded = processDataset(highData, 'B1 · 生活常用進階', true, 1000)
  console.log(`從高中生活詞庫抽取新增: ${highAdded} 個生活進階詞`)

  // (C) 再從 CET4 與托福中補足深度詞彙 (目標 300 詞)
  const cet4Added = processDataset(cet4Data, 'B2 · 深度生活交流', false, 300)
  console.log(`從 CET4 補足新增: ${cet4Added} 個`)

  const finalTotalWords = [...existingWords, ...newCandidates]
  console.log(`擴充完畢！本次新增: ${newCandidates.length} 詞，全量詞庫總計: ${finalTotalWords.length} 詞！`)

  // 5. 輸出至 public/vocab/master-lexicon.json
  const publicVocabPath = path.resolve('public', 'vocab', 'master-lexicon.json')
  fs.writeFileSync(publicVocabPath, JSON.stringify(finalTotalWords, null, 2), 'utf8')
  console.log(`已成功寫入 ${publicVocabPath}`)

  // 6. 統計分佈並輸出至 public/vocab/lexicon-meta.json
  const metaPath = path.resolve('public', 'vocab', 'lexicon-meta.json')
  const topicsCount = {}
  for (const w of finalTotalWords) {
    topicsCount[w.topic] = (topicsCount[w.topic] || 0) + 1
  }

  const meta = {
    totalWords: finalTotalWords.length,
    updatedAt: new Date().toISOString(),
    topics: topicsCount
  }
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8')
  console.log('最新詞庫統計資訊:', JSON.stringify(meta, null, 2))
}

run().catch(console.error)
