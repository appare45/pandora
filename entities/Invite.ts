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
    return {
      invite,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): Invite {
    const data = snapshot.data(options)!;
    return {
      userId:
        typeof data?.invite?.userId === 'string' ? data.userId : undefined,
      created: new firebase.firestore.Timestamp(
        data?.invite?.created.seconds,
        data?.invite?.created.nanoseconds
      ),
      organizationId:
        typeof data?.invite?.organizationId === 'string'
          ? data?.invite.organizationId
          : undefined,
      endAt: new firebase.firestore.Timestamp(
        data?.invite?.endAt.seconds,
        data?.invite?.endAt.nanoseconds
      ),
      active: data?.invite?.active,
      count: data?.invite?.count,
      role: data?.invite?.role,
    };
  },
};
