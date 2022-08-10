import {
  거리타입by거리,
  랭크보정,
  마장보정,
  작전보정,
  컨디션보정,
} from './data';
import { RacingStat, BaseStat } from './stat';

const Phase = {
  START: 'START',
  PHASE_0_ACC: 'PHASE_0_ACC',
  PHASE_0_NORMAL: 'PHASE_0_NORMAL',
  PHASE_1_ACC: 'PHASE_1_ACC',
  PHASE_1_NORMAL: 'PHASE_1_NORMAL',
  PHASE_2_ACC: 'PHASE_2_ACC',
  PHASE_2_NORMAL: 'PHASE_2_NORMAL',
  SPURT_ACC: 'SPURT_ACC',
  SPURT_NORMAL: 'SPURT_NORMAL',
  HP0: 'HP0',
} as const;
type Phase = typeof Phase[keyof typeof Phase];
interface PhaseModel {
  startVelocity: number;
  targetVelocity: number;
  acceleration: number;
  duration: number;
  distance: number;
  hpConsumption: number;
}
export type PhaseTable = { [key in Phase]: PhaseModel };
const IdealSpurt = {
  ACC: 'ACC',
  NORMAL: 'NORMAL',
} as const;
type IdealSpurt = typeof IdealSpurt[keyof typeof IdealSpurt];
export type IdealSpurtTable = { [key in IdealSpurt]: PhaseModel };

interface CompenstatedRacingStat extends RacingStat {
  compensatedStat: BaseStat;
}

export interface CalculatingRacingStat extends CompenstatedRacingStat {
  normalVelocity: number;
  startHp: number;
  healSkillHp: number;
  hp: number;
  hpConsumptionCoefficient: number;
  spurtHpConsumptionCoefficient: number;
}

export interface PhaseCalculatedRacingStat extends CalculatingRacingStat {
  phaseTable: PhaseTable;
}

export interface IdealCalculatedRacingStat extends PhaseCalculatedRacingStat {
  idealSpurtTable: IdealSpurtTable;
}

export interface CalculatedRacingStat extends IdealCalculatedRacingStat {
  idealSpurtHp: number;
  idealSpurtStamina: number;
}

export const getCompensatedStat = (
  racingStat: RacingStat
): CompenstatedRacingStat => {
  const { stat, 컨디션, 작전, 적성, race } = racingStat;

  const speed =
    stat.speed * 컨디션보정[컨디션] + 마장보정.speed[race.마장][race.마장상태];
  const stamina = stat.stamina * 컨디션보정[컨디션];
  const power =
    stat.power * 컨디션보정[컨디션] + 마장보정.power[race.마장][race.마장상태];
  const guts = stat.guts * 컨디션보정[컨디션];
  const intelligence =
    stat.intelligence * 컨디션보정[컨디션] * 랭크보정.각질[적성.각질적성[작전]];

  return {
    ...racingStat,
    compensatedStat: {
      speed,
      stamina,
      power,
      guts,
      intelligence,
    },
  };
};

export const getNormalVelocity = ({ race: { 거리 } }: RacingStat) => {
  return 20 - (거리 - 2000) / 1000;
};

export const getStartHp = ({
  race: { 거리 },
  compensatedStat: { stamina },
  작전,
}: CompenstatedRacingStat) => {
  return 거리 + 0.8 * stamina * 작전보정.HP[작전];
};

export const getHealSkillHp = ({
  healSkills: { gold, normal, unique, uniqueUpper },
}: RacingStat) => {
  return (
    gold * 550 +
    normal * 150 +
    (unique > 0 ? Math.pow(1.02, unique - 1) * 350 : 0) +
    (uniqueUpper > 0 ? Math.pow(1.02, uniqueUpper - 1) * 550 : 0)
  );
};

export const getHpConsumptionCoefficient = ({
  race: { 마장, 마장상태 },
}: RacingStat) => {
  return 마장보정.consumption[마장][마장상태];
};

export const getSpurtHpConsumptionCoefficient = ({
  compensatedStat: { guts },
}: CompenstatedRacingStat) => {
  return 1 + 200 / Math.sqrt(600 * guts);
};

