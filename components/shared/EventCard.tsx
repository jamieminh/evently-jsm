import { IEvent } from "@/lib/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import DeleteConfirmation from "./DeleteConfirmation";

type Props = {
  event: IEvent;
  hidePrice: boolean;
  hasOrderLink: boolean;
};

const EventCard = ({ event, hidePrice, hasOrderLink }: Props) => {
  console.log("EventCard - event", event);
  const { dateTime } = formatDateTime(event.startDateTime);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as String;
  const isEventOriganizer = userId === event.organizer._id.toString();

  return (
    <div className="group relative rounded-xl overflow-hidden border min-h-[380px] w-full max-w-[400px] bg-white shadow-md transition-all hover:shadow-lg md:min-h-[460px] md:h-[460px]">
      <div className="w-full min-h-[150px] h-2/5 relative md:min-h-[200px]">
        <Link href={`/events/${event._id}`}>
          <Image src={event.imageUrl} fill objectFit="cover" alt="event" />
        </Link>
      </div>

      {/* Show edit link to event creator */}
      {isEventOriganizer && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div className="px-5 py-5">
        {!hidePrice && (
          <div className="flex gap-3">
            <p className="font-medium text-xs leading-2 rounded-full bg-green-500/10 px-4 py-1 text-green-700">
              {event.isFree ? "FREE" : `$${event.price}`}
            </p>
            <p className="font-medium text-xs leading-2 rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}

        <p className="mt-4 mb-4 text-gray-500 text-sm">{dateTime}</p>
        <Link href={`/events/${event._id}`}>
          <p className="font-medium text-lg md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>
        <p className="m-medium-16 line-clamp-2 md:line-clamp-3 mt-2">
          {event.description}
        </p>

        <div className="w-full flex-between mt-3">
          <p className="p-medium-14 md:p-medium-16 text-grey-500">{`${event.organizer.firstName} ${event.organizer.lastName}`}</p>
          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Orders</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
