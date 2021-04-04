import firebase, { app } from '../utils/firebase';
import { Invite, inviteConverter } from '../entities/Invite';
import { userJoinOrganization } from './User';
import { role } from '../entities/Organization';

const firestore = firebase.firestore(app);
const inviteRef = firestore.collection('invite');

export async function createInvite(
  invite: Invite
): Promise<firebase.firestore.DocumentReference<Invite>> {
  return inviteRef
    .withConverter(inviteConverter)
    .add({
      ...invite,
      created: firebase.firestore.Timestamp.now(),
    })
    .then((_) => {
      return _;
    })
    .catch((e) => {
      throw new Error(e);
    });
}

export async function JoinOrganizationFromInvitation(
  inviteId: string,
  userId: string
): Promise<{ organizationId: string; role: role }> {
  return inviteRef
    .withConverter(inviteConverter)
    .doc(inviteId)
    .get()
    .then((id) => {
      if (!id.data()) {
        return { message: '見つからん' };
      } else {
        return userJoinOrganization(id.data().organizationId, userId)
          .then(() => {
            return {
              organizationId: id.data().organizationId,
              role: id.data().role,
            };
          })
          .catch((e) => {
            return e;
          });
      }
    })
    .catch((e) => {
      return e;
    });
}
