import React, { useEffect, useState } from 'react'
import PostCard from './PostCard';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const currentUser = "john_doe"

    useEffect(() => {
        fetch('http://localhost:3000/posts')
            .then((data) => data.json())
            .then((data) => {
                const updatedData = data.map(post => ({
                    ...post,
                    likedBy: post.likedBy || [], // ensure array exists
                    liked: post.likedBy ? post.likedBy.includes(currentUser) : false
                }));
                setPosts(updatedData);
                setVisiblePosts(updatedData.slice(0, postsPerPage));
            })
            .catch(err => console.log(err))
    }, [])

    const loadMorePosts = () => {
        const nextPage = currentPage + 1;
        const start = currentPage * postsPerPage;
        const end = start + postsPerPage;
        const newPosts = posts.slice(start, end);

        setVisiblePosts(prev => [...prev, ...newPosts]);
        setCurrentPage(nextPage);
    }

    const refreshPost = (postId, updatedComments) => {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: updatedComments } : p));
        setVisiblePosts(prev => prev.map(p => p.id === postId ? { ...p, comments: updatedComments } : p));
    };



    const toggleLike = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === postId) {
                    let updatedPost;
                    if (post.liked) {
                        updatedPost = {
                            ...post,
                            liked: false,
                            likes: post.likes - 1,
                            likedBy: post.likedBy.filter(user => user !== currentUser)
                        };
                    } else {
                        updatedPost = {
                            ...post,
                            liked: true,
                            likes: post.likes + 1,
                            likedBy: post.likedBy.includes(currentUser)
                                ? post.likedBy
                                : [...post.likedBy, currentUser]
                        };
                    }

                    fetch(`http://localhost:3000/posts/${post.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            likes: updatedPost.likes,
                            likedBy: updatedPost.likedBy
                        })
                    }).catch(err => console.log(err));

                    return updatedPost;
                }
                return post;
            })
        );
        setVisiblePosts(prevVisible =>
            prevVisible.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        liked: !post.liked,
                        likes: post.liked ? post.likes - 1 : post.likes + 1
                    };
                }
                return post;
            })
        );
    }

    return (
        <div className='d-flex justify-content-center my-4'>
            {visiblePosts.length > 0 ? (
                <div>
                    {visiblePosts.map((post) => (
                        // <div className='my-3' key={post.id}>
                        //     <div className='d-flex'>
                        //         <img className='dp rounded-circle' src={post.user.profile_pic} alt="profile pic" />
                        //         <h5 className='mt-2'>{post.user.username}</h5>
                        //     </div>
                        //     <img className='image' src={post.image} alt="post" />
                        //     <div>
                        //         <i
                        //             className={post.liked ? "bi bi-heart-fill" : "bi bi-heart"}
                        //             style={{ cursor: "pointer", color: post.liked ? "red" : "black" }}
                        //             onClick={() => toggleLike(post.id)}
                        //         ></i>
                        //         <i className="bi bi-chat"></i>
                        //         <i className="bi bi-send"></i>
                        //     </div>
                        //     <div>
                        //         <b>{post.likes} likes</b>
                        //     </div>
                        //     <p>{post.caption}</p>
                        // </div>
                        <PostCard key={post.id} post={post} toggleLike={toggleLike} refreshPost={refreshPost} />

                    ))}
                    {
                        visiblePosts.length < posts.length && (
                            <div className='text-center my-3'>
                                <i className="bi bi-arrow-down-circle-fill load-more-btn"
                                    onClick={loadMorePosts}
                                    style={{ fontSize: "2rem", cursor: "pointer" }}
                                ></i>
                            </div>
                        )
                    }
                </div>
            ) : (
                <div>
                    Loading Posts
                </div>
            )
            }
        </div >
    )
}

export default Posts