import {Link} from 'react-router-dom';

export default function SearchUser({username,fullName}) {
    return <div className="search-user">
        <Link to={`/p/${username}`} className="search-user__link">
            <div className="search-user__container">
                <img src={`/images/avatars/${username}.jpg`} alt="User" className="search-user__img" />
                <div className="search-user__group">
                    <div className="search-user__title">{username}</div>
                    {fullName && <div className="search-user__name">{fullName}</div>}
                </div>
            </div>
        </Link>
    </div>
}