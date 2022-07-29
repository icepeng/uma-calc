import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";

import { db } from "@uma-calc/core";
import React from "react";

const sortedPlayableCharacters = db.playableCharacters
  .filter((character) => character.release_ko)
  .sort((a, b) => b.release_ko!.localeCompare(a.release_ko!));

const CardModal: React.FC<{
  isOpen: boolean;
  onClose: (data?: { card_id: number }) => void;
}> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>우마무스메 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={3} spacing={2.5} justifyItems="center">
            {sortedPlayableCharacters.map(({ card_id }) => (
              <Image
                boxSize="150px"
                border="1px"
                borderColor="gray.100"
                borderRadius="4"
                alt={card_id.toString()}
                src={`/img/characters/${card_id}.png`}
                onClick={() =>
                  onClose({
                    card_id,
                  })
                }
              ></Image>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;
