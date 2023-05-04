const gql = require("graphql-tag");
const { readFileSync } = require("fs");
const { ApolloServer } = require("@apollo/server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const resolvers = require("./resolvers");
const { addMocksToSchema } = require("@graphql-tools/mock");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require("@apollo/server/plugin/landingPage/default");

const port = process.env.PORT ?? 4002;
const subgraphName = require("../package.json").name;
const routerSecret = process.env.ROUTER_SECRET;

async function main() {
  const typeDefs = gql(
    readFileSync("schema.graphql", {
      encoding: "utf-8",
    })
  );
  const schema = buildSubgraphSchema({ typeDefs, resolvers });
  const mockedSchema = addMocksToSchema({ schema, preserveResolvers: true });
  const server = new ApolloServer({
    schema: mockedSchema,
    introspection: true,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      if (
        routerSecret &&
        req.headers["router-authorization"] !== routerSecret
      ) {
        throw new GraphQLError("Missing router authentication", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
    },
    listen: {
      port,
    },
  });

  console.log(`🚀  Subgraph ready at ${url}`);
  console.log(
    `In a new terminal, run rover dev --url http://localhost:${port} --name ${subgraphName}`
  );
}

main();
