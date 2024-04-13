import { AuthService } from "./authService";
import { AuthenticateInputType, CreateUserInputType } from "./authValidators";

export const resolvers = (authService: AuthService) => ({
  Query: {},
  Mutation: {
    createUser: async (_: unknown, input: CreateUserInputType) => {
      return await authService.createUser(input);
    },
    authenticate: async (_: unknown, input: AuthenticateInputType) => {
      return await authService.authenticate(input);
    },
  },
});
