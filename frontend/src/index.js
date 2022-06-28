import React from "react";
import ReactDOM from "react-dom/client";
import UserProvider from "./config/userContext";
import { ChakraProvider } from "@chakra-ui/react";
import Router from "./config/router";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";

const root = ReactDOM.createRoot(document.getElementById("root"));
localStorage.setItem("chakra-ui-color-mode", "dark");
root.render(
  <ChakraProvider colorMode={"dark"}>
    <BrowserRouter>
      <UserProvider>
        <NavBar />
        <Router />
      </UserProvider>
    </BrowserRouter>
  </ChakraProvider>
);
