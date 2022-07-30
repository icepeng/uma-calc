import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from '@chakra-ui/react';

import { db } from '@uma-calc/core';
import React from 'react';

const sortedPlayableCharacters = db.playableCharacters
  .filter((character) => character.release_ko)
  .sort((a, b) => b.release_ko!.localeCompare(a.release_ko!));

const PlayableCardModal: React.FC<{
  isOpen: boolean;
  onClose: (data?: { id: number }) => void;
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
                key={card_id}
                cursor="pointer"
                boxSize="150px"
                border="1px"
                borderColor="gray.100"
                borderRadius="4"
                alt={card_id.toString()}
                src={`/img/${card_id}.png`}
                onClick={() =>
                  onClose({
                    id: card_id,
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

export default PlayableCardModal;
