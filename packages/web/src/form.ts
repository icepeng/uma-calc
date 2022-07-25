import { Stat, SupportCard, SupportType } from "@uma-calc/core";

export interface SupportCardFormGroup {
  name: string;
  type: SupportType;
  trainingBonus: number;
  friendshipBonus: number;
  motivationBonus: number;
  statBonus: keyof Stat | undefined;
  specialty: number;
  uniqueEffects: string[];
}

export function buildSupportCard({
  name,
  type,
  trainingBonus,
  friendshipBonus,
  motivationBonus,
  statBonus,
  specialty,
  uniqueEffects,
}: SupportCardFormGroup): SupportCard {
  return {
    name: name,
    type: type,
    specialty: specialty + +uniqueEffects.includes("specialty") * 20,
    trainingBonus:
      trainingBonus / 100 + +uniqueEffects.includes("trainingBonus") * 0.05,
    friendshipBonus:
      (1 + friendshipBonus / 100) *
      (1 + +uniqueEffects.includes("friendshipBonus") * 0.1),
    motivationBonus:
      motivationBonus / 100 + +uniqueEffects.includes("motivationBonus") * 0.15,
    statBonus: Stat({
      speed: +(statBonus === "speed") + +uniqueEffects.includes("speedBonus"),
      stamina:
        +(statBonus === "stamina") + +uniqueEffects.includes("staminaBonus"),
      power: +(statBonus === "power") + +uniqueEffects.includes("powerBonus"),
      guts: +(statBonus === "guts") + +uniqueEffects.includes("gutsBonus"),
      wizdom:
        +(statBonus === "wizdom") +
        +uniqueEffects.includes("wizdomBonus"),
      skillPoint:
        +(statBonus === "skillPoint") +
        +uniqueEffects.includes("skillPointBonus"),
    }),
  };
}
