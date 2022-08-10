import { Amplify, withSSRContext } from "aws-amplify";
import awsExports from "../../src/aws-exports";

Amplify.configure({
  ...awsExports,
  ssr: true,
});

const filename = "filename" + Math.random() * 10000;

export default async function handler(req, res) {
  const { Auth, Storage } = withSSRContext({ req });

  try {
    const user = await Auth.currentAuthenticatedUser();

    if (!user) {
      return res.status(401).json({ error: "Unauthorized request!" });
    }

    const response = await Storage.put(filename, JSON.stringify(awsExports), {
      contentType: "application/json",
    });

    if (typeof response !== "undefined" && response && response.hasOwnProperty("key")) {
      return res.status(200).json({ status: `Uploaded ${response["key"]}` });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
