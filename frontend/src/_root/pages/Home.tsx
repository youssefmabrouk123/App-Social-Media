import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import { useParams } from 'react-router-dom';
import { CUser } from '@/types';
import PostCard from '@/components/shared/postCard';
import Drawers from '@/components/shared/Drawers';
import RightSidebar from '@/components/shared/RightSidebar';

interface Post {
  postId: number;
  userId: number;
  firstname: string;
  lastname: string;
  liked: boolean;
  saved: boolean;
  imageProfilData?: string; // Change to string as it will contain base64 string
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
      const token = localStorage.getItem("accessToken");

      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`http://localhost:8080/users/posts/allpostsowner`,{
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header with the JWT token
          },
        });
        console.log(response.data.post)

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
            imageProfilData: post.imageProfilData ? `data:image/jpeg;base64,${post.imageProfilData}` : undefined,
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
                <h2 className="h3-bold md:h2-bold text-left w-full">Feeds</h2>
               

      {/* Post list rendering code */}
      {posts && posts.length > 0 ? (
  <div  >
    {posts.slice().reverse().map((post) => (
      <PostCard
        key={post.postId}
        postId={post.postId} 
        userId={post.userId}
        creatorFirstname={post.firstname} // Assuming post.firstname and post.lastname are available
        creatorLastname={post.lastname}
        liked={post.liked}
        saved={post.saved}
        postImage={post.imageProfilData || ''}
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