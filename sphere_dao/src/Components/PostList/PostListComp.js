import React, { useState, useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import './PostList.css';
import Header from '../Header/HeaderComp';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Retrieve posts from local storage
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
  }, []);

  const handleUpvote = (index) => {
    // Update the upvotes count for the selected post
    const updatedPosts = [...posts];
    updatedPosts[index].upvotes += 1;
    setPosts(updatedPosts);

    // Save the updated posts to local storage
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const handleDownvote = (index) => {
    // Update the downvotes count for the selected post
    const updatedPosts = [...posts];
    updatedPosts[index].downvotes += 1;
    setPosts(updatedPosts);

    // Save the updated posts to local storage
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    if(updatedPosts[index].downvotes>=10){
      localStorage.removeItem('posts',JSON.stringify(updatedPosts));
      window.location.reload(true);
    }

  };

  return (
    <div>
    {/* <Header></Header> */}
    <div className="post-list-container">
      <ListGroup>
        {posts && posts.map((post, index) => (
          <ListGroup.Item key={index} className="post-item">
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
              <Button
                variant="success"
                onClick={() => handleUpvote(index)}
                className="action-button"
              >
                Upvote ({post.upvotes})
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDownvote(index)}
                className="action-button"
              >
                Downvote ({post.downvotes})
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
    </div>
  );
};

export default PostList;
