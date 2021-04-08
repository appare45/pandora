import {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from '@firebase/firestore-types';
import {
  organizationDataConverter,
  organizationUserDataConverter,
  OrgData,
  OrgUser,
} from '../entities/Organization';
import firebase, { app } from '../utils/firebase';

const firestore = firebase.firestore(app);
const orgRef = firestore.collection('organization');

export async function getOrganization(
  organizationId: string
): Promise<DocumentSnapshot<OrgData>> {
  return orgRef
    .withConverter(organizationDataConverter)
    .doc(organizationId)
    .get()
    .then((org: firebase.firestore.DocumentSnapshot<OrgData>) => {
      return org;
    })
    .catch((error) => {
      console.warn(error);
      return error;
    });
}

export async function setOrganization(
  id: string,
  data: OrgData,
  options?: firebase.firestore.SetOptions
) {
  orgRef
    .withConverter(organizationDataConverter)
    .doc(id)
    .set(data, options)
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
}

export async function updateOrganization(id: string, data: OrgData) {
  return orgRef
    .withConverter(organizationDataConverter)
    .doc(id)
    .update(data)
    .catch((errror) => {
      console.warn(errror);
      throw new Error(errror);
    });
}

export async function searchOrganization(
  fieldPath: firebase.firestore.FieldPath | string,
  whereFilterOption: firebase.firestore.WhereFilterOp,
  value: any
): Promise<firebase.firestore.QuerySnapshot<OrgData>> {
  return orgRef
    .where(fieldPath, whereFilterOption, value)
    .withConverter(organizationDataConverter)
    .get()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.warn(error);
      return error;
    });
}

export async function getOrganizationUser(
  orgId: string,
  userId: string
): Promise<OrgUser> {
  return orgRef
    .withConverter(organizationUserDataConverter)
    .doc(orgId)
    .collection('user')
    .doc(userId)
    .get()
    .then((user: firebase.firestore.DocumentSnapshot<OrgUser>) => {
      return user.data();
    })
    .catch((error) => {
      console.warn(error);
      return error;
    });
}

export async function getOrganizationUersList(
  organizationId: string
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  return orgRef
    .withConverter(organizationDataConverter)
    .doc(organizationId)
    .collection('user')
    .get()
    .then((data) => {
      const users: QueryDocumentSnapshot<DocumentData>[] = [];
      data.forEach((user) => users.push(user));
      return users;
    });
}

export async function setOrganizationUser(
  orgId: string,
  userId: string,
  data: OrgUser,
  options?: firebase.firestore.SetOptions
) {
  orgRef
    .withConverter(organizationUserDataConverter)
    .doc(orgId)
    .collection('user')
    .doc(userId)
    .set(data, options)
    .then((_) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      throw new Error(error);
    });
}

export async function DisableOrganizationUser(
  organizationId: string,
  userId: string
) {
  orgRef
    .withConverter(organizationDataConverter)
    .doc(organizationId)
    .update({
      disabledUsersIds: firebase.firestore.FieldValue.arrayUnion(userId),
    })
    .catch((e) => {
      throw new Error(e);
    });
}

export async function EnableOrganizationUser(
  organizationId: string,
  userId: string
) {
  orgRef
    .withConverter(organizationDataConverter)
    .doc(organizationId)
    .update({
      disabledUsersIds: firebase.firestore.FieldValue.arrayRemove(userId),
    })
    .catch((e) => {
      throw new Error(e);
    });
}
