import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, API } from "aws-amplify";
import { useEffect, useState } from "react";
import config from "../src/aws-exports.js";

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

async function post() {
  const apiName = "helloApi";
  const path = "/hello";
  const myInit = {
    // response: true,
    body: { name: "World" },
  };

  return API.post(apiName, path, myInit)
    .then((response) => {
      console.log("got response", response);
      return response;
    })
    .catch((error) => {
      console.log("got error", error);
      return error;
    });
}

function HelloRestApi() {
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  async function getResponse() {
    setIsLoading(true);
    const getResponseData = await get();
    setResponse((existing) => ({ ...existing, get: getResponseData }));
    setIsLoading(false);
  }
  async function postResponse() {
    setIsLoading(true);
    const postResponseData = await post();
    setResponse((existing) => ({ ...existing, post: postResponseData }));
    setIsLoading(false);
  }
  function refresh() {
    getResponse();
    postResponse();
  }
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div>
      <Authenticator>
        <button onClick={refresh}>refresh</button>
        <button type="button" onClick={() => Auth.signOut()}>
          Sign out
        </button>
        {isLoading && <span>Loading...</span>}
        <code>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </code>
      </Authenticator>
    </div>
  );
}

export default HelloRestApi;
