import firebase from 'firebase';
import { Invite } from './Invite';
export interface UserData {
  lastLogin: firebase.firestore.FieldValue;
  joinedOrgId?: string;
  invite?: firebase.firestore.DocumentReference<Invite>[];
}

export const userDataConverter: firebase.firestore.FirestoreDataConverter<UserData> = {
  toFirestore(user: UserData): firebase.firestore.DocumentData {
    return user;
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options?: firebase.firestore.SnapshotOptions
  ): Readonly<UserData> {
    const data = snapshot.data(options)!;
    return {
      lastLogin: data.lastLogin,
      joinedOrgId: data?.joinedOrgId,
      invite: data?.invite,
    };
  },
};
