import { Amplify, API } from "aws-amplify";
import awsExports from "../../../src/aws-exports";
import { getPost } from '../../../src/graphql/queries';

Amplify.configure({ ...awsExports, ssr: true });

export default async function handler(req, res) {
  const { id } = req.query
  if (id) {
    await API.graphql({ query: getPost, variables: { id } }).then(({ data }) => {
      res.status(200).json(data.getPost)
    });
  } else {
    res.status(400).json({ err: "error" })
  }
}
