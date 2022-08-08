import { useRouter } from "next/router";

export default function PostCatchAll({ post }) {
  const router = useRouter();
  const slug = router.query.slug || [];

  return (
    <>
      <h1>Slug: {slug.join("/")}</h1>
    </>
  );
}
