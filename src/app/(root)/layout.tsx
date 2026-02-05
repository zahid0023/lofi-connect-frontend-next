import { Footer } from "@/layouts/home/footer";
import { Header } from "@/layouts/home/header";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
