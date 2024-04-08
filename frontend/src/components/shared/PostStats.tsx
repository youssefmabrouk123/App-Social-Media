import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";




const  savePost =  async(id: string | undefined) => {
  setIsLoading(true);
  try{
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`localhost:8080/users/savedposts/${id}/save`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the Authorization header with the JWT token
      }
    });
    console.log('*************');
    console.log(response.data);
    console.log('*************');


    if (response) {
            
    
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

const  unSavePost =  async(id: string | undefined) => {
  setIsLoading(true);
  try{
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`localhost:8080/users/savedposts/${id}/unsave`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the Authorization header with the JWT token
      }
    });
    console.log('*************');
    console.log(response.data);
    console.log('*************');


    if (response) {
            
    
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

const PostStats = ({postId}:any) => {
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserContext();




  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if(isSaved===false){
      savePost(user.id);
      setIsSaved(true);
      
    }else{
      unSavePost(user.id);
      setIsSaved(true);

    }


  };

  const handleSavePost = () => {

    



   
  };

 

  return (
    <div
      className="flex justify-between items-center z-20 ">
      <div className="flex gap-2 mr-5">
        <img
          src="/assets/icons/like.svg"
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">5001</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost()}
        />
      </div>
    </div>
  );
};

export default PostStats;
