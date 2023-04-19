import "../styles/globals.css";

export default function Layout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen min-w-screen relative contents">
          <div className="font-mono max-w-3xl mx-auto md:my-6 flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
