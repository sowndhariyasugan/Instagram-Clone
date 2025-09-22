import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [accountResults, setAccountResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const currentUser = "john_doe"

    useEffect(() => {
        fetch('http://localhost:3000/suggestions')
            .then(res => res.json())
            .then(data => setAccounts(data));

        fetch('http://localhost:3000/posts')
            .then(res => res.json())
            .then(data => {
                const updated = data.map(post => ({
                    ...post,
                    likedBy: post.likedBy || [],
                    liked: post.likedBy?.includes(currentUser)
                }));
                setPosts(updated);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        const accountMatches = accounts.filter(acc =>
            acc.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const postMatches = posts
            .filter(post =>
                post.caption.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(post => ({
                ...post,
                likedBy: post.likedBy || [],
                liked: post.likedBy?.includes(currentUser)
            }));

        setSuggestions([...accountMatches.slice(0, 3), ...postMatches.slice(0, 2)]);
    }, [searchTerm, accounts, posts]);

    const handleSearch = () => {
        const accountMatches = accounts.filter(acc =>
            acc.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const postMatches = posts.filter(post =>
            post.caption.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setAccountResults(accountMatches);
        setPostResults(postMatches);
        setSuggestions([]);
    };

    const toggleLike = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    let updatedPost = {
                        ...post,
                        liked: !post.liked,
                        likes: post.liked ? post.likes - 1 : post.likes + 1,
                        likedBy: post.liked
                            ? post.likedBy.filter(user => user !== currentUser)
                            : [...post.likedBy, currentUser]
                    };

                    fetch(`http://localhost:3000/posts/${post.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            likes: updatedPost.likes,
                            likedBy: updatedPost.likedBy
                        })
                    });

                    return updatedPost;
                }
                return post;
            })
        );

        setPostResults(prevResults =>
            prevResults.map(post =>
                post.id === postId
                    ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );
    };

    return (
        <div className="container-fluid px-0">
            <div className="row align-items-center mb-3">
                <div className="col-auto ps-5">
                    <img
                        className="logo-text"
                        src="src/assets/instagramTextLogo.png"
                        alt="Instagram Logo"
                        style={{ maxWidth: '140px', maxHeight: '40px', width: 'auto', height: '40px', objectFit: 'contain', display: 'block' }}
                    />
                </div>
                <div className="col ps-0">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className='search-container d-flex align-items-center justify-content-between py-3 bg-white shadow-sm rounded'>
                                <div className="flex-grow-1">
                                    <div className="input-group shadow-sm rounded w-100">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-search-heart"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by username or caption..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setShowDropdown(true);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch();
                                                    setShowDropdown(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    {showDropdown && suggestions.length > 0 && (
                                        <ul className="list-group position-absolute w-100 mt-1 z-3">
                                            {suggestions.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => {
                                                        setSearchTerm("username" in item ? item.username : item.caption);
                                                        handleSearch();
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    {"username" in item ? item.username : item.caption}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className='accounts-result p-3 mb-3 bg-white rounded shadow-sm'>
                        <h5 className="mb-3">Accounts</h5>
                        <div className="row g-2">
                            {accountResults.map(acc => (
                                <div key={acc.id} className="col-12 col-sm-6 col-lg-4">
                                    <div className="card card-body d-flex flex-row align-items-center">
                                        <img src={acc.profile_pic} alt={acc.username} className="rounded-circle me-2" style={{width: '32px', height: '32px', objectFit: 'cover'}} />
                                        <span className="fw-bold">{acc.username}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='posts-result p-3 bg-white rounded shadow-sm'>
                        <h5 className="mb-3">Posts</h5>
                        {postResults.length > 0 ? (
                            <div className="row g-3">
                                {postResults.map(post => (
                                    <div key={post.id} className="col-12">
                                        <PostCard post={post} toggleLike={toggleLike} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No posts found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
