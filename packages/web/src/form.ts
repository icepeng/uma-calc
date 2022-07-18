import { Stat, SupportCard, SupportType } from "@uma-calc/core";

export interface SupportCardFormGroup {
  name: string;
  type: SupportType;
  trainingBonus: number;
  friendshipBonus: number;
  conditionBonus: number;
  statBonus: keyof Stat | undefined;
  speciality: number;
  uniqueEffects: string[];
}

export function buildSupportCard({
  name,
  type,
  trainingBonus,
  friendshipBonus,
  conditionBonus,
  statBonus,
  speciality,
  uniqueEffects,
}: SupportCardFormGroup): SupportCard {
  return {
    name: name,
    type: type,
    speciality: speciality + +uniqueEffects.includes("speciality") * 20,
    trainingBonus:
      trainingBonus / 100 + +uniqueEffects.includes("trainingBonus") * 0.05,
    friendshipBonus:
      (1 + friendshipBonus / 100) *
      (1 + +uniqueEffects.includes("friendshipBonus") * 0.1),
    conditionBonus:
      conditionBonus / 100 + +uniqueEffects.includes("conditionBonus") * 0.15,
    statBonus: Stat({
      speed: +(statBonus === "speed") + +uniqueEffects.includes("speedBonus"),
      stamina:
        +(statBonus === "stamina") + +uniqueEffects.includes("staminaBonus"),
      power: +(statBonus === "power") + +uniqueEffects.includes("powerBonus"),
      grit: +(statBonus === "grit") + +uniqueEffects.includes("gritBonus"),
      intellect:
        +(statBonus === "intellect") +
        +uniqueEffects.includes("intellectBonus"),
      skillPoint:
        +(statBonus === "skillPoint") +
        +uniqueEffects.includes("skillPointBonus"),
    }),
  };
}
