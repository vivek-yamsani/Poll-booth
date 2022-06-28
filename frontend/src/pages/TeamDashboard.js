import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Box,
  InputGroup,
  Input,
  Spacer,
  useDisclosure,
  useToast,
  Text,
  VStack,
  useColorModeValue,
  IconButton,
  SimpleGrid,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FiTrash, FiUserPlus } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import PollCard from "../components/pollCard";
import { FaRedoAlt } from "react-icons/fa";
import useAxios from "../config/axios";
import NewPollForm from "../components/forms/newPollForm";

function TeamDashboard() {
  let { teamId } = useParams();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const axios = useAxios();
  const [newMember, setnW] = useState("");

  const { isOpen, onClose, onToggle } = useDisclosure();

  const [Open, setOpen] = useState(false);

  const navigate = useNavigate();

  const makeAdmin = async (id) => {
    try {
      const data = { userId: parseInt(id) };
      await axios({
        url: `/teams/${teamId}/makeAdmin`,
        method: "post",
        data,
      });
      toast({
        description: "Successfully made Admin ",
      });
      fetch();
    } catch (err) {
      console.log(err);
    }
  };

  const fetch = async () => {
    try {
      setLoading(true);
      setData(
        await axios({
          url: `/teams/${teamId}/`,
        })
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setData(null);
      setLoading(false);
    }
  };

  const toast = useToast();

  const add = async () => {
    try {
      const data = { email: newMember };
      console.log(data);
      await axios({
        url: `/teams/${teamId}/add`,
        method: "post",
        data,
      });
      toast({
        description: "Successfully added " + newMember,
      });
      fetch();
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async (id) => {
    try {
      //   console.log(id);
      await axios({
        url: `/teams/${teamId}/remove`,
        method: "post",
        data: { userId: parseInt(id) },
      });
      toast({
        description: "Successfully removed...!",
      });
      fetch();
    } catch (err) {
      console.log(err);
    }
  };

  const bg = useColorModeValue("gray.200", "gray.900");

  useEffect(() => {
    fetch();
    console.log(data);
  }, []);

  return (
    <>
      {isLoading && <Heading>Loading...</Heading>}
      {!isLoading && data && (
        <VStack>
          <HStack py={4} px={5} w={"full"}>
            <Breadcrumb
              spacing={4}
              separator={<FaChevronRight color={"gray.500"} />}
            >
              <BreadcrumbItem href={"/teams"}>
                <BreadcrumbLink
                  href="/teams"
                  fontWeight={"semibold"}
                  fontSize={"2xl"}
                >
                  Teams
                </BreadcrumbLink>{" "}
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink fontWeight={"semibold"} fontSize={"2xl"}>
                  {data.team.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Spacer />
            <Button bgColor={"purple.500"} size={"lg"} onClick={onToggle}>
              Members
            </Button>
            <Drawer isOpen={isOpen} onClose={onClose} size={"sm"}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Team Members</DrawerHeader>
                <DrawerBody>
                  <VStack spacing={5} alignItems={"start"} m={4}>
                    <InputGroup>
                      <Input
                        type={"text"}
                        placeholder={"New Member's Email ID"}
                        onChange={(e) => setnW(e.target.value)}
                        mr={"4px"}
                      />
                      <Button onClick={add}>ADD</Button>
                    </InputGroup>
                    <Heading fontSize={"xl"}>Admins</Heading>
                    {data?.team?.admins.map((admin) => {
                      return (
                        <HStack
                          w={"full"}
                          bgColor={bg}
                          p={5}
                          borderRadius={"lg"}
                          key={admin.id}
                          id={admin.id}
                        >
                          <Text fontSize={"lg"} fontWeight={"semibold"}>
                            {admin.name}
                          </Text>
                          <Spacer />
                        </HStack>
                      );
                    })}
                    <Heading fontSize={"xl"}>Members</Heading>
                    {data?.team?.members?.map((member) => {
                      // console.log(member.id);
                      return (
                        <HStack
                          w={"full"}
                          bgColor={bg}
                          p={4}
                          borderRadius={"lg"}
                          key={member.id}
                        >
                          <Text fontSize={"lg"} fontWeight={"semibold"}>
                            {member.name}
                          </Text>
                          <Spacer />
                          {data.isAdmin && (
                            <IconButton
                              id={member.id}
                              onClick={(e) => {
                                //   console.log("e.target.id", e.target, e.target);
                                makeAdmin(e.target.id);
                              }}
                              color={"green.400"}
                              icon={<FiUserPlus id={member.id} />}
                            />
                          )}
                          {data.isAdmin && (
                            <IconButton
                              id={member.id}
                              onClick={(e) => {
                                //   console.log("e.target.id", e.target, e.target);
                                remove(e.target.id);
                              }}
                              color={"red.400"}
                              icon={<FiTrash id={member.id} />}
                            />
                          )}
                        </HStack>
                      );
                    })}
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </HStack>
          <Modal isOpen={Open} onClose={() => setOpen(!Open)}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalHeader fontWeight={"bold"} fontSize={"lg"}>
                Create a Poll
              </ModalHeader>
              <ModalBody>
                <NewPollForm teamId={teamId} />
              </ModalBody>
            </ModalContent>
          </Modal>
          <Box w={"fit-content"} display={"flex"} flexDir={"column"}>
            <HStack minW={"full"}>
              <Heading fontSize={"xl"} mr={[10, 40]} fontWeight="bold">
                Here are the {data.team.name}'s Polls
              </Heading>
              <Spacer />
              {data.isAdmin && (
                <>
                  <Button size={"lg"} onClick={() => setOpen(!Open)}>
                    Create Poll
                  </Button>
                </>
              )}
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
            <SimpleGrid spacing={5} columns={data?.length !== 0 ? 2 : 1} p={4}>
              {data?.team?.polls?.length ? (
                data.team.polls.map((poll) => {
                  return (
                    <PollCard
                      title={poll.title}
                      id={poll.id}
                      key={poll.id}
                      onClick={() =>
                        navigate(`/polls/${teamId}/${poll.id}/`, {
                          replace: true,
                        })
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
                  You Have no Polls...
                </Text>
              )}
            </SimpleGrid>
          </Box>
        </VStack>
      )}
    </>
  );
}

export default TeamDashboard;
