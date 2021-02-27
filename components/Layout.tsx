import { FunctionComponent } from "react";
import { NextSeo } from "next-seo";

interface Props {
  title?: string;
  description?: string;
}

const Layout: FunctionComponent<Props> = ({ title, description, children }) => {
  return (
    <>
      <NextSeo title={title} description={description} />
      <div className="font-mono max-w-2xl mx-auto md:my-6 flex flex-col">
        {children}
      </div>
    </>
  );
};

export default Layout;
