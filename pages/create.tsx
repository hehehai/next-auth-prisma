import React, { useState } from "react";
import Layout from "~/components/Layout";
import Router from "next/router";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1 className="text-2xl mb-4">新文章（草稿）</h1>
          <div>
            <input
              className="block w-full p-3 mb-5"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="标题"
              type="text"
            />
            <textarea
              className="w-full p-3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="内容"
              rows={8}
            />
            <p>内容支持 Markdown</p>
            <div className="space-x-4 mt-5">
              <input
                className="bg-indigo-500 px-6 py-2 text-white hover:bg-indigo-500/80 cursor-pointer disabled:hover:bg-indigo-500 disabled:cursor-not-allowed"
                disabled={!content || !title}
                type="submit"
                value="创建"
              />
              <a
                href="#"
                onClick={() => Router.push("/")}
                className="text-red-500 underline underline-offset-2 hover:text-red-500/80"
              >
                取消
              </a>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;
