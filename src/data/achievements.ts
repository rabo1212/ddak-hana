export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
  condition: { type: string; value: number };
  reward: number;
  rarity: "common" | "rare" | "legendary";
}

export const achievements: Achievement[] = [
  // 할일 완료 계열
  {
    id: "first_task",
    title: "첫 발걸음",
    emoji: "👣",
    description: "할일 1개를 완료했어!",
    condition: { type: "totalCompleted", value: 1 },
    reward: 5,
    rarity: "common",
  },
  {
    id: "task_10",
    title: "열 번째 달성",
    emoji: "🌟",
    description: "할일 10개를 완료했어!",
    condition: { type: "totalCompleted", value: 10 },
    reward: 20,
    rarity: "common",
  },
  {
    id: "task_50",
    title: "반백 달성",
    emoji: "💎",
    description: "할일 50개를 완료했어!",
    condition: { type: "totalCompleted", value: 50 },
    reward: 50,
    rarity: "rare",
  },
  {
    id: "task_100",
    title: "백전백승",
    emoji: "👑",
    description: "할일 100개를 완료했어!",
    condition: { type: "totalCompleted", value: 100 },
    reward: 100,
    rarity: "legendary",
  },

  // 스트릭 계열
  {
    id: "streak_3",
    title: "3일의 기적",
    emoji: "🔥",
    description: "3일 연속 달성!",
    condition: { type: "currentStreak", value: 3 },
    reward: 10,
    rarity: "common",
  },
  {
    id: "streak_7",
    title: "일주일 전사",
    emoji: "⚔️",
    description: "7일 연속 달성!",
    condition: { type: "currentStreak", value: 7 },
    reward: 25,
    rarity: "common",
  },
  {
    id: "streak_30",
    title: "한 달의 전설",
    emoji: "🏆",
    description: "30일 연속 달성!",
    condition: { type: "currentStreak", value: 30 },
    reward: 100,
    rarity: "legendary",
  },

  // 시간 계열
  {
    id: "early_bird",
    title: "아침형 인간",
    emoji: "🌅",
    description: "오전 7시 전에 할일 완료!",
    condition: { type: "earlyBird", value: 7 },
    reward: 15,
    rarity: "rare",
  },
  {
    id: "night_owl",
    title: "올빼미",
    emoji: "🦉",
    description: "자정 이후에 할일 완료!",
    condition: { type: "nightOwl", value: 0 },
    reward: 15,
    rarity: "rare",
  },

  // 코인 계열
  {
    id: "coin_100",
    title: "동전 모으기",
    emoji: "💰",
    description: "100코인 보유 달성!",
    condition: { type: "totalCoins", value: 100 },
    reward: 10,
    rarity: "common",
  },
  {
    id: "coin_500",
    title: "부자의 길",
    emoji: "🤑",
    description: "500코인 보유 달성!",
    condition: { type: "totalCoins", value: 500 },
    reward: 30,
    rarity: "rare",
  },

  // 방꾸미기 계열
  {
    id: "room_lv3",
    title: "방꾸미기 입문",
    emoji: "🏠",
    description: "방 레벨 3 달성!",
    condition: { type: "roomLevel", value: 3 },
    reward: 20,
    rarity: "common",
  },
  {
    id: "room_lv6",
    title: "인테리어 달인",
    emoji: "🏰",
    description: "방 레벨 6 달성!",
    condition: { type: "roomLevel", value: 6 },
    reward: 50,
    rarity: "legendary",
  },

  // 소셜 계열
  {
    id: "friend_1",
    title: "첫 친구",
    emoji: "🤝",
    description: "친구 1명 추가!",
    condition: { type: "friendCount", value: 1 },
    reward: 10,
    rarity: "common",
  },

  // 커스텀 할일
  {
    id: "custom_todo",
    title: "나만의 할일",
    emoji: "✏️",
    description: "커스텀 할일을 추가했어!",
    condition: { type: "hasCustomTodo", value: 1 },
    reward: 5,
    rarity: "common",
  },
];

export const rarityColors = {
  common: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  rare: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-200" },
  legendary: { bg: "bg-amber-50", text: "text-amber-500", border: "border-amber-300" },
};

export const rarityLabels = {
  common: "일반",
  rare: "희귀",
  legendary: "전설",
};
