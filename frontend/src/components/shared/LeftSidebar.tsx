import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const [isSuccess, setIsSuccess] = useState(false);
  console.log(user);

  const handleSignOut = () => {
    localStorage.clear();
    setIsSuccess(true);
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    //if it work it work
  };
  useEffect(() => {
    if (isSuccess) navigate("/sign-in");
  }, [isSuccess]);

  ///profilPicture
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        // Fetch the user's authentication token from wherever it's stored (e.g., localStorage)
        const token = localStorage.getItem("accessToken");

        // Include the authentication token in the request headers
        const headers = {
          Authorization: `Bearer ${token}`, // Assuming it's a Bearer token
        };

        // Send the request with the authentication token included in the headers
        const response = await axios.get('http://localhost:8080/users/profile-image', { headers, responseType: 'arraybuffer' });

        // Handle the successful response and use the image data
        console.log('User profile image:', response.data);

        // Convert the binary image data to a base64-encoded string
        const base64Image = arrayBufferToBase64(response.data);
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setProfileImage(imageUrl); // Set the profile image URL in state
      } catch (error) {
        // Handle errors
        console.error('Failed to fetch user profile image:', error);
      }
    };

    // Call the function to fetch the user profile image
    fetchUserProfileImage();
  }, []); // Empty dependency array to run the effect only once

  // Function to convert an array buffer to a base64-encoded string
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  // const handleSignOut = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   // e.preventDefault();
  //   // signOut();
  //   // setIsAuthenticated(false);
  //   // setUser(INITIAL_USER);
  //   // navigate("/sign-in");
  // };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-6 ">
        <Link to="/" className="flex gap-1  items-center">
          { <img
            src="/assets/images/ednet-high-resolution-logo-transparent.png"
            alt="logo"
            width={150}
            height={30}
          /> }
        </Link>

        {isLoading || !user.email ? (
          <div className="h-7">{/* <Loader /> */}</div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            {profileImage && <img src={profileImage} className="h-14 w-14 rounded-full" alt="User Profile" />}
            <div className="flex flex-col">
              <p className="body-bold">
                {user.firstname} {user.lastname}
              </p>
              <p className="small-regular text-light-3">
                @{user.firstname}_{user.lastname}_
              </p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => handleSignOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
