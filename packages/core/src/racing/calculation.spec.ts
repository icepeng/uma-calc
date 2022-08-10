import {
  CalculatingRacingStat,
  getCalcalatingRacingStat,
  getCalculatedRacingStat,
  getCompensatedStat,
  getHealSkillHp,
  getHp0Model,
  getHpConsumptionCoefficient,
  getIdealSpurtAccModel,
  getIdealSpurtAccResult,
  getIdealSpurtNormalModel,
  getNormalVelocity,
  getPhase0AccModel,
  getPhase0AccResult,
  getPhase0AccTargetVelocity,
  getPhase0NormalModel,
  getPhase0NormalResult,
  getPhase1AccModel,
  getPhase1AccResult,
  getPhase1NormalModel,
  getPhase1NormalResult,
  getPhase2AccModel,
  getPhase2AccResult,
  getPhase2NormalModel,
  getPhase2NormalResult,
  getPhaseCalculatedRacingStat,
  getSpurtAccModel,
  getSpurtAccResult,
  getSpurtDistance,
  getSpurtHpConsumptionCoefficient,
  getSpurtNormalModel,
  getSpurtNormalResult,
  getSpurtTargetVelocity,
  getStartAcceleration,
  getStartHp,
  getStartPhaseModel,
  getStartPhaseResult,
  getStartTargetVelocity,
} from './calculation';

const round = (toRound: number) => Math.round(toRound * 100) / 100;
const round3 = (toRound: number) => Math.round(toRound * 1000) / 1000;

