export * from "./authHelpers";
export * from "./authService";
export * from "./authRepository";
export * from "./authValidators";
import { AuthHelpers } from "./authHelpers";
import { PrismaAuthRepository } from "./authRepository";
import { resolvers } from "./authResolver";
import { AuthService } from "./authService";

export const authService = new AuthService(new PrismaAuthRepository());
export const authResolvers = resolvers(authService);
export const authHelpers = new AuthHelpers(authService);
