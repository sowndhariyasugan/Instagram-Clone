import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';


function ViewStory() {
  const { id, tot } = useParams(); 
  const [story, setStory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storyId = Number(id);
    const total = Number(tot);

    if (storyId > total || storyId <= 0) {
      navigate('/');
      return; 
    }

    fetch(`http://localhost:3000/story/${storyId}`)
      .then(res => res.json())
      .then(data => setStory(data))
      .catch(err => console.log(err));
  }, [id, tot, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light position-relative">
      {story ? (
        <>
          {/* Left Arrow */}
          {Number(id) > 1 && (
            <Link
              to={`/story/${Number(id) - 1}/${tot}`}
              className="position-absolute top-50 start-0 translate-middle-y text-dark fs-1 text-decoration-none"
              style={{ padding: '0 10px' }}
            >
              <i className="bi bi-arrow-left-circle-fill"></i>
            </Link>
          )}

          {/* Story Image */}
          <img
            src={story.image}
            alt="story"
            className="img-fluid"
            style={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          />

          {/* Right Arrow */}
          {Number(id) < Number(tot) && (
            <Link
              to={`/story/${Number(id) + 1}/${tot}`}
              className="position-absolute top-50 end-0 translate-middle-y text-dark fs-1 text-decoration-none"
              style={{ padding: '0 10px' }}
            >
              <i className="bi bi-arrow-right-circle-fill"></i>
            </Link>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewStory;
