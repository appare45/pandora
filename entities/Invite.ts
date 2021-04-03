import firebase from 'firebase';
import { role } from './Organization';
export interface Invite {
  created?: firebase.firestore.FieldValue;
  userId?: string;
  organizationId?: string;
  endAt?: Date;
  active?: boolean;
  count?: number;
  role?: role;
}

export const inviteConverter: firebase.firestore.FirestoreDataConverter<Invite> = {
  toFirestore(invite: Invite): firebase.firestore.DocumentData {
    return {
      invite,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options?: firebase.firestore.SnapshotOptions
  ): Invite {
    const data = snapshot.data(options)!;
    return {
      userId: typeof data?.userId === 'string' ? data.userId : undefined,
      created: data?.created,
      organizationId:
        typeof data?.organizationId === 'string'
          ? data.organizationId
          : undefined,
      endAt: data?.endAt,
      active: data?.active,
      count: data?.count,
      role: data?.role,
    };
  },
};
