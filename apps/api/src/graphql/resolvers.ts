import { authResolvers } from "../auth";
import { taskResolvers } from "../tasks";

export const resolvers = {
  Query: {
    ...taskResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...taskResolvers.Mutation,
    ...authResolvers.Mutation,
  },
};
