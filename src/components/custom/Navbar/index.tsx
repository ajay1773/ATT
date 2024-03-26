"use client";
import classNames from "classnames";
import { map } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { ENavIconNames } from "~/constants/enums";
import { navigation } from "~/config/navigation";
import { RiHome4Fill } from "react-icons/ri";
import { IconType } from "react-icons/lib";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiUserStarFill } from "react-icons/ri";
import { RiLuggageCartFill } from "react-icons/ri";
import { RiSettings3Fill, RiCalendar2Fill } from "react-icons/ri";

type TIconConfig = {
  [key: string]: IconType;
};

type TNavbarProps = {
  children: React.ReactNode;
};

const IconConfig: TIconConfig = {
  [ENavIconNames.Dashboard]: RiHome4Fill,
  [ENavIconNames.Calendar]: RiCalendar2Fill,
  [ENavIconNames.Leaves]: RiLuggageCartFill,
  [ENavIconNames.Employees]: RiUserStarFill,
  [ENavIconNames.Settings]: RiSettings3Fill,
};

export function Navbar({ children }: TNavbarProps) {
  const currentPath = usePathname();
  const router = useRouter();
  const logout = () => {
    signOut({ redirect: false })
      .then(() => {
        router.push("/login");
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <main className="flex min-h-screen w-screen">
      <nav className="flex min-h-full w-2/12 flex-col justify-between border-r border-gray-300 bg-white p-8">
        <div className="flex h-full w-full flex-col">
          <div className="mb-6 flex items-center justify-center">
            <Image
              className="cursor-pointer"
              src={"/logo.svg"}
              alt="logo"
              width={90}
              height={90}
            />
          </div>
          <div className="mt-6 flex flex-col gap-6">
            {map(navigation, (nav) => {
              const Icon = IconConfig[`${nav.iconName}`] as IconType;
              const isActive = currentPath && currentPath === nav.link;
              const linkClassName = classNames(
                "flex justify-start gap-4 items-center px-3 py-2 text-sm",
                {
                  "bg-gray-50 shadow rounded text-blue-500 font-medium border-l-4 border-blue-500":
                    isActive,
                  "text-black": !isActive,
                },
              );
              return (
                <Link key={nav.label} href={nav.link} className={linkClassName}>
                  <Icon className="text-xl" />
                  {nav.label}
                </Link>
              );
            })}
          </div>
        </div>
        <Button variant={"secondary"} onClick={logout}>
          Logout
        </Button>
      </nav>
      <aside className="w-10/12 bg-gray-50 p-6">{children}</aside>
    </main>
  );
}
