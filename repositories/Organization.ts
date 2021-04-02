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
): Promise<OrgData> {
  return orgRef
    .withConverter(organizationDataConverter)
    .doc(organizationId)
    .get()
    .then((org: firebase.firestore.DocumentSnapshot<OrgData>) => {
      return org.data();
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
    });
}
