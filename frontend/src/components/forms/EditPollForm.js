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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiType } from "react-icons/fi";
import useAxios from "../../config/axios";

function EditPollForm({ teamId, pollId }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isLoading, setLoading] = useState(false);
  const axios = useAxios();
  const toast = useToast();

  const submit = async (values) => {
    try {
      const expiresAt = new Date(
        parseInt(values.year),
        parseInt(values.month) - 1,
        parseInt(values.date)
      );
      if (new Date() > expiresAt) {
        toast({
          description: "Please Enter a valid Date or Date is already Passed",
          status: "error",
        });
        return;
      }
      setLoading(true);
      const data = await axios({
        url: `/teams/${teamId}/polls/${pollId}/edit`,
        method: "post",
        data: {
          title: values.title,
          description: values.description,
          expiresAt: expiresAt,
        },
      });
      setLoading(false);
      toast({
        description: data.data.message,
        status: "success",
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <VStack spacing={6} h={"full"} p={4}>
        <FormControl
          isInvalid={
            errors.title ||
            errors.description ||
            errors.year ||
            errors.month ||
            errors.date
          }
        >
          <FormLabel htmlFor="title">Title</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"} children={<FiType />} />
            <Input
              id="title"
              type={"text"}
              {...register("title", {
                required: "This is a must field",
              })}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
          <FormLabel htmlFor="title">Description</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents={"none"} children={<FiType />} />
            <Input
              id="description"
              type={"text"}
              {...register("description", {
                required: "This is a must field",
              })}
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.description && errors.description.message}
          </FormErrorMessage>
          <FormLabel htmlFor="expiresAt">Expires At</FormLabel>
          <HStack spacing={4}>
            <Input
              type={"number"}
              placeholder="YYYY"
              {...register("year", {
                min: 2022,
                max: 3000,
                required: "must field",
              })}
            />
            <FormErrorMessage>
              {errors.year && errors.year.message}
            </FormErrorMessage>
            <Input
              placeholder="MM"
              type={"number"}
              {...register("month", {
                min: 1,
                max: 12,
                required: "must field",
              })}
            />
            <FormErrorMessage>
              {errors.month && errors.month.message}
            </FormErrorMessage>
            <Input
              placeholder="DD"
              type={"number"}
              {...register("date", {
                min: 1,
                max: 31,
                required: "must field",
              })}
            />
          </HStack>
          <FormErrorMessage>
            {(errors.date || errors.month || errors.year) &&
              "Please Type a Valid Date"}
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

export default EditPollForm;
