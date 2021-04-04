import { AuthContext } from '../contexts/Auth';
import React, { FormEvent, useContext, useRef, useState } from 'react';
import LoginFront from '../components/login';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import {
  OrganizationContext,
  OrganizationProvider,
} from '../contexts/Organization';
import ActionCard from '../components/ActionCard';
import ActionButton from '../components/ActionButton';
import { JoinOrganizationFromInvitation } from '../repositories/Invite';
import TextInput from '../components/TextInput';
import { setOrganizationUser } from '../repositories/Organization';

function JoinOrganization() {
  const { currentUser } = useContext(AuthContext);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<Error>();
  return (
    <ActionCard>
      <form>
        <p className="text-lg font-medium">組織コードを入力</p>
        <p className="text-sm">
          事前に伝えられている組織コードを入力してください
        </p>
        <TextInput editable={true} onInput={setCode} value={code} />
        <ActionButton
          enabled={!!code?.length}
          action={(e: FormEvent) => {
            e.preventDefault();
            JoinOrganizationFromInvitation(code, currentUser.uid)
              .then((e) => {
                setOrganizationUser(e.organizationId, currentUser.uid, {
                  name: currentUser.displayName,
                  role: e.role,
                })
                  .then(() => {
                    setError(null);
                  })
                  .catch((e) => {
                    console.warn(e);
                    setError(e);
                  });
              })
              .catch((e) => console.warn(e));
          }}
          type="submit"
        >
          参加
        </ActionButton>
      </form>
    </ActionCard>
  );
}

const OrganizationUserLayout = React.memo(
  (props: {
    userMenuStatus: boolean;
    setUserMenuStatus: Function;
    children: Object;
  }) => {
    const { currentUser } = useContext(AuthContext);
    const { currentOrganization, curretnOrganizationUser } = useContext(
      OrganizationContext
    );

    return (
      <>
        <Modal
          display={props.userMenuStatus}
          onClose={() => props.setUserMenuStatus(false)}
        >
          <Sidebar
            currentUser={currentUser}
            currentOrg={currentOrganization}
            currentOrgUser={curretnOrganizationUser}
          />
        </Modal>

        <main className="grid grid-cols-1 md:grid-cols-5 h-screen relative">
          <div className="hidden md:block justify-items-start col-start-1 relative bg-gray-50">
            <div className="sticky top-0 h-screen">
              <Sidebar
                currentUser={currentUser}
                currentOrg={currentOrganization}
                currentOrgUser={curretnOrganizationUser}
              />
            </div>
          </div>
          <div className="md:col-start-2 md:col-end-6 max-w-full">
            {props.children}
          </div>
        </main>
      </>
    );
  }
);

export default function User_layout({ children }) {
  const { currentUser, currentUserData } = useContext(AuthContext);
  const [userMenuStatus, setUserMenuStatus] = useState<boolean>(false);
  return (
    <>
      {currentUser === null ? (
        <LoginFront />
      ) : (
        <>
          {currentUserData !== undefined && (
            <>
              {!currentUserData?.joinedOrgId ? (
                <Modal display={true} blockClose>
                  <JoinOrganization />
                </Modal>
              ) : (
                <>
                  <Head>
                    <meta name="robots" content="noindex" />
                    <title>{!currentUser ? 'ログイン' : 'Pandora'}</title>
                  </Head>
                  <header className="w-full shadow flex items-center justify-between p-5 py-1 relative z-50">
                    <h1 className="text-2xl py-3 font-bold">
                      <Link href="/">
                        <a>🐍Pandora</a>
                      </Link>
                    </h1>
                    <button
                      className="w-11 h-11 m-1 p-1 md:hidden"
                      onClick={() => setUserMenuStatus(!userMenuStatus)}
                    >
                      {userMenuStatus ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      )}
                    </button>
                  </header>
                  <OrganizationProvider>
                    <OrganizationUserLayout
                      userMenuStatus={userMenuStatus}
                      setUserMenuStatus={setUserMenuStatus}
                    >
                      {children}
                    </OrganizationUserLayout>
                  </OrganizationProvider>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
