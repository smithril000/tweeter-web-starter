import { Status } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusItem from "../statusItem/StatusItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoList } from "../userInfo/UserInfoHooks";
import {
  StatusItemView,
  StatusItemPresenter,
} from "../../presenter/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  featureURL: string;
  // itemDescription: string;
  // loadMore: (
  //   authToken: AuthToken,
  //   userAlias: string,
  //   pageSize: number,
  //   lastItem: Status | null,
  // ) => Promise<[Status[], boolean]>;

  presenterFactory: (listener: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<Status | null>(null);
  const navigate = useNavigate();

  // const addItems = (newItems: Status[]) =>
  //   setItems((previousItems) => [...previousItems, ...newItems]);

  const { displayedUser, authToken } = useUserInfoList();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: StatusItemView = {
    addItems: (newItems: Status[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<StatusItemPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef
        .current!.getUser(authToken!, displayedUserAliasParam!)
        .then((toUser) => {
          if (toUser) {
            setDisplayedUser(toUser);
          }
        });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    // setLastItem(() => null);
    // setHasMoreItems(() => true);
    presenterRef.current!.reset();
  };
  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  // const loadMoreItems = async (lastItem: Status | null) => {
  //   try {
  //     const [newItems, hasMore] = await props.loadMore(
  //       authToken!,
  //       displayedUser!.alias,
  //       PAGE_SIZE,
  //       lastItem,
  //     );

  //     setHasMoreItems(() => hasMore);
  //     setLastItem(() => newItems[newItems.length - 1]);
  //     addItems(newItems);
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to load story items because of exception: ${error}`,
  //     );
  //   }
  // };

  // const navigateToUser = useNavigateToUser(props.featureURL);

  // const extractAlias = (value: string): string => {
  //   const index = value.indexOf("@");
  //   return value.substring(index);
  // };

  // const getUser = async (
  //   authToken: AuthToken,
  //   alias: string,
  // ): Promise<User | null> => {
  //   // TODO: Replace with the result of calling server
  //   return FakeData.instance.findUserByAlias(alias);
  // };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems()}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem status={item} path={props.featureURL} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
