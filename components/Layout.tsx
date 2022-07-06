import { FunctionComponent, PropsWithChildren } from "react";
import { NextSeo, SocialProfileJsonLd } from "next-seo";

interface Props {
  title?: string;
  description?: string;
}

const Layout: FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  description,
  children,
}) => {
  return (
    <>
      <NextSeo title={title} description={description} />
      <SocialProfileJsonLd
        type="Person"
        name="Wyatt Johnson"
        url="https://wyattjoh.ca"
        sameAs={[]}
      />
      <div className="min-h-screen min-w-screen bg-gray-100 relative contents">
        <div className="font-mono max-w-3xl mx-auto md:my-6 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
