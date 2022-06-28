import {
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
  Button,
  HStack,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  ModalBody,
  Input,
  InputLeftElement,
  InputGroup,
  ModalFooter,
  IconButton,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../config/axios";
import { FiType, FiTrash, FiChevronRight } from "react-icons/fi";
import { FaRedoAlt } from "react-icons/fa";
import Results from "../components/Results";
import EditPollForm from "../components/forms/EditPollForm";

function Poll() {
  const { pollId, teamId } = useParams();
  const axios = useAxios();
  const toast = useToast();
  const [newOption, setN] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const [Open, setOpen] = useState(false);
  const [isVoted, setVoted] = useState(false);
  const [selected, setSelect] = useState("");
  const { isOpen, onClose, onToggle } = useDisclosure();

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const bg = useColorModeValue("gray.200", "gray.900"),
    bg1 = useColorModeValue("purple.200", "purple.400");

  const isAdm = async () => {
    try {
      setAdmin(
        await axios({
          url: `/teams/${teamId}/polls/${pollId}/isAdmin`,
          method: "post",
        })
      );
    } catch (err) {
      console.log(err);
      setAdmin(false);
    }
  };

  const isVot = async () => {
    try {
      setVoted(
        await axios({
          url: `/teams/${teamId}/polls/${pollId}/isVoted`,
          method: "post",
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async (content) => {
    try {
      await axios({
        url: `/teams/${teamId}/polls/${pollId}/deleteOption`,
        method: "delete",
        data: {
          content,
        },
      });
      toast({
        description: "Successfully deleted the Option " + newOption,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const add = async () => {
    try {
      await axios({
        url: `/teams/${teamId}/polls/${pollId}/addOption`,
        method: "post",
        data: {
          content: newOption,
        },
      });
      toast({
        description: "Succesfully added the Option " + newOption,
        status: "success",
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
          url: `/teams/${teamId}/polls/${pollId}/getOptions`,
        })
      );
      console.log(isLoading);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const vote = async () => {
    try {
      if (!selected) {
        toast({
          description: "Please Select an Option",
          status: "info",
        });
        return;
      }
      console.log(selected);
      await axios({
        url: `/teams/${teamId}/polls/${pollId}/vote`,
        method: "post",
        data: {
          content: selected,
        },
      });
      setVoted(true);
      toast({
        description: "Successfully Voted...",
        status: "success",
      });
    } catch (err) {
      console.log(err);
      setVoted(false);
    }
  };

  useEffect(() => {
    fetch();
    isAdm();
    isVot();
  }, []);

  useEffect(() => {
    console.log(
      new Date() < new Date(data?.poll?.expiresAt),
      new Date(),
      new Date(data?.poll?.expiresAt)
    );
  }, [data]);
  return (
    <>
      {isLoading && <Text>Loading...</Text>}
      {!isLoading && data && (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalHeader>Create option</ModalHeader>
              <ModalBody>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents={"none"}
                    children={<FiType />}
                  />
                  <Input
                    id="title"
                    type={"text"}
                    placeholder="Content of the option"
                    value={newOption}
                    onChange={(e) => setN(e.target.value)}
                  />
                </InputGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => {
                    add();
                    onToggle();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal isOpen={Open} onClose={() => setOpen(!Open)}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalHeader fontWeight={"bold"} fontSize={"lg"}>
                Edit Poll
              </ModalHeader>
              <ModalBody>
                <EditPollForm teamId={teamId} pollId={data.poll.id} />
              </ModalBody>
            </ModalContent>
          </Modal>
          <VStack w={"full"} spacing={4} p={4}>
            <HStack w={"full"}>
              <Breadcrumb
                spacing={4}
                separator={<FiChevronRight color={"gray.500"} />}
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
                  <BreadcrumbLink
                    fontWeight={"semibold"}
                    fontSize={"2xl"}
                    href={`/teams/${teamId}`}
                  >
                    {data.poll.team.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink fontWeight={"semibold"} fontSize={"2xl"}>
                    Title of the Poll : {data.poll.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <Spacer />
              {isAdmin && (
                <Button size={"lg"} onClick={(e) => setOpen(!Open)}>
                  Edit Poll
                </Button>
              )}
              <Tooltip label="Refresh">
                <IconButton
                  size={"lg"}
                  icon={<FaRedoAlt />}
                  aria-label="Refresh"
                  onClick={fetch}
                />
              </Tooltip>
              <Text fontStyle={"italic"}>
                Last UpdatedBy:
                <Text fontStyle={"italic"} fontWeight={"bold"}>
                  {data.poll.author.name}
                </Text>
              </Text>
            </HStack>
            <Text fontSize={"xl"} font fontWeight={"semibold"}>
              Description: {data.poll.description}
            </Text>
            <Tabs isLazy={true} align={"center"}>
              <TabList>
                <Tab>Vote</Tab>
                {isAdmin && <Tab>Results</Tab>}
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} w={"lg"}>
                    {!data.options.length && (
                      <Text fontWeight={"semibold"} fontSize={"lg"}>
                        There are no options for this poll
                      </Text>
                    )}
                    {data.options.map((opt) => {
                      return (
                        <HStack
                          w={"full"}
                          bgColor={opt.content === selected ? bg1 : bg}
                          p={4}
                          borderRadius={"lg"}
                          key={opt.content}
                          _hover={{
                            cursor: "pointer",
                          }}
                          id={opt.content}
                          onClick={(e) => {
                            setSelect(e.target.id);
                          }}
                        >
                          <Text
                            fontSize={"lg"}
                            fontWeight={"semibold"}
                            ml={"4"}
                            id={opt.content}
                          >
                            {opt.content}
                          </Text>
                          <Spacer id={opt.content} />
                          {isAdmin && (
                            <IconButton
                              id={opt.content}
                              onClick={(e) => {
                                //   console.log("e.target.id", e.target, e.target);
                                remove(e.target.id);
                              }}
                              color={"red.400"}
                              icon={<FiTrash id={opt.content} />}
                            />
                          )}
                        </HStack>
                      );
                    })}
                    <HStack>
                      {isAdmin && (
                        <Button onClick={onToggle}>Add Option</Button>
                      )}
                      {!isVoted && (
                        <Button
                          isDisabled={
                            new Date() > new Date(data?.poll?.expiresAt)
                          }
                          onClick={(e) => {
                            vote();
                          }}
                        >
                          VOTE
                        </Button>
                      )}
                    </HStack>
                    <Spacer />
                    <Text fontStyle={"italic"} fontWeight={"semibold"}>
                      <sup>*</sup>A User can vote only Once
                    </Text>
                    {new Date() > new Date(data?.poll?.expiresAt) && (
                      <Text
                        fontStyle={"italic"}
                        fontWeight={"semibold"}
                        bgColor={"red.300"}
                        bgClip={"text"}
                      >
                        Poll is Expired
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Results pollId={pollId} teamId={teamId} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </>
      )}
    </>
  );
}

export default Poll;
