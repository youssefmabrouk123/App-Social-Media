import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import { useParams } from 'react-router-dom';
import { CUser } from '@/types';
import PostCard from '@/components/shared/postCard';


const AllUsers = () => {

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
  </div>
  </div>
  );
};

export default AllUsers;