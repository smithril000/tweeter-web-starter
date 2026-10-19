import { AuthToken, FakeData } from "tweeter-shared";
import { User } from "tweeter-shared/dist/model/domain/User";

export class UserService {
  // Implementation for user-related functionality
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
  public async getFirstUser(): Promise<User | null> {
    //TEMP FOR REGISTER WITH FAKE DATA
    return FakeData.instance.firstUser;
  }
  public async getFirstAuth(): Promise<AuthToken> {
    //TEMP FOR REGISTER WITH FAKE DATA
    return FakeData.instance.authToken;
  }
}
//last item
