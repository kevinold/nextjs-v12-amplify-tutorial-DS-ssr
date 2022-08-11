// pages/index.js
import { serializeModel } from "@aws-amplify/datastore/ssr";
import { Authenticator, Flex, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Analytics, AuthModeStrategyType, DataStore, withSSRContext } from "aws-amplify";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import awsExports from "../src/aws-exports";
import { Post } from "../src/models";
import styles from "../styles/Home.module.css";

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

export async function getServerSideProps({ req }) {
  const SSR = withSSRContext({ req });
  const posts = await SSR.DataStore.query(Post);

  let user = null;

  try {
    user = await SSR.Auth.currentAuthenticatedUser();
  } catch (e) {}

  return {
    props: {
      serverPosts: serializeModel(posts),
      user: user && user.attributes,
    },
  };
}

async function handleCreatePost(event) {
  event.preventDefault();

  const form = new FormData(event.target);

  try {
    const post = await DataStore.save(
      new Post({
        title: form.get("title"),
        content: form.get("content"),
      })
    );

    await Analytics.record({ name: "createPost" });

    //window.location.href = `/posts/${post.id}`;
  } catch ({ errors }) {
    console.error(...errors);
    throw new Error(errors[0].message);
  }
}

export default function Home({ serverPosts = [], user }) {
  const [posts, setPosts] = useState(serverPosts);

  useEffect(() => {
    const sub = DataStore.observeQuery(Post).subscribe((snapshot) => {
      setPosts(snapshot.items);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);
  return (
    <Flex direction="column">
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading level={3}>Amplify + Next.js</Heading>
        <pre data-test="user-details">User: {JSON.stringify(user, null, 2)}</pre>
        <p className={styles.description}>
          <code data-test="posts-count" className={styles.code}>
            {posts.length}
          </code>
          posts
        </p>

        <Flex>
          <Heading level={3}>Posts</Heading>
          {posts.map((post) => (
            <a
              data-test={`post-${post.id}`}
              className={styles.card}
              href={`/posts/${post.id}`}
              key={post.id}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </a>
          ))}
        </Flex>

        <Flex>
          <Heading level={3}>New Post</Heading>

          <Authenticator>
            {({ signOut }) => (
              <form onSubmit={handleCreatePost}>
                <fieldset>
                  <legend>Title</legend>
                  <input defaultValue={`Today, ${new Date().toLocaleTimeString()}`} name="title" />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea defaultValue="I built an Amplify app with Next.js!" name="content" />
                </fieldset>

                <button>Create Post</button>
                <button type="button" onClick={signOut}>
                  Sign out
                </button>
              </form>
            )}
          </Authenticator>
        </Flex>
      </main>
    </Flex>
  );
}
