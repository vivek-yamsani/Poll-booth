import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  IconButton,
  Input,
  InputLeftElement,
  InputRightElement,
  Spacer,
  VStack,
  Heading,
  InputGroup,
  Flex,
  Center,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import useAxios from "../config/axios";
import { useUserContext } from "../config/userContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isVisible, setVisible] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  function EyeButton() {
    return <>{isVisible ? <FiEye /> : <FiEyeOff />}</>;
  }

  const { login, isLoggedIn } = useUserContext();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/teams", { replace: true });
    }
  }, [isLoggedIn]);
  const axios = useAxios();
  const submit = async (values) => {
    try {
      console.log(values);
      const data = await axios({
        url: "/auth/login",
        method: "post",
        data: values,
      });
      console.log(data);
      console.log(data.token);
      login(data.token, data.user);
      toast({
        description: "Successfully Logged In...!",
      });
      navigate("/teams");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex w={"full"} h={"400px"} alignItems="center" flexDir={"column"} mt={40}>
      <Center w="full" h={"full"}>
        <form onSubmit={handleSubmit(submit)}>
          <VStack w={"xl"} spacing={6}>
            <Spacer />
            <Heading fontSize={"3xl"}>Login</Heading>
            <FormControl isInvalid={errors.email || errors.password} w="full">
              <FormLabel htmlFor="email">Email</FormLabel>
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
            </FormControl>
            <Spacer />
            <Button type="submit" size={"lg"} w="full">
              Login
            </Button>
            <Link
              color={"gray.400"}
              href="/SignUp"
              w={"full"}
              textAlign="center"
            >
              Don't have an account?
            </Link>
          </VStack>
        </form>
      </Center>
    </Flex>
  );
}

export default LoginForm;
