import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Wrap,
} from "@chakra-ui/react";
import { pickup } from "@uma-calc/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Navbar from "./Navbar";

interface GachaForm {
  targetDraw: number;
  currentDraw: number;
  ceilPoint: number;
  jewelLeft: number;
  p: number;
}

const App: React.FC = () => {
  const { register, control, getValues } = useForm<GachaForm>({
    defaultValues: {
      targetDraw: 5,
      currentDraw: 0,
      ceilPoint: 0,
      jewelLeft: 0,
      p: 0.0075,
    },
  });
  const [avg, setAvg] = React.useState<number>(0);
  const [hope, setHope] = React.useState<number>(0);
  const [summary, setSummary] = React.useState<{ title: string; p: number }[]>(
    []
  );

  function handleCalculate() {
    const { targetDraw, currentDraw, ceilPoint, jewelLeft, p } = getValues();
    const log = pickup(targetDraw, ceilPoint + currentDraw * 200, p);
    setAvg(log.reduce((sum, x) => sum + x.p * x.count, 0));

    const drawLeft = Math.floor(jewelLeft / 1500) * 10;
    setHope(
      log.filter((x) => x.count <= drawLeft).reduce((sum, x) => sum + x.p, 0)
    );
    setSummary(
      Array.from({ length: targetDraw }, (_, k) => [
        {
          title: `${k}천장 + @`,
          p: log
            .filter((x) => x.ceilCount === k && !x.isCeil)
            .reduce((sum, x) => sum + x.p, 0),
        },
        {
          title: `${k + 1}천장`,
          p: log.find((x) => x.ceilCount === k && x.isCeil)?.p ?? 0,
        },
      ]).flat()
    );
  }

  function renderPercent(value: number) {
    return (value * 100).toFixed(4) + "%";
  }

  return (
    <>
      <Navbar />
      <Wrap padding={4} spacing={4}>
        <Stack
          padding={4}
          borderColor="gray.100"
          borderWidth={1}
          borderRadius={4}
          maxWidth={480}
        >
          <FormControl>
            <FormLabel>목표 돌파수</FormLabel>
            <Select {...register("targetDraw")}>
              <option value={5}>풀돌</option>
              <option value={4}>3돌</option>
              <option value={3}>2돌</option>
              <option value={2}>1돌</option>
              <option value={1}>명함</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>현재 돌파수</FormLabel>
            <Select {...register("currentDraw")}>
              <option value={4}>3돌</option>
              <option value={3}>2돌</option>
              <option value={2}>1돌</option>
              <option value={1}>명함</option>
              <option value={0}>없음</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>현재 천장 포인트</FormLabel>
            <Controller
              name={"ceilPoint"}
              control={control}
              render={({ field: { ref, ...restField } }) => (
                <NumberInput {...restField} size="sm" min={0} max={1000}>
                  <NumberInputField ref={ref} name={restField.name} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            ></Controller>
          </FormControl>
          <FormControl>
            <FormLabel>남은 쥬얼 개수</FormLabel>
            <Controller
              name={"jewelLeft"}
              control={control}
              render={({ field: { ref, ...restField } }) => (
                <NumberInput {...restField} size="sm" min={0}>
                  <NumberInputField ref={ref} name={restField.name} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            ></Controller>
          </FormControl>
          <FormControl>
            <FormLabel>픽업 확률</FormLabel>
            <Select {...register("p")}>
              <option value={0.0075}>0.75%</option>
              <option value={0.005}>0.5%</option>
            </Select>
          </FormControl>
          <Button onClick={handleCalculate}>계산</Button>
        </Stack>
        <Box
          borderColor="gray.100"
          minWidth={360}
          borderWidth={1}
          borderRadius={4}
        >
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>천장 횟수</Th>
                  <Th isNumeric>확률</Th>
                </Tr>
              </Thead>
              <Tbody>
                {summary.map(({ title, p }) => (
                  <Tr key={title}>
                    <Td>{title}</Td>
                    <Td isNumeric>{renderPercent(p)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Stack
          borderColor="gray.100"
          minWidth={360}
          borderWidth={1}
          borderRadius={4}
          padding={4}
        >
          <Stat>
            <StatLabel>앞으로 필요한 가챠 횟수 평균</StatLabel>
            <StatNumber>{avg.toFixed(0)} 회</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>앞으로 필요한 쥬얼 평균</StatLabel>
            <StatNumber>{(avg * 150).toFixed(0)} 쥬얼</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>남은 쥬얼로 목표 달성할 확률</StatLabel>
            <StatNumber>{renderPercent(hope)}</StatNumber>
          </Stat>
        </Stack>
      </Wrap>
    </>
  );
};

export default App;
