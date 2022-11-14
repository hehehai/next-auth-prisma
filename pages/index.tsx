import React from "react";
import { GetStaticProps } from "next";
import Layout from "~/components/Layout";
import Post, { PostProps } from "~/components/Post";
import { db } from "~/lib/db/prisma";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await db.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    // 降序，最新创建的文章在最前
    orderBy: { createdAt: "desc" },
  });
  return {
    props: { feed },
    // 10 秒
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Home: React.FC<Props> = (props) => {
  return (
    <Layout>
      <h1 className="mb-3">最新文章</h1>
      <main className="space-y-6">
        {props.feed.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Home;
