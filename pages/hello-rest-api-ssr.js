import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, withSSRContext } from "aws-amplify";
import config from "../src/aws-exports.js";

Amplify.configure({ ...config, ssr: true });

export async function getServerSideProps({ req }) {
  const apiName = "helloApi";
  const path = "/hello";
  const myInit = {
    // response: true,
  };
  const SSR = withSSRContext({ req });
  const response = await SSR.API.get(apiName, path, myInit);

  return {
    props: {
      response,
    },
  };
}

function HelloRestApiSSR({ response }) {
  return (
    <div>
      <Authenticator>
        <button type="button" onClick={() => Auth.signOut()}>
          Sign out
        </button>
        <code>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </code>
      </Authenticator>
    </div>
  );
}

export default HelloRestApiSSR;
