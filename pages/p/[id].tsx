import React from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import Layout from "~/components/Layout";
import { PostProps } from "~/components/Post";
import { db } from "~/lib/db/prisma";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps<any, any> = async ({
  params,
}) => {
  const postId = params?.id;

  const post = await db.post.findUnique({
    where: { id: String(postId) },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  return {
    props: post,
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });

  Router.push("/");
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, { method: "DELETE" });

  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  // 用户已登录？
  const userHasValidSession = Boolean(session);
  // 属于当前登录人？
  const postBelongsToUser = session?.user?.email === props.author?.email;

  let title = props.title;
  if (!props.published) {
    title = `${title} (草稿)`;
  }

  const renderControl = () => {
    if (!userHasValidSession || !postBelongsToUser) return null;
    return (
      <div className="mt-10 space-x-6">
        {!props.published && (
          <button
            className="bg-sky-500 text-white hover:bg-sky-500/80 px-6 py-2"
            key="publish"
            onClick={() => publishPost(props.id)}
          >
            发布
          </button>
        )}
        <button
          className="bg-red-500 text-white hover:bg-red-500/80 px-6 py-2"
          key="delete"
          onClick={() => deletePost(props.id)}
        >
          删除
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-white px-6 py-4">
        <h2 className="text-2xl mb-4">{title}</h2>
        <p className="italic mb-4">
          作者：{props?.author?.name || "Unknown author"}
        </p>
        <ReactMarkdown children={props.content} />
        {renderControl()}
      </div>
    </Layout>
  );
};

export default Post;
