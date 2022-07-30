import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
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
import { handleNumber, renderRarity, renderType } from '../pipe';
import SupportCardModal from './SupportCardModal';

function renderSupportCard(id: number) {
  const card = db.supportCards.find((card) => card.support_id === id);
  if (!card) {
    return '-';
  }

  return `${renderRarity(card.rarity)} ${card.name_ko} (${renderType(
    card.type
  )})`;
}

const SupportCardForm: React.FC<{ index: number }> = ({ index }) => {
  const { control, getValues, setValue } = useFormContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleModalClose(data?: { id: number }) {
    if (data) {
      setValue(`deck.${index}.id`, data.id);
    }
    onClose();
  }

  return (
    <Box
      minW={270}
      padding={4}
      borderColor="gray.100"
      borderWidth={1}
      borderRadius={4}
    >
      <Stack spacing={4} direction="column">
        <FormControl>
          <FormLabel>카드명</FormLabel>
          <Box
            fontSize={'sm'}
            paddingX={3}
            paddingY={1}
            borderWidth={1}
            borderRadius={4}
            cursor={'pointer'}
            _hover={{ backgroundColor: 'gray.100' }}
            onClick={onOpen}
          >
            {renderSupportCard(getValues(`deck.${index}.id`))}
          </Box>
          <SupportCardModal
            isOpen={isOpen}
            onClose={handleModalClose}
          ></SupportCardModal>
        </FormControl>
        <FormControl>
          <FormLabel>레벨</FormLabel>
          <Controller
            control={control}
            name={`deck.${index}.level`}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 1))}
                size="sm"
                min={1}
                max={50}
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
        <Controller
          control={control}
          name={`deck.${index}.isFriendship`}
          render={({ field: { ref, onChange, value } }) => {
            return <Checkbox ref={ref} onChange={onChange} isChecked={value}>
              우정 트레이닝
            </Checkbox>;
          }}
        />
      </Stack>
    </Box>
  );
};

export default SupportCardForm;
