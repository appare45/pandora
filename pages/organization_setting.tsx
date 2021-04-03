import { FormEvent, useContext, useEffect, useReducer, useState } from 'react';
import ActionButton from '../components/ActionButton';
import ActionCard from '../components/ActionCard';
import WarningCard from '../components/WarningCard';
import { AuthContext } from '../contexts/Auth';
import { OrganizationContext } from '../contexts/Organization';
import { Invite } from '../entities/Invite';
import { role } from '../entities/Organization';
import User_layout from '../layouts/User';
import { getUserInvites } from '../repositories/Invite';
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
      {!!error && (
        <WarningCard title={error.name} description={error.message} />
      )}
    </div>
  );
}

function CreateInvite() {
  const { currentUser, currentUserData } = useContext(AuthContext);
  const currentInvite: Invite = {
    title: '',
    userId: currentUser?.uid,
    organizationId: currentUserData?.joinedOrgId,
    endAt: null,
    active: true,
    count: 0,
    role: 'host',
  };
  useEffect(() => {
    currentInvite.userId = currentUser?.uid;
    currentInvite.organizationId = currentUserData?.joinedOrgId;
  }, [currentUser?.uid, currentUserData?.joinedOrgId]);
  function create(e) {
    console.info(e);
    console.info(currentInvite);
  }
  const today: Date = new Date();
  return (
    <div className="my-1">
      <ActionCard>
        <form className="flex items-center justify-around w-full">
          <div className="flex mb-1">
            <div className="mx-1">
              <label htmlFor="roleSetting">権限</label>
              <select
                name="role"
                id="roleSetting"
                required
                onChange={(e) => (currentInvite.role = e.target.value as role)}
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
                ).slice(-2)}-${('00' + today.getDay().toString()).slice(-2)}`}
                max={`${today.getFullYear() + 1}-${(
                  '00' + (today.getMonth() + 1).toString()
                ).slice(-2)}-${('00' + today.getDay().toString()).slice(-2)}`}
                onChange={(e) => {
                  currentInvite.endAt = e.target.valueAsDate;
                  console.info(e.target.valueAsDate > new Date());
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
        console.info(invite);
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
      {!!currentInvites && !!currentInvites?.length && (
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
                <td>{invite.title}</td>
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
