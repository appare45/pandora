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
    .add({ ...invite, created: firebase.firestore.Timestamp.now() })
    .then((_) => {
      return _;
    })
    .catch((e) => {
      console.warn(e);
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
    .then(async (id) => {
      if (!id.data()) {
        throw { message: '見つかりませんでした' };
      } else {
        try {
          await userJoinOrganization(id.data().organizationId, userId);
          return {
            organizationId: id.data().organizationId,
            role: id.data().role,
          };
        } catch (e) {
          return e;
        }
      }
    })
    .catch((e) => {
      return e;
    });
}

export async function setInivationsActivation(
  invitationId: string,
  isActive: boolean
) {
  try {
    return inviteRef.withConverter(inviteConverter).doc(invitationId).update({
      active: isActive,
    });
  } catch (e) {
    throw new Error(e);
  }
}

export function getInviteLink(inviteId: string): string {
  return `${window.location.host}/invite/${inviteId}`;
}
