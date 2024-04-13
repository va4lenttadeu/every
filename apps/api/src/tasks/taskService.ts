import { Task, User } from "@repo/database";

import { authHelpers } from "../auth";
import { validateInput } from "../shared/helpers";
import {
  CreateTaskInputType,
  TaskRepository,
  UpdateTaskInputType,
  UpdateTaskStatusInputType,
  createTaskInputSchema,
  taskStatusEnumSchema,
  updateTaskInputSchema,
  updateTaskStatusInputSchema,
} from ".";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(user: User | null): Promise<Task[]> {
    authHelpers.assertAuthorization(user);
    return await this.taskRepository.getTasks(user!.id);
  }

  async createTask(
    user: User | null,
    input: CreateTaskInputType
  ): Promise<Task> {
    authHelpers.assertAuthorization(user);
    const validInput = validateInput(createTaskInputSchema, input);

    return await this.taskRepository.createTask({
      ...validInput,
      status: taskStatusEnumSchema.enum.TODO,
      userId: user!.id,
    });
  }

  async updateTaskStatus(
    user: User | null,
    input: UpdateTaskStatusInputType
  ): Promise<Task> {
    authHelpers.assertAuthorization(user);
    const validInput = validateInput(updateTaskStatusInputSchema, input);

    return await this.taskRepository.updateTaskStatus({
      ...validInput,
      userId: user!.id,
    });
  }

  async archiveTask(
    user: User | null,
    input: UpdateTaskInputType
  ): Promise<Task> {
    authHelpers.assertAuthorization(user);
    const validInput = validateInput(updateTaskInputSchema, input);

    return await this.taskRepository.updateTaskStatus({
      ...validInput,
      status: taskStatusEnumSchema.enum.ARCHIVED,
      userId: user!.id,
    });
  }
}
