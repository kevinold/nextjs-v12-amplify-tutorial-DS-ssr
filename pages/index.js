// pages/index.js
import { serializeModel } from "@aws-amplify/datastore/ssr";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import {
  Amplify,
  Analytics,
  Auth,
  AuthModeStrategyType,
  DataStore,
  withSSRContext,
} from "aws-amplify";
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
    <div className={styles.container}>
      <Head>
        <title>Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Amplify + Next.js</h1>

        <p className={styles.description}>
          <code data-test="posts-count" className={styles.code}>
            {posts.length}
          </code>
          posts
        </p>

        <div className={styles.grid}>
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

          <div className={styles.card}>
            <h3 className={styles.title}>New Post</h3>

            <Authenticator>
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
                <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
              </form>
              <code>
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </code>
            </Authenticator>
          </div>
        </div>
      </main>
    </div>
  );
}
