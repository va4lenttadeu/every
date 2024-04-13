import { User } from "@repo/database";
import { AuthenticationError, AuthorizationError } from "../../shared/errors";
import { AuthHelpers } from "../authHelpers";
import { AuthRepository } from "../authRepository";
import { AuthService } from "../authService";

jest.mock("../authService", () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    getAuthenticatedUser: jest.fn(),
  })),
}));

describe("AuthHelpers", () => {
  let authService: AuthService;
  let authHelpers: AuthHelpers;
  const user: Partial<User> = { id: "1" };

  beforeEach(() => {
    authService = new AuthService({} as AuthRepository);
    authHelpers = new AuthHelpers(authService);
  });

  describe("getAuthenticatedUser", () => {
    it("should return authenticated user when valid token is provided", async () => {
      const user = { id: 1, name: "John Doe" };
      const token = "valid_token";
      (authService.getAuthenticatedUser as jest.Mock).mockResolvedValue(user);

      const result = await authHelpers.getAuthenticatedUser(token);

      expect(result).toEqual(user);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(token);
    });

    it("should return null when invalid token is provided", async () => {
      const token = "invalid_token";
      (authService.getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

      const result = await authHelpers.getAuthenticatedUser(token);

      expect(result).toBeNull();
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(token);
    });
  });

  describe("assertAuthorization", () => {
    it("should throw AuthenticationError when user is null", () => {
      const user = null;
      const callback = jest.fn();

      expect(() =>
        authHelpers.assertAuthorization(user, callback)
      ).toThrowError(AuthenticationError);
      expect(callback).not.toHaveBeenCalled();
    });

    it("should throw AuthorizationError when callback returns false", () => {
      const callback = jest.fn().mockReturnValue(false);

      expect(() =>
        authHelpers.assertAuthorization(user as User, callback)
      ).toThrowError(AuthorizationError);
      expect(callback).toHaveBeenCalledWith(user);
    });

    it("should not throw error when callback returns true", () => {
      const callback = jest.fn().mockReturnValue(true);

      expect(() =>
        authHelpers.assertAuthorization(user as User, callback)
      ).not.toThrow();
      expect(callback).toHaveBeenCalledWith(user);
    });

    it("should not throw error when no callback is provided and user is not null", () => {
      expect(() => authHelpers.assertAuthorization(user as User)).not.toThrow();
    });
  });
});
