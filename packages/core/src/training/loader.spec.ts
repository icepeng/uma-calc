import { bonusResolver, loadSupportCard } from "./loader";

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

describe("loadSupportCard", () => {
  it("should create supportCard from id and level", () => {
    // given
    const cardId = 20023; // 스윕 토쇼 SR
    const level = 45;

    // when
    const supportCard = loadSupportCard(cardId, level);

    // then
    expect(supportCard).toStrictEqual({
      name: "스윕 토쇼",
      type: "speed",
      motivationBonus: 40,
      friendshipBonus: 30,
      trainingBonus: 5 + 5,
      statBonus: {
        guts: 0,
        power: 0,
        skillPoint: 1,
        speed: 0,
        stamina: 0,
        intelligence: 0,
      },
      specialty: 50,
    });
  });
});
