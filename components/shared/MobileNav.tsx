'use client'
import Image from "next/image";
import { useState } from "react";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "../ui/sheet";
import NavItems from "./NavItems";

type Props = {};

const MobileNav = (props: Props) => {
  // sepearate state to fix the sheet not closing when clicking links on mobile
  const [sheetOpen, setSheetOpen] = useState(false);

  const closeSheetHandler = () => {
    setSheetOpen(false);
  }

  return (
    <nav className="md:hidden">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger className="align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white md:hidden">
          <Image
            src="/assets/images/logo.svg"
            alt="Evently"
            width={128}
            height={38}
          />
          <Separator className="border border-gray-50" />
          <NavItems closeSheetHandler={closeSheetHandler} />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
