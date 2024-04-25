import React from 'react';
import { Link } from "react-router-dom";

const GridEventList = ({ events }: any) => {
  if (!events || events.length === 0) {
    return <p>No events available</p>;
  }
  
  return (
    <ul className="grid-container">
      {events.slice().reverse().map((event:any) => (
        <li key={event.id} className="relative min-w-80 h-80">
          <Link to={{ pathname: `/events/${event.id}`}} className="grid-post_link">
            <img
              src={event.imageData || "/assets/icons/wallpaper.svg"}
              alt="Failed to upload event's image"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            <div className="flex items-center justify-start gap-2 flex-1">
              <p className="line-clamp-1">{event.eventName}</p>
            </div>
        
            <div className="flex items-center justify-start gap-2 flex-1">
              <p className="line-clamp-1">{event.eventDate}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridEventList;