import { DocumentSnapshot } from '@firebase/firestore-types';
import { FC, createContext, useEffect, useState, useContext } from 'react';
import { OrgData, OrgUser } from '../entities/Organization';
import {
  getOrganization,
  getOrganizationUser,
  setOrganizationUser,
} from '../repositories/Organization';
import { getUser } from '../repositories/User';
import { AuthContext } from './Auth';

export type OrganizationContextProps = {
  currentOrganization: DocumentSnapshot<OrgData>;
  curretnOrganizationUser: OrgUser;
};

const OrganizationContext = createContext<OrganizationContextProps>({
  currentOrganization: null,
  curretnOrganizationUser: null,
});

const OrganizationProvider: FC = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<
    DocumentSnapshot<OrgData>
  >();
  const [
    currentOrganizationUser,
    setCurrentOrganizationUser,
  ] = useState<OrgUser>();
  const User = useContext(AuthContext).currentUser;

  useEffect(() => {
    if (!!User?.uid) {
      getUser(User.uid).then((user) => {
        if (!!user?.joinedOrgId) {
          // 組織のユーザーを設定
          if (!currentOrganizationUser) {
            getOrganizationUser(user.joinedOrgId, User.uid).then((orgUser) => {
              setCurrentOrganizationUser(orgUser);
              if (!orgUser?.role) {
                setOrganizationUser(
                  user.joinedOrgId,
                  User.uid,
                  {
                    name: User.displayName,
                    role: 'member',
                  },
                  { merge: true }
                ).then(() => {
                  getOrganizationUser(user.joinedOrgId, User.uid).then(
                    (orgUser) => {
                      setCurrentOrganizationUser(orgUser);
                    }
                  );
                });
              }
              if (!currentOrganization) {
                getOrganization(user.joinedOrgId).then((organization) => {
                  setCurrentOrganization(organization);
                });
              }
            });
          }
        }
      });
    }
  }, [User]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization: currentOrganization,
        curretnOrganizationUser: currentOrganizationUser,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export { OrganizationContext, OrganizationProvider };
