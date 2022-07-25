export interface Stat {
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  wizdom: number;
  skillPoint: number;
}

export type TrainingType = Exclude<keyof Stat, "skillPoint">;

const emptyStat: Stat = {
  speed: 0,
  stamina: 0,
  power: 0,
  guts: 0,
  wizdom: 0,
  skillPoint: 0,
};

export function Stat(obj: Partial<Stat>) {
  return {
    ...emptyStat,
    ...obj,
  };
}

export function addStat(a: Stat, b: Stat): Stat {
  return {
    speed: a.speed + b.speed,
    stamina: a.stamina + b.stamina,
    power: a.power + b.power,
    guts: a.guts + b.guts,
    wizdom: a.wizdom + b.wizdom,
    skillPoint: a.skillPoint + b.skillPoint,
  }
}
