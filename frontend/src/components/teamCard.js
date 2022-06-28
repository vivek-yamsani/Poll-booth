import { Text, useColorModeValue, VStack } from "@chakra-ui/react";

const TeamCard = ({ name, onClick, id }) => {
  return (
    <VStack
      px={8}
      py={4}
      spacing={1}
      align={"center"}
      minW={"400px"}
      rounded={"xl"}
      bgColor={useColorModeValue("gray.200", "gray.900")}
      shadow={"sm"}
      id={id}
      onClick={onClick}
      transition={"all .2s ease"}
      _hover={{ shadow: "xl", cursor: "pointer" }}
    >
      <Text fontWeight={"medium"} color={"purple.400"}>
        Team Name
      </Text>
      <Text fontWeight={"semibold"} fontSize={"2xl"} textAlign={"center"}>
        {name}
      </Text>
    </VStack>
  );
};

export default TeamCard;
