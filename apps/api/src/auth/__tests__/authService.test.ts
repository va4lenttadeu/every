import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SETTINGS } from "../../settings";
import { AuthRepository, PrismaAuthRepository } from "../authRepository";
import { AuthService } from "../authService";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../authRepository", () => ({
  PrismaAuthRepository: jest.fn().mockImplementation(() => ({
    createUser: jest.fn(),
    findUserByUsername: jest.fn(),
    findUserById: jest.fn(),
  })),
}));

describe("AuthService", () => {
  let authRepository: AuthRepository;
  let authService: AuthService;

  beforeEach(() => {
    authRepository = new PrismaAuthRepository();
    authService = new AuthService(authRepository);
  });

  describe("createUser", () => {
    it("should create a new user with hashed password", async () => {
      const input = { username: "testuser", password: "Password123" };
      const hashedPassword = "$2a$10$fakehashedpassword"; // Example of hashed password
      (authRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        username: input.username,
        password: hashedPassword,
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await authService.createUser(input);

      expect(authRepository.createUser as jest.Mock).toHaveBeenCalledWith(
        input.username,
        hashedPassword
      );
      expect(result).toEqual({
        id: 1,
        username: input.username,
        password: hashedPassword,
      });
    });
  });

  describe("authenticate", () => {
    it("should return user and token when authentication is successful", async () => {
      const input = { username: "testuser", password: "password123" };
      const user = {
        id: 1,
        username: input.username,
        password: "$2a$10$fakehashedpassword",
      };
      const token = "fake_token";
      (authRepository.findUserByUsername as jest.Mock).mockResolvedValue(user);
      jest.spyOn(global.Math, "random").mockReturnValue(0);
      (jwt.sign as jest.Mock).mockReturnValue(token);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.authenticate(input);

      expect(authRepository.findUserByUsername).toHaveBeenCalledWith(
        input.username
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id },
        SETTINGS.JWT_SECRET!,
        { expiresIn: "1h" }
      );
      expect(result).toEqual({ user, token });
    });

    it("should return null when user is not found", async () => {
      const input = { username: "nonexistentuser", password: "password123" };
      (authRepository.findUserByUsername as jest.Mock).mockResolvedValue(null);

      const result = await authService.authenticate(input);

      expect(authRepository.findUserByUsername).toHaveBeenCalledWith(
        input.username
      );
      expect(result).toBeNull();
    });

    it("should return null when password does not match", async () => {
      const input = { username: "testuser", password: "incorrectpassword" };
      const user = {
        id: 1,
        username: input.username,
        password: "$2a$10$fakehashedpassword",
      }; // Example of hashed password
      (authRepository.findUserByUsername as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.authenticate(input);

      expect(authRepository.findUserByUsername).toHaveBeenCalledWith(
        input.username
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        input.password,
        user.password
      );
      expect(result).toBeNull();
    });
  });

  describe("getAuthenticatedUser", () => {
    it("should return authenticated user when valid token is provided", async () => {
      const token = "valid_token";
      const userId = "1";
      const user = {
        id: userId,
        username: "testuser",
        password: "$2a$10$fakehashedpassword",
      }; // Example of hashed password
      (authRepository.findUserById as jest.Mock).mockResolvedValue(user);
      (jwt.verify as jest.Mock).mockReturnValue({ userId });

      const result = await authService.getAuthenticatedUser(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, SETTINGS.JWT_SECRET);
      expect(authRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it("should return null when invalid token is provided", async () => {
      const token = "invalid_token";
      (jwt.verify as jest.Mock).mockReturnValue(null);

      const result = await authService.getAuthenticatedUser(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, SETTINGS.JWT_SECRET);
      expect(result).toBeNull();
    });
  });
});
