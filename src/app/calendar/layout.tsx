import { Navbar } from "~/components/custom/Navbar";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navbar>{children}</Navbar>;
}
