export * from "./taskService";
export * from "./taskValidators";
export * from "./taskRepository";
import { PrismaTaskRepository } from "./taskRepository";
import { resolvers } from "./taskResolver";
import { TaskService } from "./taskService";

export const taskService = new TaskService(new PrismaTaskRepository());
export const taskResolvers = resolvers(taskService);
