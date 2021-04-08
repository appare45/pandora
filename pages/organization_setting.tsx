import React, {
  FormEvent,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import ActionButton from '../components/ActionButton';
import ActionCard from '../components/ActionCard';
import WarningCard from '../components/WarningCard';
import { AuthContext } from '../contexts/Auth';
import { OrganizationContext } from '../contexts/Organization';
import { Invite, inviteConverter } from '../entities/Invite';
import { role, roleTextConverter } from '../entities/Organization';
import User_layout from '../layouts/User';
import {
  createInvite,
  getInviteLink,
  setInivationsActivation,
} from '../repositories/Invite';
import { createUserInvite, getUserInvites } from '../repositories/User';
import {
  DisableOrganizationUser,
  EnableOrganizationUser,
  getOrganizationUersList,
  updateOrganization,
} from '../repositories/Organization';
import TextInput from './../components/TextInput';
import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  Timestamp,
} from '@firebase/firestore-types';
import firebase from '../utils/firebase';
import Heading from '../components/Heading';

function Name_setting(): JSX.Element {
  const { currentOrganization } = useContext(OrganizationContext);
  const currentUserContext = useContext(AuthContext);
  const [organizationName, setOrganizationName] = useState<string>(
    currentOrganization?.data()?.name
  );
  useEffect(() => setOrganizationName(currentOrganization?.data()?.name), [
    currentOrganization?.data()?.name,
  ]);
  const [nameEdit, setNameEdit] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  function submitChange(e: FormEvent) {
    e.preventDefault();
    updateOrganization(currentUserContext.currentUserData.joinedOrgId, {
      name: organizationName,
    })
      .then(() => {
        setError(null);
        setNameEdit(false);
      })
      .catch((e: Error) => {
        setError(e);
      });
  }

  return (
    <div>
      <form
        className="flex items-end"
        onSubmit={(e: FormEvent) => submitChange(e)}
      >
        <TextInput
          editable={nameEdit}
          edit={() => {
            setNameEdit(true);
            setError(null);
          }}
          // undefinedが渡されるのを防止
          value={organizationName || ''}
          onInput={(n: string) => {
            setOrganizationName(n);
            setError(null);
          }}
          label="組織名"
          max={20}
          min={1}
        />
        {nameEdit && (
          <>
            <div className="flex my-1 md:my-0 md:mx-0.5">
              <div className="mx-0.5 w-full">
                <ActionButton
                  type="submit"
                  enabled={
                    nameEdit &&
                    organizationName.length > 0 &&
                    organizationName.length <= 20
                  }
                  action={(e: FormEvent) => submitChange(e)}
                >
                  保存
                </ActionButton>
              </div>
              <div className="mx-0.5 w-full">
                <ActionButton
                  enabled={true}
                  action={() => {
                    setNameEdit(false);
                    setOrganizationName(currentOrganization.data()?.name || '');
                    setError(null);
                  }}
                  color="gray"
                >
                  キャンセル
                </ActionButton>
              </div>
            </div>
          </>
        )}
      </form>
      {!!error && <WarningCard error={error} />}
    </div>
  );
}

