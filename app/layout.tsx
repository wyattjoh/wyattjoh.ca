import { Footer } from "../components/footer";
import "../styles/globals.css";

type Props = {
  children: JSX.Element;
};

export default function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans font-light">
        <main className="max-w-3xl mx-auto md:pt-6 mb-24 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
