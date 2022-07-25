import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { db } from "@uma-calc/core";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

function renderRarity(rarity: number) {
  if (rarity === 1) {
    return "R";
  }
  if (rarity === 2) {
    return "SR";
  }
  if (rarity === 3) {
    return "SSR";
  }
  return "?";
}

function renderType(type: string) {
  if (type === "speed") {
    return "스피드";
  }
  if (type === "stamina") {
    return "스태미너";
  }
  if (type === "power") {
    return "파워";
  }
  if (type === "guts") {
    return "근성";
  }
  if (type === "intelligence") {
    return "지능";
  }
  if (type === "friend") {
    return "친구";
  }
  return "?";
}

const SupportCardForm: React.FC<{
  onChange?: (form: { id: number; level: number }) => void;
}> = ({ onChange }) => {
  const { register, control } = useForm<{ id: number; level: number }>();
  const value = useWatch({ control });

  useEffect(() => {
    if (value.id && value.level) {
      onChange?.({ id: value.id, level: value.level });
    }
  }, [value]);

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Stack spacing={4} direction="column">
        <FormControl>
          <FormLabel>카드명</FormLabel>
          <Select {...register("id", { valueAsNumber: true })}>
            {db.supportCards
              .filter((card) => card.release_ko)
              .map((card) => (
                <option key={card.support_id} value={card.support_id}>
                  {renderRarity(card.rarity)} {card.name_ko} (
                  {renderType(card.type)})
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>레벨</FormLabel>
          <Input {...register("level", { valueAsNumber: true })} />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default SupportCardForm;
