import { serializeModel } from "@aws-amplify/datastore/ssr";
import { Amplify, Analytics, AuthModeStrategyType, DataStore, withSSRContext } from "aws-amplify";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import awsExports from "../../src/aws-exports";
import { Post } from "../../src/models";
import styles from "../../styles/Home.module.css";

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

export async function getStaticPaths() {
  const SSR = withSSRContext();
  const posts = await SSR.DataStore.query(Post);
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return {
    fallback: true,
    paths,
  };
}

export async function getStaticProps({ params }) {
  const SSR = withSSRContext();
  const post = await SSR.DataStore.query(Post, params.id);

  return {
    props: {
      post: serializeModel(post),
    },
  };
}

export default function Posts({ post }) {
  const router = useRouter();

  useEffect(() => {
    const recordAnalytics = async () => {
      await Analytics.record({ name: "viewPostPage" });
    };

    recordAnalytics().catch(console.error);
  }, []);

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    );
  }

  async function handleDelete() {
    try {
      const postToDelete = await DataStore.query(Post, post.id);
      if (postToDelete) {
        DataStore.delete(postToDelete);
      }

      window.location.href = "/";
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title} – Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{post.title}</h1>

        <p className={styles.description}>{post.content}</p>
      </main>

      <footer className={styles.footer}>
        <button onClick={handleDelete}>💥 Delete post</button>
      </footer>
    </div>
  );
}
