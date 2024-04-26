import { Stack } from "@mantine/core";
import { Save } from "lucide-react";
import { memo } from "react";
import { z } from "zod";

import ProfileCard from "@/components/ui/ProfileCard";
import type { IUserRequest } from "@/types/User";

function UserInfoTab({ user }: { user?: IUserRequest }) {
  if (!user) {
    return null;
  }
  return (
    <Stack maw="576">
      <ProfileCard
        title="ID"
        value={user.id}
        description="ID користувача"
        footerText="ID не може бути змінено"
        readOnly={true}
      />
      <ProfileCard
        title="E-mail"
        value={user.email}
        description="E-mail користувача"
        footerText="E-mail не може бути змінено"
        readOnly={true}
      />
      <ProfileCard
        title="Повне ім'я"
        value={user.fullname ?? ""}
        description="Повне ім'я користувача"
        footerText="Максимум 100 символів"
        maximumCharacters={100}
        button={{
          icon: <Save size={20} />,
          label: "Зберегти",
        }}
        submitSettings={{
          validators: [
            { validator: z.string().min(1), errorMessage: "Мінімум 1 символ" },
            {
              validator: z.string().max(100),
              errorMessage: "Максимум 100 символів",
            },
          ],
          apiUrl: `/api/user/${user.id}/fullname`,
          key: "fullname",
          userId: user.id,
        }}
      />
    </Stack>
  );
}

export default memo(UserInfoTab);
