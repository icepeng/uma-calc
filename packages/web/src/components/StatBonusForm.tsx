import { AddIcon } from '@chakra-ui/icons';
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
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { db } from '@uma-calc/core';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { handleNumber } from '../pipe';
import PlayableCardModal from './PlayableCardModal';

const sortedPlayableCharacters = db.playableCharacters
  .filter((character) => character.release_ko)
  .sort((a, b) => b.release_ko!.localeCompare(a.release_ko!));

const StatBonusForm: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { control, setValue } = useFormContext();
  const [cardId, setCardId] = React.useState<number>(-1);

  function setCard(id: number) {
    const targetCard = sortedPlayableCharacters.find(
      ({ card_id }) => card_id === id
    );
    if (!targetCard) {
      return;
    }
    setValue('statBonus', {
      speed: targetCard.stat_bonus[0],
      stamina: targetCard.stat_bonus[1],
      power: targetCard.stat_bonus[2],
      guts: targetCard.stat_bonus[3],
      intelligence: targetCard.stat_bonus[4],
    });
    setCardId(targetCard.card_id);
  }

  function handleModalClose(data?: { id: number }) {
    if (data) {
      setCard(data.id);
    }
    onClose();
  }

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Heading size={'sm'} marginBottom={4}>
        스탯 보너스
      </Heading>
      <Stack spacing={4} direction="row" alignItems={'center'} marginBottom={4}>
        {cardId === -1 ? (
          <IconButton
            variant="outline"
            boxSize="150px"
            border="1px"
            borderColor="gray.100"
            borderRadius="4"
            onClick={onOpen}
            aria-label="SelectCard"
            icon={<AddIcon />}
          />
        ) : (
          <Image
            cursor="pointer"
            boxSize="150px"
            border="1px"
            borderColor="gray.100"
            borderRadius="4"
            alt={cardId.toString()}
            src={`/img/characters/${cardId}.png`}
            onClick={onOpen}
          ></Image>
        )}
        <PlayableCardModal
          isOpen={isOpen}
          onClose={handleModalClose}
        ></PlayableCardModal>
      </Stack>
      <Stack spacing={4} direction="row">
        <FormControl>
          <FormLabel>스피드%</FormLabel>
          <Controller
            control={control}
            name={'statBonus.speed'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 0))}
                size="sm"
                min={0}
                max={30}
                step={5}
              >
                <NumberInputField ref={ref} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>스태미나%</FormLabel>
          <Controller
            control={control}
            name={'statBonus.stamina'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 0))}
                size="sm"
                min={0}
                max={30}
                step={5}
              >
                <NumberInputField ref={ref} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>파워%</FormLabel>
          <Controller
            control={control}
            name={'statBonus.power'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 0))}
                size="sm"
                min={0}
                max={30}
                step={5}
              >
                <NumberInputField ref={ref} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>근성%</FormLabel>
          <Controller
            control={control}
            name={'statBonus.guts'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 0))}
                size="sm"
                min={0}
                max={30}
                step={5}
              >
                <NumberInputField ref={ref} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>지능%</FormLabel>
          <Controller
            control={control}
            name={'statBonus.intelligence'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 0))}
                size="sm"
                min={0}
                max={30}
                step={5}
              >
                <NumberInputField ref={ref} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default StatBonusForm;
