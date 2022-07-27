import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { db, StatBonus } from "@uma-calc/core";
import React from "react";
import CardModal from "./CardModal";

const sortedPlayableCharacters = db.playableCharacters
  .filter((character) => character.release_ko)
  .sort((a, b) => b.release_ko!.localeCompare(a.release_ko!));

const StatBonusForm: React.FC<{
  onStatBonusChange?: (bonus: StatBonus) => void;
}> = ({ onStatBonusChange }) => {
  const [speed, setSpeed] = React.useState<number>(0);
  const [stamina, setStamina] = React.useState<number>(0);
  const [power, setPower] = React.useState<number>(0);
  const [guts, setGuts] = React.useState<number>(0);
  const [intelligence, setIntelligence] = React.useState<number>(0);
  const [cardId, setCardId] = React.useState<number>(0);

  const buildStatBonus = (): StatBonus => {
    return {
      speed: 1 + speed,
      stamina: 1 + stamina,
      power: 1 + power,
      guts: 1 + guts,
      intelligence: 1 + intelligence,
    };
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  function setCard(id: number) {
    const target_card = sortedPlayableCharacters.find(
      ({ card_id }) => card_id === id
    );

    target_card?.stat_bonus.forEach((stat, i) => {
      if (i == 0) setSpeed(+stat);
      if (i == 1) setStamina(+stat);
      if (i == 2) setPower(+stat);
      if (i == 3) setGuts(+stat);
      if (i == 4) setIntelligence(+stat);
    });
    setCardId(id);
  }

  function handleModalClose(data?: { card_id: number }) {
    if (data) {
      setCard(data.card_id);
    }
    onClose();
  }

  function handleCardChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const cardId = +event.target.value;
    setCard(cardId);
  }

  React.useEffect(() => {
    onStatBonusChange?.(buildStatBonus());
  }, [speed, stamina, power, guts, intelligence]);

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Heading size={"sm"} marginBottom={4}>
        스탯 보너스
      </Heading>
      <Stack spacing={4} direction="row" alignItems={"center"} marginBottom={4}>
        <Center minW="150px" minH="150px" flexDirection={"column"}>
          {cardId === 0 ? (
            <IconButton
              aria-label="SelectCard"
              onClick={onOpen}
              icon={<AddIcon />}
            />
          ) : (
            <Image
              boxSize="150px"
              border="1px"
              borderColor="gray.100"
              borderRadius="4"
              alt={cardId.toString()}
              src={`/img/${cardId}.png`}
              onClick={onOpen}
            ></Image>
          )}
          <CardModal isOpen={isOpen} onClose={handleModalClose}></CardModal>
        </Center>
        <Select size={"md"} value={cardId} onChange={handleCardChange}>
          <option value={0}>-</option>
          {sortedPlayableCharacters.map((x) => (
            <option value={x.card_id}>
              {x.name_ko} {x.title_ko}
            </option>
          ))}
        </Select>
      </Stack>
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
            value={intelligence}
            onChange={(_, value) => setIntelligence(value ?? 0)}
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