export const getCalcalatingRacingStat = (
  racingStat: RacingStat
): CalculatingRacingStat => {
  const compensatedStat = getCompensatedStat(racingStat);
  const normalVelocity = getNormalVelocity(compensatedStat);
  const startHp = getStartHp(compensatedStat);
  const healSkillHp = getHealSkillHp(compensatedStat);
  const hpConsumptionCoefficient = getHpConsumptionCoefficient(compensatedStat);
  const spurtHpConsumptionCoefficient =
    getSpurtHpConsumptionCoefficient(compensatedStat);

  return {
    ...compensatedStat,
    normalVelocity,
    startHp,
    healSkillHp,
    hp: startHp * (1 + healSkillHp / 10000),
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
  };
};

const START_VELOCITY = 3;
export const getStartTargetVelocity = ({
  normalVelocity,
}: CalculatingRacingStat) => {
  return normalVelocity * 0.85;
};

const START_ACCELERATION = 24;
export const getStartAcceleration = (
  calculatingRacingStat: CalculatingRacingStat
) => {
  return START_ACCELERATION + getPhase0AccAccerlation(calculatingRacingStat);
};

export const getStartPhaseModel = (
  calculatingRacingStat: CalculatingRacingStat
): PhaseModel => {
  const { hpConsumptionCoefficient } = calculatingRacingStat;
  const startVelocity = START_VELOCITY;
  const targetVelocity = getStartTargetVelocity(calculatingRacingStat);
  const acceleration = getStartAcceleration(calculatingRacingStat);
  const duration = (targetVelocity - startVelocity) / acceleration;
  const distance = ((startVelocity + targetVelocity) / 2) * duration;
  const hpConsumption = 20 * hpConsumptionCoefficient * duration;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getStartPhaseResult = (
  calculatingRacingStat: CalculatingRacingStat
): CalculatingRacingStat & { phaseTable: Pick<PhaseTable, 'START'> } => {
  return {
    ...calculatingRacingStat,
    phaseTable: {
      START: getStartPhaseModel(calculatingRacingStat),
    },
  };
};

export const getPhase0AccStartVelocity = getStartTargetVelocity;
const createPhaseTargetVelocity = (compensateSpeedIndex: number) => {
  return ({
    normalVelocity,
    작전,
    compensatedStat: { intelligence },
  }: CalculatingRacingStat) => {
    return (
      normalVelocity * 작전보정.속도[작전][compensateSpeedIndex] +
      ((intelligence / 5500) * Math.log10(intelligence * 0.1) - 0.65 / 2) *
        0.01 *
        normalVelocity
    );
  };
};
export const getPhase0AccTargetVelocity = createPhaseTargetVelocity(0);
const createNormalPhaseAccerlation = (compensateSpeedIndex: number) => {
  return ({
    compensatedStat: { power },
    작전,
    race: { 거리, 마장 },
    적성,
  }: CalculatingRacingStat) => {
    return (
      0.0006 *
      Math.sqrt(500 * power) *
      작전보정.가속도[작전][compensateSpeedIndex] *
      랭크보정.거리.가속도[적성.거리적성[거리타입by거리[거리]]] *
      랭크보정.마장[적성.마장적성[마장]]
    );
  };
};
export const getPhase0AccAccerlation = createNormalPhaseAccerlation(0);

export const getPhase0AccModel = (
  calculatingRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<PhaseTable, 'START'>;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    race: { 거리 },
    phaseTable,
  } = calculatingRacingStat;
  const startVelocity = getPhase0AccStartVelocity(calculatingRacingStat);
  const targetVelocity = getPhase0AccTargetVelocity(calculatingRacingStat);
  const acceleration = getPhase0AccAccerlation(calculatingRacingStat);
  const duration = Math.min(
    (targetVelocity - startVelocity) / acceleration,
    (-1 * startVelocity +
      Math.sqrt(
        startVelocity ** 2 +
          2 * acceleration * (거리 / 6 - phaseTable.START.duration)
      )) /
      acceleration
  );
  const distance = (startVelocity + (acceleration * duration) / 2) * duration;
  const hpConsumption =
    (20 *
      hpConsumptionCoefficient *
      ((acceleration * duration + startVelocity - normalVelocity + 12) ** 3 -
        (startVelocity - normalVelocity + 12) ** 3)) /
    (3 * acceleration) /
    144;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getPhase0AccResult = (
  calculatingRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<PhaseTable, 'START'>;
  }
): CalculatingRacingStat & {
  phaseTable: Pick<PhaseTable, 'START' | 'PHASE_0_ACC'>;
} => {
  return {
    ...calculatingRacingStat,
    phaseTable: {
      ...calculatingRacingStat.phaseTable,
      PHASE_0_ACC: getPhase0AccModel(calculatingRacingStat),
    },
  };
};

