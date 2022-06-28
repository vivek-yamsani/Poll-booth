import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext();

function UserProvider({ children }) {
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (user) {
    console.log(user);
    if (typeof user == "string") {
      setUser(JSON.parse(user));
    }
  }

  const login = (jwt, user) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(jwt);
    setUser(user);
    setLoggedIn(true);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <userContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </userContext.Provider>
  );
}

export const useUserContext = () => useContext(userContext);

export default UserProvider;
