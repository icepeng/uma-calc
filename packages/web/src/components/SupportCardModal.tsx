import {
  Box,
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
import React from 'react';
import { renderSupportCard } from '../pipe';

const sortedCards = db.supportCards
  .filter((x) => x.release_ko)
  .sort((a, b) => {
    const typeComp: number = b.type.localeCompare(a.type);
    if (typeComp !== 0) {
      return typeComp;
    }

    const rarityComp: number = b.rarity - a.rarity;
    if (rarityComp !== 0) {
      return rarityComp;
    }

    return b.name_ko.localeCompare(a.type);
  })
  .map((x) => ({ ...x, name_ko_exp: getRegExp(x.name_ko) }));

export const SupportCardModal: React.FC<{
  isOpen: boolean;
  onClose: (data?: { id: number }) => void;
}> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState('');
  const initialRef = React.useRef(null);
  const cards = React.useMemo(
    () =>
      sortedCards.filter(
        (x) =>
          x.name_ko.search(
            getRegExp(query, {
              initialSearch: true,
              ignoreSpace: true,
            })
          ) !== -1
      ),
    [query]
  );

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>서포트카드 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            ref={initialRef}
            value={query}
            marginBottom={2}
            onChange={(e) => setQuery(e.currentTarget.value)}
          ></Input>
          <Box maxH="600px" overflowY="scroll">
            <SimpleGrid
              columns={4}
              spacing={2.5}
              padding={3}
              justifyItems="center"
              overflow={'visible'}
            >
              {cards.map(({ support_id }) =>
                renderSupportCard(support_id, () =>
                  onClose({
                    id: support_id,
                  })
                )
              )}
            </SimpleGrid>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupportCardModal;
