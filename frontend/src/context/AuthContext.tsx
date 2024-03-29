import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import axios from "axios";

export const INITIAL_USER = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  accessToken:"",
  setAccessToken:()=>"",
  refreshToken:"",
  setRefreshToken:()=>"",
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  accessToken:string;
  setAccessToken:React.Dispatch<React.SetStateAction<string>>;
  refreshToken:string;
  setRefreshToken:React.Dispatch<React.SetStateAction<string>>;

};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken,setAccessToken] = useState("");
  const [refreshToken,setRefreshToken] = useState("");


  // const  checkAuthUser =  async() => {
  //   setIsLoading(true);
  //   try{
  //     const response = await axios.get("http://localhost:8080/users/getall");

  //     console.log(response.data);

  //     if (response) {
  //             setUser({
  //               id: response.data.id,
  //               firstname: response.data.firstname,
  //               lastname: response.data.lastname,
  //               email: response.data.email,
  //               imageUrl: response.data.imageUrl,
  //               bio: response.data.bio,
  //             });
  //             setIsAuthenticated(true);
      
  //             return true;
  //            }
  //            return false;
  //              } catch (error) {
  //                console.error(error);
  //                return false;
  //              } finally {
  //                setIsLoading(false);
  //              }
  // };
  const  checkAuthUser =  async() => {
    setIsLoading(true);
    try{
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8080/users/user', {
        headers: {
          Authorization: `Bearer ${token}` // Include the Authorization header with the JWT token
        }
      });
      console.log('*************');
      console.log(response.data);
      console.log('*************');


      if (response) {
              // setUser({
              //   id: response.data.id,
              //   firstname: response.data.firstname,
              //   lastname: response.data.lastname,
              //   email: response.data.email,
              //   imageUrl: response.data.imageUrl,
              //   bio: response.data.bio,
              // });
              const userData = {
                id: response.data.id,
                firstname: response.data.firstname,
                lastname: response.data.lastname,
                email: response.data.email,
                imageUrl: response.data.image, // Assuming image is stored in 'image' property in the response
                bio: response.data.bio
              };
              setUser(userData);
              setIsAuthenticated(true);
      
              return true;
             }
             return false;
               } catch (error) {
                 console.error(error);
                 return false;
               } finally {
                 setIsLoading(false);
               }
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      accessToken === "[]" ||
      accessToken === null ||
      accessToken === undefined
    ) {
      navigate("/sign-in");
    }else{checkAuthUser();}

    // checkAuthUser();
   }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);

