export interface PixelItem {
  id: string;
  name: string;
  emoji: string;
  category: "furniture" | "plant" | "pet" | "deco" | "electronic" | "food";
  price: number;
  rarity: "common" | "rare" | "legendary";
  description: string;
  pixelColor: string;
  imagePath?: string; // 있으면 아이소메트릭 PNG, 없으면 기존 SVG 픽셀아트
}

export const pixelItems: PixelItem[] = [
  // ===== 아이소메트릭 PNG 가구 =====
  // 침실
  { id: "iso_bedSingle", name: "싱글 침대", emoji: "🛏️", category: "furniture", price: 35, rarity: "common", description: "심플한 1인용 침대", pixelColor: "#93C5FD", imagePath: "/assets/furniture/Isometric/bedSingle_SE.png" },
  { id: "iso_bedDouble", name: "더블 침대", emoji: "🛏️", category: "furniture", price: 80, rarity: "rare", description: "넓은 2인용 침대", pixelColor: "#818CF8", imagePath: "/assets/furniture/Isometric/bedDouble_SE.png" },
  { id: "iso_bedBunk", name: "이층 침대", emoji: "🛏️", category: "furniture", price: 120, rarity: "rare", description: "위아래 이층 침대", pixelColor: "#A78BFA", imagePath: "/assets/furniture/Isometric/bedBunk_SE.png" },
  { id: "iso_pillow", name: "포근한 베개", emoji: "🛌", category: "deco", price: 10, rarity: "common", description: "폭신폭신 베개", pixelColor: "#E0E7FF", imagePath: "/assets/furniture/Isometric/pillow_SE.png" },

  // 거실
  { id: "iso_loungeSofa", name: "소파", emoji: "🛋️", category: "furniture", price: 60, rarity: "common", description: "편안한 소파", pixelColor: "#6EE7B7", imagePath: "/assets/furniture/Isometric/loungeSofa_SE.png" },
  { id: "iso_loungeSofaCorner", name: "코너 소파", emoji: "🛋️", category: "furniture", price: 150, rarity: "rare", description: "L자형 대형 소파", pixelColor: "#34D399", imagePath: "/assets/furniture/Isometric/loungeSofaCorner_SE.png" },
  { id: "iso_loungeChair", name: "라운지 의자", emoji: "🪑", category: "furniture", price: 40, rarity: "common", description: "세련된 의자", pixelColor: "#A7F3D0", imagePath: "/assets/furniture/Isometric/loungeChair_SE.png" },
  { id: "iso_loungeChairRelax", name: "리클라이너", emoji: "🪑", category: "furniture", price: 100, rarity: "rare", description: "눕기도 되는 안락의자", pixelColor: "#059669", imagePath: "/assets/furniture/Isometric/loungeChairRelax_SE.png" },

  // 주방
  { id: "iso_kitchenFridge", name: "냉장고", emoji: "🧊", category: "electronic", price: 80, rarity: "rare", description: "시원한 냉장고", pixelColor: "#BAE6FD", imagePath: "/assets/furniture/Isometric/kitchenFridgeLarge_SE.png" },
  { id: "iso_kitchenStove", name: "가스레인지", emoji: "🍳", category: "electronic", price: 60, rarity: "common", description: "요리를 위한 필수품", pixelColor: "#FED7AA", imagePath: "/assets/furniture/Isometric/kitchenStove_SE.png" },
  { id: "iso_kitchenSink", name: "싱크대", emoji: "🚰", category: "furniture", price: 45, rarity: "common", description: "깨끗한 싱크대", pixelColor: "#E0F2FE", imagePath: "/assets/furniture/Isometric/kitchenSink_SE.png" },
  { id: "iso_kitchenCoffee", name: "커피머신", emoji: "☕", category: "electronic", price: 50, rarity: "common", description: "향긋한 커피 한 잔", pixelColor: "#78350F", imagePath: "/assets/furniture/Isometric/kitchenCoffeeMachine_SE.png" },

  // 서재
  { id: "iso_desk", name: "사무 책상", emoji: "🪑", category: "furniture", price: 45, rarity: "common", description: "깔끔한 사무용 책상", pixelColor: "#D4A574", imagePath: "/assets/furniture/Isometric/desk_SE.png" },
  { id: "iso_deskCorner", name: "코너 책상", emoji: "🪑", category: "furniture", price: 90, rarity: "rare", description: "L자형 넓은 책상", pixelColor: "#B8860B", imagePath: "/assets/furniture/Isometric/deskCorner_SE.png" },
  { id: "iso_bookcaseOpen", name: "오픈 책장", emoji: "📚", category: "furniture", price: 50, rarity: "common", description: "책이 보이는 열린 책장", pixelColor: "#92400E", imagePath: "/assets/furniture/Isometric/bookcaseOpen_SE.png" },
  { id: "iso_bookcaseWide", name: "대형 책장", emoji: "📚", category: "furniture", price: 120, rarity: "rare", description: "수납력 갑! 넓은 책장", pixelColor: "#78350F", imagePath: "/assets/furniture/Isometric/bookcaseClosedWide_SE.png" },
  { id: "iso_chairDesk", name: "사무 의자", emoji: "🪑", category: "furniture", price: 35, rarity: "common", description: "편한 사무용 의자", pixelColor: "#1F2937", imagePath: "/assets/furniture/Isometric/chairDesk_SE.png" },

  // 조명
  { id: "iso_lampFloor", name: "스탠드 조명", emoji: "🪔", category: "deco", price: 30, rarity: "common", description: "따뜻한 플로어 램프", pixelColor: "#FEF3C7", imagePath: "/assets/furniture/Isometric/lampRoundFloor_SE.png" },
  { id: "iso_lampTable", name: "탁상 조명", emoji: "💡", category: "deco", price: 20, rarity: "common", description: "책상 위 작은 조명", pixelColor: "#FDE68A", imagePath: "/assets/furniture/Isometric/lampRoundTable_SE.png" },
  { id: "iso_lampSquare", name: "사각 스탠드", emoji: "🪔", category: "deco", price: 35, rarity: "common", description: "모던한 사각 조명", pixelColor: "#FBBF24", imagePath: "/assets/furniture/Isometric/lampSquareFloor_SE.png" },

  // 장식/식물
  { id: "iso_rugRound", name: "원형 러그", emoji: "⭕", category: "deco", price: 25, rarity: "common", description: "둥근 감성 러그", pixelColor: "#FCA5A5", imagePath: "/assets/furniture/Isometric/rugRound_SE.png" },
  { id: "iso_rugRect", name: "사각 러그", emoji: "🟫", category: "deco", price: 30, rarity: "common", description: "넓은 사각형 러그", pixelColor: "#FDBA74", imagePath: "/assets/furniture/Isometric/rugRectangle_SE.png" },
  { id: "iso_pottedPlant", name: "화분", emoji: "🪴", category: "plant", price: 20, rarity: "common", description: "싱그러운 화분", pixelColor: "#4ADE80", imagePath: "/assets/furniture/Isometric/pottedPlant_SE.png" },
  { id: "iso_plantSmall1", name: "미니 식물 A", emoji: "🌱", category: "plant", price: 10, rarity: "common", description: "작고 귀여운 식물", pixelColor: "#86EFAC", imagePath: "/assets/furniture/Isometric/plantSmall1_SE.png" },
  { id: "iso_plantSmall2", name: "미니 식물 B", emoji: "🌱", category: "plant", price: 10, rarity: "common", description: "또 다른 작은 식물", pixelColor: "#6EE7B7", imagePath: "/assets/furniture/Isometric/plantSmall2_SE.png" },
  { id: "iso_plantSmall3", name: "미니 식물 C", emoji: "🌱", category: "plant", price: 10, rarity: "common", description: "세번째 미니 식물", pixelColor: "#34D399", imagePath: "/assets/furniture/Isometric/plantSmall3_SE.png" },

  // 테크
  { id: "iso_laptop", name: "노트북", emoji: "💻", category: "electronic", price: 70, rarity: "rare", description: "슬림한 노트북", pixelColor: "#94A3B8", imagePath: "/assets/furniture/Isometric/laptop_SE.png" },
  { id: "iso_computer", name: "데스크탑", emoji: "🖥️", category: "electronic", price: 90, rarity: "rare", description: "듀얼 모니터 PC", pixelColor: "#475569", imagePath: "/assets/furniture/Isometric/computerScreen_SE.png" },
  { id: "iso_tvModern", name: "모던 TV", emoji: "📺", category: "electronic", price: 100, rarity: "rare", description: "대형 스마트 TV", pixelColor: "#334155", imagePath: "/assets/furniture/Isometric/televisionModern_SE.png" },
  { id: "iso_speaker", name: "스피커", emoji: "🔊", category: "electronic", price: 40, rarity: "common", description: "좋은 음질의 스피커", pixelColor: "#1E293B", imagePath: "/assets/furniture/Isometric/speaker_SE.png" },

  // 수납
  { id: "iso_coatRack", name: "옷걸이", emoji: "🧥", category: "furniture", price: 20, rarity: "common", description: "깔끔한 코트 행거", pixelColor: "#A8A29E", imagePath: "/assets/furniture/Isometric/coatRack_SE.png" },
  { id: "iso_cardboardBox", name: "박스", emoji: "📦", category: "deco", price: 5, rarity: "common", description: "택배 왔다!", pixelColor: "#D6B88C", imagePath: "/assets/furniture/Isometric/cardboardBoxClosed_SE.png" },
  { id: "iso_trashcan", name: "휴지통", emoji: "🗑️", category: "deco", price: 10, rarity: "common", description: "깨끗하게 분리수거", pixelColor: "#9CA3AF", imagePath: "/assets/furniture/Isometric/trashcan_SE.png" },

  // 테이블
  { id: "iso_tableCoffee", name: "커피 테이블", emoji: "🪵", category: "furniture", price: 30, rarity: "common", description: "소파 앞 낮은 테이블", pixelColor: "#D4A574", imagePath: "/assets/furniture/Isometric/tableCoffee_SE.png" },
  { id: "iso_tableGlass", name: "유리 테이블", emoji: "🪵", category: "furniture", price: 50, rarity: "common", description: "투명한 유리 테이블", pixelColor: "#BFDBFE", imagePath: "/assets/furniture/Isometric/tableCoffeeGlass_SE.png" },
  { id: "iso_tableRound", name: "원형 테이블", emoji: "🪵", category: "furniture", price: 40, rarity: "common", description: "둥근 다이닝 테이블", pixelColor: "#C4A882", imagePath: "/assets/furniture/Isometric/tableRound_SE.png" },
  { id: "iso_sideTable", name: "사이드 테이블", emoji: "🪵", category: "furniture", price: 20, rarity: "common", description: "침대 옆 미니 테이블", pixelColor: "#B8860B", imagePath: "/assets/furniture/Isometric/sideTable_SE.png" },

  // 레전더리 아이소메트릭
  { id: "iso_bathtub", name: "욕조", emoji: "🛁", category: "furniture", price: 200, rarity: "legendary", description: "거품 목욕 최고!", pixelColor: "#E0F2FE", imagePath: "/assets/furniture/Isometric/bathtub_SE.png" },
  { id: "iso_loungeSofaDouble", name: "대형 소파 세트", emoji: "🛋️", category: "furniture", price: 300, rarity: "legendary", description: "거실의 왕! 대형 소파", pixelColor: "#059669", imagePath: "/assets/furniture/Isometric/loungeSofaDouble_SE.png" },
  { id: "iso_bear", name: "곰인형", emoji: "🧸", category: "deco", price: 250, rarity: "legendary", description: "포근한 대형 곰인형", pixelColor: "#92400E", imagePath: "/assets/furniture/Isometric/bear_SE.png" },
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