export const getPhase0NormalVelocity = getPhase0AccTargetVelocity;
export const getPhase0NormalModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<PhaseTable, 'START' | 'PHASE_0_ACC'>;
  }
) => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    race: { 거리 },
    phaseTable: { START, PHASE_0_ACC },
  } = calculateRacingStat;
  const startVelocity = getPhase0NormalVelocity(calculateRacingStat);
  const targetVelocity = startVelocity;
  const acceleration = 0;

  const distance = Math.max(
    거리 / 6 - (START.distance + PHASE_0_ACC.distance),
    0
  );
  const duration = distance / startVelocity;
  const hpConsumption =
    ((20 *
      hpConsumptionCoefficient *
      (startVelocity - normalVelocity + 12) ** 2) /
      144) *
    duration;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getPhase0NormalResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<PhaseTable, 'START' | 'PHASE_0_ACC'>;
  }
): CalculatingRacingStat & {
  phaseTable: Pick<PhaseTable, 'START' | 'PHASE_0_ACC' | 'PHASE_0_NORMAL'>;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      PHASE_0_NORMAL: getPhase0NormalModel(calculateRacingStat),
    },
  };
};

const getPhase1AccStartVelocity = getPhase0AccTargetVelocity;
const getPhase1AccTargetVelocity = createPhaseTargetVelocity(1);
const createPhaseAccerlation = (compensateSpeedIndex: number) => {
  const getNormalPhaseAccerlation =
    createNormalPhaseAccerlation(compensateSpeedIndex);
  return (
    calculateRacingStat: CalculatingRacingStat,
    startVelocity: number,
    targetVelocity: number
  ) => {
    return startVelocity <= targetVelocity
      ? getNormalPhaseAccerlation(calculateRacingStat)
      : -0.8;
  };
};
const getPhase1AccAccerlation = createPhaseAccerlation(1);
export const getPhase1AccModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<PhaseTable, 'START' | 'PHASE_0_ACC' | 'PHASE_0_NORMAL'>;
  }
): PhaseModel => {
  const { normalVelocity, hpConsumptionCoefficient } = calculateRacingStat;
  const startVelocity = getPhase1AccStartVelocity(calculateRacingStat);
  const targetVelocity = getPhase1AccTargetVelocity(calculateRacingStat);
  const acceleration = getPhase1AccAccerlation(
    calculateRacingStat,
    startVelocity,
    targetVelocity
  );
  const duration = (targetVelocity - startVelocity) / acceleration;
  const distance = ((startVelocity + targetVelocity) / 2) * duration;
  const hpConsumption =
    (20 *
      hpConsumptionCoefficient *
      ((targetVelocity - normalVelocity + 12) ** 3 -
        (startVelocity - normalVelocity + 12) ** 3)) /
    (3 * acceleration) /
    144;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getPhase1AccResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<PhaseTable, 'START' | 'PHASE_0_ACC' | 'PHASE_0_NORMAL'>;
  }
): CalculatingRacingStat & {
  phaseTable: Pick<
    PhaseTable,
    'START' | 'PHASE_0_ACC' | 'PHASE_0_NORMAL' | 'PHASE_1_ACC'
  >;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      PHASE_1_ACC: getPhase1AccModel(calculateRacingStat),
    },
  };
};

