import { createContext, useContext, useEffect } from "react";

import { isAxiosError } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import useAuthHttpClient from "../hooks/useAuthHttpClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { user, logout } = useAuth0();
  // const [user, setUser] = useState();
  const authHttpClient = useAuthHttpClient();

  useEffect(() => {
    if (user?.sub) {
      authHttpClient
        .post("/auth/updateUser", {
          userData: user,
        })
        .then((res) => {
          console.log(res.data);
        });
    }
  }, [user?.sub, authHttpClient]);

  const updateEducationalInformation = async (eduInfo) => {
    let err = "";
    try {
      await authHttpClient.post("/auth/educationalInfo", eduInfo);
      const aux_user = user;
      aux_user.completedEducationalInfo = true;
      // setUser(aux_user);
      localStorage.setItem("user", JSON.stringify(aux_user));
    } catch (error) {
      if (isAxiosError(error)) {
        err = error.response.data.error;
      } else {
        err = "Opps! Something Unexpected happens";
      }
    }
    return err;
  };
  const value = {
    user: { _id: user.sub.replace(/^auth0\|/i, ""), role: "user", ...user },
    logout,
    authHttpClient,
    updateEducationalInformation,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
