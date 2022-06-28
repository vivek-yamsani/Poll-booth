import {
  Button,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
  Text,
} from "@chakra-ui/react";
import { FiChevronDown, FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUserContext } from "../config/userContext";

function NavBar() {
  const { isLoggedIn, user, logout } = useUserContext();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack
      w={"full"}
      h={"73px"}
      spacing={4}
      borderBottom={"1px"}
      borderColor={"gray.700"}
      py={4}
      px={[4, 8, 16, 32, 64]}
    >
      <Link to={"/"}>
        <Heading fontSize={"2xl"}>EPOLL</Heading>
      </Link>
      <Spacer />
      <HStack spacing={4}>
        <IconButton
          icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
          onClick={toggleColorMode}
        />
        {isLoggedIn && (
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />}>
              {user.name}
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Text fontWeight={"semibold"} fontSize={"lg"}>
                  Hey , {user.name}
                </Text>
              </MenuItem>
              <MenuItem onClick={logout}>
                <Text fontWeight={"semibold"} fontSize={"lg"}>
                  Logout
                </Text>
                <Spacer />
                <FiLogOut />
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </HStack>
  );
}

export default NavBar;
