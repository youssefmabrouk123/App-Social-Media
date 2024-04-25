import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { checkIsLiked } from "@/lib/utils";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";

interface PostStatsProps {
  idPost: number;
  interactions: number;
  liked: boolean;
  saved: boolean;
  postInteraction: [];
  // Add more props as needed
}

const PostStats: React.FC<PostStatsProps> = ({
  idPost,
  liked,
  saved,
  interactions,
}) => {

  // console.log('+++++++++++++++')
  // console.log(idPost)
  // console.log(liked)
  // console.log(saved)
  // console.log(interactions)
  // console.log('+++++++++++++++')

  useEffect(() => {
    setIsSaved(saved);
    setIsLiked(liked);
    setLiveInteraction(interactions);
  }, [saved, liked, interactions]);


  const [isPostInteraction, setIsPostInteraction] = useState<[]>();
  const [isSaved, setIsSaved] = useState<boolean>();
  const [isLiked, setIsLiked] = useState<boolean>();
  const [liveInteraction, setLiveInteraction] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserContext();
  const [isHovered, setIsHovered] = useState(false);
  const [postInteractionList, setPostInteractionList] = useState<[]>([]);


  const handleHover = () => {
    setIsHovered(true);

  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const refreshListLikes = async (idPost: any) => {
    try {
      const rep = await axios.get(`http://localhost:8080/users/interaction/post/${idPost}`);
      const { data: interactionData } = rep;
      setPostInteractionList(interactionData);
    } catch (error) {
      console.error("Error refreshing likes:", error);
    }
  };
  useEffect(() => {
    refreshListLikes(idPost);
  });



  const savePost = async (id: number | undefined) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:8080/users/savedposts/${id}/save`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("*************");
      console.log(response.data);
      console.log("*************");

      return response.data; // Return more detailed response if needed
    } catch (error) {
      console.error("Error saving post:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unSavePost = async (id: number | undefined) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:8080/users/savedposts/${id}/unsave`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data");
      console.log(response.data);
      return response.data; // Return more detailed response if needed
    } catch (error) {
      console.error("Error unsaving post:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePost = () => {
    if (isSaved === false) {
      savePost(idPost).then((response) => {
        if (response) {
          setIsSaved(true);
        }
      });
    } else {
      unSavePost(idPost).then((response) => {
        if (response) {
          setIsSaved(false);
        }
      });
    }
  };

  const likePost = async (id: number | undefined) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:8080/users/interaction/add/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiked(true);
      console.log("Post liked:", response.data);
      return true;
    } catch (error) {
      console.error("Error liking post:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unLikePost = async (id: number | undefined) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `http://localhost:8080/users/interaction/delete/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiked(false);
      console.log("Post unliked:", response.data);
      return true;
    } catch (error) {
      console.error("Error unliking post:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = () => {
    if (isLiked) {
      unLikePost(idPost);
      refreshListLikes(idPost)
    } else {
      likePost(idPost);
      refreshListLikes(idPost)
    }
  };


  const getInteraction = async (id: number | undefined) => {

    const response = await axios.get(`http://localhost:8080/users/posts/getInteraction/${id}`);

    setLiveInteraction(response.data.interactions);
  }

  useEffect(() => {
    getInteraction(idPost);
  }, [liked, isLiked]);


  return (
    <div
      className="flex justify-between items-center z-20 ">
      <div className="flex gap-2 mr-5">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}

          alt="like"
          width={20}
          height={20}
          onClick={() => handleLikePost()}
          className="cursor-pointer"
        />
        <div onMouseEnter={handleHover} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }} >
          {isHovered && (
            <Popover open={isHovered}>
              <PopoverTrigger></PopoverTrigger>
              <PopoverContent>
                {postInteractionList && postInteractionList.map((interaction, index) => (
                  <div key={index}>{interaction}</div>
                ))}
              </PopoverContent>
            </Popover>
          )}
          <div className="small-medium lg:base-medium" >{liveInteraction}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={() => handleSavePost()}
        />
      </div>
    </div>
  );
};

export default PostStats;
