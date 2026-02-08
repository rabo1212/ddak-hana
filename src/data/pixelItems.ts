export interface PixelItem {
  id: string;
  name: string;
  emoji: string;
  category: "furniture" | "plant" | "pet" | "deco" | "electronic" | "food";
  price: number;
  rarity: "common" | "rare" | "legendary";
  description: string;
  pixelColor: string;
}

export const pixelItems: PixelItem[] = [
  // 가구
  { id: "item_bed", name: "아늑한 침대", emoji: "🛏️", category: "furniture", price: 30, rarity: "common", description: "포근한 침대", pixelColor: "#DDD6FE" },
  { id: "item_desk", name: "공부 책상", emoji: "🪑", category: "furniture", price: 25, rarity: "common", description: "집중할 수 있는 책상", pixelColor: "#C4A882" },
  { id: "item_bookshelf", name: "작은 책장", emoji: "📚", category: "furniture", price: 35, rarity: "common", description: "좋아하는 책들로 가득", pixelColor: "#92400E" },
  { id: "item_lamp", name: "무드등", emoji: "💡", category: "furniture", price: 20, rarity: "common", description: "따뜻한 빛의 무드등", pixelColor: "#FDE68A" },
  { id: "item_rug", name: "파스텔 러그", emoji: "🟪", category: "furniture", price: 15, rarity: "common", description: "부드러운 러그", pixelColor: "#E9D5FF" },

  // 식물
  { id: "item_cactus", name: "선인장", emoji: "🌵", category: "plant", price: 10, rarity: "common", description: "물 안 줘도 되는 친구", pixelColor: "#86EFAC" },
  { id: "item_flower", name: "화분 꽃", emoji: "🌸", category: "plant", price: 15, rarity: "common", description: "분홍 꽃이 예쁘다", pixelColor: "#FDA4AF" },
  { id: "item_bonsai", name: "분재", emoji: "🌳", category: "plant", price: 40, rarity: "rare", description: "멋스러운 미니 분재", pixelColor: "#166534" },

  // 펫
  { id: "item_cat", name: "고양이", emoji: "🐱", category: "pet", price: 50, rarity: "rare", description: "냐옹~ 귀여운 고양이", pixelColor: "#FDBA74" },
  { id: "item_fish", name: "어항", emoji: "🐟", category: "pet", price: 30, rarity: "common", description: "물고기가 헤엄치는 어항", pixelColor: "#67E8F9" },
  { id: "item_hamster", name: "햄스터", emoji: "🐹", category: "pet", price: 45, rarity: "rare", description: "쳇바퀴 도는 햄스터", pixelColor: "#FCD34D" },

  // 데코
  { id: "item_poster", name: "포스터", emoji: "🖼️", category: "deco", price: 10, rarity: "common", description: "좋아하는 포스터", pixelColor: "#60A5FA" },
  { id: "item_clock", name: "벽시계", emoji: "🕐", category: "deco", price: 20, rarity: "common", description: "째깍째깍 벽시계", pixelColor: "#F3F4F6" },
  { id: "item_star", name: "별 조명", emoji: "⭐", category: "deco", price: 25, rarity: "common", description: "반짝반짝 별 조명", pixelColor: "#FDE68A" },
  { id: "item_rainbow", name: "무지개 모빌", emoji: "🌈", category: "deco", price: 60, rarity: "rare", description: "무지개빛 모빌", pixelColor: "#F472B6" },

  // 전자기기
  { id: "item_tv", name: "레트로 TV", emoji: "📺", category: "electronic", price: 35, rarity: "common", description: "옛날 감성 TV", pixelColor: "#6B7280" },
  { id: "item_radio", name: "라디오", emoji: "📻", category: "electronic", price: 20, rarity: "common", description: "음악이 흘러나오는 라디오", pixelColor: "#78716C" },
  { id: "item_gameboy", name: "게임기", emoji: "🎮", category: "electronic", price: 55, rarity: "rare", description: "추억의 게임기", pixelColor: "#A78BFA" },

  // 음식
  { id: "item_cake", name: "케이크", emoji: "🍰", category: "food", price: 15, rarity: "common", description: "달콤한 딸기 케이크", pixelColor: "#FECDD3" },
  { id: "item_tea", name: "차 한 잔", emoji: "🍵", category: "food", price: 10, rarity: "common", description: "따뜻한 녹차", pixelColor: "#BBF7D0" },

  // 레전더리
  { id: "item_unicorn", name: "유니콘", emoji: "🦄", category: "pet", price: 100, rarity: "legendary", description: "전설의 유니콘!", pixelColor: "#F0ABFC" },
  { id: "item_piano", name: "미니 피아노", emoji: "🎹", category: "electronic", price: 80, rarity: "legendary", description: "아름다운 선율의 피아노", pixelColor: "#1F2937" },
];

export const shopCategories = [
  { id: "all", name: "전체", emoji: "🏪" },
  { id: "furniture", name: "가구", emoji: "🪑" },
  { id: "plant", name: "식물", emoji: "🌿" },
  { id: "pet", name: "펫", emoji: "🐾" },
  { id: "deco", name: "데코", emoji: "✨" },
  { id: "electronic", name: "전자기기", emoji: "📱" },
  { id: "food", name: "음식", emoji: "🍴" },
];
