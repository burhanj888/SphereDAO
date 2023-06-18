import React, { useContext, createContext, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import './PostUploadForm.css';
import { MyContext } from '../Context';

const PostUploadForm = () => {
  const [postContent, setPostContent] = useState('');
  const [walletAddress, setWalletAddress] = useContext(MyContext);
//   const walletBalance = useContext(MyContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new post object
    const newPost = {
      content: postContent,
      upvotes: 0,
      downvotes: 0,
    };

    // Save the new post to local storage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    localStorage.setItem('posts', JSON.stringify([...posts, newPost]));

    // Clear the form and trigger the onPostUpload callback
    setPostContent('');
    // onPostUpload();
    console.log(walletAddress)
  };

  return (
    <div>
        {console.log(walletAddress)}
    
    <div className="post-upload-form-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="postContent">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your post..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          
        </Form.Group>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
    </div>
    </div>
  );
};

export default PostUploadForm;
