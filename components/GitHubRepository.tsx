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
      className="border border-pink-500 p-2 rounded-md duration-200 bg-pink-600 transition-colors hover:bg-pink-500"
    >
      <h2 className="font-bold mb-1 flex items-baseline">
        <span
          style={{ backgroundColor: repo.primaryLanguage.color }}
          className="w-3 h-3 inline-block rounded-full border border-white mr-2"
        />
        <span>{repo.nameWithOwner}</span>
      </h2>
      {repo.description && <p className="text-xs">{repo.description}</p>}
    </a>
  );
};

export default GitHubRepository;
