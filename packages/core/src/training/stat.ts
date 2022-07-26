export interface Stat {
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  intelligence: number;
  skillPoint: number;
}

export type TrainingType = Exclude<keyof Stat, "skillPoint">;

const emptyStat: Stat = {
  speed: 0,
  stamina: 0,
  power: 0,
  guts: 0,
  intelligence: 0,
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
    intelligence: a.intelligence + b.intelligence,
    skillPoint: a.skillPoint + b.skillPoint,
  };
}

export function scalaProductStat(stat: Stat, scala: number): Stat {
  return {
    speed: stat.speed * scala,
    stamina: stat.stamina * scala,
    power: stat.power * scala,
    guts: stat.guts * scala,
    intelligence: stat.intelligence * scala,
    skillPoint: stat.skillPoint * scala,
  };
}
