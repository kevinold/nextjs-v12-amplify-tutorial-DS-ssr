import "@aws-amplify/ui-react/styles.css";
import { Amplify, API } from "aws-amplify";
import config from "../../src/aws-exports.js";

Amplify.configure(config);

async function get() {
  const apiName = "helloApi";
  const path = "/hello";
  const myInit = {
    // response: true,
  };

  return API.get(apiName, path, myInit)
    .then((response) => {
      console.log("got response", response);
      return response;
    })
    .catch((error) => {
      console.log("got error", error);
      return error;
    });
}
export default async function handler(req, res) {
  const getResponseData = await get();
  res.status(200).json(getResponseData);
}
