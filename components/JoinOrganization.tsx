import ActionCard from '../components/ActionCard';
import ActionButton from '../components/ActionButton';
import { JoinOrganizationFromInvitation } from '../repositories/Invite';
import TextInput from '../components/TextInput';
import { setOrganizationUser } from '../repositories/Organization';
import WarningCard from '../components/WarningCard';
import { AuthContext } from '../contexts/Auth';
import React, { FormEvent, useContext, useState } from 'react';

export default function JoinOrganization() {
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
        {!!error && <WarningCard error={error} />}
      </form>
    </ActionCard>
  );
}
