import { trainingTable } from "./data";
import { Stat, TrainingType } from "./stat";
import { StatBonus } from "./stat-bonus";
import { SupportCard } from "./support-card";

export function getTrainingStat(
  supportCards: SupportCard[],
  bonus: StatBonus,
  friendshipCards: string[],
  target: TrainingType,
  level: number,
  motivation: number
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
    .reduce((bonus, card) => bonus * (1 + card.friendshipBonus / 100), 1);

  const trainingBonus = supportCards.reduce(
    (sum, card) => sum + card.trainingBonus / 100,
    1
  );

  const motivationBonus = Math.max(
    1 +
      (motivation / 100) *
        supportCards.reduce((sum, card) => sum + card.motivationBonus / 100, 1),
    1 + motivation / 100
  );

  const countBonus = 1 + 0.05 * supportCards.length;

  const totalBonus =
    friendshipBonus * trainingBonus * motivationBonus * countBonus;

  return {
    speed: Math.floor(baseStat.speed * (1 + bonus.speed / 100) * totalBonus),
    stamina: Math.floor(
      baseStat.stamina * (1 + bonus.stamina / 100) * totalBonus
    ),
    power: Math.floor(baseStat.power * (1 + bonus.power / 100) * totalBonus),
    guts: Math.floor(baseStat.guts * (1 + bonus.guts / 100) * totalBonus),
    intelligence: Math.floor(baseStat.intelligence * (1 + bonus.intelligence / 100) * totalBonus),
    skillPoint: Math.floor(baseStat.skillPoint * totalBonus),
  };
}

function getTargetRate(card: SupportCard, target: TrainingType) {
  if (card.type === "friend") {
    return 100 / 600;
  }
  if (card.type === target) {
    return (100 + card.specialty) / (550 + card.specialty);
  }
  return 100 / (550 + card.specialty);
}

export function getAllCases(
  supportCards: SupportCard[],
  bonus: StatBonus,
  friendshipCards: string[],
  target: TrainingType,
  level: number,
  motivation: number
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
        motivation
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
