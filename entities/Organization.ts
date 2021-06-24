import {
  CollectionReference,
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@firebase/firestore-types';
import firebase from 'firebase';
export type role = 'member' | 'host' | 'committee' | 'teacher';

export interface OrgUser {
  name?: string;
  joinedEvents?: string[];
  role?: role;
  lastLogin?: FieldValue;
}

export interface MediaData {
  isPublic: boolean;
  ref: firebase.storage.Reference;
  onFace?: boolean;
  checked: null | 'committee' | 'teacher';
  committeeComment: string;
  committee: CollectionReference<OrgUser>;
  teacherComment: string;
  teacher: CollectionReference<OrgUser>;
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
  user?: CollectionReference<OrgUser>;
  event?: CollectionReference<OrgUser>;
  domain?: string;
  disabledUsersIds?: string[];
}

export const organizationDataConverter: FirestoreDataConverter<OrgData> = {
  toFirestore(organization: OrgData): DocumentData {
    return {
      organization,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): Readonly<OrgData> {
    const data = snapshot.data(options)!;
    return {
      name: data?.name,
      user: data?.user,
      event: data?.event,
      domain: data?.domain,
      disabledUsersIds: data?.disabledUsersIds,
    };
  },
};

export const organizationUserDataConverter: FirestoreDataConverter<OrgUser> = {
  toFirestore(organizationUser: OrgUser): DocumentData {
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
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
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
