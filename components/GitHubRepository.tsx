import type { FunctionComponent } from "react";

import clsx from "clsx";

interface Props {
  repo: {
    name: string;
    url: string;
    description: string;
    color: string | null | undefined;
  };
}

const GitHubRepository: FunctionComponent<Props> = ({ repo }) => {
  return (
    <a
      key={repo.name}
      href={repo.url}
      title={`Visit ${repo.name} on GitHub`}
      className="border border-primary-light p-2 rounded-md duration-200 bg-primary transition-colors hover:bg-primary-light"
    >
      <h2
        className={clsx(
          "font-bold flex items-baseline",
          repo.description && "mb-1"
        )}
      >
        <span
          style={{ backgroundColor: repo.color ?? undefined }}
          className="w-3 h-3 inline-block rounded-full border border-white mr-2"
          title={repo.name}
        />
        <span>{repo.name}</span>
      </h2>
      {repo.description && <p className="text-xs">{repo.description}</p>}
    </a>
  );
};

export default GitHubRepository;
