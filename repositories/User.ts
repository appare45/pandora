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
  return userRef
    .doc(userId)
    .withConverter(userDataConverter)
    .get()
    .then(async (userInvites) => {
      const getInvites = async (): Promise<Invite[]> => {
        const invites: Invite[] = [];
        if (!!userInvites.data().invite?.length) {
          await Promise.all(
            userInvites.data().invite.map(async (userInvite) => {
              await userInvite
                .get()
                .then((data) => invites.push(data.data().invite));
              console.info(invites);
            })
          );
        }
        return invites;
      };
      return await getInvites();
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
