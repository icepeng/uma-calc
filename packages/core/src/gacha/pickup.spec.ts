import { combination, negBinom, pickup } from "./pickup";

describe("combination", () => {
  it("should calculate combination", () => {
    // given
    const n = 5;
    const r = 3;

    // when
    const nCr = combination(n, r);

    // then
    expect(nCr).toBe(10);
  });
});

describe("negBinom", () => {
  it("should calculate negative binomial distribution", () => {
    // given
    const n = 200;
    const r = 3;
    const p = 0.0075;

    // when
    const mass = negBinom(n, r, p);

    // then
    expect(mass).toBeCloseTo(0.001886);
  });
});

describe("pickup", () => {
  it("should calculate pickup", () => {
    // given

    // when
    const result = pickup(5, 0, 0.0075);

    // then
    expect(result.reduce((res, x) => res + x.count * x.p, 0)).toBeCloseTo(
      424.103
    );
  });
});
