import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div
      onClick={() => Router.push(`/p/${post.id}`)}
      className="py-4 px-6 bg-white cursor-pointer hover:shadow-lg"
    >
      <h2 className="text-2xl mb-4">{post.title}</h2>
      <div className="mb-3 italic">作者：{authorName}</div>
      <ReactMarkdown children={post.content} />
    </div>
  );
};

export default Post;
