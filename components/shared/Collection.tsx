import { IEvent } from "@/lib/database/models/event.model";
import { CollectionTypes } from "@/types";
import EventCard from "./EventCard";
import Pagination from "./Pagination";

type Props = {
  data: IEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType: CollectionTypes;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
};

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  limit,
  page,
  totalPages = 0,
  urlParamName,
}: Props) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              const hasOrderLink =
                collectionType === CollectionTypes.Events_Organized;
              const hidePrice = collectionType === CollectionTypes.My_Tickets;
              return (
                <li key={event._id}>
                  <EventCard
                    event={event}
                    hidePrice={hidePrice}
                    hasOrderLink={hasOrderLink}
                  />
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && <Pagination urlParamName={urlParamName} page={page} totalPages={totalPages} />}
        </div>
      ) : (
        <div className="bg-grey-50 rounded-xl max-w-[400px] mx-auto w-full py-10 px-10">
          <h3 className="text-center font-semibold text-xl ">{emptyTitle}</h3>
          <p className="text-center mt-4">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
