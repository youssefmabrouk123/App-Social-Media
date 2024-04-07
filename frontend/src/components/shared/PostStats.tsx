import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";


type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = () => {
  


  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();


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
          src="/assets/icons/save.svg"
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
