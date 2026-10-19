import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export class PostPresenter {
  // Implementation for post-related functionality
  service: StatusService;

  constructor() {
    this.service = new StatusService();
  }

  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    await this.service.postStatus(authToken, status);
  }
}
