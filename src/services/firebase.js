import { firebase, FieldValue, config } from '../lib/firebase';

/**
 *
 * @param {string} username
 * @returns Result in boolean
 */
export async function doesUsernameExist(username) {
    const result = await firebase.firestore().collection('users').where('username', '==', username).get();

    return result.docs.length > 0;
}

/**
 *
 * @param {string} username
 * @returns User algonside docid
 */
export async function getUserByUsername(username) {
    const result = await firebase.firestore().collection('users').where('username', '==', username).get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
    const result = await firebase.firestore().collection('users').where('userId', '==', userId).get();
    const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    return user;
}

// check all conditions before limit results
export async function getSuggestedProfiles(userId, following) {
    let query = firebase.firestore().collection('users');

    if (following.length > 0) {
        query = query.where('userId', 'not-in', [...following, userId]);
    } else {
        query = query.where('userId', '!=', userId);
    }
    const result = await query.limit(10).get();

    const profiles = result.docs.map((user) => ({
        ...user.data(),
        docId: user.id
    }));

    return profiles;
}

export async function updateLoggedInUserFollowing(
    loggedInUserDocId, // currently logged in user document id (karl's profile)
    profileId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
) {
    return firebase
        .firestore()
        .collection('users')
        .doc(loggedInUserDocId)
        .update({
            following: isFollowingProfile ? FieldValue.arrayRemove(profileId) : FieldValue.arrayUnion(profileId)
        });
}

export async function updateFollowedUserFollowers(
    profileDocId, // currently logged in user document id (karl's profile)
    loggedInUserDocId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
) {
    return firebase
        .firestore()
        .collection('users')
        .doc(profileDocId)
        .update({
            followers: isFollowingProfile ? FieldValue.arrayRemove(loggedInUserDocId) : FieldValue.arrayUnion(loggedInUserDocId)
        });
}

export async function getPhotos(userId, following) {
    // [5,4,2] => following
    const result = await firebase.firestore().collection('photos').where('userId', 'in', following).get();

    const userFollowedPhotos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id
    }));

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }
            // photo.userId = 2
            const user = await getUserByUserId(photo.userId);
            // raphael
            const { username } = user[0];
            return { username, ...photo, userLikedPhoto };
        })
    );

    return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
    const result = await firebase.firestore().collection('photos').where('userId', '==', userId).get();

    const photos = result.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id
    }));
    return photos;
}

export async function isUserFollowingProfile(loggedInUserUsername, profileUserId) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', loggedInUserUsername) // karl (active logged in user)
        .where('following', 'array-contains', profileUserId)
        .get();

    const [response = {}] = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    return response.userId;
}

export async function toggleFollow(isFollowingProfile, activeUserDocId, profileDocId, profileUserId, activeUserUserId) {
    // 1st param: karl's doc id
    // 2nd param: raphael's user id
    // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
    await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);

    await updateFollowedUserFollowers(profileDocId, activeUserUserId, isFollowingProfile);
}

/**
 * Adds the user to the list of likes for the docId (pointing to the post)
 * @param {string} docId
 * @param {*} userId
 */
export async function addUserToLikes(docId, userId) {
    await firebase
        .firestore()
        .collection('photos')
        .doc(docId)
        .update({
            likes: FieldValue.arrayUnion(userId)
        });
}

/**
 * Removes the user from the list of likes for the docId (pointing to the post)
 * @param {string} docId
 * @param {*} userId
 */
export async function removeUserFromLikes(docId, userId) {
    await firebase
        .firestore()
        .collection('photos')
        .doc(docId)
        .update({
            likes: FieldValue.arrayRemove(userId)
        });
}

export async function searchForTerm(term) {
    const result = await firebase
        .firestore()
        .collection('users')
        .orderBy('username')
        .startAt(term)
        .endAt(term + '~')
        .limit(20)
        .get();

    //console.log('Result',result);

    const modifiedList = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    //console.log('modifiedList', modifiedList);

    return modifiedList;
}

export async function updateUserDetails(
    loggedInUserDocId, // currently logged in user document id
    fullName,
    username,
    website,
    bio,
    phoneNumber,
    gender
) {
    let success = false;
    try {
        await firebase.firestore().collection('users').doc(loggedInUserDocId).update({
            fullName: fullName,
            username: username,
            website: website,
            bio: bio,
            phoneNumber: phoneNumber,
            gender: gender
        });
        success = true;
    } catch (err) {}
    return success;
}

/**
 *
 * @param {string} emailAddress The email address
 * @param {string} oldPassword The old password
 * @param {string} newPassword The new password
 */
export async function changePassword(emailAddress, oldPassword, newPassword) {
    let success = false;

    try {
        await firebase.auth().signInWithEmailAndPassword(emailAddress, oldPassword);
        //success = false;
        await firebase.auth().currentUser.updatePassword(newPassword);
        success = true;
    } catch (err) {
        success = false;
    }
    return success;
}

export const addPhoto = async (user, photoId, imageSrc, caption) => {
    await firebase.firestore().collection('photos').add({
        photoId: photoId,
        userId: user.userId,
        imageSrc: imageSrc,
        caption: caption,
        likes: [],
        comments: [],
        userLatitude: '40.7128°',
        userLongitude: '74.0060°',
        dateCreated: Date.now()
    });
};

export const constructMediaUrl = (x) => {
    return `https://firebasestorage.googleapis.com/v0/b/${config.projectId}.appspot.com/o/avatars%2F${x}.jpg?alt=media`;
};
