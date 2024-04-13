import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@repo/database";
import { AuthRepository } from "./authRepository";
import {
  AuthenticateInputType,
  CreateUserInputType,
  authenticateInputSchema,
  createUserInputSchema,
} from "./authValidators";
import { validateInput } from "../shared/helpers";
import { SETTINGS } from "../settings";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async createUser(input: CreateUserInputType): Promise<User> {
    validateInput(createUserInputSchema, input);

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return await this.authRepository.createUser(input.username, hashedPassword);
  }

  async authenticate(
    input: AuthenticateInputType
  ): Promise<{ user: User; token: string } | null> {
    validateInput(authenticateInputSchema, input);

    const user = await this.authRepository.findUserByUsername(input.username);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) return null;

    const token = jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return {
      user,
      token,
    };
  }

  async getAuthenticatedUser(token: string) {
    const decoded = jwt.verify(token, SETTINGS.JWT_SECRET) as
      | { userId: string }
      | undefined;

    if (!decoded) {
      return null;
    }

    return this.authRepository.findUserById(decoded.userId);
  }
}
