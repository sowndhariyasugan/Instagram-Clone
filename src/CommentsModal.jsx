import React, { useEffect, useState } from "react";

function CommentsModal({ show, onClose, comments = [], postId, refreshPost }) {
  const [commentsState, setCommentsState] = useState(comments || []);
  const [newComment, setNewComment] = useState("");
  const [saving, setSaving] = useState(false);
  const currentUser = "john_doe";

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setCommentsState(comments || []);
  }, [comments]);

  if (!show) return null;

  const handleAddComment = async () => {
    const trimmed = newComment.trim();
    if (trimmed === "") return;

    const newCommentObj = { user: currentUser, comment: trimmed, replies: [] };

    const updatedComments = [...commentsState, newCommentObj];
    setCommentsState(updatedComments);
    setNewComment("");

    if (typeof refreshPost === "function") {
      refreshPost(postId, updatedComments);
    }

    setSaving(true);
    try {
      await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments })
      });
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to post comment.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddReply = async (commentIdx) => {
    const trimmed = replyText.trim();
    if (trimmed === "") return;

    const updatedComments = commentsState.map((c, idx) =>
      idx === commentIdx
        ? {
            ...c,
            replies: [...(c.replies || []), { user: currentUser, reply: trimmed }]
          }
        : c
    );

    setCommentsState(updatedComments);
    setReplyText("");
    setReplyingTo(null);

    if (typeof refreshPost === "function") {
      refreshPost(postId, updatedComments);
    }

    try {
      await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments })
      });
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comments</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {commentsState.map((c, idx) => (
              <li key={idx} className="list-group-item">
                <b>{c.user}:</b> {c.comment}

                {c.replies && c.replies.length > 0 && (
                  <ul className="mt-2">
                    {c.replies.map((r, rIdx) => (
                      <li key={rIdx}>
                        <small>
                          <b>{r.user}:</b> {r.reply}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="btn btn-sm btn-link ms-2"
                  onClick={() => setReplyingTo(replyingTo === idx ? null : idx)}
                >
                  Reply
                </button>

                {replyingTo === idx && (
                  <div className="input-group mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddReply(idx)}
                    >
                      Post
                    </button>
                  </div>
                )}
              </li>
            ))}

            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                disabled={saving}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAddComment}
                disabled={saving}
              >
                {saving ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsModal;
