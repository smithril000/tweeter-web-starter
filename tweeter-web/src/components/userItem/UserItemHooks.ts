import { AuthToken, User } from "tweeter-shared";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoList } from "../userInfo/UserInfoHooks";
import { UserService } from "../../model.service/UserService";

export const useExtractAlias = () => {
  return (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };
};

export const useGetUser = () => {
  const service = new UserService();
  return async (authToken: AuthToken, alias: string): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return service.getUser(authToken, alias);
  };
};

export const useNavigateToUser = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfoList();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const extractAlias = useExtractAlias();
  const getUser = useGetUser();

  return async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());
      const toUser = await getUser(authToken!, alias);

      if (toUser && !toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };
};
