import firebase from 'firebase';
export type role = 'member' | 'host' | 'committee' | 'teacher';

export interface OrgUser {
  name?: string;
  joinedEvents?: string[];
  role?: role;
  lastLogin?: firebase.firestore.FieldValue;
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
  name?: string;
  user?: firebase.firestore.CollectionReference<OrgUser>;
  event?: firebase.firestore.CollectionReference<OrgUser>;
  domain?: string;
}

export const organizationDataConverter: firebase.firestore.FirestoreDataConverter<OrgData> = {
  toFirestore(organization: OrgData): firebase.firestore.DocumentData {
    return {
      organization,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options?: firebase.firestore.SnapshotOptions
  ): Readonly<OrgData> {
    const data = snapshot.data(options)!;
    return {
      name: data?.name,
      user: data?.user,
      event: data?.event,
      domain: data?.domain,
    };
  },
};

export const organizationUserDataConverter: firebase.firestore.FirestoreDataConverter<OrgUser> = {
  toFirestore(organizationUser: OrgUser): firebase.firestore.DocumentData {
    if (!!organizationUser) {
      return {
        name: !organizationUser?.name ? organizationUser.name : '',
        joinedEvents: !organizationUser?.joinedEvents
          ? organizationUser.joinedEvents
          : [],
        role: organizationUser?.role,
      };
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options?: firebase.firestore.SnapshotOptions
  ): Readonly<OrgUser> {
    const data = snapshot.data(options)!;
    return {
      name: data.name,
      joinedEvents: data.joinedEvents,
      role: data.role,
    };
  },
};

export const roleTextConverter = (role: role): string => {
  switch (role) {
    case 'host':
      return '管理者';

    case 'teacher':
      return '教員';

    case 'committee':
      return '委員';
    default:
      return '生徒';
  }
};
