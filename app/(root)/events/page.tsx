import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { getAllEvents } from "@/lib/actions/event.actions";
import { CollectionTypes, SearchParamProps } from "@/types";

const EVENTS_LIMIT: number = 6;

const EventsPage = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const eventsResponse = await getAllEvents({
    query: searchText,
    category,
    limit: EVENTS_LIMIT,
    page,
  });

  return (
    <div className="pt-14 pb-20">
      <div className="wrapper">
        <h2 className="text-center h2-bold mb-20">
          Explore from Thousands of Events
        </h2>
        <div className="flex w-full flex-col gap-5 md:flex-row mb-14">
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
      </div>
    </div>
  );
};

export default EventsPage;
