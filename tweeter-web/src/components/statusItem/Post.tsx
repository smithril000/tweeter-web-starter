import { Link, useNavigate } from "react-router-dom";
import { AuthToken, Status, Type, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoList } from "../userInfo/UserInfoHooks";
import { UserService } from "../../model.service/UserService";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfoList();
  const { setDisplayedUser } = useUserInfoActions();
  const service = new UserService();

  const navigate = useNavigate();
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const toUser = await service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${props.featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={`${props.featurePath}/${segment.text}`}
            onClick={navigateToUser}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        ),
      )}
    </>
  );
};

export default Post;
