import { FunctionComponent, useMemo } from "react";

import { CONTRIBUTION_DAYS, GitHubContributionStats } from "../lib/github";

interface Props {
  stats: GitHubContributionStats;
}

// NOTE: If you want to change this value, ensure that you update lib/github.ts.
export const WIDTH = 672;
export const HEIGHT = 200;

const GitHubContributionGraph: FunctionComponent<Props> = ({
  stats: { rx, username, width, contributions },
}) => {
  return (
    <div className="w-full relative">
      <a
        href={`https://github.com/${username}`}
        title={`GitHub contributions over the last ${CONTRIBUTION_DAYS} days.`}
        className="text-pink-700 transition-colors duration-200 hover:text-pink-600"
      >
        <svg
          className="w-full fill-current"
          viewBox={`0 0 ${WIDTH} ${HEIGHT + parseInt(width, 10) / 2}`}
          preserveAspectRatio="xMaxYMin"
        >
          {contributions.map(({ x, height, opacity }, index) => (
            <rect
              key={index}
              opacity={opacity}
              width={width}
              x={x}
              y={`-${rx}`}
              rx={rx}
              height={height}
            />
          ))}
        </svg>
      </a>
    </div>
  );
};

export default GitHubContributionGraph;
