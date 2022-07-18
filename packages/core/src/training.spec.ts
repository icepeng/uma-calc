import { Stat } from "./stat";
import { StatBonus } from "./stat-bonus";
import { SupportCard } from "./support-card";
import { getTrainingStat } from "./training";

describe("getTrainingStat", () => {
  it("should calculate stat", () => {
    // given
    const supportCards: SupportCard[] = [
      {
        name: "키타산 블랙",
        type: "speed",
        trainingBonus: 0.15,
        friendshipBonus: 1.25,
        conditionBonus: 0.3,
        statBonus: Stat({
          power: 1,
        }),
        speciality: 100,
      },
      {
        name: "나리타 타이신",
        type: "speed",
        trainingBonus: 0.1,
        friendshipBonus: 1.2,
        conditionBonus: 0.45,
        statBonus: Stat({
          speed: 1,
        }),
        speciality: 0,
      },
      {
        name: "에이신 플래시",
        type: "speed",
        trainingBonus: 0.05,
        friendshipBonus: 1.2,
        conditionBonus: 0.65,
        statBonus: Stat({
          speed: 1,
        }),
        speciality: 0,
      },
      {
        name: "사일런스 스즈카",
        type: "speed",
        trainingBonus: 0,
        friendshipBonus: 1.27,
        conditionBonus: 0.48,
        statBonus: Stat({
          skillPoint: 1,
        }),
        speciality: 0,
      },
    ];

    const bonus: StatBonus = {
      speed: 1,
      power: 1.1,
      stamina: 1,
      grit: 1,
      intellect: 1,
    };
    // when
    const stat = getTrainingStat(
      supportCards,
      bonus,
      ["키타산 블랙", "에이신 플래시", "사일런스 스즈카", "나리타 타이신"],
      "speed",
      5,
      0.2
    );

    // then
    expect(stat.speed).toBe(89);
    expect(stat.power).toBe(49);
    expect(stat.skillPoint).toBe(16);
  });
});
