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
import { StatBonus } from "@uma-calc/core";
import React from "react";

const StatBonusForm: React.FC<{
  onStatBonusChange?: (bonus: StatBonus) => void;
}> = ({ onStatBonusChange }) => {
  const [speed, setSpeed] = React.useState<number>(0);
  const [stamina, setStamina] = React.useState<number>(0);
  const [power, setPower] = React.useState<number>(0);
  const [guts, setGuts] = React.useState<number>(0);
  const [intellect, setIntellect] = React.useState<number>(0);

  const buildStatBonus = (): StatBonus => {
    return {
      speed: 1 + speed / 100,
      stamina: 1 + stamina / 100,
      power: 1 + power / 100,
      guts: 1 + guts / 100,
      intellect: 1 + intellect / 100,
    };
  };

  React.useEffect(() => {
    onStatBonusChange?.(buildStatBonus());
  }, [speed, stamina, power, guts, intellect]);

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Heading size={"sm"} marginBottom={4}>
        스탯 보너스
      </Heading>
      <Stack spacing={4} direction="row">
        <FormControl>
          <FormLabel>스피드%</FormLabel>
          <NumberInput
            value={speed}
            onChange={(_, value) => setSpeed(value ?? 0)}
            size="sm"
            min={0}
            max={30}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>스태미나%</FormLabel>
          <NumberInput
            value={stamina}
            onChange={(_, value) => setStamina(value ?? 0)}
            size="sm"
            min={0}
            max={30}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>파워%</FormLabel>
          <NumberInput
            value={power}
            onChange={(_, value) => setPower(value ?? 0)}
            size="sm"
            min={0}
            max={30}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>근성%</FormLabel>
          <NumberInput
            value={guts}
            onChange={(_, value) => setGuts(value ?? 0)}
            size="sm"
            min={0}
            max={30}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>지능%</FormLabel>
          <NumberInput
            value={intellect}
            onChange={(_, value) => setIntellect(value ?? 0)}
            size="sm"
            min={0}
            max={30}
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

export default StatBonusForm;
