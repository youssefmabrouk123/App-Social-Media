import { useUserContext } from '@/context/AuthContext';
import React from 'react'

const Saved = () => {

  const { user, setUser, setIsAuthenticated, isLoading,profileImage } = useUserContext();

  return (
    <div>
            {profileImage && <img src={profileImage} className="h-14 w-14 rounded-full" alt="User Profile" />}

    </div>
  )
}

export default Saved
