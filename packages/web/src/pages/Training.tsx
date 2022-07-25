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
import type { Stat, StatBonus, TrainingType } from "@uma-calc/core";
import { getAllCases, trainingTypes } from "@uma-calc/core";
import React from "react";
import StatBonusForm from "../components/StatBonusForm";
import SupportCardForm from "../components/SupportCardForm";
import TrainingLevelForm from "../components/TrainingLevelForm";
import { buildSupportCard, SupportCardFormGroup } from "../form";

const TrainingPage: React.FC = () => {
  const [supportCards, setSupportCards] = React.useState<
    SupportCardFormGroup[]
  >([
    {
      name: "킹 헤일로",
      type: "speed",
      trainingBonus: 5,
      friendshipBonus: 18,
      motivationBonus: 26,
      statBonus: undefined,
      specialty: 45,
      uniqueEffects: ["speedBonus"],
    },
    {
      name: "스페셜 위크",
      type: "speed",
      trainingBonus: 0,
      friendshipBonus: 35,
      motivationBonus: 30,
      statBonus: "speed",
      specialty: 30,
      uniqueEffects: ["trainingBonus"],
    },
    {
      name: "에이신 플래시",
      type: "speed",
      trainingBonus: 5,
      friendshipBonus: 20,
      motivationBonus: 47,
      statBonus: undefined,
      specialty: 35,
      uniqueEffects: ["motivationBonus"],
    },
    {
      name: "맨하탄 카페",
      type: "stamina",
      trainingBonus: 0,
      friendshipBonus: 20,
      motivationBonus: 40,
      statBonus: "stamina",
      specialty: 50,
      uniqueEffects: ["specialty", "trainingBonus"],
    },
    {
      name: "슈퍼 크릭",
      type: "stamina",
      trainingBonus: 10,
      friendshipBonus: 20,
      motivationBonus: 0,
      statBonus: undefined,
      specialty: 20,
      uniqueEffects: ["specialty", "friendshipBonus"],
    },
    {
      name: "하야카와 타즈나",
      type: "friend",
      trainingBonus: 10,
      friendshipBonus: 0,
      motivationBonus: 0,
      statBonus: undefined,
      specialty: 0,
      uniqueEffects: [],
    },
  ]);
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
            supportCards.map((form) => buildSupportCard(form)),
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
    (index: number) => (form: SupportCardFormGroup) => {
      setSupportCards([
        ...supportCards.slice(0, index),
        form,
        ...supportCards.slice(index + 1),
      ]);
    };

  return (
    <Stack padding={4} spacing={4}>
      <Wrap spacing={4} direction="row" align="center">
        <SupportCardForm
          initialValue={supportCards[0]}
          onChange={handleSupportCardChange(0)}
        />
        <SupportCardForm
          initialValue={supportCards[1]}
          onChange={handleSupportCardChange(1)}
        />
        <SupportCardForm
          initialValue={supportCards[2]}
          onChange={handleSupportCardChange(2)}
        />
        <SupportCardForm
          initialValue={supportCards[3]}
          onChange={handleSupportCardChange(3)}
        />
        <SupportCardForm
          initialValue={supportCards[4]}
          onChange={handleSupportCardChange(4)}
        />
        <SupportCardForm
          initialValue={supportCards[5]}
          onChange={handleSupportCardChange(5)}
        />
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
