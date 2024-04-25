import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import axios from "axios";

export const INITIAL_USER = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  role: "",
  birthDate:"",
  age: "",
  bio: "",
  filiere: "",
  imageUrl: "",
  post: [],
  savedPosts: [],
  likedInteractions: [],
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  setIsLoading: async () => false as boolean,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  accessToken: "",
  setAccessToken: () => "",
  refreshToken: "",
  setRefreshToken: () => "",
  profileImage: null,
  fetch: false,
  setFetch: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  refreshToken: string;
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
  profileImage: string;
  fetch: boolean;
  setFetch: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [fetch, setFetch] = useState(false);

  // const [refresh, setRefresh] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/users/user", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Authorization header with the JWT token
        },
      });
      console.log("*************");
      console.log(response.data);
      console.log("*************");

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
          role: response.data.role,
          age: response.data.age,
          bio: response.data.bio,
          filiere: response.data.filiere,
          imageUrl: response.data.imageUrl,
          post: response.data.post,
          savedPosts: response.data.savedPosts,
          likedInteractions: response.data.likedInteractions,
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
  const fetchUserProfileImage = async () => {
    try {
      // Fetch the user's authentication token from wherever it's stored (e.g., localStorage)
      const token = localStorage.getItem("accessToken");

      // Include the authentication token in the request headers
      const headers = {
        Authorization: `Bearer ${token}`, // Assuming it's a Bearer token
      };

      // Send the request with the authentication token included in the headers
      const response = await axios.get(
        "http://localhost:8080/users/profile-image",
        { headers, responseType: "arraybuffer" }
      );

      // Handle the successful response and use the image data
      console.log("User profile image:", response.data);

      // Convert the binary image data to a base64-encoded string
      const base64Image = arrayBufferToBase64(response.data);
      const image = `data:image/png;base64,${base64Image}`;
      setProfileImage(image); // Set the profile image URL in state

      //const updatedUser = { ...user, imageUrl: image };
      // Then update the state
      //setUser(updatedUser);
    } catch (error) {
      // Handle errors
      console.error("Failed to fetch user profile image:", error);
    }
  };
  const arrayBufferToBase64 = (buffer: any) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      accessToken === "[]" ||
      accessToken === null ||
      accessToken === undefined
    ) {
      navigate("/sign-in");
    } else {
      checkAuthUser();
      fetchUserProfileImage();
    }

    // checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    profileImage,
    fetch,
    setFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
