import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { CollectionTypes, SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

const EVENTS_LIMIT: number = 3;

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const eventsResponse = await getAllEvents({
    query: searchText,
    category,
    limit: EVENTS_LIMIT,
    page,
  });

  console.log("eventsResponse", eventsResponse);

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
              **Every event in this website is entirely FICTIONAL, take them
              with no salt.
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
        <h2 className="h2-bold ">
          Trusted by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search placeholder="Search title..." />
          <CategoryFilter placeholder="Category" />
        </div>
        <Collection
          data={eventsResponse?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType={CollectionTypes.All_Events}
          limit={EVENTS_LIMIT}
          page={page}
          totalPages={eventsResponse?.totalPages}
        />
      </section>
    </>
  );
}
