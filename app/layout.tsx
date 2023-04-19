import "../styles/globals.css";

type Props = {
  children: JSX.Element;
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <main className="font-mono max-w-3xl mx-auto mb-8 md:my-6 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
