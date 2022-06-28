import {
  InputGroup,
  InputLeftElement,
  Input,
  FormControl,
  FormErrorMessage,
  Button,
  Spinner,
  FormLabel,
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiType } from "react-icons/fi";
import useAxios from "../../config/axios";

function NewTeamForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isLoading, setLoading] = useState(false);
  const axios = useAxios();

  const submit = async (values) => {
    try {
      setLoading(true);
      await axios({
        url: "/teams/new",
        method: "post",
        data: values,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <VStack>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"} children={<FiType />} />
            <Input
              id="name"
              type={"text"}
              {...register("name", {
                required: "This is a must field",
              })}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
          <HStack w={"full"} mt={5}>
            <Spacer />
            <Button type={"submit"} size="lg" mt={"20px"}>
              Create{isLoading && <Spinner size={"lg"} />}
            </Button>
          </HStack>
        </FormControl>
      </VStack>
    </form>
  );
}

export default NewTeamForm;
