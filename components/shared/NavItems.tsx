"use client";
import { headerLinks } from "@/constants/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "../ui/sheet";
import { useRollbar } from "@rollbar/react";
import { Button } from "../ui/button";

type Props = {
  closeSheetHandler?: () => void;
};

// fix clicking links on mobile not closing the sheet -> this method doesn't work, useState instead
// const NavItemWrapper = ({
//   children,
//   isOnMobile,
// }: {
//   children: React.ReactNode;
//   isOnMobile: boolean;
// }) => {
//   return isOnMobile ? <SheetClose asChild>{children}</SheetClose> : children;
// };

const NavItems = ({ closeSheetHandler = () => {} }: Props) => {
  const pathname = usePathname();
  const rollbar = useRollbar();

  const mockRollbarWarningLogger = () => {
    rollbar.warning("Client warning message with Rollbar.");
  };

  return (
    <ul className="md:flex-between flex w-full flex-col gap-5 items-start md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-16 whitespace-nowrap`}
            onClick={closeSheetHandler}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
      <Button asChild>
        <li
          className="flex-center p-medium-16 whitespace-nowrap cursor-pointer"
          onClick={mockRollbarWarningLogger}
        >
          Log Warning
        </li>
      </Button>
    </ul>
  );
};

export default NavItems;
