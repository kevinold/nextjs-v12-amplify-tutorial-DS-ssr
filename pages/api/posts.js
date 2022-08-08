import { Amplify, API } from "aws-amplify";
import awsExports from "../../src/aws-exports";
import { listPosts } from "../../src/graphql/queries";

Amplify.configure({ ...awsExports, ssr: true });

export default function handler(req, res) {
  API.graphql({ query: listPosts }).then(({ data }) => {
    res.status(200).json({ posts: data.listPosts.items });
  });
}
