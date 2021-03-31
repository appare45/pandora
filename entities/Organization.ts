import firebase from 'firebase';
export interface OrgUser {
  name: string;
  joinedEvents: string[];
  role: ('member' | 'host' | 'committee' | 'teacher')[];
}

export interface MediaData {
  isPublic: boolean;
  ref: firebase.storage.Reference;
  onFace?: boolean;
  checked: null | 'committee' | 'teacher';
  committeeComment: string;
  committee: firebase.firestore.CollectionReference<OrgUser>;
  teacherComment: string;
  teacher: firebase.firestore.CollectionReference<OrgUser>;
}

export interface EventArticleData {
  isPublic: boolean;
  title: string;
  content: string;
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

export const organizationDataConverter: firebase.firestore.FirestoreDataConverter<OrgData> = {
  toFirestore(organization: OrgData): firebase.firestore.DocumentData {
    return {
      name: organization.name,
      user: organization.user,
      event: organization.event,
      domain: organization.domain,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options?: firebase.firestore.SnapshotOptions
  ): OrgData {
    const data = snapshot.data(options)!;
    return {
      name: data?.name,
      user: data?.user,
      event: data?.event,
      domain: data?.domain,
    };
  },
};
