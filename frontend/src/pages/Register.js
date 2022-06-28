import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  IconButton,
  Input,
  Text,
  InputLeftElement,
  InputRightElement,
  Spacer,
  VStack,
  useToast,
  Heading,
  InputGroup,
  Flex,
  Center,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { useForm } from "react-hook-form";
import useAxios from "../config/axios";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [isVisible, setVisible] = useState(false);

  function EyeButton() {
    return <>{isVisible ? <FiEye /> : <FiEyeOff />}</>;
  }
  const toast = useToast();
  const axios = useAxios();
  const submit = async (values) => {
    try {
      console.log(values);
      await axios({
        url: "/auth/signup",
        method: "post",
        data: values,
      });
      toast({
        description: "Successfully signed up ...!",
      });
      navigate("/signIn");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex w={"full"} h={"400px"} alignItems="center" flexDir={"column"} mt={40}>
      <Center w="full" h={"full"}>
        <form onSubmit={handleSubmit(submit)} width={"500px"}>
          <VStack w={"xl"} spacing={16}>
            <Spacer />
            <Heading fontSize={"3xl"}>Register</Heading>
            <FormControl
              isInvalid={errors.email || errors.password || errors.name}
              w="full"
            >
              <FormLabel htmlFor="name">Name</FormLabel>
              <InputGroup w={"full"}>
                <InputLeftElement
                  pointerEvents={"none"}
                  children={<FiUser />}
                />
                <Input
                  id="name"
                  type={"text"}
                  variant={"filled"}
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup w={"full"}>
                <InputLeftElement
                  pointerEvents={"none"}
                  children={<FiMail />}
                />
                <Input
                  id="email"
                  type={"email"}
                  placeholder="you@example.com"
                  variant={"filled"}
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Must be a valid email",
                    },
                  })}
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup w={"full"}>
                <Input
                  id="password"
                  type={isVisible ? "text" : "password"}
                  variant={"filled"}
                  {...register("password", {
                    required: "This is a must field",
                    minLength: {
                      value: 6,
                      message: "Min 6 characters should be present",
                    },
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$.,/;:]).{6,}$/,
                      message: "Invalid password",
                    },
                  })}
                />
                <InputLeftElement
                  pointerEvents={"none"}
                  children={<FiLock />}
                />
                <InputRightElement
                  children={
                    <IconButton
                      onClick={() => {
                        setVisible(!isVisible);
                      }}
                      icon={<EyeButton />}
                    />
                  }
                />
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
              <Text fontSize={16} fontWeight={"medium"} textColor={"gray.500"} >
                Password must contain atleast one digit,Uppercase
                letter,Lowercase letter,Special characters[!@#$.,/;:]
              </Text>
            </FormControl>
            <Spacer />
            <Button type="submit" size={"lg"} w="full">
              Sign Up
            </Button>
            <Link
              color={"gray.400"}
              href="/SignIn"
              w={"full"}
              textAlign="center"
            >
              Already had an account?
            </Link>
          </VStack>
        </form>
      </Center>
    </Flex>
  );
}

export default RegisterForm;
