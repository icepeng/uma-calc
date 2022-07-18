import { Stat, TrainingType } from "./stat";

export interface SupportCard {
  name: string;
  type: SupportType;
  trainingBonus: number;
  conditionBonus: number;
  friendshipBonus: number;
  statBonus: Stat;
  speciality: number;
}

export type SupportType = TrainingType | "friend";

const emptySupportCard: SupportCard = {
  name: "",
  type: "speed",
  trainingBonus: 0,
  conditionBonus: 0,
  friendshipBonus: 1,
  statBonus: Stat({}),
  speciality: 0,
};

export function SupportCard(obj: Partial<SupportCard>) {
  return {
    ...emptySupportCard,
    ...obj,
  };
}
