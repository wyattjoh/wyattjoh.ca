type Props = {
  href: string;
  children: string;
};

export function Link({ href, children }: Props) {
  return (
    <a
      className="underline decoration-2 decoration-gray-300 hover:decoration-black"
      rel="nofollow noreferrer"
      href={href}
    >
      {children}
    </a>
  );
}
