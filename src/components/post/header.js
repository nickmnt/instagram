/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PopupMenu from '../popup-menu';
import {useEffect,useState} from 'react';

export default function Header({ username }) {

  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
        if (
          open && (event.target.matches(".popup-menu__close") ||
          !event.target.closest(".popup-menu__container"))
        ) {
          setOpen(false);
        }
  }

  //Popup event handler
  useEffect(() => {
    
    document.addEventListener(
      "click",
      handleClick
    )
    
    return () => {
      document.removeEventListener('click', handleClick);
    };

    
  },[open]);
  
  return (
    <>
    <div className="p-header">
        <Link to={`/p/${username}`} className="p-header__link">
          <img
            src={`/images/avatars/${username}.jpg`}
            alt={`${username} profile picture`}
            className="p-header__img"
          />
          <p className="p-header__text">{username}</p>
        </Link>
        <svg className="p-header__more noselect" onClick={() => setOpen(true)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
    </div>
    {open && <PopupMenu />}
    </>
  );
}

Header.propTypes = {
  username: PropTypes.string.isRequired
};