function CreatedInvite(props: { url: string }) {
  const ref = useRef<HTMLInputElement>();
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <div className="flex">
      <input
        type="text"
        value={props.url}
        disabled
        className="flex-1 bg-gray-50 p-1 font-mono"
        ref={ref}
      />
      <button
        onClick={() => {
          navigator.clipboard.writeText(props.url);
          setCopied(true);
        }}
        className="w-6 ml-1"
      >
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-green-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function CreateInvite() {
  const { currentUser, currentUserData } = useContext(AuthContext);
  const initInvite: Invite = {
    userId: currentUser?.uid,
    organizationId: currentUserData?.joinedOrgId,
    endAt: null,
    active: true,
    role: 'host',
  };
  const reducer = (
    state: Invite,
    action: {
      type: 'setEndAt' | 'setRole' | 'setUserId' | 'setOrganizationId';
      payload: role | Timestamp | string;
    }
  ) => {
    const _: Invite = state;
    switch (action.type) {
      case 'setEndAt': {
        _.endAt = action.payload as Timestamp;
        return _;
      }
      case 'setRole': {
        _.role = action.payload as role;
        return _;
      }
      case 'setUserId': {
        _.userId = action.payload as string;
      }
      case 'setOrganizationId': {
        _.organizationId = action.payload as string;
      }
      default:
        return _;
    }
  };

  const [currentInvite, dispatch] = useReducer(reducer, initInvite);
  useEffect(() => {
    currentInvite.userId = currentUser?.uid;
    dispatch({ type: 'setUserId', payload: currentUser?.uid });
    currentInvite.organizationId = currentUserData?.joinedOrgId;
    dispatch({
      type: 'setOrganizationId',
      payload: currentUserData?.joinedOrgId,
    });
  }, [currentUser?.uid, currentUserData?.joinedOrgId]);
  const [errorState, setErrorState] = useState<Error>();
  function create(e: FormEvent) {
    e.preventDefault();
    if (
      !currentInvite.endAt ||
      currentInvite.endAt.seconds <= Date.now() / 1000 ||
      currentInvite.endAt.seconds >= Date.now() + 3.154e7 / 1000
    ) {
      setErrorState({
        name: '有効期限を正しく指定してください',
        message: '',
      });
    } else {
      createInvite(currentInvite)
        .then((e) => {
          createUserInvite(e, currentUser.uid)
            .then(() => {
              setInviteLink(getInviteLink(e.id));
            })
            .catch((e) => {
              setErrorState(e);
            });
        })
        .catch((e) => {
          setErrorState(e);
        });
    }
  }

  const [inviteLink, setInviteLink] = useState<string>();
  const today: Date = new Date();
  return (
    <div className="my-1">
      <ActionCard>
        {!inviteLink ? (
          <form
            className="flex items-center justify-around w-full"
            onChange={() => setErrorState(null)}
          >
            <div className="flex mb-1">
              <div className="mx-1">
                <label htmlFor="roleSetting">権限</label>
                <select
                  name="role"
                  id="roleSetting"
                  required
                  onChange={(e) =>
                    dispatch({ type: 'setRole', payload: e.target.value })
                  }
                >
                  <option value="member">生徒</option>
                  <option value="teacher">教師</option>
                  <option value="committer">委員</option>
                  <option value="host">管理者</option>
                </select>
              </div>
              <div className="mx-1">
                <label htmlFor="limit">有効期限</label>
                <input
                  type="date"
                  required
                  min={`${today.getFullYear()}-${(
                    '00' + (today.getMonth() + 1).toString()
                  ).slice(-2)}-${(
                    '00' + (today.getDate() + 1).toString()
                  ).slice(-2)}`}
                  max={`${today.getFullYear() + 1}-${(
                    '00' + (today.getMonth() + 1).toString()
                  ).slice(-2)}-${('00' + today.getDate().toString()).slice(
                    -2
                  )}`}
                  onChange={(e) => {
                    dispatch({
                      type: 'setEndAt',
                      payload: new firebase.firestore.Timestamp(
                        e.target.valueAsNumber / 1000,
                        0
                      ),
                    });
                  }}
                />
              </div>
            </div>
            <div>
              <ActionButton enabled action={(e) => create(e)}>
                作成
              </ActionButton>
            </div>
          </form>
        ) : (
          <CreatedInvite url={inviteLink} />
        )}
        {!!errorState && <WarningCard error={errorState} />}
      </ActionCard>
    </div>
  );
}

function InviteLink() {
  const [currentInvites, setCurrentInvites] = useState<
    DocumentReference<Invite>[]
  >();
  const userContext = useContext(AuthContext);
  const { curretnOrganizationUser } = useContext(OrganizationContext);
  useEffect(() => {
    if (!!userContext.currentUser?.uid) {
      getUserInvites(userContext.currentUser.uid).then((invites) => {
        setCurrentInvites(invites);
      });
    }
  }, [!userContext.currentUser?.uid]);
  const [createLinkState, setCreateLinkState] = useState<boolean>(false);
  return (
    <>
      {curretnOrganizationUser?.role === 'host' && (
        <div className="my-5">
          <div className="flex">
            <h2 className="text-lg font-medium break-normal flex-1 w-full whitespace-nowrap">
              招待リンク
            </h2>
            <div>
              {createLinkState ? (
                <ActionButton
                  enabled
                  color="gray"
                  action={() => setCreateLinkState(false)}
                >
                  キャンセル
                </ActionButton>
              ) : (
                <ActionButton enabled action={() => setCreateLinkState(true)}>
                  作成
                </ActionButton>
              )}
            </div>
          </div>
          {createLinkState && (
            <div className="my-2">
              <CreateInvite />
            </div>
          )}
          {!currentInvites?.length ? (
            <p className="text-center">作成されたリンクはありません</p>
          ) : (
            <table className="table-auto w-full mt-4">
              <thead>
                <tr>
                  <th className="px-2">権限</th>
                  <th className="px-2">作成日時</th>
                  <th className="px-2">有効期限</th>
                  <th className="px-2">コピー</th>
                  <th className="px-2">有効/無効</th>
                </tr>
              </thead>
              <tbody>
                {currentInvites.map((invite) => (
                  <InviteDataTable invite={invite} key={invite.id} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}

function InviteDataTable(props: { invite: DocumentReference<Invite> }) {
  const [inviteData, setInviteData] = useState<Invite>();
  useEffect(() => {
    props.invite.withConverter(inviteConverter).onSnapshot((data) => {
      console.info(data.data().endAt.toMillis() > Date.now());
      setInviteData(data.data());
    });
  }, []);
  const Memoizedlement = React.memo(
    (props: { inviteData: Invite; inviteId: string }) => {
      return (
        <tr className="p-1 border-t-2 border-b-2">
          {!!props.inviteData && (
            <>
              <td className="px-2">
                {roleTextConverter(props.inviteData.role)}
              </td>
              <td className="px-2">
                {new Date(props.inviteData.created.toMillis()).toLocaleString()}
              </td>
              <td className="px-2">
                {new Date(props.inviteData.endAt.toMillis()).toLocaleString()}
              </td>
              <td className="flex p-1 justify-center">
                <ActionButton
                  color="gray"
                  enabled
                  action={() =>
                    navigator.clipboard.writeText(getInviteLink(props.inviteId))
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-9 w-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </ActionButton>
              </td>
              <td className="p-1 justify-center">
                {props.inviteData.endAt.toMillis() < Date.now() ? (
                  <>期限切れ</>
                ) : (
                  <>
                    {props.inviteData.active ? (
                      <ActionButton
                        enabled
                        action={() =>
                          setInivationsActivation(props.inviteId, false)
                        }
                        color="red"
                      >
                        無効化
                      </ActionButton>
                    ) : (
                      <ActionButton
                        color="blue"
                        enabled
                        action={() =>
                          setInivationsActivation(props.inviteId, true)
                        }
                      >
                        有効化
                      </ActionButton>
                    )}
                  </>
                )}
              </td>
            </>
          )}
        </tr>
      );
    }
  );
  return <Memoizedlement inviteData={inviteData} inviteId={props.invite.id} />;
}

function UsersList() {
  const [currentUsers, setCurrentUsers] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >();
  const [disabledUsersIds, setDisabledUsersIds] = useState<string[]>();
  const { currentUserData } = useContext(AuthContext);
  const { currentOrganization } = useContext(OrganizationContext);
  useEffect(() => {
    if (!!currentUserData?.joinedOrgId) {
      getOrganizationUersList(currentUserData?.joinedOrgId).then((data) => {
        setCurrentUsers(data);
      });
    }
  }, [!currentUserData]);
  useEffect(() => {
    if (!!currentOrganization?.data().disabledUsersIds) {
      setDisabledUsersIds(currentOrganization?.data().disabledUsersIds);
    }
  }, [!currentOrganization?.data().disabledUsersIds]);
  return (
    <>
      <Heading level={2}>ユーザー</Heading>
      {!currentUsers?.length ? (
        <p>ユーザーが見つかりませんでした</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>氏名</th>
              <th>権限</th>
              <th>有効/無効</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((data) => (
              <UserDataRow
                userData={data}
                key={data.id}
                isEnabled={!(disabledUsersIds?.indexOf(data.id) >= 0)}
              />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function UserDataRow(props: {
  userData: QueryDocumentSnapshot<DocumentData>;
  isEnabled: boolean;
}) {
  const { currentUser, currentUserData } = useContext(AuthContext);
  const [isEnabledLocal, setIsEnabledLocal] = useState<boolean>();
  useEffect(() => {
    setIsEnabledLocal(props.isEnabled);
  }, [props.isEnabled]);
  function disableUser(userId: string) {
    if (isEnabledLocal) {
      DisableOrganizationUser(currentUserData.joinedOrgId, userId).then(() => {
        setIsEnabledLocal(false);
      });
    } else {
      EnableOrganizationUser(currentUserData.joinedOrgId, userId).then(() => {
        setIsEnabledLocal(true);
      });
    }
  }
  return (
    <tr className="p-1 border-t-2 border-b-2 leading-7">
      <td>{props.userData.data().name}</td>
      <td>{roleTextConverter(props.userData.data().role)}</td>
      <td className="flex justify-center">
        {currentUser.uid == props.userData.id ? (
          <p>あなた</p>
        ) : (
          <ActionButton
            enabled
            color={isEnabledLocal && 'red'}
            action={() => {
              disableUser(props.userData.id);
            }}
          >
            {isEnabledLocal ? '無効化' : '有効化'}
          </ActionButton>
        )}
      </td>
    </tr>
  );
}

export default function organization_setting() {
  return (
    <User_layout>
      <section className="m-10">
        <Heading level={1}>設定</Heading>
        <div className="md:px-3 px-0.5 py-2 max-w-3xl">
          <Name_setting />
          <InviteLink />
          <UsersList />
        </div>
      </section>
    </User_layout>
  );
}
