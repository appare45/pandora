import { Invite } from '../entities/Invite';
import { UserData, userDataConverter } from '../entities/User';
import firebase, { app } from './../utils/firebase';

const firestore = firebase.firestore(app);
const userRef = firestore.collection('user');

export async function getUser(id: string): Promise<UserData> {
  return userRef
    .withConverter(userDataConverter)
    .doc(id)
    .get()
    .then((user) => {
      return user.data();
    })
    .catch((error) => {
      console.warn(error);
      return error;
    });
}

export async function setUser(
  id: string,
  userData: UserData,
  options?: firebase.firestore.SetOptions
) {
  userRef
    .withConverter(userDataConverter)
    .doc(id)
    .set(userData, options)
    .catch((error) => {
      console.error(error);
    });
}

export async function createUserInvite(
  invite: firebase.firestore.DocumentReference<Invite>[],
  userId: string
) {
  console.info(invite);
  return userRef
    .doc(userId)
    .withConverter(userDataConverter)
    .update({ invite: invite })
    .then((_) => {
      return _;
    })
    .catch((e) => {
      throw new Error(e);
    });
}

export async function getUserInvites(userId: string): Promise<Invite[]> {
  const invites: Invite[] = [];
  userRef
    .doc(userId)
    .withConverter(userDataConverter)
    .collection('invites')
    .get()
    .then((userInvites) => {
      userInvites.forEach((userInvite) => {
        invites.push(userInvite.data());
      });
    });
  return invites;
}
