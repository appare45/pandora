import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from '@firebase/firestore-types';
import { role } from './Organization';
import firebase, { app } from '../utils/firebase';

export interface Invite {
  created?: Timestamp;
  userId?: string;
  organizationId?: string;
  endAt?: Timestamp;
  active?: boolean;
  count?: number;
  role?: role;
}

export const inviteConverter: FirestoreDataConverter<Invite> = {
  toFirestore(invite: Invite): DocumentData {
    return invite;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): Invite {
    const data = snapshot.data(options)!;
    return {
      userId: typeof data?.userId === 'string' ? data.userId : undefined,
      created: new firebase.firestore.Timestamp(
        data?.created.seconds,
        data?.created.nanoseconds
      ),
      organizationId:
        typeof data?.organizationId === 'string'
          ? data.organizationId
          : undefined,
      endAt: new firebase.firestore.Timestamp(
        data?.endAt.seconds,
        data?.endAt.nanoseconds
      ),
      active: data?.active,
      count: data?.count,
      role: data?.role,
    };
  },
};
