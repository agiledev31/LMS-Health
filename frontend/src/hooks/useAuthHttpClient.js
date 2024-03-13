import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const useAuthHttpClient = (sendFormData) => {
  const [token, setToken] = useState();
  const { getAccessTokenSilently } = useAuth0();

  const authHttpClient = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}/api`,
    withCredentials: false,
    headers: {
      "Content-Type": sendFormData ? "multipart/form-data" : "application/json",
    },
  });

  authHttpClient.interceptors.request.use(
    async (config) => {
      let accessToken = token;
      if (!accessToken) {
        accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          },
        });
        setToken(accessToken);
      }
      config.headers["authorization"] = `Bearer ${accessToken}`;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  authHttpClient.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        error.response.data.message === "Unauthorized!"
      ) {
        const accessToken = await await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          },
        });
        setToken(accessToken);
        originalRequest.headers["authorization"] = `Bearer ${accessToken}`;
        return authHttpClient.request(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return authHttpClient;
};
export default useAuthHttpClient;
