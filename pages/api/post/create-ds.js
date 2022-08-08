import { Amplify, AuthModeStrategyType, withSSRContext } from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { Post } from "../../../src/models";

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

export default async function handler(req, res) {
  const { DataStore } = withSSRContext(req);
  const post = await DataStore.save(
    new Post({
      title: `API ${new Date().toLocaleTimeString()}`,
      content: "Test content",
    })
  );
  res.status(200).json({ post });
}
