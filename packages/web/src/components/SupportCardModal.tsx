import {
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { db } from "@uma-calc/core";
import React from "react";
import { renderRarity, renderType } from "../pipe";

const sortedCards = db.supportCards
  .filter((card) => card.release_ko)
  .sort((a, b) => {
    const typeComp = b.type.localeCompare(a.type);
    if (typeComp !== 0) {
      return typeComp;
    }

    const rarityComp = b.rarity - a.rarity;
    if (rarityComp !== 0) {
      return rarityComp;
    }

    return b.name_ko.localeCompare(a.type);
  });

const SupportCardModal: React.FC<{
  isOpen: boolean;
  onClose: (data?: { id: number }) => void;
}> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState("");
  const initialRef = React.useRef(null);
  const cards = React.useMemo(
    () => sortedCards.filter((card) => card.name_ko.includes(query)),
    [query]
  );

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>서포트 카드 선택</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            ref={initialRef}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <List paddingX={0} maxH="400px" overflowY="scroll">
            {cards.map((card) => (
              <ListItem
                cursor={"pointer"}
                _hover={{ backgroundColor: "gray.100" }}
                key={card.support_id}
                onClick={() =>
                  onClose({
                    id: card.support_id,
                  })
                }
              >
                {renderRarity(card.rarity)} {card.name_ko} (
                {renderType(card.type)})
              </ListItem>
            ))}
          </List>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupportCardModal;
