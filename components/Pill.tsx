import { FunctionComponent } from "react";

const Pill: FunctionComponent = ({ children }) => {
  return <div className="inline bg-pink-400 p-1">{children}</div>;
};

export default Pill;
