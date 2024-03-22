"use client";
import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import Checkout from "./Checkout";

type Props = {
  event: IEvent;
};

const CheckoutButton = ({ event }: Props) => {
  const { user } = useUser();
  console.log('CheckoutButton - user', user);

  const userId = user?.publicMetadata?.userId as string;
  const isEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {/* Cannot by past event */}
      {isEventFinished ? (
        <p className="p-2 text-red-400">Tickets are no longer available</p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size={"lg"}>
              <Link href="/sign-in">Sign in to buy tickets</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
