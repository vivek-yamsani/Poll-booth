import {
  VStack,
  HStack,
  useColorModeValue,
  Text,
  Spacer,
  Stat,
  StatNumber,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAxios from "../config/axios";

export default function Results({ pollId, teamId }) {
  const [result, setResults] = useState();
  const [isLoading, setLoading] = useState(false);

  const bg = useColorModeValue("gray.200", "gray.900");

  const axios = useAxios();

  const fetch = async () => {
    try {
      setLoading(true);
      setResults(
        await axios({
          url: `/teams/${teamId}/polls/${pollId}/results`,
          method: "get",
        })
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
  console.log(result);
  return (
    <>
      {isLoading && <Text>Loading...</Text>}
      {!isLoading && result && (
        <VStack spacing={4} w={"lg"}>
          {!result?.length && (
            <Text fontWeight={"semibold"} fontSize={"lg"}>
              There are no options for this poll
            </Text>
          )}
          {result?.map((opt) => {
            return (
              <HStack
                w={"full"}
                bgColor={bg}
                p={4}
                borderRadius={"lg"}
                key={opt.content}
                id={opt.content}
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
                <Text>No of Votes: </Text>
                <Stat>
                  <StatNumber>{opt.count}</StatNumber>
                </Stat>
              </HStack>
            );
          })}
        </VStack>
      )}
    </>
  );
}
