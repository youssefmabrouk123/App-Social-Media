import { useParams, Link, useNavigate } from "react-router-dom";




import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {



  const handleDeletePost = () => {
    
  };

  return (
    <div className="post_details-container">
      {/* <div className="hidden md:flex max-w-5xl w-full">
        <Button
          
          variant="ghost"
          className="shad-button_ghost">
          <img
            src="/assets/icons/profile-placeholder.svg"
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div> */}

      
        <div className="post_details-card">
          <img
            src="assets/images/hack.jpg"
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to="/profile"
                className="flex items-center gap-3">
                <img
                  src="/assets/images/ggg.png"
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
Ensit Geeks Club                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      10h
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                  Tunis                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to="/update-post"
                  >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className="ost_details-delete_btn ">
                  
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>Geeks Hack 3.0: 24-Hour Hackathon,
Are you ready to unleash your inner coding genius, dive into the world of challenges, and compete for major cash prizes🏆?
The next chapter of our hackathon, will take place on November 25 and 26, 2023. This event brings together students from various universities for a 24-hour computer problem-solving competition. Geeks'Hack promises innovation, collaboration, and technological challenges. Teams compete to find efficient solutions using different programming languages such as C, C++, Python, and Java, all within our platform developed and maintained by members of the GEEKS Club.
🗓️ Date: November 25th to November 26th, 2023
⏰ Time: 9:00 AM on November 25th to 9:00 AM on November 26th (24 Hours of Fun Coding)
🌐 Location: ENSIT
📋 Registration: Coming Soon!
</p>
              <ul className="flex gap-1 mt-2">
                
                  <li>
                    #GeeksHack3.0
                    
                  </li>
                  <li>
                    #hackathon
                    
                  </li>   <li>
                    #Ensit
                    
                  </li>
               
              </ul>
            </div>

            <div className="w-full">
              <PostStats />
            </div>
          </div>
        </div>
     

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Event
        </h3>

      </div>
    </div>
  );
};

export default PostDetails;
