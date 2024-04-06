import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        // Fetch the user's authentication token from wherever it's stored (e.g., localStorage)
        const token = localStorage.getItem("accessToken");

        // Include the authentication token in the request headers
        const headers = {
          Authorization: `Bearer ${token}`, // Assuming it's a Bearer token
        };

        // Send the request with the authentication token included in the headers
        const response = await axios.get('http://localhost:8080/users/profile-image', { headers, responseType: 'arraybuffer' });

        // Handle the successful response and use the image data
        console.log('User profile image:', response.data);

        // Convert the binary image data to a base64-encoded string
        const base64Image = arrayBufferToBase64(response.data);
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setProfileImage(imageUrl); // Set the profile image URL in state
      } catch (error) {
        // Handle errors
        console.error('Failed to fetch user profile image:', error);
      }
    };

    // Call the function to fetch the user profile image
    fetchUserProfileImage();
  }, []); // Empty dependency array to run the effect only once

  // Function to convert an array buffer to a base64-encoded string
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  return (
    <div>
     home
    </div>
  );
};

export default Home;
