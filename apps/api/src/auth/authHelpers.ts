import { User } from "@repo/database";
import { AuthService } from "./authService";
import { AuthenticationError, AuthorizationError } from "../shared/errors";

export type AuthContext = {
  user: User | null;
};

type AuthorizationCallback = ((user: User) => boolean) | undefined;

export class AuthHelpers {
  constructor(private authService: AuthService) {}

  getAuthenticatedUser(token: string): Promise<User | null> {
    return this.authService.getAuthenticatedUser(token);
  }

  assertAuthorization(
    user: User | null,
    callback: AuthorizationCallback = undefined
  ) {
    if (!user) {
      throw new AuthenticationError();
    }

    if (callback && !callback(user)) {
      throw new AuthorizationError();
    }
  }
}
