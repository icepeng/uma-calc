import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { characters, Gene } from "@uma-calc/core";
import React from "react";
import { useForm } from "react-hook-form";

interface GeneForm {
  charaId: number;
  blueStatType: string;
  redStatType: string;
}

const GeneModal: React.FC<{
  isOpen: boolean;
  onClose: (data?: Gene) => void;
}> = ({ isOpen, onClose }) => {
  const { register, getValues } = useForm<GeneForm>();

  const handleSave = () => {
    const { charaId, blueStatType, redStatType } = getValues();
    onClose({
      charaId,
      blueStat: {
        type: blueStatType,
        value: 3,
      },
      redStat: {
        type: redStatType,
        value: 3,
      },
      whiteStats: [],
      gpScore: 0,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>캐릭터</FormLabel>
            <Select {...register("charaId")}>
              {characters
                .filter((char) => char.playable && char.name_ko)
                .map((char) => (
                  <option key={char.char_id} value={char.char_id}>
                    {char.name_ko}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>청인자</FormLabel>
            <Select {...register("blueStatType")}>
              {["스피드", "스태미너", "파워", "근성", "지능"].map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>적인자</FormLabel>
            <Select {...register("redStatType")}>
              {[
                "단거리",
                "마일",
                "중거리",
                "장거리",
                "잔디",
                "더트",
                "도주",
                "선행",
                "선입",
                "추입",
              ].map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneModal;
