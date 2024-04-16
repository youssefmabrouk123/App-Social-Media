import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';


type UserCardProps = {
  user: {
    imageUrl: string;
    firstname: string;
    lastname: string;
    email: string;
    userId: number; // Assuming this is the correct property name for user ID
  };
};

const UserCard = ({ user }: UserCardProps) => {
  return (
<div className="user-card" style={{ margin: '45px', transform: 'scale(1.25)' }}>
      <img
        src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.firstname} {user.lastname}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          {user.email}
        </p>
      </div>
      <Link to={`/profile/${user.userId}`}>
        <Button type="button" size="sm" className="shad-button_primary px-5">
          Profil
        </Button>
      </Link>
    </div>

  );
};

export default UserCard;
