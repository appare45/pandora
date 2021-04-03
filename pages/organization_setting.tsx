import {
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
import { Invite } from '../entities/Invite';
import { role } from '../entities/Organization';
import User_layout from '../layouts/User';
import { createInvite, getUserInvites } from '../repositories/Invite';
import { updateOrganization } from '../repositories/Organization';
import TextInput from './../components/TextInput';

function Name_setting(): JSX.Element {
  const currentOrganization = useContext(OrganizationContext);
  const currentUserContext = useContext(AuthContext);
  const [organizationName, setOrganizationName] = useState(
    currentOrganization.currentOrganization?.name
  );
  useEffect(
    () => setOrganizationName(currentOrganization.currentOrganization?.name),
    [currentOrganization.currentOrganization?.name]
  );
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
                    setOrganizationName(
                      currentOrganization.currentOrganization?.name || ''
                    );
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
        className="w-8 ml-1"
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
    count: 0,
    role: 'host',
  };
  const reducer = (
    state: Invite,
    action: {
      type: 'setEndAt' | 'setRole' | 'setUserId' | 'setOrganizationId';
      payload: role | Date | string;
    }
  ) => {
    const _: Invite = state;
    switch (action.type) {
      case 'setEndAt': {
        _.endAt = action.payload as Date;
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
    if (!currentInvite.endAt) {
      setErrorState({
        name: '有効期限を指定してください',
        message: '',
      });
    } else {
      createInvite(currentInvite)
        .then((e) => setInviteLink(`${window.location.host}/invite/${e.id}`))
        .catch((e) => setErrorState(e));
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
                  <option value="host" className="bg-yellow-100">
                    管理者
                  </option>
                  <option value="teacher" className="bg-blue-100">
                    教師
                  </option>
                  <option value="committer" className="bg-green-100">
                    委員
                  </option>
                  <option value="member" className="bg-gray-100">
                    生徒
                  </option>
                </select>
              </div>
              <div className="mx-1">
                <label htmlFor="limit">有効期限</label>
                <input
                  type="date"
                  required
                  min={`${today.getFullYear()}-${(
                    '00' + (today.getMonth() + 1).toString()
                  ).slice(-2)}-${('00' + today.getDate().toString()).slice(
                    -2
                  )}`}
                  max={`${today.getFullYear() + 1}-${(
                    '00' + (today.getMonth() + 1).toString()
                  ).slice(-2)}-${('00' + today.getDate().toString()).slice(
                    -2
                  )}`}
                  onChange={(e) => {
                    currentInvite.endAt = e.target.valueAsDate;
                    dispatch({
                      type: 'setEndAt',
                      payload: e.target.valueAsDate,
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
  const [currentInvites, setCurrentInvites] = useState<Invite[]>();
  const userContext = useContext(AuthContext);
  useEffect(() => {
    if (!!userContext.currentUser?.uid) {
      getUserInvites(userContext.currentUser.uid).then((invite) => {
        setCurrentInvites(invite);
      });
    }
  }, [!userContext.currentUser?.uid]);
  return (
    <div className="my-3">
      <div className="flex">
        <h2 className="text-lg font-medium break-normal flex-1 w-full whitespace-nowrap">
          招待リンク
        </h2>
        <div>
          <ActionButton>作成</ActionButton>
        </div>
      </div>
      <div>
        <CreateInvite />
      </div>
      {!!currentInvites?.length && (
        <table className="table-auto">
          <thead>
            <tr>名前</tr>
            <tr>作成日時</tr>
            <tr>有効期限</tr>
            <tr>利用回数</tr>
          </thead>
          <tbody>
            {currentInvites.map((invite) => (
              <tr>
                <td>{invite?.created}</td>
              </tr>
            ))}
          </tbody>
          {/* {currentInvites && } */}
        </table>
      )}
    </div>
  );
}
export default function organization_setting() {
  return (
    <User_layout>
      <section className="m-10">
        <h2 className="text-2xl font-medium">設定</h2>
        <div className="md:px-3 px-0.5 py-2 max-w-xl">
          <Name_setting />
          <InviteLink />
        </div>
      </section>
    </User_layout>
  );
}
