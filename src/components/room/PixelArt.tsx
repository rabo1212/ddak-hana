"use client";

/**
 * 픽셀아트 SVG 렌더러
 * 각 아이템의 8x8 도트 데이터를 SVG <rect>로 그린다.
 */

interface PixelDef {
  grid: string[];
  palette: Record<string, string>;
}

// ===== 22개 아이템 픽셀 데이터 =====
const pixelData: Record<string, PixelDef> = {
  // ── 가구 ──
  item_bed: {
    grid: [
      "..PPPP..",
      ".PPPPPP.",
      "WWWWWWWW",
      "WLLLLLLW",
      "WLLLLLLW",
      "WBBBBBBW",
      "WBBBBBBW",
      "DD....DD",
    ],
    palette: { P: "#DDD6FE", W: "#A78BFA", L: "#EDE9FE", B: "#C4B5FD", D: "#7C3AED" },
  },
  item_desk: {
    grid: [
      "........",
      "BBBBBBBB",
      "BBBBBBBB",
      ".B....B.",
      ".B....B.",
      ".B....B.",
      ".B....B.",
      ".B....B.",
    ],
    palette: { B: "#C4A882" },
  },
  item_bookshelf: {
    grid: [
      "BBBBBBBB",
      "BRRGGYYB",
      "BRRGGYYB",
      "BBBBBBBB",
      "BYYRRPPB",
      "BYYRRPPB",
      "BBBBBBBB",
      "BB....BB",
    ],
    palette: { B: "#92400E", R: "#F87171", G: "#4ADE80", Y: "#FDE68A", P: "#C4B5FD" },
  },
  item_lamp: {
    grid: [
      "..YYYY..",
      ".YYYYYY.",
      ".YYYYYY.",
      "..YYYY..",
      "...SS...",
      "...SS...",
      "...SS...",
      "..SSSS..",
    ],
    palette: { Y: "#FDE68A", S: "#A78BFA" },
  },
  item_rug: {
    grid: [
      "........",
      "........",
      ".PPPPPP.",
      "PLLLLLLP",
      "PLLLLLLP",
      "PLLLLLLP",
      ".PPPPPP.",
      "........",
    ],
    palette: { P: "#C4B5FD", L: "#E9D5FF" },
  },

  // ── 식물 ──
  item_cactus: {
    grid: [
      "...GG...",
      "..GGGG..",
      "G.GGGG..",
      "GGGGGG.G",
      "GGGGGGGG",
      "..GGGG..",
      "..BBBB..",
      ".BBBBBB.",
    ],
    palette: { G: "#4ADE80", B: "#92400E" },
  },
  item_flower: {
    grid: [
      "...PP...",
      "..PPPP..",
      ".PPYYPP.",
      "..PPPP..",
      "...GG...",
      "..GGGG..",
      "..BBBB..",
      ".BBBBBB.",
    ],
    palette: { P: "#FDA4AF", Y: "#FDE68A", G: "#4ADE80", B: "#92400E" },
  },
  item_bonsai: {
    grid: [
      "..GGGG..",
      ".GGGGGG.",
      "GGGGGGGG",
      ".GGGGGG.",
      "...BB...",
      "..BBBB..",
      "...BB...",
      "..BBBB..",
    ],
    palette: { G: "#166534", B: "#92400E" },
  },

  // ── 펫 ──
  item_cat: {
    grid: [
      "O......O",
      "OO....OO",
      "OOOOOOOO",
      "OWOWWOWO",
      "OOOOOOOO",
      "OO.PP.OO",
      ".OOOOOO.",
      "..O..O..",
    ],
    palette: { O: "#FDBA74", W: "#FFFFFF", P: "#FDA4AF" },
  },
  item_fish: {
    grid: [
      ".BBBBBB.",
      "BWWWWWWB",
      "BWFFWWWB",
      "BWFWFWWB",
      "BWWWWFWB",
      "BWWWWWWB",
      "BWGGWWWB",
      ".BBBBBB.",
    ],
    palette: { B: "#67E8F9", W: "#E0F2FE", F: "#F97316", G: "#4ADE80" },
  },
  item_hamster: {
    grid: [
      ".YY..YY.",
      "YYYYYYYY",
      "YWYWWYWY",
      "YYYYYYYY",
      "YY.PP.YY",
      ".YYYYYY.",
      "..YYYY..",
      "..Y..Y..",
    ],
    palette: { Y: "#FCD34D", W: "#FFFFFF", P: "#FDA4AF" },
  },
  item_unicorn: {
    grid: [
      "...R....",
      "..RWW...",
      ".RWWWW..",
      "RWWWWWW.",
      ".WWPWWW.",
      ".WWWWW..",
      "..WW.WW.",
      "..W...W.",
    ],
    palette: { R: "#F0ABFC", W: "#FFFFFF", P: "#EC4899" },
  },

  // ── 데코 ──
  item_poster: {
    grid: [
      "GGGGGGGG",
      "GBBBBBBG",
      "GBRRRRGG",
      "GBRRRRBG",
      "GBRRRRGG",
      "GBBBBBBG",
      "GGGGGGGG",
      "........",
    ],
    palette: { G: "#D4D4D8", B: "#60A5FA", R: "#F87171" },
  },
  item_clock: {
    grid: [
      "..WWWW..",
      ".WWWWWW.",
      "WW.WW.WW",
      "WWWWW.WW",
      "WW.W..WW",
      "WW....WW",
      ".WWWWWW.",
      "..WWWW..",
    ],
    palette: { W: "#F3F4F6" },
  },
  item_star: {
    grid: [
      "...YY...",
      "...YY...",
      "YYYYYYYY",
      ".YYYYYY.",
      "..YYYY..",
      ".YY..YY.",
      "YY....YY",
      "........",
    ],
    palette: { Y: "#FDE68A" },
  },
  item_rainbow: {
    grid: [
      "..RRRR..",
      ".ROOOOO.",
      "ROYYYYOR",
      "ROYGGYOY",
      "ROYGGYOY",
      "ROY..YOR",
      ".O....O.",
      "........",
    ],
    palette: { R: "#F87171", O: "#FDBA74", Y: "#FDE68A", G: "#4ADE80" },
  },

  // ── 전자기기 ──
  item_tv: {
    grid: [
      "GGGGGGGG",
      "GBBBBBBG",
      "GBBBBBBG",
      "GBBBBBBG",
      "GBBBBBBG",
      "GGGGGGGG",
      "...GG...",
      "..GGGG..",
    ],
    palette: { G: "#6B7280", B: "#3B82F6" },
  },
  item_radio: {
    grid: [
      "....AA..",
      "...A....",
      "BBBBBBBB",
      "BCCCCCBB",
      "BCCCCCBB",
      "BOO.OOBB",
      "BOO.OOBB",
      "BBBBBBBB",
    ],
    palette: { A: "#78716C", B: "#A8A29E", C: "#FDE68A", O: "#57534E" },
  },
  item_gameboy: {
    grid: [
      ".PPPPPP.",
      ".PGGGPP.",
      ".PGGGPP.",
      ".PPPPPP.",
      ".PP..PP.",
      ".PRRPPP.",
      ".PP.RPP.",
      ".PPPPPP.",
    ],
    palette: { P: "#A78BFA", G: "#86EFAC", R: "#F87171" },
  },

  // ── 음식 ──
  item_cake: {
    grid: [
      "...RR...",
      "...YY...",
      ".PPPPPP.",
      "PWWWWWWP",
      "PPPPPPPP",
      "PWWWWWWP",
      "PPPPPPPP",
      "........",
    ],
    palette: { R: "#F87171", Y: "#FDE68A", P: "#FECDD3", W: "#FFFFFF" },
  },
  item_tea: {
    grid: [
      "........",
      "..SSSS..",
      ".GGGGGG.",
      ".GGGGGG.",
      ".GGGGGG.",
      ".GGGGGG.",
      "..GGGG..",
      "..SSSS..",
    ],
    palette: { G: "#BBF7D0", S: "#D4D4D8" },
  },

  // ── 레전더리 ──
  item_piano: {
    grid: [
      "BBBBBBBB",
      "BWBWBWBB",
      "BWBWBWBB",
      "BWWWWWBB",
      "BBBBBBBB",
      "BB....BB",
      "BB....BB",
      "BB....BB",
    ],
    palette: { B: "#1F2937", W: "#FFFFFF" },
  },
};

// ===== 컴포넌트 =====
interface PixelArtProps {
  itemId: string;
  size?: number;
  className?: string;
}

export default function PixelArt({ itemId, size = 32, className = "" }: PixelArtProps) {
  const data = pixelData[itemId];
  if (!data) return null;

  const rows = data.grid.length;
  const cols = Math.max(...data.grid.map((r) => r.length));
  const cellSize = size / Math.max(rows, cols);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {data.grid.map((row, y) =>
        row.split("").map((char, x) => {
          if (char === ".") return null;
          const color = data.palette[char];
          if (!color) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill={color}
            />
          );
        })
      )}
    </svg>
  );
}

// 아이템 ID로 픽셀 데이터 존재 여부 확인
export function hasPixelArt(itemId: string): boolean {
  return itemId in pixelData;
}
