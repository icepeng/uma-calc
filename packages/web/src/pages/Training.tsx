import {
  Box,
  Checkbox,
  CheckboxGroup,
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
  getAllCases,
  loadSupportCard,
  Stat,
  StatBonus,
  TrainingType,
  trainingTypes,
} from "@uma-calc/core";
import React from "react";
import StatBonusForm from "../components/StatBonusForm";
import SupportCardForm from "../components/SupportCardForm";
import TrainingLevelForm from "../components/TrainingLevelForm";

const TrainingPage: React.FC = () => {
  const [supportCardStates, setSupportCardStates] = React.useState<
    { id: number | undefined; level: number }[]
  >([
    {
      id: undefined,
      level: 0,
    },
    {
      id: undefined,
      level: 0,
    },
    {
      id: undefined,
      level: 0,
    },
    {
      id: undefined,
      level: 0,
    },
    {
      id: undefined,
      level: 0,
    },
    {
      id: undefined,
      level: 0,
    },
  ]);
  const supportCards = React.useMemo(
    () =>
      supportCardStates
        .filter((state) => state.id !== undefined)
        .map((state) => loadSupportCard(state.id!, state.level)!),
    []
  );
  const [statBonus, setStatBonus] = React.useState<StatBonus>({
    speed: 0,
    stamina: 0,
    power: 0,
    guts: 0,
    wizdom: 0,
  });
  const [trainingLevels, setTrainingLevels] = React.useState<
    Record<TrainingType, number>
  >({ speed: 1, stamina: 1, power: 1, guts: 1, wizdom: 1 });
  const [friendshipCards, setFriendshipCards] = React.useState<string[]>([]);
  const [motivation, setMotivation] = React.useState<number>(0.2);

  const summary: Record<string, { p5: Stat; p10: Stat; p25: Stat; p50: Stat }> =
    React.useMemo(() => {
      return Object.fromEntries(
        trainingTypes.map((training) => {
          const allCases = getAllCases(
            supportCards,
            statBonus,
            friendshipCards,
            training,
            trainingLevels[training],
            motivation
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

          return [
            training,
            {
              p5,
              p10,
              p25,
              p50,
            },
          ];
        })
      );
    }, [supportCards, statBonus, trainingLevels, friendshipCards, motivation]);

  const handleSupportCardChange =
    (index: number) => (form: { id: number; level: number }) => {
      console.log(form);
      setSupportCardStates([
        ...supportCardStates.slice(0, index),
        form,
        ...supportCardStates.slice(index + 1),
      ]);
    };

  return (
    <Stack padding={4} spacing={4}>
      <Wrap spacing={4} direction="row" align="center">
        <SupportCardForm onChange={handleSupportCardChange(0)} />
        <SupportCardForm onChange={handleSupportCardChange(1)} />
        <SupportCardForm onChange={handleSupportCardChange(2)} />
        <SupportCardForm onChange={handleSupportCardChange(3)} />
        <SupportCardForm onChange={handleSupportCardChange(4)} />
        <SupportCardForm onChange={handleSupportCardChange(5)} />
      </Wrap>
      <StatBonusForm onStatBonusChange={setStatBonus} />
      <TrainingLevelForm onChange={setTrainingLevels} />
      <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
        <Heading size={"sm"} marginBottom={4}>
          우정 트레이닝
        </Heading>
        <CheckboxGroup
          value={friendshipCards}
          onChange={(value: string[]) => setFriendshipCards(value)}
        >
          <Stack spacing={[1, 5]} direction={"row"}>
            {supportCards.map((card, i) => (
              <Checkbox key={i} value={card.name}>
                {card.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>
      <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
        <Heading size={"sm"} marginBottom={4}>
          평균 스탯
        </Heading>
        <Select
          value={motivation}
          onChange={(e) => setMotivation(+e.currentTarget.value)}
        >
          <option value={0.2}>최상</option>
          <option value={0.1}>양호</option>
          <option value={0}>보통</option>
          <option value={-0.1}>저조</option>
          <option value={-0.2}>최악</option>
        </Select>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>누적확률</Th>
                <Th>스피드</Th>
                <Th>스태미나</Th>
                <Th>파워</Th>
                <Th>근성</Th>
                <Th>지능</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>5%</Td>
                {trainingTypes.map((training) => (
                  <Td key={training}>{summary[training].p5[training]}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>10%</Td>
                {trainingTypes.map((training) => (
                  <Td key={training}>{summary[training].p10[training]}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>25%</Td>
                {trainingTypes.map((training) => (
                  <Td key={training}>{summary[training].p25[training]}</Td>
                ))}
              </Tr>
              <Tr>
                <Td>50%</Td>
                {trainingTypes.map((training) => (
                  <Td key={training}>{summary[training].p50[training]}</Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  );
};

export default TrainingPage;
