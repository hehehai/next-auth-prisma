import React, { ReactNode } from "react";
import Header from "./Header";

const Layout: React.FC<{ children?: ReactNode }> = (props) => (
  <div>
    <Header />
    <div className="px-8">{props.children}</div>
  </div>
);

export default Layout;
