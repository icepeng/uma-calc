import {
  addStat,
  getAllCases,
  loadSupportCard,
  scalaProductStat,
  Stat,
  StatBonus,
  TrainingType,
  trainingTypes,
} from '@uma-calc/core';

export const initialDeck = [
  {
    id: -1,
    level: 50,
    isFriendship: false,
  },
  {
    id: -1,
    level: 50,
    isFriendship: false,
  },
  {
    id: -1,
    level: 50,
    isFriendship: false,
  },
  {
    id: -1,
    level: 50,
    isFriendship: false,
  },
  {
    id: -1,
    level: 50,
    isFriendship: false,
  },
  {
    id: -1,
    level: 50,
    isFriendship: false,
  },
];

export const initialFormValue = {
  deck: initialDeck,
  statBonus: {
    speed: 0,
    stamina: 0,
    power: 0,
    guts: 0,
    intelligence: 0,
  },
  trainingLevels: {
    speed: 1,
    stamina: 1,
    power: 1,
    guts: 1,
    intelligence: 1,
  },
  isSummerTraining: false,
  motivation: 20,
};

export type DeckForm = typeof initialDeck;
export type TrainingForm = typeof initialFormValue;

export function generateSummary(
  formValues: TrainingForm,
  fn: (stat: Stat, training: TrainingType) => number
) {
  const supportCards = formValues.deck
    .filter((state) => state.id !== -1)
    .map((state) => loadSupportCard(state.id, state.level)!);

  return Object.fromEntries(
    trainingTypes.map((training) => {
      const allCases = getAllCases(
        supportCards,
        formValues.statBonus as StatBonus,
        formValues.deck
          .filter((card) => card.isFriendship)
          .map((card) => card.id),
        training,
        formValues.isSummerTraining ? 5 : formValues.trainingLevels[training],
        formValues.motivation
      ).sort((a, b) => fn(b.stat, training) - fn(a.stat, training));

      const cumulated = allCases.reduce(
        (prev, curr, i) => [
          ...prev,
          {
            stat: curr.stat,
            p: curr.p,
            pCum: (prev[i - 1]?.pCum ?? 0) + curr.p,
          },
        ],
        [] as { stat: Stat; p: number; pCum: number }[]
      );

      const p5 = fn(cumulated.find((x) => x.pCum > 0.05)!.stat, training);
      const p10 = fn(cumulated.find((x) => x.pCum > 0.1)!.stat, training);
      const p25 = fn(cumulated.find((x) => x.pCum > 0.25)!.stat, training);
      const p50 = fn(cumulated.find((x) => x.pCum > 0.5)!.stat, training);
      const avg = fn(
        cumulated.reduce(
          (sum, x) => addStat(sum, scalaProductStat(x.stat, x.p)),
          Stat({})
        ),
        training
      );

      return [
        training,
        {
          p5,
          p10,
          p25,
          p50,
          avg,
        },
      ];
    })
  );
}
