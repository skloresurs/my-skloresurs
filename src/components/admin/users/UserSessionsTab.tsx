import { Center } from "@mantine/core";
import { map } from "lodash";
import { memo } from "react";

import InfoAlert from "@/components/ui/InfoAlert";
import SessionItem from "@/components/ui/SessionItem";
import type { IUserRequest } from "@/types/User";

function UserSessionsTab({ user }: { user?: IUserRequest }) {
  if (!user?.sessions)
    return (
      <Center>
        <InfoAlert maw={576} w={576} title="Немає сесій" description="Не знадено жодної сесії" />
      </Center>
    );

  return (
    <div className="flex max-w-xl flex-col gap-3">
      {map(user?.sessions, (e) => (
        <SessionItem key={e.id} session={e} />
      ))}
    </div>
  );
}

export default memo(UserSessionsTab);
