import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";

type Props = {
  params: { id: string };
};

const UpdateEventPage = async ({ params }: Props) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const eventId = params.id;
  const event = await getEventById(eventId);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={userId} type="update" event={event} eventId={eventId} />
      </div>
    </>
  );
};

export default UpdateEventPage;
