import { supportCards } from "../data/support";
import { SupportCard, SupportType } from "./support-card";

function interpolation(table: number[]) {
  const levelArray = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const result = Array.from({ length: levelArray[table.length - 1] }, () => 0);

  for (let i = 0; i < table.length; i += 1) {
    const item = table[i];

    if (item !== -1) {
      const index = table.slice(i + 1).findIndex((x) => x !== -1);
      if (index !== -1) {
        const nextPivot = index + i + 1;
        for (
          let level = levelArray[i];
          level <= levelArray[nextPivot];
          level += 1
        ) {
          result[level] =
            item +
            ((table[nextPivot] - table[i]) * (level - levelArray[i])) /
              (levelArray[nextPivot] - levelArray[i]);
        }
      } else {
        for (
          let level = levelArray[i];
          level <= levelArray[table.length - 1];
          level += 1
        ) {
          result[level] = item;
        }
      }
    }
  }

  return result.map((x) => Math.floor(x));
}

const effectMap = {
  friendshipBonus: 1,
  motivationBonus: 2,
  speedBonus: 3,
  staminaBonus: 4,
  powerBonus: 5,
  gutsBonus: 6,
  wizdomBonus: 7,
  trainingBonus: 8,
  specialty: 19,
  skillPointBonus: 30,
};

function addMultipliers(a: number, b: number) {
  return ((100 + a) * (100 + b)) / 100 - 100;
}

export function bonusResolver(
  type: keyof typeof effectMap,
  effects: number[][],
  level: number
) {
  const bonusEffect = effects.find((effect) => effect[0] === effectMap[type]);
  if (!bonusEffect) {
    return 0;
  }

  const table = bonusEffect.slice(1);
  const interpolated = interpolation(table);

  return interpolated[Math.min(level, interpolated.length - 1)];
}

export function uniqueBonusResolver(
  type: keyof typeof effectMap,
  unique:
    | { level: number; effects: { type: number; value: number }[] }
    | undefined,
  level: number
) {
  if (!unique) {
    return 0;
  }
  if (level < unique.level) {
    return 0;
  }

  const effect = unique.effects.find((eff) => eff.type === effectMap[type]);
  if (!effect) {
    return 0;
  }

  return effect.value;
}

export function loadSupportCard(
  id: number,
  level: number
): SupportCard | undefined {
  const rawData = supportCards.find((card) => card.support_id === id);
  if (!rawData) {
    return;
  }

  return {
    name: rawData.name_ko,
    type: rawData.type as SupportType,
    motivationBonus:
      bonusResolver("motivationBonus", rawData.effects, level) +
      uniqueBonusResolver("motivationBonus", rawData.unique, level),
    friendshipBonus: addMultipliers(
      bonusResolver("friendshipBonus", rawData.effects, level),
      uniqueBonusResolver("friendshipBonus", rawData.unique, level)
    ),
    trainingBonus:
      bonusResolver("trainingBonus", rawData.effects, level) +
      uniqueBonusResolver("trainingBonus", rawData.unique, level),
    statBonus: {
      speed:
        bonusResolver("speedBonus", rawData.effects, level) +
        uniqueBonusResolver("speedBonus", rawData.unique, level),
      stamina:
        bonusResolver("staminaBonus", rawData.effects, level) +
        uniqueBonusResolver("staminaBonus", rawData.unique, level),
      power:
        bonusResolver("powerBonus", rawData.effects, level) +
        uniqueBonusResolver("powerBonus", rawData.unique, level),
      guts:
        bonusResolver("gutsBonus", rawData.effects, level) +
        uniqueBonusResolver("gutsBonus", rawData.unique, level),
      wizdom:
        bonusResolver("wizdomBonus", rawData.effects, level) +
        uniqueBonusResolver("wizdomBonus", rawData.unique, level),
      skillPoint:
        bonusResolver("skillPointBonus", rawData.effects, level) +
        uniqueBonusResolver("skillPointBonus", rawData.unique, level),
    },
    specialty: addMultipliers(
      bonusResolver("specialty", rawData.effects, level),
      uniqueBonusResolver("specialty", rawData.unique, level)
    ),
  };
}
