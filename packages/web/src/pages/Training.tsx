import {
  Box,
  Heading,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Wrap,
} from "@chakra-ui/react";
import {
  addStat,
  getAllCases,
  loadSupportCard,
  scalaProductStat,
  Stat,
  StatBonus,
  trainingTypes,
} from "@uma-calc/core";
import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import StatBonusForm from "../components/StatBonusForm";
import SupportCardForm from "../components/SupportCardForm";
import TrainingLevelForm from "../components/TrainingLevelForm";

const TrainingPage: React.FC = () => {
  const methods = useForm({
    defaultValues: {
      supportCards: [
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
      ],
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
    },
  });

  const supportCardStates = useWatch({
    control: methods.control,
    name: "supportCards",
  });
  const formValues = useWatch({ control: methods.control });

  const supportCards = React.useMemo(
    () =>
      supportCardStates
        .filter((state) => state.id !== -1)
        .map((state) => loadSupportCard(state.id!, state.level)!),
    [supportCardStates]
  );

  const summary: Record<
    string,
    { p5: Stat; p10: Stat; p25: Stat; p50: Stat; avg: Stat }
  > = React.useMemo(() => {
    return Object.fromEntries(
      trainingTypes.map((training) => {
        const allCases = getAllCases(
          supportCards,
          formValues.statBonus as StatBonus,
          formValues
            .supportCards!.filter((card) => card.isFriendship)
            .map((card) => card.id!),
          training,
          formValues.isSummerTraining
            ? 5
            : formValues.trainingLevels![training]!,
          formValues.motivation!
        ).sort((a, b) => b.stat[training] - a.stat[training]);

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

        const p5 = cumulated.find((x) => x.pCum > 0.05)!.stat;
        const p10 = cumulated.find((x) => x.pCum > 0.1)!.stat;
        const p25 = cumulated.find((x) => x.pCum > 0.25)!.stat;
        const p50 = cumulated.find((x) => x.pCum > 0.5)!.stat;
        const avg = cumulated.reduce(
          (sum, x) => addStat(sum, scalaProductStat(x.stat, x.p)),
          Stat({})
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
  }, [supportCards, formValues]);

  return (
    <FormProvider {...methods}>
      <Stack padding={4} spacing={4} direction="row">
        <Stack
          maxW={782}
          padding={4}
          spacing={4}
          borderColor="gray.100"
          borderWidth={1}
          borderRadius={4}
        >
          <Wrap spacing={4} direction="row" align="center">
            <SupportCardForm index={0} />
            <SupportCardForm index={1} />
            <SupportCardForm index={2} />
            <SupportCardForm index={3} />
            <SupportCardForm index={4} />
            <SupportCardForm index={5} />
          </Wrap>
          <StatBonusForm />
          <TrainingLevelForm />
        </Stack>
        <Stack>
          <Select {...methods.register("motivation")}>
            <option value={20}>최상</option>
            <option value={10}>양호</option>
            <option value={0}>보통</option>
            <option value={-10}>저조</option>
            <option value={-20}>최악</option>
          </Select>
          <Box
            padding={4}
            borderColor="gray.100"
            borderWidth={1}
            borderRadius={4}
          >
            <Heading size={"sm"} marginBottom={4}>
              평균 스탯 상승량
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>스피드</Th>
                    <Th>스태미나</Th>
                    <Th>파워</Th>
                    <Th>근성</Th>
                    <Th>지능</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>스피드</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {summary[training].avg.speed
                          ? summary[training].avg.speed.toFixed(1)
                          : "-"}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>스태미나</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {summary[training].avg.stamina
                          ? summary[training].avg.stamina.toFixed(1)
                          : "-"}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>파워</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {summary[training].avg.power
                          ? summary[training].avg.power.toFixed(1)
                          : "-"}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>근성</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {summary[training].avg.guts
                          ? summary[training].avg.guts.toFixed(1)
                          : "-"}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>지능</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {summary[training].avg.intelligence
                          ? summary[training].avg.intelligence.toFixed(1)
                          : "-"}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>스킬포인트</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {summary[training].avg.skillPoint
                          ? summary[training].avg.skillPoint.toFixed(1)
                          : "-"}
                      </Td>
                    ))}
                  </Tr>
                  <Tr>
                    <Td>총합</Td>
                    {trainingTypes.map((training) => (
                      <Td key={training}>
                        {Object.values(summary[training].avg)
                          .reduce((sum, x) => sum + x, 0)
                          .toFixed(1)}
                      </Td>
                    ))}
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default TrainingPage;
