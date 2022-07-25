import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react";
import { TrainingType } from "@uma-calc/core";
import React from "react";

const TrainingLevelForm: React.FC<{
  onChange?: (traningLevels: Record<TrainingType, number>) => void;
}> = ({ onChange }) => {
  const [speed, setSpeed] = React.useState<number>(1);
  const [stamina, setStamina] = React.useState<number>(1);
  const [power, setPower] = React.useState<number>(1);
  const [guts, setGuts] = React.useState<number>(1);
  const [wizdom, setWizdom] = React.useState<number>(1);

  React.useEffect(() => {
    onChange?.({
      speed,
      stamina,
      power,
      guts,
      wizdom,
    });
  }, [speed, stamina, power, guts, wizdom]);

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Heading size={"sm"} marginBottom={4}>
        트레이닝 레벨
      </Heading>
      <Stack spacing={4} direction="row">
        <FormControl>
          <FormLabel>스피드</FormLabel>
          <NumberInput
            value={speed}
            onChange={(_, value) => setSpeed(value ?? 0)}
            size="sm"
            min={1}
            max={5}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>스태미나</FormLabel>
          <NumberInput
            value={stamina}
            onChange={(_, value) => setStamina(value ?? 0)}
            size="sm"
            min={1}
            max={5}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>파워</FormLabel>
          <NumberInput
            value={power}
            onChange={(_, value) => setPower(value ?? 0)}
            size="sm"
            min={1}
            max={5}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>근성</FormLabel>
          <NumberInput
            value={guts}
            onChange={(_, value) => setGuts(value ?? 0)}
            size="sm"
            min={1}
            max={5}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>지능</FormLabel>
          <NumberInput
            value={wizdom}
            onChange={(_, value) => setWizdom(value ?? 0)}
            size="sm"
            min={1}
            max={5}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default TrainingLevelForm;
