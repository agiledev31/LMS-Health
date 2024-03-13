import { httpClient } from "../config/axiosConfig";
export const setAccessToken = (token) => {
  localStorage.setItem("ACCESS_TOKEN",token);
};
export const getAccessToken = () => localStorage.getItem("ACCESS_TOKEN");

export const refreshAccessToken = async () => {
  const response = await httpClient.get("/auth/refresh");
  const { accessToken } = response.data;
  setAccessToken(accessToken);
};