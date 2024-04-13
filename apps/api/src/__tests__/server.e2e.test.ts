const request = require("supertest");
import express from "express";
import { prisma } from "@repo/database";
import { startServer } from "../server";
import { taskService, CreateTaskInputType } from "../tasks";
import { User } from "@repo/database";
import { CreateUserInputType, authService } from "../auth";

const getAuthenticatedUserMock = jest.fn();
jest.mock("../auth/authHelpers", () => ({
  AuthHelpers: jest.fn().mockImplementation(() => ({
    getAuthenticatedUser: jest
      .fn()
      .mockImplementation(() => getAuthenticatedUserMock()),
    assertAuthorization: jest.fn(),
  })),
}));

describe("API", () => {
  let server: express.Application;
  let user: User;

  beforeAll(async () => {
    server = await startServer();
    user = (await prisma.user.upsert({
      where: {
        username: "testuser",
      },
      update: {
        username: "testuser",
      },
      create: {
        username: "testuser",
        password: "123",
      },
    })) as User;

    getAuthenticatedUserMock.mockResolvedValue(user);
  });

  it("health check returns 200", async () => {
    await request(server)
      .get("/health")
      .expect(200)
      .then((res: express.Request) => {
        expect(res.body.ok).toBe(true);
      });
  });

  it("fetches all tasks", async () => {
    const GET_TASKS_QUERY = `
      query {
        tasks {
          id
          title
          description
          status
        }
      }
    `;

    await createTask(user as User, {
      title: "New Task",
      description: "Description of new task",
    });
    const response = await request(server)
      .post("/graphql")
      .send({ query: GET_TASKS_QUERY })
      .set("Authorization", "Bearer token123")
      .expect(200);

    expect(response.body.data.tasks).toBeDefined();
    expect(response.body.data.tasks.length).toBeGreaterThan(0);
  });

  it("creates a new task", async () => {
    const CREATE_TASK_MUTATION = `
      mutation {
        createTask(title: "New Task", description: "Description of new task") {
          id
          title
          description
          status
        }
      }
    `;

    const response = await request(server)
      .post("/graphql")
      .send({ query: CREATE_TASK_MUTATION })
      .set("Authorization", "Bearer token123")
      .expect(200);

    expect(response.body.data.createTask).toHaveProperty("id");
    expect(response.body.data.createTask.title).toBe("New Task");
    expect(response.body.data.createTask.description).toBe(
      "Description of new task"
    );
    expect(response.body.data.createTask.status).toBe("TODO");
  });

  it("updates a task status", async () => {
    const task = await createTask(user as User, {
      title: "New Task",
      description: "Description of new task",
    });

    const UPDATE_TASK_STATUS_MUTATION = `
      mutation {
        updateTaskStatus(id: ${task.id}, status: IN_PROGRESS) {
          id
          status
        }
      }
    `;

    const response = await request(server)
      .post("/graphql")
      .send({ query: UPDATE_TASK_STATUS_MUTATION })
      .set("Authorization", "Bearer token123")
      .expect(200);

    expect(response.body.data.updateTaskStatus).toHaveProperty("id");
    expect(response.body.data.updateTaskStatus.id).toBe(task.id.toString());
    expect(response.body.data.updateTaskStatus.status).toBe("IN_PROGRESS");
  });

  it("archives a task", async () => {
    const task = await createTask(user as User, {
      title: "New Task",
      description: "Description of new task",
    });
    const ARCHIVE_TASK_MUTATION = `
      mutation {
        archiveTask(id: ${task.id}) {
          id
          title
          description
          status
        }
      }
    `;

    const response = await request(server)
      .post("/graphql")
      .send({ query: ARCHIVE_TASK_MUTATION })
      .set("Authorization", "Bearer token123")
      .expect(200);

    expect(response.body.data.archiveTask).toHaveProperty("id");
    expect(response.body.data.archiveTask.id).toBe(task.id.toString());
    expect(response.body.data.archiveTask.status).toBe("ARCHIVED");
  });
});

const createTask = (user: User, taskData: Partial<CreateTaskInputType>) => {
  return taskService.createTask(user, taskData as CreateTaskInputType);
};

const createUser = (user: CreateUserInputType) => {
  return authService.createUser(user);
};
