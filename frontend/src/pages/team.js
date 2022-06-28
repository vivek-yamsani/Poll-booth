import {
  Button,
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Tooltip,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../config/axios";
import { useUserContext } from "../config/userContext";
import TeamCard from "../components/teamCard";
import NewTeamForm from "../components/forms/newTeam";
import { FaRedoAlt } from "react-icons/fa";

function Teams() {
  const { user } = useUserContext();

  const { isOpen, onClose, onToggle } = useDisclosure();

  const axios = useAxios();

  const navigate = useNavigate();

  const [data, setData] = useState();

  const [isLoading, setLoading] = useState(false);

  async function fetch() {
    try {
      setLoading(true);
      setData(
        await axios({
          url: "/teams/",
          method: "get",
        })
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(function () {
    fetch();
  }, []);

  return (
    <>
      <Center>
        <Box
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          w={"fit-content"}
        >
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create a new Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <NewTeamForm />
              </ModalBody>
            </ModalContent>
          </Modal>
          <HStack minW={"full"} ml={4} mr={4} mt={4} mb={4}>
            <Heading
              fontWeight={"semibold"}
              textAlign={"center"}
              fontSize={"2xl"}
            >
              Welcome, {user.name}
            </Heading>
            <Spacer />
            <Button size={"lg"} onClick={onToggle}>
              Create Team
            </Button>
            <Tooltip label="Refresh">
              <IconButton
                size={"lg"}
                icon={<FaRedoAlt />}
                aria-label="Refresh"
                onClick={fetch}
              />
            </Tooltip>
          </HStack>
          {isLoading && (
            <Text mt={"100px"} textAlign={"center"}>
              Loading...
            </Text>
          )}
          <SimpleGrid spacing={5} columns={data?.length ? 2 : 1}>
            {data?.length ? (
              data.map((team) => {
                return (
                  <TeamCard
                    name={team.name}
                    id={team.id}
                    key={team.id}
                    onClick={() =>
                      navigate(`/teams/${team.id}`, { replace: true })
                    }
                  />
                );
              })
            ) : (
              <Text
                mt={"100px"}
                textAlign={"center"}
                fontWeight={"extrabold"}
                fontSize={"lg"}
              >
                You Have no Teams...
              </Text>
            )}
          </SimpleGrid>
        </Box>
      </Center>
    </>
  );
}

export default Teams;