describe('racing.caculation', () => {
  let racingStat: CalculatingRacingStat;

  beforeEach(() => {
    racingStat = getCalcalatingRacingStat({
      stat: {
        speed: 1200,
        stamina: 900,
        power: 750,
        guts: 400,
        intelligence: 500,
      },
      적성: {
        마장적성: {
          잔디: 'A',
          더트: 'A',
        },
        거리적성: {
          단거리: 'A',
          마일: 'A',
          중거리: 'A',
          장거리: 'A',
        },
        각질적성: {
          도주: 'A',
          선행: 'A',
          선입: 'A',
          추입: 'A',
        },
      },
      컨디션: '최상',
      작전: '선행',
      healSkills: {
        gold: 1,
        normal: 1,
        unique: 4,
        uniqueUpper: 0,
      },
      race: {
        마장: '잔디',
        마장상태: '양호',
        거리: 2400,
      },
    });
  });

  describe('getCompensatedStat', () => {
    it('should calculate compensated stat', () => {
      const { compensatedStat } = getCompensatedStat(racingStat);
      expect(compensatedStat.speed).toBe(1248);
      expect(compensatedStat.stamina).toBe(936);
      expect(compensatedStat.power).toBe(780);
      expect(compensatedStat.guts).toBe(416);
      expect(compensatedStat.intelligence).toBe(520);
    });
  });

  describe('getNormalVelocity', () => {
    it('should calculate normal velocity', () => {
      expect(getNormalVelocity(racingStat)).toBe(19.6);
    });
  });

  describe('getStartHp', () => {
    it('should calculate start hp', () => {
      expect(round(getStartHp(racingStat))).toBe(3066.43);
    });
  });

  describe('getHealSkillHp', () => {
    it('should calculate heal skill hp', () => {
      expect(round(getHealSkillHp(racingStat))).toBe(1071.42);
    });
  });

  describe('getHpConsumptionCoefficient', () => {
    it('should calculate hp Compsumption coefficient', () => {
      expect(getHpConsumptionCoefficient(racingStat)).toBe(1);
    });

    it('should calculate hp Compsumption coefficient with 불량', () => {
      racingStat.race.마장상태 = '불량';
      expect(getHpConsumptionCoefficient(racingStat)).toBe(1.02);
    });
  });

  describe('getSpurtHpConsumptionCoefficient', () => {
    it('should caculate spurt hp comsumption coefficient', () => {
      expect(round(getSpurtHpConsumptionCoefficient(racingStat))).toBe(1.4);
    });
  });

  describe('getStartTargetVelocity', () => {
    it('should calculate start target velocity', () => {
      expect(round3(getStartTargetVelocity(racingStat))).toBe(16.66);
    });
  });

  describe('getStartAcceleration', () => {
    it('should calculate start acceleration', () => {
      expect(round3(getStartAcceleration(racingStat))).toBe(24.369);
    });

    it('should calculate start acceleration with 마장 적성 D', () => {
      racingStat.적성.마장적성.잔디 = 'D';
      expect(round3(getStartAcceleration(racingStat))).toBe(24.258);
    });

    it('should calculate start acceleration with 거리적성 E', () => {
      racingStat.적성.거리적성.중거리 = 'E';
      expect(round3(getStartAcceleration(racingStat))).toBe(24.221);
    });
  });

  describe('getStartPhaseModel', () => {
    it('should calculate start phase model', () => {
      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getStartPhaseModel(racingStat);
      expect(round3(startVelocity)).toBe(3);
      expect(round3(targetVelocity)).toBe(16.66);
      expect(round3(acceleration)).toBe(24.369);
      expect(round3(duration)).toBe(0.561);
      expect(round(distance)).toBe(5.51);
      expect(round(hpConsumption)).toBe(11.21);
    });
  });

  describe('getPhase0TargetVelocity', () => {
    it('should calculate phase 0 target velocity', () => {
      expect(round3(getPhase0AccTargetVelocity(racingStat))).toBe(19.137);
    });
  });

  describe('getPhase0AccModel', () => {
    beforeEach(() => {
      racingStat = getStartPhaseResult(racingStat);
    });

    it('should calculate phase 0 acc model', () => {
      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getPhase0AccModel(racingStat);
      expect(round3(startVelocity)).toBe(16.66);
      expect(round3(targetVelocity)).toBe(19.137);
      expect(round3(acceleration)).toBe(0.369);
      expect(round3(duration)).toBe(6.711);
      expect(round(distance)).toBe(120.12);
      expect(round(hpConsumption)).toBe(99.33);
    });
  });

  describe('getPhase0NormalModel', () => {
    beforeEach(() => {
      racingStat = getPhase0AccResult(getStartPhaseResult(racingStat));
    });

    it('should calculate phase 0 normal model', () => {
      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getPhase0NormalModel(racingStat);
      expect(round3(startVelocity)).toBe(19.137);
      expect(round3(targetVelocity)).toBe(19.137);
      expect(round3(acceleration)).toBe(0);
      expect(round3(duration)).toBe(14.337);
      expect(round(distance)).toBe(274.37);
      expect(round(hpConsumption)).toBe(265.04);
    });
  });

  describe('getPhase1AccModel', () => {
    beforeEach(() => {
      racingStat = getPhase0NormalResult(
        getPhase0AccResult(getStartPhaseResult(racingStat))
      );
    });

    it('should calculate phase 1 acc model', () => {
      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getPhase1AccModel(racingStat);
      expect(round3(startVelocity)).toBe(19.137);
      expect(round3(targetVelocity)).toBe(19.392);
      expect(round3(acceleration)).toBe(0.375);
      expect(round3(duration)).toBe(0.68);
      expect(round(distance)).toBe(13.1);
      expect(round(hpConsumption)).toBe(12.85);
    });
  });

  describe('getPhase1NormalModel', () => {
    beforeEach(() => {
      racingStat = getPhase1AccResult(
        getPhase0NormalResult(
          getPhase0AccResult(getStartPhaseResult(racingStat))
        )
      );
    });

    it('should calculate phase 1 normal model', () => {
      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getPhase1NormalModel(racingStat);
      expect(round3(startVelocity)).toBe(19.392);
      expect(round3(targetVelocity)).toBe(19.392);
      expect(round3(acceleration)).toBe(0);
      expect(round3(duration)).toBe(61.207);
      expect(round(distance)).toBe(1186.9);
      expect(round(hpConsumption)).toBe(1182.0);
    });
  });

  describe('getSpurtTagetVelocity', () => {
    it('should calculate spurt target velocity', () => {
      expect(round3(getSpurtTargetVelocity(racingStat))).toBe(23.51);
    });
  });

  describe('getSpurtDistance', () => {
    it('should calculate spurt distance', () => {
      racingStat.stat.stamina = 500;
      racingStat = getPhase1NormalResult(
        getPhase1AccResult(
          getPhase0NormalResult(
            getPhase0AccResult(
              getStartPhaseResult(getCalcalatingRacingStat(racingStat))
            )
          )
        )
      );

      expect(round(getSpurtDistance(racingStat))).toBe(691.61);
    });

    it('should calculate spurt distance from full stamina', () => {
      racingStat = getPhase1NormalResult(
        getPhase1AccResult(
          getPhase0NormalResult(
            getPhase0AccResult(
              getStartPhaseResult(getCalcalatingRacingStat(racingStat))
            )
          )
        )
      );

      expect(round(getSpurtDistance(racingStat))).toBe(800);
    });
  });

  describe('getPhase2AccModel', () => {
    it('should calculate phase 2 acc model', () => {
      racingStat = getPhase1NormalResult(
        getPhase1AccResult(
          getPhase0NormalResult(
            getPhase0AccResult(
              getStartPhaseResult(getCalcalatingRacingStat(racingStat))
            )
          )
        )
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getPhase2AccModel(racingStat);
      expect(round3(startVelocity)).toBe(19.392);
      expect(round3(targetVelocity)).toBe(20.658);
      expect(round3(acceleration)).toBe(0.373);
      expect(round3(duration)).toBe(0);
      expect(round(distance)).toBe(0);
      expect(round(hpConsumption)).toBe(0);
    });

    it('should calculate phase 2 normal model with run phase2 condition', () => {
      racingStat.stat.stamina = 500;
      racingStat = getPhase1NormalResult(
        getPhase1AccResult(
          getPhase0NormalResult(
            getPhase0AccResult(
              getStartPhaseResult(getCalcalatingRacingStat(racingStat))
            )
          )
        )
      );

      const { duration, distance, hpConsumption } =
        getPhase2AccModel(racingStat);
      expect(round3(duration)).toBe(3.393);
      expect(round(distance)).toBe(67.94);
      expect(round(hpConsumption)).toBe(101.96);
    });
  });

  describe('getPhase2NormalModel', () => {
    it('should calculate phase 2 normal model', () => {
      racingStat = getPhase2AccResult(
        getPhase1NormalResult(
          getPhase1AccResult(
            getPhase0NormalResult(
              getPhase0AccResult(
                getStartPhaseResult(getCalcalatingRacingStat(racingStat))
              )
            )
          )
        )
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getPhase2NormalModel(racingStat);
      expect(round3(startVelocity)).toBe(20.658);
      expect(round3(targetVelocity)).toBe(20.658);
      expect(round3(acceleration)).toBe(0);
      expect(round3(duration)).toBe(0);
      expect(round(distance)).toBe(0);
      expect(round(hpConsumption)).toBe(0);
    });

    it('should calculate phase 2 normal model with run phase2 condition', () => {
      racingStat.stat.stamina = 500;
      racingStat = getPhase2AccResult(
        getPhase1NormalResult(
          getPhase1AccResult(
            getPhase0NormalResult(
              getPhase0AccResult(
                getStartPhaseResult(getCalcalatingRacingStat(racingStat))
              )
            )
          )
        )
      );

      const { duration, distance, hpConsumption } =
        getPhase2NormalModel(racingStat);

      expect(round3(duration)).toBe(1.958);
      expect(round(distance)).toBe(40.45);
      expect(round(hpConsumption)).toBe(64.93);
    });
  });

  describe('getSpurtAccModel', () => {
    it('should calculate spurt acc model', () => {
      racingStat = getPhase2AccResult(
        getPhase1NormalResult(
          getPhase1AccResult(
            getPhase0NormalResult(
              getPhase0AccResult(
                getStartPhaseResult(getCalcalatingRacingStat(racingStat))
              )
            )
          )
        )
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getSpurtAccModel(racingStat);
      expect(round3(startVelocity)).toBe(19.392);
      expect(round3(targetVelocity)).toBe(23.51);
      expect(round3(acceleration)).toBe(0.373);
      expect(round3(duration)).toBe(11.035);
      expect(round(distance)).toBe(236.71);
      expect(round(hpConsumption)).toBe(414.78);
    });
  });

  describe('getSpurtNormalModel', () => {
    it('should calculate spurt normal model', () => {
      racingStat = getSpurtAccResult(
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
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getSpurtNormalModel(racingStat);
      expect(round3(startVelocity)).toBe(23.51);
      expect(round3(targetVelocity)).toBe(23.51);
      expect(round3(acceleration)).toBe(0);

      expect(round3(duration)).toBe(23.959);
      expect(round(distance)).toBe(563.29);
      expect(round(hpConsumption)).toBe(1179.54);
    });
  });

  describe('getHp0Model', () => {
    it('should calculate hp0 model', () => {
      racingStat = getSpurtNormalResult(
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
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getHp0Model(racingStat);
      expect(round3(startVelocity)).toBe(23.51);
      expect(round3(targetVelocity)).toBe(0);
      expect(round3(acceleration)).toBe(-1.2);
      expect(round3(duration)).toBe(0);
      expect(round(distance)).toBe(0);
      expect(round(hpConsumption)).toBe(0);
    });

    it('should calculate hp0 model with run hp0 condition', () => {
      racingStat.stat.stamina = 500;
      racingStat = getSpurtNormalResult(
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
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getHp0Model(racingStat);
      expect(round3(startVelocity)).toBe(23.51);
      expect(round3(targetVelocity)).toBe(0);
      expect(round3(acceleration)).toBe(-1.2);
      expect(round3(duration)).toBe(1.653);
      expect(round(distance)).toBe(37.22);
      expect(round(hpConsumption)).toBe(0);
    });
  });

  describe('getIdealSpurctAccModel', () => {
    it('should calculate ideal spurt acc model', () => {
      racingStat = getPhaseCalculatedRacingStat(racingStat);

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getIdealSpurtAccModel(racingStat);
      expect(round3(startVelocity)).toBe(19.392);
      expect(round3(targetVelocity)).toBe(23.51);
      expect(round3(acceleration)).toBe(0.373);
      expect(round3(duration)).toBe(11.035);
      expect(round(distance)).toBe(236.71);
      expect(round(hpConsumption)).toBe(414.78);
    });
  });

  describe('getIdealSpurtNormalModel', () => {
    it('should calculate ideal spurt normal model', () => {
      racingStat = getIdealSpurtAccResult(
        getPhaseCalculatedRacingStat(racingStat)
      );

      const {
        startVelocity,
        targetVelocity,
        acceleration,
        duration,
        distance,
        hpConsumption,
      } = getIdealSpurtNormalModel(racingStat);
      expect(round3(startVelocity)).toBe(23.51);
      expect(round3(targetVelocity)).toBe(23.51);
      expect(round3(acceleration)).toBe(0);

      expect(round3(duration)).toBe(23.959);
      expect(round(distance)).toBe(563.29);
      expect(round(hpConsumption)).toBe(1179.54);
    });
  });

  describe('getCalculatedRacingStat', () => {
    it('should calculate calculated racing stat', () => {
      const { idealSpurtHp, idealSpurtStamina } =
        getCalculatedRacingStat(racingStat);
      expect(round(idealSpurtHp)).toBe(3164.76);
      expect(round3(idealSpurtStamina)).toBe(643.95);
    });

    it('should calculate calculated racing stat with speed 1100', () => {
      racingStat.stat.speed = 1100;
      const { idealSpurtHp, idealSpurtStamina } =
        getCalculatedRacingStat(racingStat);
      expect(round(idealSpurtHp)).toBe(3151.14);
      expect(round3(idealSpurtStamina)).toBe(626.67);
    });

    it('should calculate calculated racing stat with power 1200', () => {
      racingStat.stat.power = 1200;
      const { idealSpurtHp, idealSpurtStamina } =
        getCalculatedRacingStat(racingStat);
      expect(round(idealSpurtHp)).toBe(3185.22);
      expect(round3(idealSpurtStamina)).toBe(669.905);
    });
  });
});
