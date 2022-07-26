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
        trainingBonus: 15,
        friendshipBonus: 25,
        motivationBonus: 30,
        statBonus: Stat({
          power: 1,
        }),
        specialty: 0,
      },
      {
        name: "나리타 타이신",
        type: "speed",
        trainingBonus: 10,
        friendshipBonus: 20,
        motivationBonus: 45,
        statBonus: Stat({
          speed: 1,
        }),
        specialty: 0,
      },
      {
        name: "에이신 플래시",
        type: "speed",
        trainingBonus: 5,
        friendshipBonus: 20,
        motivationBonus: 65,
        statBonus: Stat({
          speed: 1,
        }),
        specialty: 0,
      },
      {
        name: "사일런스 스즈카",
        type: "speed",
        trainingBonus: 0,
        friendshipBonus: 27,
        motivationBonus: 48,
        statBonus: Stat({
          skillPoint: 1,
        }),
        specialty: 0,
      },
    ];

    const bonus: StatBonus = {
      speed: 0,
      power: 10,
      stamina: 0,
      guts: 0,
      wizdom: 0,
    };
    // when
    const stat = getTrainingStat(
      supportCards,
      bonus,
      ["키타산 블랙", "에이신 플래시", "사일런스 스즈카", "나리타 타이신"],
      "speed",
      5,
      20
    );

    // then
    expect(stat.speed).toBe(89);
    expect(stat.power).toBe(49);
    expect(stat.skillPoint).toBe(16);
  });
});
