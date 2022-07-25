import { Box, Button, Center, Stack, useDisclosure } from "@chakra-ui/react";
import { Gene, getCharacterName } from "@uma-calc/core";
import React from "react";
import GeneModal from "./GeneModal";
import Navbar from "./Navbar";

const App: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [root, setRoot] = React.useState<Gene>({
    charaId: 1026, // 미호노 부르봉
    blueStat: {
      type: "speed",
      value: 3,
    },
    redStat: {
      type: "grass",
      value: 3,
    },
    whiteStats: [],
    gpScore: 0,
  });

  const handleModalClose = (data?: Gene) => {
    console.log(data);
    onClose();
  };

  // const getGeneTree = () => {
  //   function rec(gene: Gene, x: number, y: ) {
  //     return <Center position={"relative"} top></Center>
  //   }
  // }

  return (
    <>
      <Navbar />
      <Stack padding={4} spacing={4}>
        <Box
          padding={4}
          borderColor="gray.100"
          borderWidth={1}
          borderRadius={4}
        >
          <Center
            width={48}
            height={48}
            padding={4}
            borderColor="gray.100"
            borderWidth={1}
            borderRadius={4}
          >
            {getCharacterName(root.charaId)}
          </Center>
        </Box>
        <Button onClick={onOpen}>Open</Button>
        <GeneModal isOpen={isOpen} onClose={handleModalClose}></GeneModal>
      </Stack>
    </>
  );
};

export default App;
