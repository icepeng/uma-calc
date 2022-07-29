import {
  Box,
  Center,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from '@chakra-ui/react';

import { db } from '@uma-calc/core';
import { getRegExp } from 'korean-regexp';
import React, { ChangeEvent } from 'react';
import { renderType } from '../pipe';

const sortedCardRegexs = db.supportCards
  .filter((x) => x.release_ko)
  .sort((a, b) => {
    const rarityComp = b.rarity - a.rarity;
    if (rarityComp !== 0) {
      return rarityComp;
    }

    const typeComp = b.type.localeCompare(a.type);
    if (typeComp !== 0) {
      return typeComp;
    }

    return b.name_ko.localeCompare(a.type);
  })
  .map((x) => ({ ...x, name_ko_exp: getRegExp(x.name_ko) }));

export const SupportCardModal: React.FC<{
  isOpen: boolean;
  onClose: (data?: { id: number }) => void;
}> = ({ isOpen, onClose }) => {
  const [supportCards, setSupportCards] = React.useState(sortedCardRegexs);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSupportCards(
      sortedCardRegexs.filter(
        (x) =>
          x.name_ko.search(
            getRegExp(query, {
              initialSearch: true,
              ignoreSpace: true,
            })
          ) !== -1
      )
    );
  }

  function handleModalClose() {
    setSupportCards(sortedCardRegexs);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>서포트카드 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input marginBottom={4} onChange={handleInputChange}></Input>
          <SimpleGrid columns={4} spacing={2.5} justifyItems="center">
            {supportCards.map(({ support_id, name_ko, type }) => (
              <Center position={'relative'} flexDirection="column">
                <Image
                  boxSize="128px"
                  alt={support_id.toString()}
                  src={`/img/supports/${support_id}.png`}
                  onClick={() =>
                    onClose({
                      id: support_id,
                    })
                  }
                />
                {name_ko}
                {renderType(type)}
              </Center>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupportCardModal;
