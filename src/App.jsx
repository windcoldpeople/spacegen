import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Trash2, Check, Wand2, Settings2, Bot, Globe } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";

// --- 多國語言設定 ---
const LANGUAGES = [
  { code: 'zh', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'th', label: 'ไทย' },
  { code: 'ms', label: 'Bahasa Melayu' }
];

const UI_TEXT = {
  zh: { custom: "自訂細節", prefs: "進階設定", hq: "附加高畫質後綴", ar: "畫面比例", clear: "Clear", inspire: "Inspire", engine: "目標 AI 模型", prompt: "產生的 Prompt", chars: "chars", copy: "複製", copied: "已複製", placeholder: "描述其他元素... 例如：窗外下著雨" },
  en: { custom: "Custom Details", prefs: "Preferences", hq: "Add Masterpiece Suffix", ar: "Aspect Ratio", clear: "Clear", inspire: "Inspire", engine: "Target Engine", prompt: "Generated Prompt", chars: "chars", copy: "Copy", copied: "Copied", placeholder: "Describe additional elements... e.g., raining outside" },
  ja: { custom: "カスタム詳細", prefs: "設定", hq: "高画質サフィックス追加", ar: "アスペクト比", clear: "クリア", inspire: "ランダム", engine: "対象 AI モデル", prompt: "生成されたプロンプト", chars: "文字", copy: "コピー", copied: "コピー済", placeholder: "追加要素を説明... 例: 外は雨" },
  ko: { custom: "사용자 정의", prefs: "설정", hq: "고품질 접미사 추가", ar: "종횡比", clear: "지우기", inspire: "랜덤", engine: "대상 AI 모델", prompt: "생성된 프롬프트", chars: "자", copy: "복사", copied: "복사됨", placeholder: "추가 요소 설명... 예: 밖에 비가 옴" },
  vi: { custom: "Chi tiết Tùy chỉnh", prefs: "Cài đặt", hq: "Thêm hậu tố chất lượng", ar: "Tỷ lệ khung hình", clear: "Xóa", inspire: "Ngẫu nhiên", engine: "Mô hình AI", prompt: "Prompt Đã Tạo", chars: "kí tự", copy: "Sao chép", copied: "Đã chép", placeholder: "Thêm chi tiết... VD: ngoài trời mưa" },
  id: { custom: "Detail Kustom", prefs: "Pengaturan", hq: "Tambah Sufiks Kualitas", ar: "Rasio Aspek", clear: "Hapus", inspire: "Acak", engine: "Mesin AI", prompt: "Prompt Dihasilkan", chars: "karakter", copy: "Salin", copied: "Tersalin", placeholder: "Tambahkan elemen... cth: hujan di luar" },
  th: { custom: "รายละเอียดเพิ่มเติม", prefs: "การตั้งค่า", hq: "เพิ่มคำต่อท้ายคุณภาพ", ar: "อัตราส่วนภาพ", clear: "ล้าง", inspire: "สุ่ม", engine: "โมเดล AI", prompt: "Prompt ที่สร้าง", chars: "อักษร", copy: "คัดลอก", copied: "คัดลอกแล้ว", placeholder: "เพิ่มรายละเอียด... เช่น ฝนตกข้างนอก" },
  ms: { custom: "Butiran Tersuai", prefs: "Keutamaan", hq: "Tambah Akhiran Kualiti", ar: "Nisbah Aspek", clear: "Padam", inspire: "Rawak", engine: "Enjin AI", prompt: "Prompt Dihasilkan", chars: "aksara", copy: "Salin", copied: "Tersalin", placeholder: "Tambah elemen... cth: hujan di luar" }
};

