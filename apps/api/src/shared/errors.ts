import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

const FORBIDDEN = "FORBIDDEN";
export class ValidationError extends GraphQLError {
  constructor(message = "invalid_input") {
    super(message, {
      extensions: {
        code: ApolloServerErrorCode.BAD_USER_INPUT,
      },
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor() {
    super("unauthenticated", {
      extensions: {
        code: FORBIDDEN,
      },
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor() {
    super("unauthorized", {
      extensions: {
        code: FORBIDDEN,
      },
    });
  }
}

export class GenericError extends GraphQLError {
  constructor() {
    super("internal_server_error", {
      extensions: {
        code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
