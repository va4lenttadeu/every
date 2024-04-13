export const typeDefs = `
  type Query {
    tasks: [Task]
  }

  type Mutation {
    createTask(title: String!, description: String!): Task!
    updateTaskStatus(id: ID!, status: TaskStatus!): Task!
    archiveTask(id: ID!): Task!
    createUser(username: String!, password: String!): User!
    authenticate(username: String!, password: String!): AuthPayload!
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
    ARCHIVED
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: TaskStatus!
  }

  type User {
    id: ID!
    username: String!
  }

  type AuthPayload {
    token: String
    user: User
  }
`;
