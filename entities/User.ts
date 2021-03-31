import firebase from 'firebase';
export interface UserData {
  readonly lastLogin: firebase.firestore.FieldValue;
  readonly joinedOrgId?: string;
}

export const userDataConverter: firebase.firestore.FirestoreDataConverter<UserData> = {
  toFirestore(user: UserData): firebase.firestore.DocumentData {
    if (!user?.joinedOrgId) {
      return { lastLogin: user.lastLogin };
    }
    return { lastLogin: user.lastLogin, joinedOrgId: user?.joinedOrgId };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options?: firebase.firestore.SnapshotOptions
  ): UserData {
    const data = snapshot.data(options)!;
    return {
      lastLogin: data.lastLogin,
      joinedOrgId: data?.joinedOrgId,
    };
  },
};
