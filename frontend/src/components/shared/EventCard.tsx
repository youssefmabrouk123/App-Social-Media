import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Event {
  id: number;
  eventName: string;
  eventDescription: string;
  location: string;
  organizer: string;
  eventDate: string;
  filename: string;
}

interface EventCardProps {
  eventId: number;
  userId: number;
  creatorFirstname: string;
  creatorLastname: string;
  eventImage: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventId,
  userId,
  creatorFirstname,
  creatorLastname,
  eventImage,
}) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get<Event>(`http://localhost:8080/users/events/all`);
        setEvent(response.data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  if (!event) {
    return null; // or display a loading indicator
  }

  return (
    <div className="event-card" style={{ marginBottom: '30px' }}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${userId}`}>
            <img
              src={eventImage || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {creatorFirstname} {creatorLastname}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {event.eventDate}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {event.location}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/events/${eventId}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{event.eventName}</p>
          <p className="text-light-3">{event.eventDescription}</p>
        </div>

        <img
          src={eventImage}
          alt="event image"
          className="event-card_img"
        />
      </Link>
    </div>
  );
};

export default EventCard;
