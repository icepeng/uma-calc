import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react";
import { Stat, SupportType } from "@uma-calc/core";
import React from "react";
import { SupportCardFormGroup } from "../form";

const SupportCardForm: React.FC<{
  initialValue?: SupportCardFormGroup;
  onChange?: (form: SupportCardFormGroup) => void;
}> = ({ initialValue, onChange }) => {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<SupportType>("speed");
  const [trainingBonus, setTrainingBonus] = React.useState<number>(0);
  const [friendshipBonus, setFriendshipBonus] = React.useState<number>(0);
  const [conditionBonus, setConditionBonus] = React.useState<number>(0);
  const [statBonus, setStatBonus] = React.useState<keyof Stat | undefined>();
  const [speciality, setSpeciality] = React.useState<number>(0);
  const [uniqueEffects, setUniqueEffects] = React.useState<string[]>([]);

  React.useEffect(() => {
    onChange?.({
      name,
      type,
      trainingBonus,
      friendshipBonus,
      conditionBonus,
      statBonus,
      speciality,
      uniqueEffects,
    });
  }, [
    name,
    type,
    trainingBonus,
    friendshipBonus,
    conditionBonus,
    statBonus,
    speciality,
    uniqueEffects,
  ]);

  React.useEffect(() => {
    if (!initialValue) {
      return;
    }
    setName(initialValue.name);
    setType(initialValue.type);
    setTrainingBonus(initialValue.trainingBonus);
    setFriendshipBonus(initialValue.friendshipBonus);
    setConditionBonus(initialValue.conditionBonus);
    setStatBonus(initialValue.statBonus);
    setSpeciality(initialValue.speciality);
    setUniqueEffects(initialValue.uniqueEffects);
  }, []);

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Stack spacing={4} direction="row">
        <Stack spacing={4} direction="column" align="center">
          <FormControl>
            <FormLabel>카드명</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel>특기</FormLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.currentTarget.value as SupportType)}
              size="sm"
            >
              <option value="speed">스피드</option>
              <option value="stamina">스태미나</option>
              <option value="power">파워</option>
              <option value="grit">근성</option>
              <option value="intellect">지능</option>
              <option value="friend">친구</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>특기율</FormLabel>
            <NumberInput
              value={speciality}
              onChange={(_, value) => setSpeciality(value || 0)}
              size="sm"
              min={0}
              max={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Stack>
        <Stack spacing={4} direction="column" align="center">
          <FormControl>
            <FormLabel>트레이닝 효과 증가 %</FormLabel>
            <NumberInput
              value={trainingBonus}
              onChange={(_, value) => setTrainingBonus(value || 0)}
              size="sm"
              min={0}
              max={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>우정 보너스 증가 %</FormLabel>
            <NumberInput
              value={friendshipBonus}
              onChange={(_, value) => setFriendshipBonus(value || 0)}
              size="sm"
              min={0}
              max={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>컨디션 효과 증가 %</FormLabel>
            <NumberInput
              value={conditionBonus}
              onChange={(_, value) => setConditionBonus(value || 0)}
              size="sm"
              min={0}
              max={100}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>스탯 보너스</FormLabel>
            <Select
              value={statBonus}
              onChange={(e) =>
                setStatBonus(e.currentTarget.value as keyof Stat | undefined)
              }
              size="sm"
            >
              <option value={undefined}>없음</option>
              <option value="speed">스피드</option>
              <option value="stamina">스태미나</option>
              <option value="power">파워</option>
              <option value="grit">근성</option>
              <option value="intellect">지능</option>
              <option value="skillPoint">스킬 포인트</option>
            </Select>
          </FormControl>
        </Stack>
        <Stack spacing={4} direction="column" align="center">
          <CheckboxGroup
            value={uniqueEffects}
            onChange={(value: string[]) => setUniqueEffects(value)}
          >
            <Stack spacing={[1, 5]} direction={"column"}>
              <Checkbox value="trainingBonus">트레이닝 효과 증가</Checkbox>
              <Checkbox value="friendshipBonus">우정 보너스 증가</Checkbox>
              <Checkbox value="conditionBonus">컨디션 효과 증가</Checkbox>
              <Checkbox value="speedBonus">스피드 보너스 증가</Checkbox>
              <Checkbox value="staminaBonus">스태미나 보너스 증가</Checkbox>
              <Checkbox value="powerBonus">파워 보너스 증가</Checkbox>
              <Checkbox value="gritBonus">근성 보너스 증가</Checkbox>
              <Checkbox value="intellectBonus">지능 보너스 증가</Checkbox>
              <Checkbox value="speciality">특기율 증가</Checkbox>
            </Stack>
          </CheckboxGroup>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SupportCardForm;
