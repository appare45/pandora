import firebase, { app } from '../utils/firebase';
import { Invite, inviteConverter } from '../entities/Invite';

const firestore = firebase.firestore(app);
const inviteRef = firestore.collection('invite');

export async function getUserInvites(userId: string): Promise<Invite[]> {
  return inviteRef
    .withConverter(inviteConverter)
    .where('userId', '==', userId)
    .get()
    .then((snapshot) => {
      const data: Invite[] = [];
      console.info(snapshot.empty);
      snapshot.forEach((_) => {
        data.push(_.data());
      });
      return data;
    })
    .catch((error) => {
      console.warn(error);
      throw new Error(error);
    });
}

export async function createInvite(
  invite: Invite
): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> {
  return inviteRef
    .withConverter(inviteConverter)
    .add({
      ...invite,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((_) => {
      return _;
    })
    .catch((e) => {
      throw new Error(e);
    });
}
