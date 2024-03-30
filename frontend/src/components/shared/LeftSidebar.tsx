import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
  const [isSuccess,setIsSuccess]=useState(false)


  const handleSignOut =() =>{

    localStorage.clear();
    setIsSuccess(true);
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    //if it work it work 

}
useEffect(() => {
  if (isSuccess) navigate('/sign-in');
}, [isSuccess]);

  
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
          <img
            src="/assets/images/ednet-high-resolution-logo-transparent.png"
            alt="logo"
            width={150}
            height={30}
          />
        </Link>

        {isLoading || !user.email ? (
          <div className="h-7">
            {/* <Loader /> */}
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.firstname} {user.lastname}</p>
              <p className="small-regular text-light-3">@{user.firstname}_{user.lastname}_</p>
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
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
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
        onClick={() => handleSignOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;