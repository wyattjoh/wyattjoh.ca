import clsx from "clsx";
import Head from "next/head";
import { FunctionComponent } from "react";

interface Props {
  title?: string;
  className?: string;
}

const Layout: FunctionComponent<Props> = ({ title, className, children }) => {
  return (
    <>
      {title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <div
        className={clsx(
          "max-w-4xl mx-auto h-screen my-6 space-y-4 flex flex-col",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
