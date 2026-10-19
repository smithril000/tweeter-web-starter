import { User } from "tweeter-shared/dist/model/domain/User";
import { FollowService } from "../model.service/FollowService";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";

export class UserInfoPresenter {
  service: FollowService;
  constructor() {
    this.service = new FollowService();
  }

  async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    return this.service.getIsFollowerStatus(authToken, user, selectedUser);
  }

  async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    return this.service.getFolloweeCount(authToken, user);
  }

  async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    return this.service.getFollowerCount(authToken, user);
  }
}
