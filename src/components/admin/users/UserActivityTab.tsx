import "dayjs/locale/uk";

import { Center } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { some } from "lodash";
import { twMerge } from "tailwind-merge";

import type { IUserRequest } from "@/types/User";

interface IProps {
  user?: IUserRequest;
}

export default function UserActivityTab({ user }: IProps) {
  return (
    <Center>
      <DatePicker
        hideOutsideDates
        value={null}
        minDate={dayjs("2024-02-09").toDate()}
        locale="uk"
        renderDay={(date) => {
          const dateObject = dayjs(date);
          const day = dateObject.date();
          return (
            <div
              className={twMerge(
                "aspect-square size-7 rounded-full p-1 text-center",
                some(user?.active_days, (d) => d === dateObject.format("YYYY-MM-DD"))
                  ? "bg-[var(--mantine-color-green-9)]"
                  : "",
              )}
            >
              <div>{day}</div>
            </div>
          );
        }}
      />
    </Center>
  );
}
