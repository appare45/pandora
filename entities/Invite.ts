import { Timestamp } from '@firebase/firestore-types';
import firebase from 'firebase';
export interface Invite {
  readonly title?: string;
  readonly created?: Timestamp;
  readonly userId?: string;
  readonly organizationId?: string;
  readonly endAt?: Date;
  readonly active?: boolean;
  readonly count?: number;
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
      title: typeof data?.title === 'string' ? data.title : undefined,
      userId: typeof data?.userId === 'string' ? data.userId : undefined,
      created: data?.created,
      organizationId:
        typeof data?.organizationId === 'string'
          ? data.organizationId
          : undefined,
      endAt: data?.endAt,
      active: data?.active,
      count: data?.count,
    };
  },
};
