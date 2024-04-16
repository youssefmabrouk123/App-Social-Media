import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  postId: number;
  userId: number;
  interactions: number;
  caption: string;
  location: string;
  tags: string;
  imageData: ArrayBuffer;
  creationdate: string;
}

interface PostCardProps {
  postId: number;
  userId: number;
  creatorFirstname: string;
  creatorLastname: string;
  liked: boolean;
  saved: boolean;
  postImage: string;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const PostCard: React.FC<PostCardProps> = ({
  postId,
  userId,
  creatorFirstname,
  creatorLastname,
  liked,
  saved,
  postImage,
}) => {
  const [userPost, setUserPost] = useState<Post | null>(null);
  const [imageURL, setImageURL] = useState<string>('');

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get<Post>(`http://localhost:8080/users/posts/all/${postId}`);
        const { data } = response;
        setUserPost(data);
        const imageResponse = await axios.get(`http://localhost:8080/users/posts/image/${postId}`, {
              responseType: 'arraybuffer'
            });
            const base64Image = arrayBufferToBase64(imageResponse.data);
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;
            setImageURL(imageUrl);
    
      } catch (error) {
        console.error('Failed to fetch post details:', error);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (!userPost) {
    return null; // or display a loading indicator
  }

  return (
    <div className="post-card" style={{ marginBottom: '30px' }}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${userId}`}>
            <img
              src={postImage || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {creatorFirstname} {creatorLastname}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(userPost.creationdate)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {userPost.location}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/posts/${postId}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{userPost.caption}</p>
          <ul className="flex gap-1 mt-2">
              {userPost?.tags.split(',').map((tag, index) => (
    <li key={`${tag.trim()}${index}`} className="text-light-3 small-regular">
      #{tag.trim()}
    </li>
  ))}
            </ul>
        </div>

        <img
          src={imageURL}
          alt="post image"
          className="post-card_img"
        />
      </Link>
      <PostStats liked={liked} saved={saved} interactions={userPost.interactions} idPost={postId} />
    </div>
  );
};

export default PostCard;
