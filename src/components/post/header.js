/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Header({ username }) {
  
  return (
    <div className="p-header">
        <Link to={`/p/${username}`} className="p-header__link">
          <img
            src={`/images/avatars/${username}.jpg`}
            alt={`${username} profile picture`}
            className="p-header__img"
          />
          <p className="p-header__text">{username}</p>
        </Link>
    </div>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired
};
