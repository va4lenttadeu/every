import { ApolloServer } from "@apollo/server";
import express from "express";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { logger } from "@repo/logger";
import { SETTINGS } from "./settings";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";
import { authHelpers } from "./auth";
import { GenericError } from "./shared/errors";
import { ApolloServerErrorCode } from "@apollo/server/errors";

export const startServer = async () => {
  const server = express();
  const apolloServer = await startApollo();
  server
    .disable("x-powered-by")
    .use(express.json())
    .use(cors())
    .use(
      "/graphql",
      cors(),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => buildContext(req),
      })
    )
    .get("/health", (req, res) => {
      return res.json({ ok: true });
    });

  server.listen(SETTINGS.PORT, () => {
    logger.info(`api running on ${SETTINGS.PORT}`);
  });

  return server;
};

const startApollo = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      // hide the internal errors from the response
      if (
        formattedError.extensions?.code ===
        ApolloServerErrorCode.INTERNAL_SERVER_ERROR
      ) {
        logger.error(error);
        return new GenericError();
      }

      return formattedError;
    },
  });

  await server.start();

  return server;
};

const buildContext = async (req: express.Request) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return { user: null };
  }

  const user = await authHelpers.getAuthenticatedUser(token);

  return {
    user,
  };
};
