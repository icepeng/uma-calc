import { 작전, 거리타입, 마장, 적성랭크, 컨디션, 거리, 마장상태 } from './data';

export interface BaseStat {
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  intelligence: number;
}

export interface HealSkils {
  gold: number;
  normal: number;
  unique: number;
  uniqueUpper: number;
}

export interface Race {
  마장: 마장;
  마장상태: 마장상태;
  거리: 거리;
}

export interface 적성 {
  마장적성: Record<마장, 적성랭크>;
  거리적성: Record<거리타입, 적성랭크>;
  각질적성: Record<작전, 적성랭크>;
}

export interface RacingStat {
  stat: BaseStat;
  healSkils: HealSkils;
  race: Race;
  적성: 적성;
  컨디션: 컨디션;
  작전: 작전;
}
