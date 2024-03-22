import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";

type Props = {};

const CreateEventPage = (props: Props) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={userId as string} type="create" />
      </div>
    </>
  );
};

export default CreateEventPage;
