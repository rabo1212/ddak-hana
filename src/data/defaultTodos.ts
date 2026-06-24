import type { Todo } from "@/stores/useTodoStore";

type TodoTemplate = Omit<Todo, "id" | "completedAt" | "createdAt">;

export const defaultTodos: TodoTemplate[] = [
  // 셀프케어
  { title: "물 한 잔 마시기", emoji: "💧", category: "self-care", difficulty: 1, coinReward: 5, estimatedMinutes: 1, isCustom: false, isRoutine: false, routineDays: null },
  { title: "얼굴 씻기", emoji: "🧼", category: "self-care", difficulty: 1, coinReward: 5, estimatedMinutes: 3, isCustom: false, isRoutine: false, routineDays: null },
  { title: "양치하기", emoji: "🪥", category: "self-care", difficulty: 1, coinReward: 5, estimatedMinutes: 3, isCustom: false, isRoutine: false, routineDays: null },
  { title: "스트레칭 5분", emoji: "🧘", category: "self-care", difficulty: 1, coinReward: 10, estimatedMinutes: 5, isCustom: false, isRoutine: false, routineDays: null },

  // 집안일
  { title: "책상 위 정리하기", emoji: "🗂️", category: "chore", difficulty: 1, coinReward: 10, estimatedMinutes: 5, isCustom: false, isRoutine: false, routineDays: null },
  { title: "설거지하기", emoji: "🍽️", category: "chore", difficulty: 2, coinReward: 15, estimatedMinutes: 10, isCustom: false, isRoutine: false, routineDays: null },
  { title: "빨래 돌리기", emoji: "👕", category: "chore", difficulty: 2, coinReward: 10, estimatedMinutes: 5, isCustom: false, isRoutine: false, routineDays: null },
  { title: "쓰레기 버리기", emoji: "🗑️", category: "chore", difficulty: 1, coinReward: 10, estimatedMinutes: 5, isCustom: false, isRoutine: false, routineDays: null },

  // 업무
  { title: "이메일 1개 답장하기", emoji: "📧", category: "work", difficulty: 2, coinReward: 15, estimatedMinutes: 5, isCustom: false, isRoutine: false, routineDays: null },
  { title: "할일 목록 정리하기", emoji: "📝", category: "work", difficulty: 2, coinReward: 10, estimatedMinutes: 10, isCustom: false, isRoutine: false, routineDays: null },
  { title: "25분 집중 작업", emoji: "🍅", category: "work", difficulty: 3, coinReward: 30, estimatedMinutes: 25, isCustom: false, isRoutine: false, routineDays: null },

  // 건강
  { title: "10분 산책하기", emoji: "🚶", category: "health", difficulty: 2, coinReward: 20, estimatedMinutes: 10, isCustom: false, isRoutine: false, routineDays: null },
  { title: "비타민 먹기", emoji: "💊", category: "health", difficulty: 1, coinReward: 5, estimatedMinutes: 1, isCustom: false, isRoutine: false, routineDays: null },

  // 소셜
  { title: "친구에게 안부 보내기", emoji: "💬", category: "social", difficulty: 2, coinReward: 15, estimatedMinutes: 3, isCustom: false, isRoutine: false, routineDays: null },

  // 재미
  { title: "좋아하는 노래 1곡 듣기", emoji: "🎵", category: "fun", difficulty: 1, coinReward: 5, estimatedMinutes: 4, isCustom: false, isRoutine: false, routineDays: null },
  { title: "창밖 구경하기", emoji: "🪟", category: "fun", difficulty: 1, coinReward: 5, estimatedMinutes: 2, isCustom: false, isRoutine: false, routineDays: null },
];
