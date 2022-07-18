import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";

const Links: string[] = [];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      px={4}
      borderBottom={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Box fontFamily={"heading"} fontWeight={"bold"}>
            UmaCalc
          </Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
