import React, { useState } from "react";
import CommentsModal from "./CommentsModal";

function PostCard({ post, toggleLike, refreshPost }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="my-3" key={post.id}>
      <div className="d-flex">
        <img className="dp rounded-circle" src={post.user.profile_pic} alt="profile pic" />
        <h5 className="mt-2">{post.user.username}</h5>
      </div>
      <img className="image" src={post.image} alt="post" />
      <div>
        <i
          className={post.liked ? "bi bi-heart-fill" : "bi bi-heart"}
          style={{ cursor: "pointer", color: post.liked ? "red" : "black" }}
          onClick={() => toggleLike(post.id)}
        ></i>
        <i
          className="bi bi-chat"
          style={{ cursor: "pointer", marginLeft: "10px" }}
          onClick={() => setShowComments(true)}
        ></i>
        <i className="bi bi-send" style={{ marginLeft: "10px" }}></i>
      </div>
      <div>
        <b>{post.likes} likes</b>
      </div>
      <p>{post.caption}</p>

      <CommentsModal
        show={showComments}
        onClose={() => setShowComments(false)}
        comments={post.comments || []}
        postId={post.id}
        refreshPost={refreshPost}
      />
    </div>
  );
}

export default PostCard;
