import axios from "axios";
import { useUserContext } from "./userContext";
import { useToast } from "@chakra-ui/react";

function useAxios() {
  const { token } = useUserContext();
  const toast = useToast();
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND,
    headers: {
      "content-type": "application/json",
      token: token,
    },
  });

  axiosInstance.interceptors.response.use(
    (res) => {
      console.log(res, res.data);
      return res.data;
    },
    (err) => {
      if (!err.response) {
        toast({
          description: "Server is not responding",
          status: "info",
        });
      } else {
        toast({
          description: err.response.data.message,
          status: "error",
        });
        throw err;
      }
    }
  );

  return axiosInstance;
}

export default useAxios;