const getPhase1NormalVelocity = getPhase1AccTargetVelocity;
export const getPhase1NormalModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<
      PhaseTable,
      'START' | 'PHASE_0_ACC' | 'PHASE_0_NORMAL' | 'PHASE_1_ACC'
    >;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    phaseTable,
    race: { 거리 },
  } = calculateRacingStat;
  const startVelocity = getPhase1NormalVelocity(calculateRacingStat);
  const targetVelocity = startVelocity;
  const acceleration = 0;

  const distance = 거리 / 2 - phaseTable.PHASE_1_ACC.distance;
  const duration = distance / startVelocity;
  const hpConsumption =
    ((20 *
      hpConsumptionCoefficient *
      (startVelocity - normalVelocity + 12) ** 2) /
      144) *
    duration;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getPhase1NormalResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<
      PhaseTable,
      'START' | 'PHASE_0_ACC' | 'PHASE_0_NORMAL' | 'PHASE_1_ACC'
    >;
  }
): CalculatingRacingStat & {
  phaseTable: Pick<
    PhaseTable,
    | 'START'
    | 'PHASE_0_ACC'
    | 'PHASE_0_NORMAL'
    | 'PHASE_1_ACC'
    | 'PHASE_1_NORMAL'
  >;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      PHASE_1_NORMAL: getPhase1NormalModel(calculateRacingStat),
    },
  };
};

export const getSpurtDistance = (
  calculatingRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<
      PhaseTable,
      | 'START'
      | 'PHASE_0_ACC'
      | 'PHASE_0_NORMAL'
      | 'PHASE_1_ACC'
      | 'PHASE_1_NORMAL'
    >;
  }
) => {
  const {
    hp,
    phaseTable,
    race: { 거리 },
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
    normalVelocity,
  } = calculatingRacingStat;
  const sumOfHpCumsumption = [
    'START',
    'PHASE_0_ACC',
    'PHASE_0_NORMAL',
    'PHASE_1_ACC',
    'PHASE_1_NORMAL',
  ].reduce((acc, curr) => {
    return acc + phaseTable[curr].hpConsumption;
  }, 0);

  const phase2TargetVelocity = getPhase2AccTargetVelocity(
    calculatingRacingStat
  );
  const spurtTargetVelocity = getSpurtTargetVelocity(calculatingRacingStat);

  return Math.min(
    (hp -
      sumOfHpCumsumption -
      ((거리 / 3 - 60) *
        20 *
        hpConsumptionCoefficient *
        spurtHpConsumptionCoefficient *
        (phase2TargetVelocity - normalVelocity + 12) ** 2) /
        144 /
        phase2TargetVelocity) /
      (20 *
        hpConsumptionCoefficient *
        spurtHpConsumptionCoefficient *
        ((spurtTargetVelocity - normalVelocity + 12) ** 2 /
          144 /
          spurtTargetVelocity -
          (phase2TargetVelocity - normalVelocity + 12) ** 2 /
            144 /
            phase2TargetVelocity)) +
      60,
    거리 / 3
  );
};

export const getSpurtTargetVelocity = (
  calculatingRacingStat: CalculatingRacingStat
) => {
  const {
    normalVelocity,
    작전,
    compensatedStat: { speed },
    적성,
    race: { 거리 },
  } = calculatingRacingStat;

  return (
    (normalVelocity * (작전보정.속도[작전][2] + 0.01) +
      Math.sqrt(500 * speed) *
        랭크보정.거리.속도[적성.거리적성[거리타입by거리[거리]]] *
        0.002) *
      1.05 +
    Math.sqrt(500 * speed) *
      랭크보정.거리.속도[적성.거리적성[거리타입by거리[거리]]] *
      0.002
  );
};

const getPhase2AccStartVelocity = getPhase1AccTargetVelocity;
const getPhase2AccTargetVelocity = (
  calculatingRacingStat: CalculatingRacingStat
) => {
  const {
    normalVelocity,
    작전,
    compensatedStat: { speed, intelligence },
    race: { 거리 },
    적성,
  } = calculatingRacingStat;

  return (
    normalVelocity * 작전보정.속도[작전][2] +
    Math.sqrt(500 * speed) *
      랭크보정.거리.속도[적성.거리적성[거리타입by거리[거리]]] *
      0.002 +
    ((intelligence / 5500) * Math.log10(intelligence * 0.1) - 0.65 / 2) *
      0.01 *
      normalVelocity
  );
};
const getPhase2AccAccerlation = createPhaseAccerlation(2);
export const getPhase2AccModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<
      PhaseTable,
      | 'START'
      | 'PHASE_0_ACC'
      | 'PHASE_0_NORMAL'
      | 'PHASE_1_ACC'
      | 'PHASE_1_NORMAL'
    >;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
    race: { 거리 },
  } = calculateRacingStat;
  const startVelocity = getPhase2AccStartVelocity(calculateRacingStat);
  const targetVelocity = getPhase2AccTargetVelocity(calculateRacingStat);
  const acceleration = getPhase2AccAccerlation(
    calculateRacingStat,
    startVelocity,
    targetVelocity
  );

  const spurtDistance = getSpurtDistance(calculateRacingStat);

  const duration =
    거리 / 3 <= spurtDistance
      ? 0
      : (targetVelocity - startVelocity) / acceleration;
  const distance = ((startVelocity + targetVelocity) / 2) * duration;
  const hpConsumption =
    (20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      ((startVelocity + acceleration * duration - normalVelocity + 12) ** 3 -
        (startVelocity - normalVelocity + 12) ** 3)) /
    (3 * acceleration) /
    144;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getPhase2AccResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Pick<
      PhaseTable,
      | 'START'
      | 'PHASE_0_ACC'
      | 'PHASE_0_NORMAL'
      | 'PHASE_1_ACC'
      | 'PHASE_1_NORMAL'
    >;
  }
): CalculatingRacingStat & {
  phaseTable: Omit<
    PhaseTable,
    'PHASE_2_NORMAL' | 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'
  >;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      PHASE_2_ACC: getPhase2AccModel(calculateRacingStat),
    },
  };
};