// --- 資料字典：五大類別選項與多國語言翻譯 ---
const PROMPT_DATA = [
  {
    id: 'emotion',
    t: { zh: '情感與氛圍', en: 'Emotion', ja: '感情と雰囲気', ko: '감정과 분위기', vi: 'Cảm xúc', id: 'Emosi', th: 'อารมณ์', ms: 'Emosi' },
    options: [
      { en: 'calm', t: { zh: '平靜', en: 'Calm', ja: '穏やか', ko: '평온', vi: 'Bình tĩnh', id: 'Tenang', th: 'สงบ', ms: 'Tenang' } },
      { en: 'mysterious', t: { zh: '神秘', en: 'Mysterious', ja: '神秘的', ko: '신비', vi: 'Bí ẩn', id: 'Misterius', th: 'ลึกลับ', ms: 'Misteri' } },
      { en: 'sacred', t: { zh: '神聖', en: 'Sacred', ja: '神聖', ko: '신성', vi: 'Thiêng liêng', id: 'Sakral', th: 'ศักดิ์สิทธิ์', ms: 'Suci' } },
      { en: 'playful', t: { zh: '俏皮', en: 'Playful', ja: '遊び心', ko: '유쾌', vi: 'Vui tươi', id: 'Ceria', th: 'ขี้เล่น', ms: 'Ceria' } },
      { en: 'inspiring', t: { zh: '啟發', en: 'Inspiring', ja: '刺激的', ko: '영감', vi: 'Cảm hứng', id: 'Inspiratif', th: 'แรงบันดาลใจ', ms: 'Inspirasi' } },
      { en: 'cozy', t: { zh: '舒適', en: 'Cozy', ja: '居心地良', ko: '아늑', vi: 'Ấm cúng', id: 'Nyaman', th: 'อบอุ่น', ms: 'Selesa' } },
      { en: 'dramatic', t: { zh: '戲劇', en: 'Dramatic', ja: 'ドラマ', ko: '극적', vi: 'Kịch tính', id: 'Dramatis', th: 'ดราม่า', ms: 'Dramatik' } },
      { en: 'intimate', t: { zh: '親密', en: 'Intimate', ja: '親密', ko: '친밀', vi: 'Thân mật', id: 'Intim', th: 'ใกล้ชิด', ms: 'Intim' } },
      { en: 'open', t: { zh: '開闊', en: 'Open', ja: '開放的', ko: '개방', vi: 'Mở', id: 'Terbuka', th: 'เปิดกว้าง', ms: 'Terbuka' } },
      { en: 'quiet', t: { zh: '安靜', en: 'Quiet', ja: '静寂', ko: '고요', vi: 'Yên tĩnh', id: 'Sepi', th: 'เงียบสงบ', ms: 'Sunyi' } }
    ]
  },
  {
    id: 'activity',
    t: { zh: '活動與行為', en: 'Activity', ja: '活動と行動', ko: '활동과 행동', vi: 'Hoạt động', id: 'Aktivitas', th: 'กิจกรรม', ms: 'Aktiviti' },
    options: [
      { en: 'reading', t: { zh: '閱讀', en: 'Reading', ja: '読書', ko: '독서', vi: 'Đọc sách', id: 'Membaca', th: 'อ่าน', ms: 'Membaca' } },
      { en: 'gathering', t: { zh: '聚會', en: 'Gathering', ja: '集まり', ko: '모임', vi: 'Tụ tập', id: 'Berkumpul', th: 'ชุมนุม', ms: 'Berkumpul' } },
      { en: 'resting', t: { zh: '休息', en: 'Resting', ja: '休息', ko: '휴식', vi: 'Nghỉ ngơi', id: 'Istirahat', th: 'พักผ่อน', ms: 'Berehat' } },
      { en: 'walking', t: { zh: '漫步', en: 'Walking', ja: '散歩', ko: '산책', vi: 'Đi dạo', id: 'Berjalan', th: 'เดินเล่น', ms: 'Berjalan' } },
      { en: 'observing', t: { zh: '觀察', en: 'Observing', ja: '観察', ko: '관찰', vi: 'Quan sát', id: 'Mengamati', th: 'สังเกต', ms: 'Memerhati' } },
      { en: 'studying', t: { zh: '學習', en: 'Studying', ja: '学習', ko: '학습', vi: 'Học tập', id: 'Belajar', th: 'เรียนรู้', ms: 'Belajar' } },
      { en: 'meditating', t: { zh: '冥想', en: 'Meditating', ja: '瞑想', ko: '명상', vi: 'Ngồi thiền', id: 'Meditasi', th: 'ทำสมาธิ', ms: 'Meditasi' } },
      { en: 'talking', t: { zh: '交談', en: 'Talking', ja: '会話', ko: '대화', vi: 'Trò chuyện', id: 'Ngobrol', th: 'พูดคุย', ms: 'Berbual' } },
      { en: 'waiting', t: { zh: '等待', en: 'Waiting', ja: '待機', ko: '대기', vi: 'Chờ đợi', id: 'Menunggu', th: 'รอคอย', ms: 'Menunggu' } },
      { en: 'playing', t: { zh: '玩耍', en: 'Playing', ja: '遊び', ko: '놀이', vi: 'Chơi đùa', id: 'Bermain', th: 'เล่นสนุก', ms: 'Bermain' } }
    ]
  },
  {
    id: 'setting',
    t: { zh: '環境與地點', en: 'Setting', ja: '環境と場所', ko: '환경과 장소', vi: 'Bối cảnh', id: 'Lokasi', th: 'สถานที่', ms: 'Lokasi' },
    options: [
      { en: 'forest', t: { zh: '森林', en: 'Forest', ja: '森林', ko: '숲', vi: 'Rừng', id: 'Hutan', th: 'ป่าไม้', ms: 'Hutan' } },
      { en: 'mountain', t: { zh: '山脈', en: 'Mountain', ja: '山脈', ko: '산', vi: 'Núi', id: 'Gunung', th: 'ภูเขา', ms: 'Gunung' } },
      { en: 'seaside', t: { zh: '海濱', en: 'Seaside', ja: '海辺', ko: '해변', vi: 'Bờ biển', id: 'Tepi Laut', th: 'ชายทะเล', ms: 'Tepi Laut' } },
      { en: 'urban', t: { zh: '都會', en: 'Urban', ja: '都市', ko: '도시', vi: 'Đô thị', id: 'Perkotaan', th: 'เมือง', ms: 'Bandar' } },
      { en: 'campus', t: { zh: '校園', en: 'Campus', ja: 'キャンパス', ko: '캠퍼스', vi: 'Trường học', id: 'Kampus', th: 'วิทยาเขต', ms: 'Kampus' } },
      { en: 'desert', t: { zh: '沙漠', en: 'Desert', ja: '砂漠', ko: '사막', vi: 'Sa mạc', id: 'Gurun', th: 'ทะเลทราย', ms: 'Gurun' } },
      { en: 'riverside', t: { zh: '河畔', en: 'Riverside', ja: '川岸', ko: '강변', vi: 'Bờ sông', id: 'Tepi Sungai', th: 'ริมแม่น้ำ', ms: 'Tepi Sungai' } },
      { en: 'garden', t: { zh: '花園', en: 'Garden', ja: '庭園', ko: '정원', vi: 'Sân vườn', id: 'Taman', th: 'สวน', ms: 'Taman' } },
      { en: 'historic city', t: { zh: '古城', en: 'Old City', ja: '古都', ko: '고도', vi: 'Phố cổ', id: 'Kota Tua', th: 'เมืองเก่า', ms: 'Bandar Lama' } },
      { en: 'rooftop', t: { zh: '屋頂', en: 'Rooftop', ja: '屋上', ko: '옥상', vi: 'Sân thượng', id: 'Atap', th: 'ดาดฟ้า', ms: 'Bumbung' } }
    ]
  },
  {
    id: 'character',
    t: { zh: '空間特徵', en: 'Character', ja: '空間的特徴', ko: '공간 특성', vi: 'Đặc điểm', id: 'Karakter', th: 'ลักษณะ', ms: 'Karakter' },
    options: [
      { en: 'minimal', t: { zh: '極簡', en: 'Minimal', ja: 'ミニマル', ko: '미니멀', vi: 'Tối giản', id: 'Minimalis', th: 'มินิมอล', ms: 'Minimal' } },
      { en: 'monumental', t: { zh: '宏偉', en: 'Monument', ja: '記念碑', ko: '기념비적', vi: 'Đồ sộ', id: 'Monumental', th: 'ยิ่งใหญ่', ms: 'Monumental' } },
      { en: 'organic', t: { zh: '有機', en: 'Organic', ja: '有機的', ko: '유기적', vi: 'Hữu cơ', id: 'Organik', th: 'ออร์แกนิก', ms: 'Organik' } },
      { en: 'hidden', t: { zh: '隱蔽', en: 'Hidden', ja: '隠蔽', ko: '은폐', vi: 'Ẩn giấu', id: 'Tersembunyi', th: 'ซ่อนเร้น', ms: 'Tersembunyi' } },
      { en: 'open', t: { zh: '開放', en: 'Open', ja: '開放的', ko: '개방적', vi: 'Mở', id: 'Terbuka', th: 'เปิดกว้าง', ms: 'Terbuka' } },
      { en: 'layered', t: { zh: '層次', en: 'Layered', ja: '層状', ko: '층상', vi: 'Nhiều lớp', id: 'Berlapis', th: 'มีเลเยอร์', ms: 'Berlapis' } },
      { en: 'geometric', t: { zh: '幾何', en: 'Geometric', ja: '幾何学', ko: '기하학', vi: 'Hình học', id: 'Geometris', th: 'เรขาคณิต', ms: 'Geometrik' } },
      { en: 'floating', t: { zh: '懸浮', en: 'Floating', ja: '浮遊', ko: '부유', vi: 'Lơ lửng', id: 'Melayang', th: 'ลอยตัว', ms: 'Terapung' } },
      { en: 'heavy', t: { zh: '厚重', en: 'Heavy', ja: '重厚', ko: '중후', vi: 'Nặng nề', id: 'Berat', th: 'หนักแน่น', ms: 'Berat' } },
      { en: 'light', t: { zh: '輕盈', en: 'Light', ja: '軽快', ko: '경쾌', vi: 'Nhẹ nhàng', id: 'Ringan', th: 'เบาบาง', ms: 'Ringan' } }
    ]
  },
  {
    id: 'spatialType',
    t: { zh: '空間類型', en: 'Spatial Type', ja: '空間タイプ', ko: '공간 유형', vi: 'Loại Không gian', id: 'Tipe Ruang', th: 'ประเภทพื้นที่', ms: 'Jenis Ruang' },
    options: [
      { en: 'interior', t: { zh: '室內', en: 'Interior', ja: '室内', ko: '실내', vi: 'Nội thất', id: 'Interior', th: 'ภายใน', ms: 'Dalaman' } },
      { en: 'building exterior', t: { zh: '外觀', en: 'Exterior', ja: '外観', ko: '외관', vi: 'Ngoại thất', id: 'Eksterior', th: 'ภายนอก', ms: 'Luaran' } },
      { en: 'pavilion', t: { zh: '展館', en: 'Pavilion', ja: 'パビリオン', ko: '파빌리온', vi: 'Gian hàng', id: 'Paviliun', th: 'พาวิลเลี่ยน', ms: 'Pavilion' } },
      { en: 'landscape space', t: { zh: '景觀', en: 'Landscape', ja: '景観', ko: '조경', vi: 'Cảnh quan', id: 'Lanskap', th: 'ภูมิทัศน์', ms: 'Landskap' } },
      { en: 'urban plaza', t: { zh: '廣場', en: 'Plaza', ja: '広場', ko: '광장', vi: 'Quảng trường', id: 'Alun-alun', th: 'พลาซ่า', ms: 'Plaza' } },
      { en: 'courtyard', t: { zh: '庭院', en: 'Courtyard', ja: '中庭', ko: '중정', vi: 'Sân trong', id: 'Halaman', th: 'ลานบ้าน', ms: 'Halaman' } },
      { en: 'gallery', t: { zh: '藝廊', en: 'Gallery', ja: 'ギャラリー', ko: '갤러리', vi: 'Phòng tranh', id: 'Galeri', th: 'แกลเลอรี่', ms: 'Galeri' } },
      { en: 'installation', t: { zh: '裝置', en: 'Install.', ja: '装置', ko: '설치물', vi: 'Sắp đặt', id: 'Instalasi', th: 'งานศิลปะ', ms: 'Pemasangan' } },
      { en: 'bridge', t: { zh: '橋樑', en: 'Bridge', ja: '橋梁', ko: '교량', vi: 'Cầu', id: 'Jembatan', th: 'สะพาน', ms: 'Jambatan' } },
      { en: 'tower', t: { zh: '塔樓', en: 'Tower', ja: '塔', ko: '타워', vi: 'Tháp', id: 'Menara', th: 'หอคอย', ms: 'Menara' } }
    ]
  }
];

