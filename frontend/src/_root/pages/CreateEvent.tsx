import EventForm from "@/components/forms/EventForm";

const CreateEvent = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={44}
            height={40}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Event</h2>
        </div>
        <EventForm />
      </div>
    </div>
  );
};

export default CreateEvent;