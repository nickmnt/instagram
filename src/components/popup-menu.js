
export default function PopupMenu() {
    return (
        <div className="popup-menu">
            <div className="popup-menu__container">
                <div className="popup-menu__item popup-menu__item-red noselect">
                    Report
                </div>
                <div className="popup-menu__item popup-menu__item-red noselect">
                    Unfollow
                </div>
                <div className="popup-menu__item noselect">
                    Go to post
                </div>
                <div className="popup-menu__item noselect">
                    Share to...
                </div>
                <div className="popup-menu__item noselect">
                    Copy Link
                </div>
                <div className="popup-menu__close noselect">
                    Cancel
                </div>
            </div>
        </div>
    );
}