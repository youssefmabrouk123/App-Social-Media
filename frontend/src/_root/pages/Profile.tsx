import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import GridPostList from '@/components/shared/GridPostList';
import { CUser } from '@/types';
import { useUserContext } from '@/context/AuthContext';
import { Route, Routes, Link, Outlet, useParams, useLocation, } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserDetail from "./UserDetail";


interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

// Function to convert an array buffer to a base64-encoded string
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CUser | null>(null);
  const [posts, setPosts] = useState<any>(null);
  const [flipper, setFlipper] = useState(true);
  const [profileImage, setProfileImage] = useState("");



  useEffect(() => {
    const fetchData = async (id: string | undefined) => {
      setIsLoading(true);
      try {
        const [userDataResponse, userPostsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/users/userdetail/${id}`),
          axios.get(`http://localhost:8080/users/${id}/posts`),
        ]);

        
        if (userDataResponse.data && userPostsResponse.data) {
          const userData: CUser = {
            id: userDataResponse.data.id,
            firstname: userDataResponse.data.firstname,
            lastname: userDataResponse.data.lastname,
            email: userDataResponse.data.email,
            role: userDataResponse.data.role,
            age: userDataResponse.data.age,
            bio: userDataResponse.data.bio,
            imageUrl: userDataResponse.data.image,
            filiere: userDataResponse.data.filiere,
            post: userDataResponse.data.post,
          };

          const userPosts = userPostsResponse.data;
          setCurrentUser(userData);
          console.log(userData);

          const postsWithImages = await Promise.all(userPosts.map(async (post: any) => {
            const imageResponse = await axios.get(`http://localhost:8080/users/posts/image/${post.id}`, {
              responseType: 'arraybuffer'
            });
            const base64Image = arrayBufferToBase64(imageResponse.data);
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;
            return { ...post, imageUrl };
          }));

          setPosts(postsWithImages);
          console.log(userPosts);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    const fetchUserProfileImage = async (id: string | undefined) => {
      try {
        // Fetch the user's authentication token from wherever it's stored (e.g., localStorage)
        const token = localStorage.getItem("accessToken");

        // Include the authentication token in the request headers


        // Send the request with the authentication token included in the headers
        const response = await axios.get(`http://localhost:8080/users/profileimagebyid/${id}`, { responseType: 'arraybuffer' });

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
    fetchUserProfileImage(id);

    fetchData(id);
  }, [id]);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img src={profileImage || "/assets/icons/profile-placeholder.svg"} alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full" />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.firstname + " " + currentUser.lastname}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.firstname + "_" + currentUser.lastname+"_"}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={posts ? posts.length : 0} label="Posts" />
              {/* <StatBlock value={20} label="" />
              <StatBlock value={20} label="Following" /> */}
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id == currentUser.id || "hidden"}`}>
              <Link
                to={`/update-profile`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.id && "hidden"}`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full" >
        <Button
          className={`profile-tab h-14 rounded-l-lg  ${flipper ? "" : "!bg-dark-3"} `}
          onClick={() => setFlipper(true)}
        >
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Button>

        <Button
          className={`profile-tab h-14 rounded-l-lg ml-7 ${!flipper ? "" : "!bg-dark-3"} `}
          onClick={() => setFlipper(false)}
        >
          <img
            src={"/assets/icons/follow.svg"}
            alt="like"
            width={20}
            height={20}
          />
          User Details
        </Button>
      </div>

      

{flipper ? <GridPostList posts={posts} /> : <UserDetail user={currentUser}/>}
    </div>
  );
};

export default Profile;
