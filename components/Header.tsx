import { useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();

  const isLoading = useMemo(() => {
    return status === "loading";
  }, [status]);

  return (
    <div className="px-8 py-4 mx-auto">
      <div className="bg-white px-6 py-4 flex items-center justify-between">
        <div className="space-x-6">
          <Link href="/">
            <a className="bold">首页</a>
          </Link>
          {session && (
            <Link href="/drafts">
              <a>我的草稿</a>
            </Link>
          )}
        </div>
        {isLoading ? (
          <div>验证中...</div>
        ) : (
          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <p>
                  {session?.user?.name} ({session?.user?.email})
                </p>
                <Link href="/create">
                  <a>新文章</a>
                </Link>
                <Link href="/api/auth/signout">
                  <a>退出</a>
                </Link>
              </>
            ) : (
              <Link href="/api/auth/signin">
                <a>登录</a>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
