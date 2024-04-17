import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { logServerInfo } from "@/lib/logger/rollbar-server";
import { CollectionTypes } from "@/types";
import Image from "next/image";
import Link from "next/link";

const EVENTS_LIMIT: number = 3;

export default async function Home() {
  const eventsResponse = await getAllEvents({
    query: "",
    limit: EVENTS_LIMIT,
    page: 1,
    category: "",
  });

  console.log("eventsResponse", eventsResponse);

  // the RollbarProvider in root layout will catch this error
  const mockRollbarErrorLogger = () => {
    throw new Error("This is a test error for Rollbar.");
  };

  const mockRollbarInfoLogger = () => {
    logServerInfo("Log info from server component");
  };

  // mockRollbarErrorLogger();
  // mockRollbarInfoLogger();

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate: Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and lern helpful tips from 1,102+ mentors in world-class
              companies with our global community.
            </p>
            <p className="text-xs">
              **Every event in this website is entirely FICTIONAL. This website
              is a educational personal project and is not intended for
              commercial use.
            </p>
            <Button className="button w-full sm:w-fit" size={"lg"} asChild>
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="Hero"
            width={1000}
            height={1000}
            className="max-h=[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold ">Featured Events</h2>

        <Collection
          data={eventsResponse?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType={CollectionTypes.All_Events}
          limit={EVENTS_LIMIT}
          page={1}
          totalPages={1}
        />
      </section>
    </>
  );
}
