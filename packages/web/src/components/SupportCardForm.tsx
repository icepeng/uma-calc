import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { db } from "@uma-calc/core";
import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import SupportCardModal, { renderType } from "./SuppportCardModal";

const SupportCardForm: React.FC<{
  onChange?: (form: { id: number; level: number }) => void;
}> = ({ onChange }) => {
  const { register, control } = useForm<{ id: number; level: number }>({
    defaultValues: { level: 50 },
  });
  const value = useWatch({ control });

  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleModalClose(data?: { id: number }) {
    if (data) {
      value.id = data?.id;
    }
    onClose();
  }

  useEffect(() => {
    if (value.id && value.level) {
      onChange?.({ id: value.id, level: value.level });
    }
  }, [value]);

  return (
    <Box padding={4} borderColor="gray.100" borderWidth={1} borderRadius={4}>
      <Stack spacing={4} direction="column">
        <FormControl>
          <FormLabel>서포트 카드</FormLabel>
          <Center h={"174px"}>
            {/* 여기 어떻게 할 지 잘 모르겠음 겹쳐서 타입 띄우는거 자체를 고쳐야하나? */}
            <Center w={"150px"} flexDirection={"column"} position={"relative"}>
              {value.id === undefined ? (
                <IconButton
                  aria-label="SelectSupportCard"
                  onClick={onOpen}
                  icon={<AddIcon />}
                />
              ) : (
                <Image
                  boxSize="150px"
                  alt={value.id?.toString()}
                  src={`/img/supports/${value.id}.png`}
                  onClick={onOpen}
                />
              )}
              {db.supportCards.find((x) => x.support_id === value.id)?.name_ko}
              {renderType(
                db.supportCards.find((x) => x.support_id === value.id)?.type!
              )}
            </Center>
          </Center>
          <SupportCardModal
            isOpen={isOpen}
            onClose={handleModalClose}
          ></SupportCardModal>
        </FormControl>
        <FormControl>
          <FormLabel>레벨</FormLabel>
          <Controller
            control={control}
            name="level"
            render={({ field: { ref, onChange, ...restField } }) => (
              <NumberInput
                {...restField}
                onChange={(value) => onChange(+value)}
                size="sm"
                min={1}
                max={50}
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

export default SupportCardForm;
