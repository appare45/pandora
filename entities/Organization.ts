import firebase from 'firebase';
export interface OrgUser {
  name: string;
  joinedEvents: string[];
  role: ('member' | 'host' | 'committee' | 'teacher')[];
}

export interface MediaData {
  public: boolean;
  ref: firebase.storage.Reference;
  onFace?: boolean;
  checked: null | 'committee' | 'teacher';
  committeeComment: string;
  committee: firebase.firestore.CollectionReference<OrgUser>;
  teacherComment: string;
  teacher: firebase.firestore.CollectionReference<OrgUser>;
}

export interface EventData {
  name: string;
  description: string;
  icon: MediaData;
}

export interface OrgData {
  name: string;
  user: firebase.firestore.CollectionReference<OrgUser>;
  event: firebase.firestore.CollectionReference<OrgUser>;
  domain: string;
}
