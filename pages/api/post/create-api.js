import { Amplify, withSSRContext } from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { createPost } from "../../../src/graphql/mutations";

Amplify.configure({
  ...awsExports,
  ssr: true,
});

Amplify.Logger.LOG_LEVEL = "DEBUG";

export default async function handler(req, res) {
  const SSR = withSSRContext({ req });
  const { data } = await SSR.API.graphql({
    authMode: "AMAZON_COGNITO_USER_POOLS",
    query: createPost,
    variables: {
      input: {
        title: `API GraphQL ${new Date().toLocaleTimeString()}`,
        content: "Test content",
      },
    },
  });

  res.status(200).json({ post: data });
}
