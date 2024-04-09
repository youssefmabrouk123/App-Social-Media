import React from 'react';
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const GridPostList = ({ posts }: any) => {
  const { user } = useUserContext();

  if (!posts || posts.length === 0) {
    return <p>No posts available</p>;
  }

  console.log(posts);
  
  return (
    <ul className="grid-container">
      {posts.slice().reverse().map((post:any) => (
        <li key={post.id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            <div className="flex items-center justify-start gap-2 flex-1">
              <p className="line-clamp-1">{post.location}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;