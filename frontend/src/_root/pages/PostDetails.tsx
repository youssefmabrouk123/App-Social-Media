
import { useParams, Link, useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import PostStats from "@/components/shared/PostStats";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, useToast } from "@/components/ui/use-toast";

const arrayBufferToBase64 = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

interface UserPost {
  postId: number;
  userId: number;
  interactions: number;
  caption: string;
  location: string;
  tags: string;
  imageData: ArrayBuffer;
  creationdate: string;
}

interface Post {
  postId: number;
  userId: number;
  firstname: string;
  lastname: string;
  liked?: boolean;
  saved?: boolean;
  imageProfilData?: string; // Change to string as it will contain base64 string
}

const PostDetails = () => {
  const { user } = useUserContext();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<Post>();
  const [userPost, setUserPost] = useState<UserPost>();
  const [imageURL, setImageURL] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();


  useEffect(() => {
    const fetchData = async (id: any) => {
      const token = localStorage.getItem("accessToken");
      setIsLoading(true);
      try {
        const response = await axios.get<Post>(
          `http://localhost:8080/users/posts/postsowner/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Authorization header with the JWT token
            },
          }
        );

        console.log(response.data);

        if (response.data) {
          const {
            postId,
            userId,
            firstname,
            lastname,
            liked,
            saved,
            imageProfilData,
          } = response.data;
          // Convert image data to base64 if present
          const updatedPost: Post = {
            postId,
            userId,
            firstname,
            lastname,
            liked,
            saved,
            imageProfilData: imageProfilData
              ? `data:image/jpeg;base64,${imageProfilData}`
              : undefined,
          };
          setPost(updatedPost);
        } else {
          console.error("Invalid response format: Missing data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPostDetail = async (id: any) => {
      try {
        const response = await axios.get<UserPost>(`http://localhost:8080/users/posts/all/${id}`);
        const { data } = response;
        setUserPost(data);
        const imageResponse = await axios.get(`http://localhost:8080/users/posts/image/${id}`, {
          responseType: 'arraybuffer'
        });
        const base64Image = arrayBufferToBase64(imageResponse.data);
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        setImageURL(imageUrl);

      } catch (error) {
        console.error('Failed to fetch post details:', error);
      }
    };

    fetchData(id);
    fetchPostDetail(id);

  }, [id]);

  const handleDelete = async (postId:any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`http://localhost:8080/users/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title :'Post deleted ✔ '
      });
      navigate('/');
      console.log('Post deleted successfully:', response.data);
    } catch (error) {
      toast({
        title :'Failed to delete post'
      });
      console.error('Failed to delete post:', error);
    }
  };
  
  // console.log('----------------------')
  //           console.log(post?.liked)
  //           console.log(post?.saved)
  //           console.log(userPost?.interactions)
  //           console.log(post?.postId)

  //           console.log('----------------------')

  return (
    <div className="post_details-container">
      <h3 className="body-bold md:h3-bold w-full my-10">
        POST DETAILS
      </h3>
      {/* <hr className="border w-full border-dark-4/80" /> */}

      <div className="post_details-card">
        <img
          src={imageURL}
          alt="creator"
          className="post_details-img"
        />

        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link to="/profile" className="flex items-center gap-3">
              <img
                src={
                  post?.imageProfilData ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
              />
              <div className="flex gap-1 flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post?.lastname} {post?.firstname}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular ">{multiFormatDateString(userPost?.creationdate)}</p>•
                  <p className="subtle-semibold lg:small-regular">{userPost?.location} </p>
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4 ">
              <Button
                onClick={() => handleDelete(post?.postId)} variant="ghost"
                className={`ost_details-delete_btn ${parseInt(user.id, 10) === post?.userId || "hidden"}`}>
                <img
                  src={"/assets/icons/delete.svg"}
                  alt="delete"
                  width={24}
                  height={24}
                />
              </Button>
              <Link
                to={`/update-post/${post?.postId}`}
                className={`${parseInt(user.id, 10) === post?.userId || "hidden"}`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          <hr className="border w-full border-dark-4/80" />

          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>
              {userPost?.caption}
            </p>
            <ul className="flex gap-1 mt-2">
              <li>{userPost?.tags}</li>
            </ul>
          </div>

          <div className="w-full">


            <PostStats
              idPost={post?.postId}
              liked={post?.liked}
              saved={post?.saved}
              interactions={userPost?.interactions}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />


      </div>
    </div>
  );
};

export default PostDetails;
