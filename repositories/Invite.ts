import firebase, { app } from '../utils/firebase';
import { Invite, inviteConverter } from '../entities/Invite';

const firestore = firebase.firestore(app);
const inviteRef = firestore.collection('invite');

export async function createInvite(
  invite: Invite
): Promise<firebase.firestore.DocumentReference<Invite>> {
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
