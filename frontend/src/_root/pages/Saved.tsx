import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import GridPostList from '@/components/shared/GridPostList';

interface Post {
  id: number;
  imageUrl: string;
  location: string;
}

const SavedPosts: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setIsLoading(true);
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('accessToken');

        // Make sure token is available
        if (!token) {
          throw new Error('Access token not found');
        }

        // Fetch saved posts from the API
        const response = await axios.get<any[]>('http://localhost:8080/users/savedposts/get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Decode base64 image data and create imageUrl
        const postsWithImages = response.data.map(post => ({
          id: post.postId,
          imageUrl: `data:image/jpeg;base64,${post.imageData}`,
          location: post.location,
        }));

        // Update posts state with the received data
        setPosts(postsWithImages);
      } catch (error) {
        console.error('Failed to fetch saved posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{  margin: '20px auto', padding:"40px  " }}    > 
      {posts.length > 0 ? (
        <GridPostList posts={posts} />
      ) : (
        <p>No saved posts found</p>
      )}
    </div>

  );
};

export default SavedPosts;
