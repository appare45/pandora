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
  currentOrganization: OrgData;
  curretnOrganizationUser: OrgUser;
};

const OrganizationContext = createContext<OrganizationContextProps>({
  currentOrganization: null,
  curretnOrganizationUser: null,
});

const OrganizationProvider: FC = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<OrgData>();
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
            getOrganization(user.joinedOrgId).then((organization: OrgData) => {
              setCurrentOrganization(organization);
            });
          });
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
