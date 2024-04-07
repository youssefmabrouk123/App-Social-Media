import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import { useParams } from 'react-router-dom';
import { CUser } from '@/types';
import PostCard from '@/components/shared/postCard';

interface Post {
  id: number;
  caption: string;
  location: string;
  tags: string;
  filename: string;
  creationdate: string;
  imageData?: string; // Change to string as it will contain base64 string
}

const AllUsers = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CUser | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchData = async (id: string | undefined) => {
      setIsLoading(true);
      try {
        const [userDataResponse, postsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/users/userdetail/8`),
          axios.get(`http://localhost:8080/users/posts/allposts`),
        ]);

        if (userDataResponse.data && postsResponse.data) {
          const userData: CUser = {
            id: userDataResponse.data.id,
            firstname: userDataResponse.data.firstname,
            lastname: userDataResponse.data.lastname,
            email: userDataResponse.data.email,
            role: userDataResponse.data.role,
            age: userDataResponse.data.age,
            bio: userDataResponse.data.bio,
            imageUrl: userDataResponse.data.image,
            filiere: userDataResponse.data.filiere,
            post: userDataResponse.data.post,
          };

          setCurrentUser(userData);
          // Convert image data to base64 for each post
          const postsWithImageData = postsResponse.data.map((post: Post) => ({
            ...post,
            imageData: post.imageData ? `data:image/jpeg;base64,${post.imageData}` : undefined,
          }));
          setPosts(postsWithImageData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    
    fetchData(id);
  }, [id]);

  if (isLoading || !currentUser) {
    return <Loader />;
  }

  return (
    <div className="profile-container">
      {/* Your JSX code for rendering user profile */}
      {/* Example: */}
      {/* <h1>{currentUser.firstname} {currentUser.lastname}</h1> */}
      {/* <p>{currentUser.bio}</p> */}

      {/* Your JSX code for rendering buttons */}

      {/* Post list rendering code */}
      {posts && posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              creatorFirstname={currentUser.firstname}
              creatorLastname={currentUser.lastname}
              postCaption={post.caption}
              postLocation={post.location}
              postDate={post.creationdate}
              postImage={post.imageData || ''}
            />
          ))}
        </div>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
};

export default AllUsers;
