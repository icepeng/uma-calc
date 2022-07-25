import { Gene, getRelationScore, getScore } from "./score";

describe("getScore", () => {
  it("should calculate relation between parent", () => {
    // given
    const char1 = 1014; // 엘 콘도르 파사
    const char2 = 1006; // 오구리 캡

    // when
    const score = getRelationScore(char1, char2);

    // then
    expect(score).toBe(23);
  });

  it("should calculate relation between grandparent", () => {
    // given
    const char1 = 1014; // 엘 콘도르 파사
    const char2 = 1006; // 오구리 캡
    const char3 = 1026; // 미호노 부르봉

    // when
    const score = getRelationScore(char1, char2, char3);

    // then
    expect(score).toBe(22);
  });

  it("should ignore duplicate chara ids", () => {
    // given
    const char1 = 1014; // 엘 콘도르 파사
    const char2 = 1026; // 미호노 부르봉
    const char3 = 1014; // 엘 콘도르 파사

    // when
    const score = getRelationScore(char1, char2, char3);

    // then
    expect(score).toBe(0);
  });
});

describe("getGeneScore", () => {
  it("should calculate total score", () => {
    // given
    const grandparent1: Gene = {
      blueStat: {
        type: "speed",
        value: 3,
      },
      redStat: {
        type: "grass",
        value: 3,
      },
      whiteStats: [],
      charaId: 1026, // 미호노 부르봉
      gpScore: 0,
    };

    const grandparent2: Gene = {
      blueStat: {
        type: "speed",
        value: 3,
      },
      redStat: {
        type: "grass",
        value: 3,
      },
      whiteStats: [],
      charaId: 1004, // 마루젠스키
      gpScore: 0,
    };

    const gene1: Gene = {
      blueStat: {
        type: "speed",
        value: 3,
      },
      redStat: {
        type: "grass",
        value: 3,
      },
      whiteStats: [],
      parent1: grandparent1,
      parent2: grandparent2,
      charaId: 1020, // 세이운 스카이
      gpScore: 0,
    };

    const gene2: Gene = {
      blueStat: {
        type: "speed",
        value: 3,
      },
      redStat: {
        type: "grass",
        value: 3,
      },
      whiteStats: [],
      parent1: gene1,
      parent2: grandparent2,
      charaId: 1026, // 미호노 부르봉
      gpScore: 0,
    };

    const charaId = 1004; // 마루젠스키

    // when
    const score = getScore(charaId, gene1, gene2);

    // then
    expect(score).toBe(100);
  });
});
