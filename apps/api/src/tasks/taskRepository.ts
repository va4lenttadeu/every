import { Task, prisma } from "@repo/database";
import {
  CreateTaskInputType,
  TaskStatusEnum,
  UpdateTaskStatusInputType,
} from ".";

export interface TaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  createTask(
    input: CreateTaskInputType & { userId: string; status: TaskStatusEnum }
  ): Promise<Task>;
  updateTaskStatus(
    input: UpdateTaskStatusInputType & { userId: string }
  ): Promise<Task>;
}

export class PrismaTaskRepository implements TaskRepository {
  async getTasks(userId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: { userId },
    });
  }

  async createTask(
    input: CreateTaskInputType & { userId: string; status: TaskStatusEnum }
  ): Promise<Task> {
    return await prisma.task.create({
      data: input,
    });
  }

  async updateTaskStatus(
    input: UpdateTaskStatusInputType & { userId: string }
  ): Promise<Task> {
    return await prisma.task.update({
      where: { id: input.id, userId: input.userId },
      data: { status: input.status },
    });
  }
}