const 마장 = {
  잔디: '잔디',
  더트: '더트',
} as const;
export type 마장 = typeof 마장[keyof typeof 마장];

const 마장상태 = {
  양호: '양호',
  연중: '연중',
  중: '중',
  불량: '불량',
} as const;
export type 마장상태 = typeof 마장상태[keyof typeof 마장상태];

const 적성랭크 = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  S: 'S',
};
export type 적성랭크 = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'S';

const 작전 = {
  도주: '도주',
  선행: '선행',
  선입: '선입',
  추입: '추입',
} as const;
export type 작전 = typeof 작전[keyof typeof 작전];

const 컨디션 = {
  최상: '최상',
  양호: '양호',
  보통: '보통',
  저조: '저조',
  최악: '최악',
} as const;
export type 컨디션 = typeof 컨디션[keyof typeof 컨디션];

const 거리타입 = {
  단거리: '단거리',
  마일: '마일',
  중거리: '중거리',
  장거리: '장거리',
} as const;
export type 거리타입 = typeof 거리타입[keyof typeof 거리타입];

const 거리 = {
  1000: 1000,
  1200: 1200,
  1400: 1400,
  1500: 1500,
  1600: 1600,
  1800: 1800,
  2000: 2000,
  2200: 2200,
  2300: 2300,
  2400: 2400,
  2500: 2500,
  2600: 2600,
  3000: 3000,
  3200: 3200,
  3400: 3400,
  3600: 3600,
} as const;
export type 거리 = typeof 거리[keyof typeof 거리];

export const 거리타입by거리 = {
  [거리[1000]]: 거리타입.단거리,
  [거리[1200]]: 거리타입.단거리,
  [거리[1400]]: 거리타입.단거리,
  [거리[1500]]: 거리타입.마일,
  [거리[1600]]: 거리타입.마일,
  [거리[1800]]: 거리타입.마일,
  [거리[2000]]: 거리타입.중거리,
  [거리[2200]]: 거리타입.중거리,
  [거리[2300]]: 거리타입.중거리,
  [거리[2400]]: 거리타입.중거리,
  [거리[2500]]: 거리타입.중거리,
  [거리[2600]]: 거리타입.중거리,
  [거리[3000]]: 거리타입.장거리,
  [거리[3200]]: 거리타입.장거리,
  [거리[3400]]: 거리타입.장거리,
  [거리[3600]]: 거리타입.장거리,
} as const;

interface 랭크보정 {
  마장: Record<적성랭크, number>;
  거리: {
    속도: Record<적성랭크, number>;
    가속도: Record<적성랭크, number>;
  };
  각질: Record<적성랭크, number>;
}
export const 랭크보정: 랭크보정 = {
  마장: {
    A: 1,
    B: 0.9,
    C: 0.8,
    D: 0.7,
    E: 0.5,
    F: 0.3,
    G: 0.1,
    S: 1.05,
  },
  거리: {
    속도: {
      A: 1,
      B: 0.9,
      C: 0.8,
      D: 0.6,
      E: 0.4,
      F: 0.2,
      G: 0.1,
      S: 1.05,
    },
    가속도: {
      A: 1,
      B: 1,
      C: 1,
      D: 1,
      E: 0.6,
      F: 0.5,
      G: 0.4,
      S: 1,
    },
  },
  각질: {
    A: 1,
    B: 0.85,
    C: 0.75,
    D: 0.6,
    E: 0.4,
    F: 0.2,
    G: 0.1,
    S: 1.1,
  },
};

interface 마장보정 {
  speed: Record<마장, Record<마장상태, number>>;
  power: Record<마장, Record<마장상태, number>>;
  consumption: Record<마장, Record<마장상태, number>>;
}
export const 마장보정: 마장보정 = {
  speed: {
    [마장.잔디]: {
      [마장상태.양호]: 0,
      [마장상태.연중]: 0,
      [마장상태.중]: 0,
      [마장상태.불량]: -50,
    },
    [마장.더트]: {
      [마장상태.양호]: 0,
      [마장상태.연중]: 0,
      [마장상태.중]: 0,
      [마장상태.불량]: -50,
    },
  },
  power: {
    [마장.잔디]: {
      [마장상태.양호]: 0,
      [마장상태.연중]: -50,
      [마장상태.중]: -50,
      [마장상태.불량]: -50,
    },
    [마장.더트]: {
      [마장상태.양호]: -100,
      [마장상태.연중]: -50,
      [마장상태.중]: -100,
      [마장상태.불량]: -100,
    },
  },
  consumption: {
    [마장.잔디]: {
      [마장상태.양호]: 1,
      [마장상태.연중]: 1,
      [마장상태.중]: 1.02,
      [마장상태.불량]: 1.02,
    },
    [마장.더트]: {
      [마장상태.양호]: 1,
      [마장상태.연중]: 1,
      [마장상태.중]: 1.01,
      [마장상태.불량]: 1.02,
    },
  },
};

interface 작전보정 {
  HP: Record<작전, number>;
  속도: Record<작전, [number, number, number]>;
  가속도: Record<작전, [number, number, number]>;
}
export const 작전보정: 작전보정 = {
  HP: {
    [작전.도주]: 0.95,
    [작전.선행]: 0.89,
    [작전.선입]: 1,
    [작전.추입]: 0.995,
  },
  속도: {
    [작전.도주]: [1, 0.98, 0.962],
    [작전.선행]: [0.978, 0.991, 0.975],
    [작전.선입]: [0.938, 0.998, 0.994],
    [작전.추입]: [0.931, 1, 1],
  },
  가속도: {
    [작전.도주]: [1, 1, 0.996],
    [작전.선행]: [0.985, 1, 0.996],
    [작전.선입]: [0.975, 1, 1],
    [작전.추입]: [0.945, 1, 0.997],
  },
};

export const 컨디션보정: Record<컨디션, number> = {
  [컨디션.최상]: 1.04,
  [컨디션.양호]: 1.02,
  [컨디션.보통]: 1,
  [컨디션.저조]: 0.98,
  [컨디션.최악]: 0.96,
};