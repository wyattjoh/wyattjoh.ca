import { FunctionComponent, useMemo } from "react";
import { GitHubContributionStats } from "../lib/github";

interface Props {
  stats: GitHubContributionStats;
}

// NOTE: If you want to change this value, ensure that you update lib/github.ts.
export const WIDTH = 672;
export const HEIGHT = 200;

const GitHubContributionGraph: FunctionComponent<Props> = ({
  stats: { username, width, contributions },
}) => {
  return (
    <div className="w-full relative">
      <a
        href={`https://github.com/${username}`}
        title={`Go to @${username}'s GitHub profile`}
        className="text-pink-700 transition-colors duration-200 hover:text-pink-600"
      >
        <svg
          className="w-full fill-current"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMaxYMin"
        >
          {contributions.map(({ x, height, opacity }, index) => (
            <rect
              key={index}
              opacity={opacity}
              width={width}
              x={x}
              y="0"
              height={height}
            ></rect>
          ))}
        </svg>
      </a>
    </div>
  );
};

export default GitHubContributionGraph;
