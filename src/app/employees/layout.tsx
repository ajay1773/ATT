import { Navbar } from "~/components/custom/Navbar";

export default function LeavesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navbar>{children}</Navbar>;
}
