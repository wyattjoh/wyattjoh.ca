import Head from "next/head";
import { FunctionComponent } from "react";

interface Props {
  title?: string;
}

const Layout: FunctionComponent<Props> = ({ title, children }) => {
  return (
    <>
      {title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <div className="font-mono max-w-2xl mx-auto my-6 flex flex-col">
        {children}
      </div>
    </>
  );
};

export default Layout;
