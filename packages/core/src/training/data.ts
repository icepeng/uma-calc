import { Stat, TrainingType } from "./stat";

export const trainingTypes: TrainingType[] = [
  "speed",
  "stamina",
  "power",
  "guts",
  "intelligence",
];

export const trainingTable: Record<TrainingType, Record<number, Stat>> = {
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
      guts: 4,
      skillPoint: 2,
    }),
    2: Stat({
      stamina: 10,
      guts: 4,
      skillPoint: 2,
    }),
    3: Stat({
      stamina: 11,
      guts: 4,
      skillPoint: 2,
    }),
    4: Stat({
      stamina: 12,
      guts: 5,
      skillPoint: 2,
    }),
    5: Stat({
      stamina: 13,
      guts: 6,
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
  guts: {
    1: Stat({
      guts: 8,
      speed: 4,
      stamina: 4,
      skillPoint: 2,
    }),
    2: Stat({
      guts: 9,
      speed: 4,
      stamina: 4,
      skillPoint: 2,
    }),
    3: Stat({
      guts: 10,
      speed: 4,
      stamina: 4,
      skillPoint: 2,
    }),
    4: Stat({
      guts: 11,
      speed: 5,
      stamina: 4,
      skillPoint: 2,
    }),
    5: Stat({
      guts: 12,
      speed: 5,
      stamina: 5,
      skillPoint: 2,
    }),
  },
  intelligence: {
    1: Stat({
      intelligence: 9,
      speed: 2,
      skillPoint: 4,
    }),
    2: Stat({
      intelligence: 10,
      speed: 2,
      skillPoint: 4,
    }),
    3: Stat({
      intelligence: 11,
      speed: 2,
      skillPoint: 4,
    }),
    4: Stat({
      intelligence: 12,
      speed: 3,
      skillPoint: 4,
    }),
    5: Stat({
      intelligence: 13,
      speed: 4,
      skillPoint: 4,
    }),
  },
};
