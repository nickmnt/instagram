import PageTemplate from './pagetemplate';

export default function SettingsTemplate({children}) {
    return (
        <PageTemplate>
            <div className="settings">
                <div className="sidebar">
                    <span className="menu__item">Edit Profile</span>
                    <span className="menu__item">Change Password</span>
                    <span className="menu__item">Push Notifications</span>
                    <span className="menu__item">Privacy and Security</span>
                    <span className="menu__item">Login Activity</span>
                </div>
                <div className="main">
                    {children}
                </div>
            </div>
        </PageTemplate>
    );
}