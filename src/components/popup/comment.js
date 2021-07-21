import {Link} from 'react-router-dom';

export default function Comment({comment, displayName}) {
    return (
        <div className="comment">
            <img src={`/images/avatars/${displayName}.jpg`} alt="User" className="comment__img" />
            <div className="comment__txt">
                <Link to={`/p/${displayName}`} className="comment__link">
                <span className="comment__name">{displayName}</span>
                </Link>{comment}
            </div>
        </div>
    );
}