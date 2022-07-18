import { StatBonus } from "./stat-bonus";
import { Stat, TrainingType } from "./stat";
import { SupportCard } from "./support-card";

export const trainingTypes: TrainingType[] = [
  "speed",
  "stamina",
  "power",
  "grit",
  "intellect",
];

const trainingTable: Record<TrainingType, Record<number, Stat>> = {
  speed: {
    1: Stat({
      speed: 10,
      power: 5,
      skillPoint: 2,
    }),
    2: Stat({
      speed: 11,
      power: 5,
      skillPoint: 2,
    }),
    3: Stat({
      speed: 12,
      power: 5,
      skillPoint: 2,
    }),
    4: Stat({
      speed: 13,
      power: 6,
      skillPoint: 2,
    }),
    5: Stat({
      speed: 14,
      power: 7,
      skillPoint: 2,
    }),
  },
  stamina: {
    1: Stat({
      stamina: 9,
      grit: 4,
      skillPoint: 2,
    }),
    2: Stat({
      stamina: 10,
      grit: 4,
      skillPoint: 2,
    }),
    3: Stat({
      stamina: 11,
      grit: 4,
      skillPoint: 2,
    }),
    4: Stat({
      stamina: 12,
      grit: 5,
      skillPoint: 2,
    }),
    5: Stat({
      stamina: 13,
      grit: 6,
      skillPoint: 2,
    }),
  },
  power: {
    1: Stat({
      power: 8,
      stamina: 5,
      skillPoint: 2,
    }),
    2: Stat({
      power: 9,
      stamina: 5,
      skillPoint: 2,
    }),
    3: Stat({
      power: 10,
      stamina: 5,
      skillPoint: 2,
    }),
    4: Stat({
      power: 11,
      stamina: 6,
      skillPoint: 2,
    }),
    5: Stat({
      power: 12,
      stamina: 7,
      skillPoint: 2,
    }),
  },
  grit: {
    1: Stat({
      grit: 8,
      speed: 4,
      stamina: 4,
      skillPoint: 2,
    }),
    2: Stat({
      grit: 9,
      speed: 4,
      stamina: 4,
      skillPoint: 2,
    }),
    3: Stat({
      grit: 10,
      speed: 4,
      stamina: 4,
      skillPoint: 2,
    }),
    4: Stat({
      grit: 11,
      speed: 5,
      stamina: 4,
      skillPoint: 2,
    }),
    5: Stat({
      grit: 12,
      speed: 5,
      stamina: 5,
      skillPoint: 2,
    }),
  },
  intellect: {
    1: Stat({
      intellect: 9,
      speed: 2,
      skillPoint: 2,
    }),
    2: Stat({
      intellect: 10,
      speed: 2,
      skillPoint: 2,
    }),
    3: Stat({
      intellect: 11,
      speed: 2,
      skillPoint: 2,
    }),
    4: Stat({
      intellect: 12,
      speed: 3,
      skillPoint: 2,
    }),
    5: Stat({
      intellect: 13,
      speed: 4,
      skillPoint: 2,
    }),
  },
};

export function getTrainingStat(
  supportCards: SupportCard[],
  bonus: StatBonus,
  friendshipCards: string[],
  target: TrainingType,
  level: number,
  condition: number
): Stat {
  const friendshipSet = new Set(friendshipCards);
  const baseStat = supportCards
    .filter((card) => card.statBonus)
    .reduce(
      (stat, card) => {
        Object.entries(card.statBonus!).forEach(([type, amount]) => {
          if (stat[type] === 0) {
            return;
          }
          stat[type] += amount;
        });
        return stat;
      },
      {
        ...trainingTable[target][level],
      }
    );

  const friendshipBonus = supportCards
    .filter((card) => card.type === target && friendshipSet.has(card.name))
    .reduce((bonus, card) => bonus * card.friendshipBonus, 1);

  const trainingBonus = supportCards.reduce(
    (sum, card) => sum + card.trainingBonus,
    1
  );

  const conditionBonus = Math.max(
    1 +
      condition *
        supportCards.reduce((sum, card) => sum + card.conditionBonus, 1),
    1 + condition
  );

  const countBonus = 1 + 0.05 * supportCards.length;

  const totalBonus =
    friendshipBonus * trainingBonus * conditionBonus * countBonus;

  return {
    speed: Math.floor(baseStat.speed * bonus.speed * totalBonus),
    stamina: Math.floor(baseStat.stamina * bonus.stamina * totalBonus),
    power: Math.floor(baseStat.power * bonus.power * totalBonus),
    grit: Math.floor(baseStat.grit * bonus.grit * totalBonus),
    intellect: Math.floor(
      baseStat.intellect * bonus.intellect * totalBonus
    ),
    skillPoint: Math.floor(baseStat.skillPoint * totalBonus),
  };
}

function getTargetRate(card: SupportCard, target: TrainingType) {
  if (card.type === "friend") {
    return 100 / 600;
  }
  if (card.type === target) {
    return (100 + card.speciality) / (550 + card.speciality);
  }
  return 100 / (550 + card.speciality);
}

export function getAllCases(
  supportCards: SupportCard[],
  bonus: StatBonus,
  friendshipCards: string[],
  target: TrainingType,
  level: number,
  condition: number
) {
  function rec(
    cards: SupportCard[],
    i: number,
    p: number
  ): { stat: Stat; p: number }[] {
    if (i === supportCards.length) {
      const stat = getTrainingStat(
        cards,
        bonus,
        friendshipCards,
        target,
        level,
        condition
      );
      return [
        {
          stat,
          p,
        },
      ];
    }
    const card = supportCards[i];
    const targetRate = getTargetRate(card, target);
    return [
      ...rec([...cards, card], i + 1, p * targetRate),
      ...rec(cards, i + 1, p * (1 - targetRate)),
    ];
  }

  return rec([], 0, 1);
}
