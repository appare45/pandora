import firebase from 'firebase';
export interface UserData {
  readonly lastLogin: firebase.firestore.Timestamp;
  readonly joinedOrgId: string;
}
