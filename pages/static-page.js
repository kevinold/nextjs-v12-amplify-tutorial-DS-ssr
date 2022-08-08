import { Amplify, Analytics, Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import awsExports from "../src/aws-exports";

Amplify.configure({ ...awsExports });

export default function StaticPage() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const recordAnalytics = async () => {
      await Analytics.record({ name: "viewStaticPage" });
    };

    Auth.currentAuthenticatedUser().then((user) => {
      console.log({ user });
      setCurrentUser(user);
    });

    Auth.currentSession()
      .then((currentSession) => console.log({ currentSession }))
      .catch((err) => console.log(err));

    recordAnalytics().catch(console.error);
  }, []);
  return (
    <div data-test="content">
      This is a static page
      <code>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
      </code>
    </div>
  );
}
