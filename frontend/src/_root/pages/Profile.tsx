import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Home } from ".";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import LikedPosts from "./LikedPosts";
import axios from "axios";
import { useEffect, useState } from "react";
import { CUser } from "@/types";
import { any } from "zod";
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

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CUser | null>(null);
  const [posts, setPosts] = useState<any>(null);
  const [flipper, setFlipper] = useState(true);


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

          setPosts(userPosts);
          console.log(userPosts);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

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
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.firstname + " " + currentUser.lastname}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.firstname + "_" + currentUser.firstname}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={posts.length} label="Posts" />
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
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.id && "hidden"
                }`}
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
        className={`profile-tab h-14 rounded-l-lg  ${ flipper==!true && "!bg-dark-3"} `}
        onClick={()=>setFlipper(true)}
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
        className={`profile-tab h-14 rounded-l-lg ml-7 ${ flipper==!false && "!bg-dark-3"} `}
        onClick={()=>setFlipper(false)}>     
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

