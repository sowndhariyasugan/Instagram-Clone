import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Suggestions() {

  const [profile, setProfile] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {

    fetch('http://localhost:3000/profile')
      .then(data => data.json())
      .then(data => setProfile(data))
      .catch(err => console.log(err));

    fetch('http://localhost:3000/suggestions')
      .then(data => data.json())
      .then(data => setSuggestions(data))
      .catch(err => console.log(err));

    fetch('http://localhost:3000/followers')
      .then(res => res.json())
      .then(data => setFollowers(data))
      .catch(err => console.log(err));
  }, [])

  const handleFollow = async (id, username) => {
    try {
      if (followers.some(f => f.id === id)) return;

      await axios.post('http://localhost:3000/followers', { id, username });

      setFollowers(prev => [...prev, { id, username }]);
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <div>
      <div className='suggestions w-75 m-4'>
        {
          profile ?
            <div className='d-flex'>
              <img className='dp rounded-circle' src={profile.profile_pic} alt="profile pic" />
              <h5 className='mt-2'>{profile.username}</h5>
              <small className='ms-auto text-primary m-2'>Switch</small>
            </div> :
            <p>Loading..</p>
        }
        <div className='d-flex'>
          <p>Suggested for you</p>
          <b className='ms-auto'>See All</b>
        </div>
        {suggestions.length > 0 ? (
          <div>
            {suggestions.map((suggestion) => {
              const isFollowed = followers.some(f => f.id === suggestion.id);

              return (
                <div key={suggestion.id}>
                  <div className='d-flex'>
                    <img
                      className='dp rounded-circle'
                      src={suggestion.profile_pic}
                      alt="profile pic"
                    />
                    <h5 className='my-3'>{suggestion.username}</h5>

                    <a
                      className='text-primary my-3 ms-auto'
                      style={{ cursor: "pointer" }}
                      onClick={() => handleFollow(suggestion.id, suggestion.username)}
                    >
                      {isFollowed ? "Following" : "Follow"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Loading ...</div>
        )}

      </div>
    </div>
  )
}

export default Suggestions