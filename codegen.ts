import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
  schema: {
    "https://api.github.com/graphql": {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "wyattjoh/wyattjoh.ca",
      },
    },
  },
  documents: ["src/**/*.graphql", "src/**/*.ts"], // Your GraphQL queries
  generates: {
    "src/generated/github-types.ts": {
      plugins: ["typescript-operations", "typescript"],
      config: {
        skipTypename: false,
        enumsAsTypes: true,
        immutableTypes: true,
        onlyOperationTypes: true,
        scalars: {
          URI: "string",
        },
      },
    },
  },
};

module.exports = config;
