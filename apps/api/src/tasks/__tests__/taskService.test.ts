import { User } from "@repo/database";
import { authHelpers } from "../../auth";
import { AuthenticationError } from "../../shared/errors";
import {
  CreateTaskInputType,
  PrismaTaskRepository,
  TaskRepository,
  TaskService,
  UpdateTaskInputType,
  UpdateTaskStatusInputType,
  taskStatusEnumSchema,
} from "..";

jest.mock("../taskRepository", () => ({
  PrismaTaskRepository: jest.fn().mockImplementation(() => ({
    getTasks: jest.fn(),
    createTask: jest.fn(),
    updateTaskStatus: jest.fn(),
    archiveTask: jest.fn(),
  })),
}));

jest.mock("../../auth", () => ({
  authHelpers: {
    assertAuthorization: jest.fn(),
  },
}));

const validateInput = jest.fn();

describe("TaskService", () => {
  let taskRepository: TaskRepository;
  let taskService: TaskService;
  const user: Partial<User> = { id: "cluzxrvge000011fkmwo9lb1z" };

  beforeEach(() => {
    taskRepository = new PrismaTaskRepository();
    taskService = new TaskService(taskRepository);
  });

  describe("getTasks", () => {
    it("should get tasks for a valid user", async () => {
      const tasks = [{ id: 1, userId: user.id, description: "Task 1" }];
      (taskRepository.getTasks as jest.Mock).mockResolvedValue(tasks);
      (authHelpers.assertAuthorization as jest.Mock).mockReturnValue(undefined);

      const result = await taskService.getTasks(user as User);

      expect(authHelpers.assertAuthorization).toHaveBeenCalledWith(user);
      expect(taskRepository.getTasks).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(tasks);
    });

    it("should throw AuthenticationError for null user", async () => {
      (authHelpers.assertAuthorization as jest.Mock).mockImplementation(() => {
        throw new AuthenticationError();
      });

      await expect(taskService.getTasks(null)).rejects.toThrow(
        AuthenticationError
      );
    });
  });

  describe("createTask", () => {
    const input: Partial<CreateTaskInputType> = {
      title: "New Task",
      description: "Task description",
    };
    it("should create task for a valid user and input", async () => {
      const validInput = {
        ...input,
        status: taskStatusEnumSchema.enum.TODO,
        userId: user.id,
      };
      (taskRepository.createTask as jest.Mock).mockResolvedValue(validInput);
      (authHelpers.assertAuthorization as jest.Mock).mockReturnValue(undefined);
      validateInput.mockReturnValue(validInput);

      const result = await taskService.createTask(
        user as User,
        input as CreateTaskInputType
      );

      expect(authHelpers.assertAuthorization).toHaveBeenCalledWith(user);
      expect(taskRepository.createTask).toHaveBeenCalledWith(validInput);
      expect(result).toEqual(validInput);
    });

    it("should throw AuthenticationError for null user", async () => {
      (authHelpers.assertAuthorization as jest.Mock).mockImplementation(() => {
        throw new AuthenticationError();
      });

      await expect(
        taskService.createTask(null, input as CreateTaskInputType)
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe("updateTaskStatus", () => {
    const input: Partial<UpdateTaskStatusInputType> = {
      id: 1,
      status: "TODO",
    };

    it("should update task status for a valid user and input", async () => {
      const validInput = { ...input, userId: user.id };
      (taskRepository.updateTaskStatus as jest.Mock).mockResolvedValue(
        validInput
      );
      (authHelpers.assertAuthorization as jest.Mock).mockReturnValue(undefined);
      validateInput.mockReturnValue(validInput);

      const result = await taskService.updateTaskStatus(
        user as User,
        input as UpdateTaskStatusInputType
      );

      expect(authHelpers.assertAuthorization).toHaveBeenCalledWith(user);
      expect(taskRepository.updateTaskStatus).toHaveBeenCalledWith(validInput);
      expect(result).toEqual(validInput);
    });

    it("should throw AuthenticationError for null user", async () => {
      (authHelpers.assertAuthorization as jest.Mock).mockImplementation(() => {
        throw new AuthenticationError();
      });

      await expect(
        taskService.updateTaskStatus(null, input as UpdateTaskStatusInputType)
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe("archiveTask", () => {
    const input: UpdateTaskInputType = { id: 1 };
    it("should archive task for a valid user and input", async () => {
      const validInput = {
        ...input,
        userId: user.id,
        status: taskStatusEnumSchema.enum.ARCHIVED,
      };
      (taskRepository.updateTaskStatus as jest.Mock).mockResolvedValue(
        validInput
      );
      (authHelpers.assertAuthorization as jest.Mock).mockReturnValue(undefined);
      (validateInput as jest.Mock).mockReturnValue(validInput);

      const result = await taskService.archiveTask(user as User, input);

      expect(authHelpers.assertAuthorization).toHaveBeenCalledWith(user);
      expect(taskRepository.updateTaskStatus).toHaveBeenCalledWith(validInput);
      expect(result).toEqual(validInput);
    });

    it("should throw AuthenticationError for null user", async () => {
      (authHelpers.assertAuthorization as jest.Mock).mockImplementation(() => {
        throw new AuthenticationError();
      });

      await expect(taskService.archiveTask(null, input)).rejects.toThrow(
        AuthenticationError
      );
    });
  });
});
