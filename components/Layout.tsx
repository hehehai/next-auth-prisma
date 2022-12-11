import { useSession } from "next-auth/react";
import React, { ReactNode, useEffect } from "react";
import refreshSession from "~/lib/utils";
import Header from "./Header";

const Layout: React.FC<{ children?: ReactNode }> = (props) => {
  const { data, status } = useSession();

  const handleSubmitInitPassword = async () => {
    let password = "";
    do {
      password = window.prompt("Please enter your init password", "");
    } while (!password || password.trim() === "");
    try {
      const res = await fetch("/api/user/init-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });
      if (res.ok) {
        window.alert("Init password save successful");
      }
    } catch (err) {
      console.log(err);
    } finally {
      refreshSession()
    }
  };

  useEffect(() => {
    if (status === "authenticated" && data?.user?.noPwd) {
      handleSubmitInitPassword();
    }
  }, [status]);

  return (
    <div>
      <Header />
      <div className="px-8">{props.children}</div>
    </div>
  );
};

export default Layout;
