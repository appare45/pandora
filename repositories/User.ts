import { DocumentReference } from '@firebase/firestore-types';
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
      throw new Error(error);
    });
}

export async function createUserInvite(
  invite: firebase.firestore.DocumentReference<Invite>,
  userId: string
) {
  return userRef
    .doc(userId)
    .withConverter(userDataConverter)
    .update({ invite: firebase.firestore.FieldValue.arrayUnion(invite) })
    .then((_) => {
      return _;
    })
    .catch((e) => {
      throw new Error(e);
    });
}

export async function getUserInvites(
  userId: string
): Promise<DocumentReference<Invite>[]> {
  return userRef
    .doc(userId)
    .withConverter(userDataConverter)
    .get()
    .then((userInvites) => {
      return userInvites.data().invite;
    })
    .catch((e) => {
      console.warn(e);
      throw new Error(e);
    });
}

export async function userJoinOrganization(
  organizationId: string,
  userId: string
) {
  return userRef
    .doc(userId)
    .withConverter(userDataConverter)
    .update({ joinedOrgId: organizationId })
    .catch((e) => {
      return e;
    });
}