export const getPhase2NormalModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<
      PhaseTable,
      'PHASE_2_NORMAL' | 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'
    >;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
    phaseTable,
    race: { 거리 },
  } = calculateRacingStat;

  const startVelocity = phaseTable.PHASE_2_ACC.targetVelocity;
  const targetVelocity = startVelocity;
  const acceleration = 0;

  const spurtDistance = getSpurtDistance(calculateRacingStat);

  const distance = Math.max(
    거리 / 3 - spurtDistance - phaseTable.PHASE_2_ACC.distance,
    0
  );
  const duration = distance / targetVelocity;
  const hpConsumption =
    ((20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      (targetVelocity - normalVelocity + 12) ** 2) /
      144) *
    duration;
  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getPhase2NormalResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<
      PhaseTable,
      'PHASE_2_NORMAL' | 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'
    >;
  }
): CalculatingRacingStat & {
  phaseTable: Omit<PhaseTable, 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'>;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      PHASE_2_NORMAL: getPhase2NormalModel(calculateRacingStat),
    },
  };
};

const getSpurtAccStartVelocity = (
  calculatingRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'>;
  }
) => {
  const { phaseTable } = calculatingRacingStat;

  return phaseTable.PHASE_2_ACC.distance === 0
    ? phaseTable.PHASE_1_NORMAL.startVelocity
    : phaseTable.PHASE_2_NORMAL.startVelocity;
};
const getSpurtAccTagetVelocity = (
  calculatingRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'>;
  }
) => {
  const {
    normalVelocity,
    작전,
    compensatedStat: { speed },
    적성,
    race: { 거리 },
  } = calculatingRacingStat;

  return (
    (normalVelocity * (작전보정.속도[작전][2] + 0.01) +
      Math.sqrt(500 * speed) *
        랭크보정.거리.속도[적성.거리적성[거리타입by거리[거리]]] *
        0.002) *
      1.05 +
    Math.sqrt(500 * speed) *
      랭크보정.거리.속도[적성.거리적성[거리타입by거리[거리]]] *
      0.002
  );
};
const getSpurtAccAccerlation = (
  calculatingRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'>;
  }
) => {
  const {
    작전,
    compensatedStat: { power },
    적성,
    race: { 거리, 마장 },
  } = calculatingRacingStat;

  return (
    0.0006 *
    Math.sqrt(500 * power) *
    작전보정.가속도[작전][2] *
    랭크보정.거리.가속도[적성.거리적성[거리타입by거리[거리]]] *
    랭크보정.마장[적성.마장적성[마장]]
  );
};
export const getSpurtAccModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'>;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
  } = calculateRacingStat;

  const startVelocity = getSpurtAccStartVelocity(calculateRacingStat);
  const targetVelocity = getSpurtAccTagetVelocity(calculateRacingStat);
  const acceleration = getSpurtAccAccerlation(calculateRacingStat);
  const duration = (targetVelocity - startVelocity) / acceleration;
  const distance = ((targetVelocity + startVelocity) / 2) * duration;
  const hpConsumption =
    (20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      ((startVelocity + acceleration * duration - normalVelocity + 12) ** 3 -
        (startVelocity - normalVelocity + 12) ** 3)) /
    (3 * acceleration) /
    144;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getSpurtAccResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_ACC' | 'SPURT_NORMAL' | 'HP0'>;
  }
): CalculatingRacingStat & {
  phaseTable: Omit<PhaseTable, 'SPURT_NORMAL' | 'HP0'>;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      SPURT_ACC: getSpurtAccModel(calculateRacingStat),
    },
  };
};

