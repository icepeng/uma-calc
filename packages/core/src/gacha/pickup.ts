export function combination(n: number, r: number) {
  if (n < r) {
    return 0;
  }

  return (
    Array.from({ length: r }, (_, i) => n - i).reduce(
      (prev, curr) => prev * curr,
      1
    ) /
    Array.from({ length: r }, (_, i) => r - i).reduce(
      (prev, curr) => prev * curr,
      1
    )
  );
}

export function negBinom(n: number, r: number, p: number) {
  return combination(n - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, n - r);
}

function getTable(p: number): Record<number, number[]> {
  return {
    1: Array.from({ length: 1001 }, (_, k) => negBinom(k, 1, p)),
    2: Array.from({ length: 1001 }, (_, k) => negBinom(k, 2, p)),
    3: Array.from({ length: 1001 }, (_, k) => negBinom(k, 3, p)),
    4: Array.from({ length: 1001 }, (_, k) => negBinom(k, 4, p)),
    5: Array.from({ length: 1001 }, (_, k) => negBinom(k, 5, p)),
  };
}

export function pickup(targetDraw: number, ceilPoint: number, p: number) {
  const ceilDraw = Math.floor(ceilPoint / 200);
  let drawLeft = targetDraw - ceilDraw;
  if (drawLeft <= 0) {
    return [];
  }

  const table = getTable(p);

  let point = ceilPoint % 200;
  let drawCount = 0;
  const drawLog: {
    p: number;
    count: number;
    ceilCount: number;
    isCeil: boolean;
  }[] = [];
  while (drawLeft > 0) {
    drawCount += 1;
    point += 1;
    drawLog.push({
      p: table[drawLeft][drawCount],
      count: drawCount,
      ceilCount: targetDraw - drawLeft,
      isCeil: false,
    });
    if (point === 200) {
      const curr =
        drawLeft <= 1
          ? 1
          : Array.from(
              { length: drawCount },
              (_, k) => table[drawLeft - 1][k + 1]
            ).reduce((sum, x) => sum + x, 0);
      const prev = Array.from(
        { length: drawCount },
        (_, k) => table[drawLeft][k + 1]
      ).reduce((sum, x) => sum + x, 0);

      drawLog.push({
        p: curr - prev,
        count: drawCount,
        ceilCount: targetDraw - drawLeft,
        isCeil: true,
      });
      drawLeft -= 1;
      point = 0;
    }
  }

  return drawLog;
}
