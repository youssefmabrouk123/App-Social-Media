import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/users/allusers');
        const usersWithImages = response.data.map(user => ({
          ...user,
          imageUrl: user.imageProfilData ? `data:image/jpeg;base64,${user.imageProfilData}` : "/assets/icons/profile-placeholder.svg"
        }));
        setUsers(usersWithImages);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <Loader />;
  }


  console.log("0000")
  console.log(users)


  return (
    <div className="profile-container">
      
      {/* User list rendering code */}
      {users && users.length > 0 ? (
        <div style={{
          display: 'flex',
        }}>
          {users.map((user) => (
            <UserCard 
            style={{ marginRight: '30px auto ', paddingLeft: '20px', }}
              key={user.userId}
              user={user}
            />


          ))}
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default AllUsers;
