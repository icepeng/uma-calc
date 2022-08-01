import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
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
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { handleNumber, renderSupportCard } from '../pipe';
import SupportCardModal from './SupportCardModal';

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
          <FormLabel>서포트 카드</FormLabel>
          {getValues(`deck.${index}.id`) === -1 ? (
            <Center
              boxSize={'150px'}
              _hover={{ backgroundColor: 'gray.100' }}
              margin={[0, 'auto']}
              cursor={'pointer'}
              borderRadius={4}
              onClick={onOpen}
            >
              <AddIcon aria-label="SelectSupportCard" />
            </Center>
          ) : (
            renderSupportCard(getValues(`deck.${index}.id`), onOpen)
          )}
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
            return (
              <Checkbox ref={ref} onChange={onChange} isChecked={value}>
                우정 트레이닝
              </Checkbox>
            );
          }}
        />
      </Stack>
    </Box>
  );
};

export default SupportCardForm;
