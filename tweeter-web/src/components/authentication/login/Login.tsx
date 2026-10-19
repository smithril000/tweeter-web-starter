import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import AuthFields from "../fields/AuthFields";
import { useAuthCredentials } from "../AuthCredentialsContext";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { UserService } from "../../../model.service/UserService";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { alias, password, setAlias, setPassword, clearCredentials } =
    useAuthCredentials();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const userService = new UserService();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    try {
      setIsLoading(true);

      const [user, authToken] = await login(alias, password);

      updateUserInfo(user, user, authToken, rememberMe);
      clearCredentials();

      if (!!props.originalUrl) {
        navigate(props.originalUrl);
      } else {
        navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    const user = await userService.getFirstUser();

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, await userService.getFirstAuth()];
  };

  const inputFieldFactory = () => {
    return (
      <AuthFields
        onClick={loginOnEnter}
        alias={alias}
        password={password}
        setAlias={setAlias}
        setPassword={setPassword}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
