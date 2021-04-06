import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import JoinOrganization from '../components/JoinOrganization';
import LoginFront from '../components/login';
import Modal from '../components/Modal';
import WarningCard from '../components/WarningCard';
import { AuthContext } from '../contexts/Auth';
import {
  OrganizationContext,
  OrganizationProvider,
} from '../contexts/Organization';
import { JoinOrganizationFromInvitation } from '../repositories/Invite';
import { setOrganizationUser } from '../repositories/Organization';

export default function InviteApp() {
  return (
    <Modal display={true} blockClose>
      <OrganizationProvider>
        <Invite />
      </OrganizationProvider>
    </Modal>
  );
}

function Invite() {
  const router = useRouter();
  const { currentOrganization } = useContext(OrganizationContext);
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState<Error>();
  if (!!currentOrganization) {
    router.push('/');
  }
  if (!!router.asPath.replace(/\/invite\?/gm, '')) {
    useEffect(() => {
      if (!!currentUser && !!currentOrganization) {
        JoinOrganizationFromInvitation(
          router.asPath.replace(/\/invite\?/gm, '').replace('=', ''),
          currentUser.uid
        )
          .then((e) => {
            setOrganizationUser(e.organizationId, currentUser.uid, {
              name: currentUser.displayName,
              role: e.role,
            })
              .then(() => {
                router.push('/');
              })
              .catch(() => setError({ name: 'リンクが無効です', message: '' }));
          })
          .catch(() => setError({ name: 'リンクが無効です', message: '' }));
      }
    }, [currentUser]);
  }
  return (
    <>
      {!currentUser ? (
        <LoginFront />
      ) : (
        <>
          <JoinOrganization />
          <Modal display={!!error} blockClose>
            <WarningCard error={error} />
          </Modal>
        </>
      )}
    </>
  );
}
