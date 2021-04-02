import { FormEvent, useContext, useEffect, useState } from 'react';
import ActionButton from '../components/ActionButton';
import { AuthContext } from '../contexts/Auth';
import { OrganizationContext } from '../contexts/Organization';
import User_layout from '../layouts/User';
import { setOrganization } from '../repositories/Organization';
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

  function submitChange(e: FormEvent) {
    e.preventDefault();
    setOrganization(
      currentUserContext.currentUserData.joinedOrgId,
      { name: organizationName },
      { merge: true }
    );
  }

  return (
    <form
      className="max-w-lg md:flex items-end"
      onSubmit={(e: FormEvent) => submitChange(e)}
    >
      <TextInput
        editable={nameEdit}
        edit={() => setNameEdit(true)}
        // undefinedが渡されるのを防止
        value={organizationName || ''}
        onInput={setOrganizationName}
        label="組織名"
        max={20}
        min={1}
      />
      {nameEdit && (
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
              }}
              color="gray"
            >
              キャンセル
            </ActionButton>
          </div>
        </div>
      )}
    </form>
  );
}

export default function organization_setting() {
  return (
    <User_layout>
      <section className="m-10">
        <h2 className="text-2xl font-medium">設定</h2>
        <div className="md:px-3 px-0.5 py-2">
          <Name_setting />
        </div>
      </section>
    </User_layout>
  );
}
