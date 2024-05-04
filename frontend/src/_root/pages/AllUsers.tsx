import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredUsers = users.filter(user => {
    const searchLowerCase = searchTerm.toLowerCase();
    return (
      user.firstname.toLowerCase().includes(searchLowerCase) ||
      user.lastname.toLowerCase().includes(searchLowerCase) ||
      user.email.toLowerCase().includes(searchLowerCase)
    );
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <div className="xl:w-96">
          <div className="flex w-full flex-wrap items-stretch">
              <input
                type="search"
                className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-4 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-white focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)]  focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                value={searchTerm}
                onChange={handleSearchChange}
              />

              {/* <!--Search icon--> */}
              <span 
                  className="input-group-text flex items-center whitespace-nowrap rounded px-4 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                  id="basic-addon2">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5">
                      <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd" />
                  </svg>
              </span>
          </div>
        </div>
        {/* User list rendering code */}
        {filteredUsers && filteredUsers.length > 0 ? (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap', // Allow items to wrap to the next line
            justifyContent: 'center', 
            maxWidth: '100%', 
            overflowX: 'auto',
          }}>
            {filteredUsers.map((user) => (
              <UserCard
                key={user.userId}
                user={user}
              />
            ))}
          </div>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
