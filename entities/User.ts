import {
  DocumentData,
  DocumentReference,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@firebase/firestore-types';
import { Invite } from './Invite';
export interface UserData {
  lastLogin: FieldValue;
  joinedOrgId?: string;
  invite?: DocumentReference<Invite>[];
}

export const userDataConverter: FirestoreDataConverter<UserData> = {
  toFirestore(user: UserData): DocumentData {
    return user;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): Readonly<UserData> {
    const data = snapshot.data(options)!;
    return {
      lastLogin: data.lastLogin,
      joinedOrgId: data?.joinedOrgId,
      invite: data?.invite,
    };
  },
};
