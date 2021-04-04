import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from '@firebase/firestore-types';
import { role } from './Organization';
export interface Invite {
  created?: Timestamp;
  userId?: string;
  organizationId?: string;
  endAt?: Date;
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
      created: data?.invite?.created,
      organizationId:
        typeof data?.invite?.organizationId === 'string'
          ? data?.invite.organizationId
          : undefined,
      endAt: data?.invite?.endAt,
      active: data?.invite?.active,
      count: data?.invite?.count,
      role: data?.invite?.role,
    };
  },
};
