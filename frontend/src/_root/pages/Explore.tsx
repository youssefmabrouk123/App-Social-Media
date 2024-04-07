import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Explore = () => {
  // const [postImage, setPostImage] = useState(null);

  // useEffect(() => {
  //   const fetchPostImage = async () => {
  //     try {
  //       const postId = 52; // Replace with the actual post ID
  //       const token = localStorage.getItem("accessToken");
  //       const headers = { Authorization: `Bearer ${token}` };

  //       const response = await axios.get(`http://localhost:8080/users/posts/image/${postId}`, {
  //         headers,
  //         responseType: 'arraybuffer'
  //       });

  //       const base64Image = arrayBufferToBase64(response.data);
  //       const imageUrl = `data:image/jpeg;base64,${base64Image}`;
  //       setPostImage(imageUrl);
  //     } catch (error) {
  //       console.error('Failed to fetch post image:', error);
  //     }
  //   };

  //   fetchPostImage();
  // }, []);

  // const arrayBufferToBase64 = (buffer:any) => {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // };

  return (
    <div>
      {/* {postImage && <img src={postImage} alt="Post Image" />} */}
    </div>
  )
}

export default Explore