import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <main className="relative min-h-screen">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
