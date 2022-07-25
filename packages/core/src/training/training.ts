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
    intellect: Math.floor(baseStat.intellect * bonus.intellect * totalBonus),
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