export const getSpurtNormalModel = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_NORMAL' | 'HP0'>;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hp,
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
    race: { 거리 },
    phaseTable,
  } = calculateRacingStat;

  const startVelocity = phaseTable.SPURT_ACC.targetVelocity;
  const targetVelocity = startVelocity;
  const acceleration = 0;

  const sumOfHpConsumption = [
    'START',
    'PHASE_0_ACC',
    'PHASE_0_NORMAL',
    'PHASE_1_ACC',
    'PHASE_1_NORMAL',
    'PHASE_2_ACC',
    'PHASE_2_NORMAL',
    'SPURT_ACC',
  ].reduce((acc, phase) => {
    return acc + phaseTable[phase].hpConsumption;
  }, 0);

  const sumOfEndPhaseDistance = [
    'PHASE_2_ACC',
    'PHASE_2_NORMAL',
    'SPURT_ACC',
  ].reduce((acc, phase) => {
    return acc + phaseTable[phase].distance;
  }, 0);

  const hpConsumption = Math.min(
    (((20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      (targetVelocity - normalVelocity + 12) ** 2) /
      144) *
      (거리 / 3 - sumOfEndPhaseDistance)) /
      targetVelocity,
    hp - sumOfHpConsumption
  );

  const duration =
    hpConsumption /
    ((20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      (targetVelocity - normalVelocity + 12) ** 2) /
      144);

  const distance = duration * targetVelocity;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getSpurtNormalResult = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'SPURT_NORMAL' | 'HP0'>;
  }
): CalculatingRacingStat & {
  phaseTable: Omit<PhaseTable, 'HP0'>;
} => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      SPURT_NORMAL: getSpurtNormalModel(calculateRacingStat),
    },
  };
};

const HP0_ACCELLERATION = -1.2;
export const getHp0Model = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'HP0'>;
  }
): PhaseModel => {
  const {
    race: { 거리 },
    phaseTable,
  } = calculateRacingStat;

  const startVelocity = phaseTable.SPURT_NORMAL.targetVelocity;
  const targetVelocity = 0;
  const acceleration = HP0_ACCELLERATION;

  const sumOfEndPhaseDistance = [
    'PHASE_2_ACC',
    'PHASE_2_NORMAL',
    'SPURT_ACC',
    'SPURT_NORMAL',
  ].reduce((acc, phase) => {
    return acc + phaseTable[phase].distance;
  }, 0);

  const distance = 거리 / 3 - sumOfEndPhaseDistance;
  const duration = Math.abs(
    (-1 * startVelocity +
      Math.sqrt(startVelocity ** 2 + 2 * acceleration * distance)) /
      acceleration
  );
  const hpConsumption = 0;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};

export const getHp0Result = (
  calculateRacingStat: CalculatingRacingStat & {
    phaseTable: Omit<PhaseTable, 'HP0'>;
  }
): PhaseCalculatedRacingStat => {
  return {
    ...calculateRacingStat,
    phaseTable: {
      ...calculateRacingStat.phaseTable,
      HP0: getHp0Model(calculateRacingStat),
    },
  };
};

