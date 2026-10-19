import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { StatusService } from "../model.service/StatusService";
import { PAGE_SIZE } from "./FolloweePresenter";

export class FeedItemPresenter extends StatusItemPresenter {
  private service: StatusService;
  constructor(listener: StatusItemView) {
    super(listener);
    this.service = new StatusService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFeedItems(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load feed items because of exception: ${error}`,
      );
    }
  }
}