// --- 對照矩陣 (Matrix Data Base) - 保持英文底層 ---
const ATTRIBUTE_MATRIX = {
  'calm': { form: 'horizontal space', strategy: 'courtyard', material: 'wood', color: 'neutral tones', light: 'diffuse light', style: 'minimal', designer: 'Peter Zumthor' },
  'mysterious': { form: 'narrow passage', strategy: 'hidden sequence', material: 'stone', color: 'dark tones', light: 'shadow contrast', style: 'atmospheric', designer: 'Peter Zumthor' },
  'sacred': { form: 'pure geometry', strategy: 'axial path', material: 'stone / concrete', color: 'monochrome', light: 'top light', style: 'monumental', designer: 'Tadao Ando' },
  'playful': { form: 'irregular form', strategy: 'scattered space', material: 'colorful materials', color: 'vibrant colors', light: 'bright daylight', style: 'postmodern', designer: 'Ricardo Bofill' },
  'inspiring': { form: 'open volume', strategy: 'upward movement', material: 'glass / steel', color: 'bright palette', light: 'skylight', style: 'modern', designer: 'Norman Foster' },
  'cozy': { form: 'compact form', strategy: 'enclosed corner', material: 'wood', color: 'warm tones', light: 'warm ambient', style: 'human scale', designer: 'Alvar Aalto' },
  'dramatic': { form: 'tall vertical volume', strategy: 'framed axis', material: 'concrete', color: 'strong contrast', light: 'light beam', style: 'monumental', designer: 'Louis Kahn' },
  'intimate': { form: 'small enclosure', strategy: 'layered threshold', material: 'wood', color: 'warm palette', light: 'soft indirect light', style: 'human scale', designer: 'Alvar Aalto' },
  'open': { form: 'horizontal layers', strategy: 'outward viewing', material: 'glass / steel', color: 'bright palette', light: 'open daylight', style: 'modern', designer: 'Snøhetta' },
  'quiet': { form: 'simple geometry', strategy: 'garden courtyard', material: 'wood / stone', color: 'soft earth tones', light: 'filtered daylight', style: 'zen', designer: 'Tadao Ando' },
  'minimal': { form: 'clean lines', material: 'concrete', color: 'monochrome', light: 'diffuse light', style: 'minimalist' },
  'monumental': { form: 'massive geometry', strategy: 'grand axis', material: 'stone / concrete', light: 'dramatic contrast', style: 'brutalist' },
  'organic': { form: 'curved fluid forms', strategy: 'integrated with nature', material: 'timber / rammed earth', light: 'soft daylight', style: 'organic architecture', designer: 'Zaha Hadid' },
  'heavy': { form: 'solid massing', material: 'concrete / stone', style: 'brutalist', designer: 'Louis Kahn' },
  'light': { form: 'slender structures', material: 'glass / steel', light: 'bright daylight', designer: 'SANAA' },
  'pavilion': { form: 'light span', strategy: 'open pavilion', material: 'timber / steel', light: 'open daylight', designer: 'SANAA' },
  'courtyard': { form: 'enclosed garden', strategy: 'inward focus', material: 'stone / wood', light: 'filtered daylight', designer: 'Kengo Kuma' },
  'gallery': { form: 'large volume', strategy: 'central gathering', material: 'white walls / concrete', light: 'soft top light', designer: 'Tadao Ando' },
  'tower': { form: 'vertical circulation', strategy: 'vertical lookout', material: 'concrete / glass', light: 'open sky light' }
};

