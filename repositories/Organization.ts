import { organizationDataConverter, OrgData } from '../entities/Organization';
import firebase, { app } from '../utils/firebase';

const firestore = firebase.firestore(app);
const orgRef = firestore.collection('organization');

export async function getOrganization(id: string): Promise<OrgData> {
  return orgRef
    .withConverter(organizationDataConverter)
    .doc(id)
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
