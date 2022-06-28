import { Text, useColorModeValue, VStack } from "@chakra-ui/react";

const PollCard = ({ title, onClick, id }) => {
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
        Title
      </Text>
      <Text fontWeight={"semibold"} fontSize={"2xl"} textAlign={"center"}>
        {title}
      </Text>
    </VStack>
  );
};

export default PollCard;
