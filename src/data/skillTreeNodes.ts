import type { Node, Edge } from "@xyflow/react";

// 업적 ID → 스킬트리 노드 위치 매핑
// 4열: 시작(x=0) → 중급(x=250) → 고급(x=500) → 전설(x=750)
// 4행 라인: 할일, 스트릭, 코인/방꾸미기, 소셜/기타

export const skillTreeNodes: Node[] = [
  // === 할일 라인 (y=0) ===
  { id: "first_task", position: { x: 0, y: 0 }, data: { label: "first_task" }, type: "achievement" },
  { id: "task_10", position: { x: 250, y: 0 }, data: { label: "task_10" }, type: "achievement" },
  { id: "task_50", position: { x: 500, y: 0 }, data: { label: "task_50" }, type: "achievement" },
  { id: "task_100", position: { x: 750, y: 0 }, data: { label: "task_100" }, type: "achievement" },

  // === 스트릭 라인 (y=150) ===
  { id: "streak_3", position: { x: 0, y: 150 }, data: { label: "streak_3" }, type: "achievement" },
  { id: "streak_7", position: { x: 250, y: 150 }, data: { label: "streak_7" }, type: "achievement" },
  { id: "streak_30", position: { x: 500, y: 150 }, data: { label: "streak_30" }, type: "achievement" },

  // === 시간 라인 (스트릭에서 분기, y=300) ===
  { id: "early_bird", position: { x: 250, y: 300 }, data: { label: "early_bird" }, type: "achievement" },
  { id: "night_owl", position: { x: 500, y: 300 }, data: { label: "night_owl" }, type: "achievement" },

  // === 코인 + 방꾸미기 라인 (y=450) ===
  { id: "coin_100", position: { x: 0, y: 450 }, data: { label: "coin_100" }, type: "achievement" },
  { id: "coin_500", position: { x: 250, y: 450 }, data: { label: "coin_500" }, type: "achievement" },
  { id: "room_lv3", position: { x: 500, y: 450 }, data: { label: "room_lv3" }, type: "achievement" },
  { id: "room_lv6", position: { x: 750, y: 450 }, data: { label: "room_lv6" }, type: "achievement" },

  // === 소셜/기타 라인 (y=600) ===
  { id: "friend_1", position: { x: 0, y: 600 }, data: { label: "friend_1" }, type: "achievement" },
  { id: "custom_todo", position: { x: 250, y: 600 }, data: { label: "custom_todo" }, type: "achievement" },
];

export const skillTreeEdges: Edge[] = [
  // 할일 라인
  { id: "e-first-10", source: "first_task", target: "task_10", animated: true },
  { id: "e-10-50", source: "task_10", target: "task_50", animated: true },
  { id: "e-50-100", source: "task_50", target: "task_100", animated: true },

  // 스트릭 라인
  { id: "e-s3-s7", source: "streak_3", target: "streak_7", animated: true },
  { id: "e-s7-s30", source: "streak_7", target: "streak_30", animated: true },

  // 스트릭 → 시간 분기
  { id: "e-s3-early", source: "streak_3", target: "early_bird", animated: true },
  { id: "e-s7-night", source: "streak_7", target: "night_owl", animated: true },

  // 코인 → 방꾸미기 라인
  { id: "e-c100-c500", source: "coin_100", target: "coin_500", animated: true },
  { id: "e-c500-r3", source: "coin_500", target: "room_lv3", animated: true },
  { id: "e-r3-r6", source: "room_lv3", target: "room_lv6", animated: true },

  // 할일 → 스트릭 연결 (크로스)
  { id: "e-first-s3", source: "first_task", target: "streak_3", animated: true },

  // 할일 → 코인 연결 (크로스)
  { id: "e-first-c100", source: "first_task", target: "coin_100", animated: true },

  // 할일 → 커스텀
  { id: "e-first-custom", source: "first_task", target: "custom_todo", animated: true },
];