export const getPhaseCalculatedRacingStat = (
  racingStat: RacingStat
): PhaseCalculatedRacingStat => {
  return getHp0Result(
    getSpurtNormalResult(
      getSpurtAccResult(
        getPhase2NormalResult(
          getPhase2AccResult(
            getPhase1NormalResult(
              getPhase1AccResult(
                getPhase0NormalResult(
                  getPhase0AccResult(
                    getStartPhaseResult(getCalcalatingRacingStat(racingStat))
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

export const getIdealSpurtAccModel = (
  phaseCalculatedRacingStat: PhaseCalculatedRacingStat
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
    phaseTable,
  } = phaseCalculatedRacingStat;

  const startVelocity = phaseTable.PHASE_1_NORMAL.targetVelocity;
  const targetVelocity = phaseTable.SPURT_NORMAL.targetVelocity;
  const acceleration = phaseTable.SPURT_ACC.acceleration;
  const duration = (targetVelocity - startVelocity) / acceleration;
  const distance = ((startVelocity + targetVelocity) / 2) * duration;
  const hpConsumption =
    (20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      ((startVelocity + acceleration * duration - normalVelocity + 12) ** 3 -
        (startVelocity - normalVelocity + 12) ** 3)) /
    (3 * acceleration) /
    144;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
export const getIdealSpurtAccResult = (
  phaseCalculatedRacingStat: PhaseCalculatedRacingStat
): PhaseCalculatedRacingStat & {
  idealSpurtTable: Pick<IdealSpurtTable, 'ACC'>;
} => {
  return {
    ...phaseCalculatedRacingStat,
    idealSpurtTable: {
      ACC: getIdealSpurtAccModel(phaseCalculatedRacingStat),
    },
  };
};

export const getIdealSpurtNormalModel = (
  phaseCalculatedRacingStat: PhaseCalculatedRacingStat & {
    idealSpurtTable: Pick<IdealSpurtTable, 'ACC'>;
  }
): PhaseModel => {
  const {
    normalVelocity,
    hpConsumptionCoefficient,
    spurtHpConsumptionCoefficient,
    race: { 거리 },
    idealSpurtTable,
  } = phaseCalculatedRacingStat;

  const startVelocity = idealSpurtTable.ACC.targetVelocity;
  const targetVelocity = startVelocity;
  const acceleration = 0;

  const distance = 거리 / 3 - idealSpurtTable.ACC.distance;
  const duration = distance / targetVelocity;
  const hpConsumption =
    ((20 *
      hpConsumptionCoefficient *
      spurtHpConsumptionCoefficient *
      (targetVelocity - normalVelocity + 12) ** 2) /
      144) *
    duration;

  return {
    startVelocity,
    targetVelocity,
    acceleration,
    duration,
    distance,
    hpConsumption,
  };
};
const getIdealSpurtNormalResult = (
  phaseCalculatedRacingStat: PhaseCalculatedRacingStat & {
    idealSpurtTable: Pick<IdealSpurtTable, 'ACC'>;
  }
): IdealCalculatedRacingStat => {
  return {
    ...phaseCalculatedRacingStat,
    idealSpurtTable: {
      ...phaseCalculatedRacingStat.idealSpurtTable,
      NORMAL: getIdealSpurtNormalModel(phaseCalculatedRacingStat),
    },
  };
};

const getIdealCalculatedRacingStat = (
  racingStat: RacingStat
): IdealCalculatedRacingStat => {
  return getIdealSpurtNormalResult(
    getIdealSpurtAccResult(getPhaseCalculatedRacingStat(racingStat))
  );
};

export const getCalculatedRacingStat = (
  racingStat: RacingStat
): CalculatedRacingStat => {
  const idealCalculratedRacingStat = getIdealCalculatedRacingStat(racingStat);
  const {
    compensatedStat: { stamina },
    hp,
    작전,
    healSkillHp,
    phaseTable,
    idealSpurtTable,
  } = idealCalculratedRacingStat;
  const sumOfStartPhaseHpConsumption = [
    'START',
    'PHASE_0_ACC',
    'PHASE_0_NORMAL',
    'PHASE_1_ACC',
    'PHASE_1_NORMAL',
  ].reduce((acc, phase) => {
    return acc + phaseTable[phase].hpConsumption;
  }, 0);

  const sumofIdealSpurtHpConsumption = ['ACC', 'NORMAL'].reduce(
    (acc, phase) => {
      return acc + idealSpurtTable[phase].hpConsumption;
    },
    0
  );

  const idealSpurtHp =
    sumofIdealSpurtHpConsumption + sumOfStartPhaseHpConsumption;
  const idealSpurtStamina =
    stamina +
    (idealSpurtHp - hp) / 0.8 / 작전보정.HP[작전] / (1 + healSkillHp / 10000);

  return {
    ...idealCalculratedRacingStat,
    idealSpurtHp,
    idealSpurtStamina,
  };
};
const calculateRacing = getCalculatedRacingStat;
export default calculateRacing;
