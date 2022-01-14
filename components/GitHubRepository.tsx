import clsx from "clsx";
import { FunctionComponent } from "react";

import { RepositoryFragmentFragment } from "../lib/__generated__/types";

interface Props {
  repo: RepositoryFragmentFragment;
}

const GitHubRepository: FunctionComponent<Props> = ({ repo }) => {
  return (
    <a
      key={repo.nameWithOwner}
      href={repo.url}
      title={`Visit ${repo.nameWithOwner} on GitHub`}
      className="border border-primary-light p-2 rounded-md duration-200 bg-primary transition-colors hover:bg-primary-light"
    >
      <h2
        className={clsx(
          "font-bold flex items-baseline",
          repo.description && "mb-1"
        )}
      >
        <span
          style={{ backgroundColor: repo.primaryLanguage?.color ?? undefined }}
          className="w-3 h-3 inline-block rounded-full border border-white mr-2"
          title={repo.primaryLanguage?.name}
        />
        <span>{repo.nameWithOwner}</span>
      </h2>
      {repo.description && <p className="text-xs">{repo.description}</p>}
    </a>
  );
};

export default GitHubRepository;
