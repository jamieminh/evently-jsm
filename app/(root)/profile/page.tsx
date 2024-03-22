import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByBuyer } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/database/models/order.model";
import { CollectionTypes, SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const orders = await getOrdersByBuyer({ userId, page: ordersPage, limit: 6 });

  const organizedEvents = await getEventsByUser({
    userId,
    page: eventsPage,
    limit: 6,
  });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  console.log("Profile - orderedEvents", orderedEvents);

  return (
    <>
      {/* My Tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:z-10">
        <div className="wrapper flex flex-col sm:flex-row items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button
            asChild
            className="flex sm:hidden text-sm py-2 h-10 rounded-full mt-3"
          >
            <Link href="/#events">Explore</Link>
          </Button>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of events to explore"
          collectionType={CollectionTypes.My_Tickets}
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      {/* Event Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:z-10">
        <div className="wrapper flex flex-col sm:flex-row items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>

          <div className="flex gap-2 items-center mt-3 md:mt-0">
            <Button
              asChild
              className="flex text-sm py-2 h-10 rounded-full sm:text-base md:h-14"
            >
              <Link href="/orders">All Orders</Link>
            </Button>
            <Button
              asChild
              className="flex sm:hidden text-sm py-2 h-10 rounded-full"
            >
              <Link href="/events/create">Create</Link>
            </Button>
            <Button asChild size="lg" className="button hidden md:flex">
              <Link href="/events/create">Create New Events</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No event created yet"
          emptyStateSubtext="Let's create one now"
          collectionType={CollectionTypes.Events_Organized}
          limit={6}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
