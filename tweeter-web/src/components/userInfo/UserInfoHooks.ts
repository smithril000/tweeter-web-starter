import { useContext } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";

export const useUserInfoList = () => {
  return useContext(UserInfoContext);
};

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};
