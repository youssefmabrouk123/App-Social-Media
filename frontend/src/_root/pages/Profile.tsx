import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Home } from ".";
// import { useGetUserById } from "@/lib/react-query/queries";
// import { Loader } from "@/components/shared/Loader";

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
  // const { data: currentUser } =null;

  // if (!currentUser)
  //   return (
  //     <div className="flex-center w-full h-full">
  //       {/* <Loader /> */}
  //     </div>
  //   );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={"/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                yassine
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                waaywa
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={20} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              Inspirational Instagram bio ideas · Every day I create a life I
              love · When the world is dark, look up to the stars · Trying to
              watch ... ‎200+ best Instagram bio ideas... · ‎Instagram bio puns
              · ‎What is an Instagram bio?
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className="hidden">
              <Link
                to={`/update-profile`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg 
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
            <div className="hidden">
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/`}
          className={`profile-tab rounded-l-lg !bg-dark-3"
            }`}
        >
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>
        <Link
          to={`/profile/liked-posts`}
          className={`profile-tab rounded-r-lg 
            }`}
        >
          <img
            src={"/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
          />
          Liked Posts
        </Link>
      </div>

      <Routes>
        <Route
          index
          // element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {<Route path="/liked-posts" element={<Home />} />}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
