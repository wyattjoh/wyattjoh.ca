import { FunctionComponent, PropsWithChildren } from "react";
interface Props {
  href: string;
}

const Link: FunctionComponent<PropsWithChildren<Props>> = ({
  href,
  children,
}) => {
  return (
    <a className="underline" rel="nofollow noreferrer" href={href}>
      {children}
    </a>
  );
};

export default Link;
