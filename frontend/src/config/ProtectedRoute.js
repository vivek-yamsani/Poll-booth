import { useToast } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "./userContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUserContext();
  const toast = useToast();
  if (!isLoggedIn) {
    toast({
      description: "Please Login",
      status: "error",
    });
    return (
      <>
        <Navigate to={"/signIn"} replace={true} />
      </>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