const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4'];

export default function App() {
  const [lang, setLang] = useState('zh');
  const t = UI_TEXT[lang];

  const [selections, setSelections] = useState({
    emotion: [], activity: [], setting: [], character: [], spatialType: []
  });
  const [customText, setCustomText] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [addBaseQuality, setAddBaseQuality] = useState(true);
  const [aiModel, setAiModel] = useState('midjourney');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const toggleSelection = (categoryId, enValue) => {
    setSelections(prev => {
      const categoryList = prev[categoryId];
      if (categoryList.includes(enValue)) return { ...prev, [categoryId]: categoryList.filter(item => item !== enValue) };
      return { ...prev, [categoryId]: [...categoryList, enValue] };
    });
  };

  const handleRandomize = () => {
    const randomSelections = {};
    PROMPT_DATA.forEach(category => {
      const count = category.id === 'character' || category.id === 'emotion' ? Math.floor(Math.random() * 2) + 1 : 1;
      const shuffled = [...category.options].sort(() => 0.5 - Math.random());
      randomSelections[category.id] = shuffled.slice(0, count).map(opt => opt.en);
    });
    setSelections(randomSelections);
  };

  const handleClear = () => {
    setSelections({ emotion: [], activity: [], setting: [], character: [], spatialType: [] });
    setCustomText('');
  };

  const processWeightedArray = (arr, model) => {
    if (!arr || arr.length === 0) return [];
    const counts = {};
    arr.forEach(item => {
      const normalized = item.toLowerCase().trim();
      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    return Object.entries(counts).map(([item, count]) => {
      if (count === 1) return item;
      if (model === 'midjourney') {
        return `${item}::${count === 2 ? '1.3' : '1.5'}`;
      } else {
        return count === 2 ? `prominent ${item}` : `dominant focus on ${item}`;
      }
    }).filter(Boolean);
  };

  useEffect(() => {
    const rawSelections = Object.values(selections).flat();
    if (rawSelections.length === 0 && !customText.trim()) {
      setGeneratedPrompt('');
      return;
    }

    const pools = { base: [...rawSelections], form: [], strategy: [], material: [], color: [], light: [], style: [], designer: [] };
    
    rawSelections.forEach(term => {
      const data = ATTRIBUTE_MATRIX[term];
      if (data) {
        if (data.form) pools.form.push(data.form);
        if (data.strategy) pools.strategy.push(data.strategy);
        if (data.material) pools.material.push(data.material);
        if (data.color) pools.color.push(data.color);
        if (data.light) pools.light.push(data.light);
        if (data.style) pools.style.push(data.style);
        if (data.designer) pools.designer.push(data.designer);
      }
    });

    if (customText.trim()) pools.base.push(customText.trim());

    const wBase = processWeightedArray(pools.base, aiModel);
    const wForm = processWeightedArray(pools.form, aiModel);
    const wStrategy = processWeightedArray(pools.strategy, aiModel);
    const wMaterial = processWeightedArray(pools.material, aiModel);
    const wColor = processWeightedArray(pools.color, aiModel);
    const wLight = processWeightedArray(pools.light, aiModel);
    const wStyle = processWeightedArray(pools.style, aiModel);
    const wDesigner = processWeightedArray(pools.designer, aiModel);

    let finalPrompt = '';

    if (aiModel === 'midjourney') {
      const mjParts = [...wBase, ...wStyle, ...wForm, ...wStrategy, ...wMaterial, ...wColor, ...wLight];
      if (wDesigner.length) mjParts.push(`by ${wDesigner.join(', ')}`);
      if (addBaseQuality) mjParts.push('masterpiece', 'best quality', 'highly detailed architectural photography');
      
      finalPrompt = Array.from(new Set(mjParts)).join(', ');
      if (aspectRatio) finalPrompt += ` --ar ${aspectRatio} --v 6.0`;

    } else {
      finalPrompt = aiModel === 'chatgpt'
        ? `Please generate a highly detailed, photorealistic architectural image. `
        : `Create a cinematic, realistic architectural photograph. `;

      if (wBase.length) finalPrompt += `The core concept features: ${wBase.join(', ')}. `;

      if (wStyle.length || wDesigner.length) {
        finalPrompt += `The design follows a ${wStyle.length ? wStyle.join(' and ') + ' style' : 'contemporary aesthetic'}`;
        if (wDesigner.length) finalPrompt += `, heavily inspired by the works of ${wDesigner.join(' and ')}. `;
        else finalPrompt += `. `;
      }
      if (wForm.length || wStrategy.length) finalPrompt += `Spatially, it incorporates ${[...wForm, ...wStrategy].join(', ')}. `;
      if (wMaterial.length || wColor.length) {
        finalPrompt += `The construction primarily utilizes ${wMaterial.length ? wMaterial.join(' and ') : 'modern materials'}`;
        if (wColor.length) finalPrompt += ` presented in a palette of ${wColor.join(', ')}`;
        finalPrompt += `. `;
      }
      if (wLight.length) finalPrompt += `The atmosphere is defined by ${wLight.join(', ')}. `;
      if (addBaseQuality) finalPrompt += `Ensure the output is a masterpiece with sharp focus, perfect composition, and exquisite architectural detailing.`;

      if (aspectRatio && aiModel === 'chatgpt') finalPrompt += ` Please use an aspect ratio of ${aspectRatio.replace(':', ' by ')}.`;
      else if (aspectRatio && aiModel === 'gemini') finalPrompt += ` Aspect ratio requirement: ${aspectRatio}.`;
    }

    setGeneratedPrompt(finalPrompt.replace(/\s+/g, ' ').trim());
  }, [selections, customText, aspectRatio, addBaseQuality, aiModel]);

  const copyToClipboard = () => {
    if (!generatedPrompt) return;

    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = generatedPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
      document.body.removeChild(textArea);
    });
  };

  return (
    <>
      <div className="min-h-screen bg-[#FDFCFB] text-stone-800 font-sans selection:bg-stone-200 selection:text-stone-900">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-stone-200 p-5 lg:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-serif tracking-[0.25em] text-stone-900 uppercase font-bold">
                SpaceGen
              </h1>
              <div className="h-4 w-px bg-stone-300"></div>
              <span className="text-xs tracking-[0.15em] uppercase text-stone-500 mt-0.5">
                SPATIAL PROMPT STUDIO
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative flex items-center gap-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full">
                <Globe size={14} strokeWidth={1.5} />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-[10px] tracking-widest uppercase font-medium outline-none cursor-pointer appearance-none text-center pr-1"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleClear} className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-stone-500 hover:text-stone-900 transition-colors">
                <Trash2 size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">{t.clear}</span>
              </button>

              <button onClick={handleRandomize} className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-stone-500 hover:text-stone-900 transition-colors">
                <RefreshCw size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">{t.inspire}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-5 lg:p-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {PROMPT_DATA.map((category) => (
              <section key={category.id} className="space-y-5">
                <h2 className="text-sm font-serif tracking-widest text-stone-600 uppercase flex items-center gap-4 font-medium">
                  {category.t[lang]}
                  <span className="text-[10px] text-stone-400 tracking-widest font-sans">{category.id}</span>
                  <div className="h-[1px] bg-stone-200 flex-1 mt-0.5"></div>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                  {category.options.map((option) => {
                    const isSelected = selections[category.id].includes(option.en);
                    return (
                      <button
                        key={option.en}
                        onClick={() => toggleSelection(category.id, option.en)}
                        className={`
                          w-full h-full min-h-[44px] flex items-center justify-center text-center px-2 py-2 rounded-sm text-[13px] tracking-wide transition-all duration-300 border leading-tight
                          ${isSelected
                            ? 'bg-stone-900 border-stone-900 text-white shadow-md font-medium'
                            : 'bg-white border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-900'
                          }
                        `}
                      >
                        {option.t[lang]}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="space-y-4 pt-6">
              <h2 className="text-sm font-serif tracking-widest text-stone-600 uppercase flex items-center gap-4 font-medium">
                {t.custom}
                <span className="text-[10px] text-stone-400 tracking-widest font-sans">(CUSTOM DETAILS)</span>
                <div className="h-[1px] bg-stone-200 flex-1 mt-0.5"></div>
              </h2>

              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={t.placeholder}
                className="w-full bg-transparent border-b border-stone-300 px-2 py-3 text-sm text-stone-800 focus:outline-none focus:border-stone-900 placeholder:text-stone-400 transition-colors"
              />
            </section>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 relative">
            <div className="sticky top-28 bg-white border border-stone-200 rounded-sm shadow-lg p-8 flex flex-col gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-serif tracking-widest text-stone-500 uppercase flex items-center gap-2 font-medium">
                  <Bot size={14} strokeWidth={1.5} />
                  {t.engine}
                </h4>

                <div className="flex bg-[#FDFCFB] p-1.5 rounded-sm border border-stone-200">
                  {[{ id: 'midjourney', label: 'Midjourney' }, { id: 'chatgpt', label: 'ChatGPT' }, { id: 'gemini', label: 'Gemini' }].map(model => (
                    <button
                      key={model.id}
                      onClick={() => setAiModel(model.id)}
                      className={`flex-1 py-2.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all duration-300 ${
                        aiModel === model.id ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      {model.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-serif tracking-widest text-stone-500 uppercase flex items-center gap-2 font-medium">
                    <Wand2 size={14} strokeWidth={1.5} />
                    {t.prompt}
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">{generatedPrompt.length} {t.chars}</span>
                </div>

                <div className="relative group">
                  <div
                    className={`
                      w-full min-h-[160px] max-h-[300px] overflow-y-auto p-5 rounded-sm text-sm leading-relaxed border transition-colors whitespace-pre-wrap break-words
                      ${generatedPrompt ? 'bg-[#FDFCFB] border-stone-400 text-stone-800' : 'bg-[#FDFCFB] border-stone-200 text-stone-400'}
                    `}
                  >
                    {generatedPrompt || '...'}
                  </div>

                  {generatedPrompt && (
                    <button
                      onClick={copyToClipboard}
                      className="absolute bottom-4 right-4 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-sm shadow-md transition-all flex items-center gap-2 transform active:scale-95"
                    >
                      {isCopied ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={1.5} />}
                      <span className="text-xs font-medium tracking-widest uppercase">
                        {isCopied ? t.copied : t.copy}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-stone-200">
                <h4 className="text-xs font-serif tracking-widest text-stone-500 uppercase flex items-center gap-2 font-medium">
                  <Settings2 size={14} strokeWidth={1.5} />
                  {t.prefs}
                </h4>

                <div className="flex items-center justify-between group">
                  <span className="text-sm tracking-wide text-stone-600 group-hover:text-stone-900 transition-colors">
                    {t.hq}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={addBaseQuality}
                      onChange={(e) => setAddBaseQuality(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <span className="text-sm tracking-wide text-stone-600 block">{t.ar}</span>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.map(ratio => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio === aspectRatio ? '' : ratio)}
                        className={`
                          px-4 py-1.5 rounded-sm text-xs tracking-widest transition-colors border
                          ${aspectRatio === ratio ? 'bg-stone-200 border-stone-400 text-stone-900 font-medium' : 'bg-white border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-800'}
                        `}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Analytics />
    </>
  );
}
