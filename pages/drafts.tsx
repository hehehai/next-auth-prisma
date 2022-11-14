import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import Layout from "~/components/Layout";
import Post, { PostProps } from "~/components/Post";
import { db } from "~/lib/db/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  // 查询文章（草稿）
  const drafts = await db.post.findMany({
    where: {
      author: { email: session?.user?.email },
      published: false,
    },
    // 关联查询作者（用户）
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return { props: { drafts } };
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>我的草稿</h1>
        <div>请先登录</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="mb-3">我的草稿</h1>
        <main className="space-y-6">
          {props.drafts.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;
