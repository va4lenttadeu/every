import { TaskService } from "./taskService";
import { AuthContext } from "../auth";
import {
  CreateTaskInputType,
  UpdateTaskInputType,
  UpdateTaskStatusInputType,
} from ".";

export const resolvers = (taskService: TaskService) => ({
  Query: {
    tasks: async (_: unknown, __: unknown, context: AuthContext) => {
      return await taskService.getTasks(context.user);
    },
  },
  Mutation: {
    createTask: async (
      _: unknown,
      input: CreateTaskInputType,
      context: AuthContext
    ) => {
      return await taskService.createTask(context.user, input);
    },
    updateTaskStatus: async (
      _: unknown,
      input: UpdateTaskStatusInputType,
      context: AuthContext
    ) => {
      return await taskService.updateTaskStatus(context.user, input);
    },
    archiveTask: async (
      _: unknown,
      input: UpdateTaskInputType,
      context: AuthContext
    ) => {
      return await taskService.archiveTask(context.user, input);
    },
  },
});
