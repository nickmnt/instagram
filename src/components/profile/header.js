/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import UserContext from '../../context/user';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export default function Header({
    photosCount,
    followerCount,
    setFollowerCount,
    profile: { docId: profileDocId, userId: profileUserId, fullName, followers, following, username: profileUsername, bio }
}) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [isFollowingProfile, setIsFollowingProfile] = useState(null);
    const activeBtnFollow = user?.username && user?.username !== profileUsername;

    const handleToggleFollow = async () => {
        setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
        setFollowerCount({
            followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
        });
        await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
    };

    useEffect(() => {
        const isLoggedInUserFollowingProfile = async () => {
            const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
            setIsFollowingProfile(!!isFollowing);
        };

        if (user?.username && profileUserId) {
            isLoggedInUserFollowingProfile();
        }
    }, [user?.username, profileUserId]);

    return (
        <div className="prof-header">
            <div className="prof-header__img-container">
                {profileUsername ? (
                    <img
                        className="prof-header__img"
                        alt={`${fullName} profile picture`}
                        src={`/images/avatars/${profileUsername}.jpg`}
                        onError={(e) => {
                            e.target.src = DEFAULT_IMAGE_PATH;
                        }}
                    />
                ) : (
                    <Skeleton circle height={150} width={150} count={1} />
                )}
            </div>
            <div className="prof-header__mid">
                <div className="prof-header__mid-top">
                    <p className="prof-header__title">{profileUsername}</p>
                    {activeBtnFollow && isFollowingProfile === null ? (
                        <Skeleton count={1} width={80} height={32} />
                    ) : (
                        activeBtnFollow && (
                            <button
                                className="btn prof-header__follow"
                                type="button"
                                onClick={handleToggleFollow}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleToggleFollow();
                                    }
                                }}
                            >
                                {isFollowingProfile ? 'Unfollow' : 'Follow'}
                            </button>
                        )
                    )}
                    {!activeBtnFollow && activeBtnFollow !== undefined && (
                        <Link role="button" className="btn-edit" to={ROUTES.EDIT_PROFILE}>
                            Edit Profile
                        </Link>
                    )}
                </div>
                <div className="prof-header__info">
                    {!followers || !following ? (
                        <Skeleton count={1} width={677} height={24} />
                    ) : (
                        <>
                            <p className="prof-header__text">
                                <span className="prof-header__bold">{photosCount}</span> photos
                            </p>
                            <p className="prof-header__text">
                                <span className="prof-header__bold">{followerCount}</span>
                                {` `}
                                {followerCount === 1 ? `follower` : `followers`}
                            </p>
                            <p className="prof-header__text">
                                <span className="prof-header__bold">{following?.length}</span> following
                            </p>
                        </>
                    )}
                </div>
                <div className="prof-header__name-container">
                    <p className="prof-header__name">{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
                    <p className="prof-header__bio">{bio === undefined ? !fullName ? <Skeleton count={1} height={24} /> : bio : <>No biography available.</>}</p>
                </div>
            </div>
        </div>
    );
}

Header.propTypes = {
    photosCount: PropTypes.number.isRequired,
    followerCount: PropTypes.number.isRequired,
    setFollowerCount: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        docId: PropTypes.string,
        userId: PropTypes.string,
        fullName: PropTypes.string,
        username: PropTypes.string,
        followers: PropTypes.array,
        following: PropTypes.array
    }).isRequired
};
