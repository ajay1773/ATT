"use client";
import AuthContext from "~/components/custom/AuthContext";
import { Navbar } from "~/components/custom/Navbar";

export default function ConfigurationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContext>
      <Navbar>{children}</Navbar>
    </AuthContext>
  );
}
