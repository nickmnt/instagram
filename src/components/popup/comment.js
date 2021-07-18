

export default function Comment({comment, displayName}) {
    {console.log(`images/avatars/${displayName}.jpg`)}
    return (
        <div className="comment">
            <img src={`/images/avatars/${displayName}.jpg`} alt="User" className="comment__img" />
            <p className="comment__txt"><span className="comment__name">{displayName}</span>{comment}</p>
        </div>
    );
}