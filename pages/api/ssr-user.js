// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Amplify, withSSRContext } from "aws-amplify";

import awsExports from "../../src/aws-exports";

Amplify.configure({ ...awsExports, ssr: true });

export default async function handler(req, res) {
  const SSR = withSSRContext({ req });

  let user = null;
  let session = null;
  let userInfo = null;
  let userAttrs = null;

  try {
    user = await SSR.Auth.currentAuthenticatedUser();
    console.log(user);
    session = await SSR.Auth.currentSession().idToken;
    userInfo = await SSR.Auth.currentUserInfo();
    userAttrs = await SSR.Auth.userAttributes(user);
    await SSR.Auth.signOut({ global: true });
  } catch (e) {}

  res.status(200).json({ user: user.attributes, session, userInfo, userAttrs });
}
