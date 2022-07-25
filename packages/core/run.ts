import { getAllCases, Stat, SupportCard, TrainingType } from "./src/training";

const supportCards: SupportCard[] = [
  {
    name: "킹 헤일로",
    type: "speed",
    speciality: 45,
    trainingBonus: 0.05,
    friendshipBonus: 1.18,
    conditionBonus: 0.26,
    statBonus: {
      speed: 1,
      stamina: 0,
      power: 0,
      grit: 0,
      intellect: 0,
      skillPoint: 0,
    },
  },
  {
    name: "스페셜 위크",
    type: "speed",
    speciality: 30,
    trainingBonus: 0.05,
    friendshipBonus: 1.35,
    conditionBonus: 0.3,
    statBonus: {
      speed: 1,
      stamina: 0,
      power: 0,
      grit: 0,
      intellect: 0,
      skillPoint: 0,
    },
  },
  {
    name: "에이신 플래시",
    type: "speed",
    speciality: 35,
    trainingBonus: 0.05,
    friendshipBonus: 1.2,
    conditionBonus: 0.62,
    statBonus: {
      speed: 0,
      stamina: 0,
      power: 0,
      grit: 0,
      intellect: 0,
      skillPoint: 0,
    },
  },
  {
    name: "맨하탄 카페",
    type: "stamina",
    speciality: 70,
    trainingBonus: 0.05,
    friendshipBonus: 1.2,
    conditionBonus: 0.4,
    statBonus: {
      speed: 0,
      stamina: 1,
      power: 0,
      grit: 0,
      intellect: 0,
      skillPoint: 0,
    },
  },
  {
    name: "슈퍼 크릭",
    type: "stamina",
    speciality: 40,
    trainingBonus: 0.1,
    friendshipBonus: 1.32,
    conditionBonus: 0,
    statBonus: {
      speed: 0,
      stamina: 0,
      power: 0,
      grit: 0,
      intellect: 0,
      skillPoint: 0,
    },
  },
  {
    name: "하야카와 타즈나",
    type: "friend",
    speciality: 0,
    trainingBonus: 0.1,
    friendshipBonus: 1,
    conditionBonus: 0,
    statBonus: {
      speed: 0,
      stamina: 0,
      power: 0,
      grit: 0,
      intellect: 0,
      skillPoint: 0,
    },
  },
];

function run(target: TrainingType, level: number, condition: number) {
  const result = getAllCases(
    supportCards,
    { speed: 1, stamina: 1, power: 1, grit: 1, intellect: 1 },
    [],
    target,
    level,
    condition
  );

  const avg = result.reduce((sum, { p, stat }) => {
    return {
      speed: sum.speed + stat.speed * p,
      stamina: sum.stamina + stat.stamina * p,
      power: sum.power + stat.power * p,
      grit: sum.grit + stat.grit * p,
      intellect: sum.intellect + stat.intellect * p,
      skillPoint: sum.skillPoint + stat.skillPoint * p,
    };
  }, Stat({}));

  console.log(
    Object.entries(avg)
      .filter(([_, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([type, value]) => [type, value.toFixed(1)])[0]
  );
}

run("speed", 1, 0.1);
run("stamina", 3, 0.1);
run("power", 1, 0.1);
run("intellect", 2, 0.1);
