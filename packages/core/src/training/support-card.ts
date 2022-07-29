import { Stat, TrainingType } from "./stat";

export interface SupportCard {
  id: number;
  type: SupportType;
  trainingBonus: number; // 합연산
  motivationBonus: number; // 합연산
  friendshipBonus: number; // 곱연산
  statBonus: Stat;
  specialty: number; // 곱연산
}

export type SupportType = TrainingType | "friend";
