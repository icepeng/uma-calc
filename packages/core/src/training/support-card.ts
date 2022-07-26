import { Stat, TrainingType } from "./stat";

export interface SupportCard {
  name: string;
  type: SupportType;
  trainingBonus: number; // 합연산
  motivationBonus: number; // 합연산
  friendshipBonus: number; // 곱연산
  statBonus: Stat;
  specialty: number; // 곱연산
}

export type SupportType = TrainingType | "friend";

const emptySupportCard: SupportCard = {
  name: "",
  type: "speed",
  trainingBonus: 0,
  motivationBonus: 0,
  friendshipBonus: 1,
  statBonus: Stat({}),
  specialty: 0,
};

export function SupportCard(obj: Partial<SupportCard>) {
  return {
    ...emptySupportCard,
    ...obj,
  };
}
