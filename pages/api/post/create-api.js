import { Amplify, AuthModeStrategyType, withSSRContext } from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { createPost } from "../../../src/graphql/mutations";

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

export default async function handler(req, res) {
  const SSR = withSSRContext(req);
  const { data } = await SSR.API.graphql({
    authMode: "AMAZON_COGNITO_USER_POOLS",
    query: createPost,
    variables: {
      input: {
        title: `API ${new Date().toLocaleTimeString()}`,
        content: "Test content",
      },
    },
  });

  res.status(200).json({ post: data });
}
