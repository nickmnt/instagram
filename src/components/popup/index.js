//Post popup
import {useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import Comment from './comment';
import Actions from './actions';
import Header from '../post/header';

//User name is the username of the user that posted, content is the content of the post
export default function Popup({username, content}) {
    const commentInput = useRef(null);
    const [comment, setComment] = useState('');
    //Focus to comment input when comment svg is clicked
    const handleFocus = () => commentInput.current.focus();
    console.log(content);

    return (

        <div className="popup">


            <div className="popup__container" onClick={()=>{}}>

                <img src={content.imageSrc} alt={content.caption} className="popup__img"></img>

                <div className="popup__sidebar">

                <div className="popup__header">
                    
                        {/*<Link to={`/p/${username}`} className="popup__header-link">
                            <img
                                src={`/images/avatars/${username}.jpg`}
                                alt={`${username} profile picture`}
                                className="popup__header-img"
                            />
                            <p className="popup__header-text">{username}</p>
                        </Link>
                        */}
                        <Header username={username} className="popup__header-link"/>

                </div>

                <div className="popup__comments">
                <div className="comment popup__caption">
                    <img src={`/images/avatars/${username}.jpg`} alt="User" className="comment__img" />
                    <p className="comment__txt"><span className="comment__name">{username}</span>{content.caption}</p>
                </div>
                    {content.comments.map(comment => <Comment comment={comment.comment} displayName={comment.displayName}/>)}              
                </div>

                <div className="popup__actions">
                    <Actions docId={content.docId} totalLikes={content.likes.length}
                        likedPhoto={content.userLikedPhoto}
                        handleFocus={handleFocus}
                        datePosted={content.dateCreated}
                        />
                </div>

                <form action="" className="popup__add">
                    <input type="text" className="add-comment__input popup__input"
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                    placeholder="Add a comment..."
                    aria-label="Add a comment"
                    autoComplete="off"
                    ref={commentInput} />
                    <button className={`btn-simple add-comment__btn popup__btn ${!comment && 'add-comment__btn--off'}`}>Post</button>
                </form>

            </div>

            </div>



        </div>

    );

}