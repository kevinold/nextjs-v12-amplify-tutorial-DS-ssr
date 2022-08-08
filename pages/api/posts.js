import { Amplify, AuthModeStrategyType, withSSRContext } from "aws-amplify";
import awsExports from "../../src/aws-exports";
import { Post } from "../../src/models";

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

export default async function handler(req, res) {
  const { DataStore } = withSSRContext(req);
  const posts = await DataStore.query(Post);
  res.status(200).json({ posts });
}
