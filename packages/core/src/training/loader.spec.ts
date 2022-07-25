import { bonusResolver } from "./loader";

describe("bonusResolver", () => {
  it("should calculate motivationBonus from effects", () => {
    // given
    const effects: number[][] = [
      // 키타산 블랙 SSR
      [1, 10, -1, -1, -1, -1, 20, 20, -1, -1, 25, -1],
      [2, -1, -1, -1, 10, -1, 20, 20, -1, -1, 30, -1],
      [5, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1],
      [8, -1, -1, 1, -1, -1, 5, 5, -1, -1, 10, -1],
      [14, 10, -1, -1, -1, -1, -1, 25, -1, -1, -1, 35],
      [15, -1, -1, 1, -1, -1, 5, 5, -1, -1, 5, -1],
      [16, -1, -1, 1, -1, -1, 10, 10, -1, -1, 15, -1],
      [17, -1, -1, -1, 1, -1, 1, 1, -1, -1, 2, -1],
      [18, -1, -1, -1, 5, -1, 20, 20, -1, -1, 30, -1],
      [19, -1, -1, -1, -1, -1, -1, -1, -1, -1, 40, 80],
    ];
    // when
    const motivationBonus = bonusResolver("motivationBonus", effects, 41);

    // then
    expect(motivationBonus).toBe(27);
  });
});
