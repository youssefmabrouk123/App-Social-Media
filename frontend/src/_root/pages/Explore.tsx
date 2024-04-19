import GridEventList from '@/components/shared/GridEventList';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

interface Event {
  id: number;
  imageData: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
}

const Explore = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<any[]>('http://localhost:8080/users/events/allevents');
        console.log("/////");
        console.log(response.data);
        const eventsWithImages = response.data.event.map((event: any) => ({
          id: event.eventId,
          imageData: event.imageData ? `data:image/jpeg;base64,${event.imageData}` : undefined,
          //imageData: `data:image/jpeg;base64,${event.imageData}`,
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventDate: event.eventDate || "Date not available",
        }));

        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Failed to fetch saved events:', error);
      } finally {
        setIsLoading(false);
      }
    };


    fetchSavedEvents();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  console.log("@@@@")
  console.log(events)

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/wallpaper.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Events</h2>
      </div>
      <div className="flex gap-2 w-full max-w-5xl">
        <Button
          className={`${user.role === "CLUB" ? "shad-button_primary whitespace-nowrap" : "hidden"}`}
          type="submit"
          onClick={() => navigate('/create-event')} >
          Create an event as {user.firstname}
        </Button>


      </div>
      <div style={{ marginRight: '40px', padding: "30px ", paddingTop: '0px', }}>
        {events.length > 0 ? (
          <GridEventList events={events} />
        ) : (
          <p>No saved events found</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
