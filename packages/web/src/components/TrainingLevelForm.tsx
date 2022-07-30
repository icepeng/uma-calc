import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { handleNumber } from '../pipe';

const TrainingLevelForm: React.FC = () => {
  const { control, register } = useFormContext();
  const isSummerTraining = useWatch({ control, name: 'isSummerTraining' });

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Heading size={'sm'} marginBottom={4}>
        트레이닝 레벨
      </Heading>
      <Checkbox mb={4} {...register('isSummerTraining')}>
        여름 합숙
      </Checkbox>
      <Stack spacing={4} direction="row">
        <FormControl>
          <FormLabel>스피드</FormLabel>
          <Controller
            control={control}
            name={'trainingLevels.speed'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 1))}
                size="sm"
                min={1}
                max={5}
                isDisabled={isSummerTraining}
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
          <FormLabel>스태미나</FormLabel>
          <Controller
            control={control}
            name={'trainingLevels.stamina'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 1))}
                size="sm"
                min={1}
                max={5}
                isDisabled={isSummerTraining}
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
          <FormLabel>파워</FormLabel>
          <Controller
            control={control}
            name={'trainingLevels.power'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 1))}
                size="sm"
                min={1}
                max={5}
                isDisabled={isSummerTraining}
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
          <FormLabel>근성</FormLabel>
          <Controller
            control={control}
            name={'trainingLevels.guts'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 1))}
                size="sm"
                min={1}
                max={5}
                isDisabled={isSummerTraining}
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
          <FormLabel>지능</FormLabel>
          <Controller
            control={control}
            name={'trainingLevels.intelligence'}
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(handleNumber(value, 1))}
                size="sm"
                min={1}
                max={5}
                isDisabled={isSummerTraining}
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

export default TrainingLevelForm;
