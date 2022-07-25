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

  return interpolated[level];
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
    motivationBonus: bonusResolver("motivationBonus", rawData.effects, level),
    friendshipBonus: bonusResolver("friendshipBonus", rawData.effects, level),
    trainingBonus: bonusResolver("trainingBonus", rawData.effects, level),
    statBonus: {
      speed: bonusResolver("speedBonus", rawData.effects, level),
      stamina: bonusResolver("staminaBonus", rawData.effects, level),
      power: bonusResolver("powerBonus", rawData.effects, level),
      guts: bonusResolver("gutsBonus", rawData.effects, level),
      wizdom: bonusResolver("wizdomBonus", rawData.effects, level),
      skillPoint: bonusResolver("skillPointBonus", rawData.effects, level),
    },
    specialty: bonusResolver("specialty", rawData.effects, level),
  };
}
