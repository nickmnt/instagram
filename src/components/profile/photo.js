import { useState, useEffect } from 'react';
import { firebase } from '../../lib/firebase';
import 'firebase/storage';

export default function Photo({ photo }) {
    const [imgUrl, setImageUrl] = useState('');

    useEffect(() => {
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const image = storageRef.child(photo.imageSrc);
        image.getDownloadURL().then((url) => setImageUrl(url));
    }, [photo.imageSrc]);

    return <>{imgUrl ? <img src={imgUrl} alt={photo.caption} className="photos__img" /> : null}</>;
}
