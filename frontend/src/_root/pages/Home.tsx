import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import { useParams } from 'react-router-dom';
import { CUser } from '@/types';
import PostCard from '@/components/shared/postCard';

interface Post {
  postId: number;
  userId: number;
  firstname: string;
  lastname: string;
  location: string;
  caption: string;
  tags: string;
  filename: string;
  creationdate: string;
  imageData?: string;
  interactions: number;
}
interface ApiResponse {
  post: Post[]; // Assuming the post array is in the response
}

const Home = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CUser | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchData = async (id: string | undefined) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`http://localhost:8080/users/posts/allposts`);

        if (response.data && Array.isArray(response.data.post)) {
          // Assuming the user information is included in the response
          const userData = {
            firstname: response.data.post[0].firstname, // Assuming user info is in the first post
            lastname: response.data.post[0].lastname,
          };
          setCurrentUser(userData);

          // Convert image data to base64 for each post
          const postsWithImageData = response.data.post.map((post: Post) => ({
            ...post,
            imageData: post.imageData ? `data:image/jpeg;base64,${post.imageData}` : undefined,
          }));
          setPosts(postsWithImageData);
        } else {
          console.error('Invalid response format: Missing data or posts array');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
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
      {/* Post list rendering code */}
      {posts && posts.length > 0 ? (
  <div  >
    {posts.map((post) => (
      <PostCard
        key={post.id} // Unique key prop
        creatorFirstname={post.firstname} // Assuming post.firstname and post.lastname are available
        creatorLastname={post.lastname}
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

export default Home;