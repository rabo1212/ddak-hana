export interface Character {
  id: string;
  name: string;
  emoji: string;
  personality: string;
}

export const characters: Character[] = [
  { id: "bear", name: "곰돌이", emoji: "🐻", personality: "든든한 응원단장" },
  { id: "buffalo", name: "버팔로", emoji: "🦬", personality: "묵묵히 함께하는 힘" },
  { id: "chick", name: "병아리", emoji: "🐤", personality: "작지만 용감한 친구" },
  { id: "chicken", name: "닭둘기", emoji: "🐔", personality: "아침을 깨우는 알람" },
  { id: "cow", name: "젖소", emoji: "🐮", personality: "느긋한 힐링 메이트" },
  { id: "crocodile", name: "악어", emoji: "🐊", personality: "날카로운 집중력" },
  { id: "dog", name: "강아지", emoji: "🐶", personality: "무한 긍정 에너지" },
  { id: "duck", name: "오리", emoji: "🦆", personality: "꽥꽥 페이스메이커" },
  { id: "elephant", name: "코끼리", emoji: "🐘", personality: "기억력 좋은 매니저" },
  { id: "frog", name: "개구리", emoji: "🐸", personality: "점프하듯 앞으로!" },
  { id: "giraffe", name: "기린", emoji: "🦒", personality: "멀리 보는 전략가" },
  { id: "goat", name: "염소", emoji: "🐐", personality: "산도 오르는 끈기" },
  { id: "gorilla", name: "고릴라", emoji: "🦍", personality: "파워풀한 실행력" },
  { id: "hippo", name: "하마", emoji: "🦛", personality: "여유로운 리더" },
  { id: "horse", name: "말", emoji: "🐴", personality: "달리는 것이 즐거워" },
  { id: "monkey", name: "원숭이", emoji: "🐵", personality: "재치있는 문제 해결사" },
  { id: "moose", name: "무스", emoji: "🫎", personality: "묵직한 존재감" },
  { id: "narwhal", name: "일각고래", emoji: "🐳", personality: "유니콘 같은 꿈꾸는 자" },
  { id: "owl", name: "부엉이", emoji: "🦉", personality: "밤에 더 빛나는 지혜" },
  { id: "panda", name: "판다", emoji: "🐼", personality: "귀여움으로 세상을 구해" },
  { id: "parrot", name: "앵무새", emoji: "🦜", personality: "칭찬 전문가" },
  { id: "penguin", name: "펭귄", emoji: "🐧", personality: "차분한 도우미" },
  { id: "pig", name: "돼지", emoji: "🐷", personality: "행운을 부르는 친구" },
  { id: "rabbit", name: "토끼", emoji: "🐰", personality: "열정 넘치는 스프린터" },
  { id: "rhino", name: "코뿔소", emoji: "🦏", personality: "돌진하는 추진력" },
  { id: "sloth", name: "나무늘보", emoji: "🦥", personality: "천천히 해도 괜찮아" },
  { id: "snake", name: "뱀", emoji: "🐍", personality: "유연한 적응력" },
  { id: "walrus", name: "바다코끼리", emoji: "🦭", personality: "든든한 수호자" },
  { id: "whale", name: "고래", emoji: "🐋", personality: "넓은 마음의 소유자" },
  { id: "zebra", name: "얼룩말", emoji: "🦓", personality: "균형 잡힌 완벽주의자" },
];

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

export function getCharacterImagePath(id: string, style: string = "Round"): string {
  return `/assets/animals/${style}/${id}.png`;
}
