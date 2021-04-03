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
      snapshot.forEach((_) => {
        data.push(_.data());
      });
      return data;
    });
}
