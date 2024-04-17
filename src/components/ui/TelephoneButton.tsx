import { ActionIcon, Button, Popover, PopoverDropdown, PopoverTarget, ScrollArea, Stack } from "@mantine/core";
import { map } from "lodash";
import { Phone } from "lucide-react";
import { memo } from "react";

interface IProps {
  tel?: string[];
}

function TelephoneButton({ tel }: IProps) {
  if (!tel || tel.length === 0) return null;
  if (tel.length === 1)
    return (
      <ActionIcon component="a" href={`tel:${tel[0]}`} variant="light" size="lg">
        <Phone size={20} />
      </ActionIcon>
    );

  return (
    <Popover width={200} position="bottom-end" withArrow shadow="md">
      <PopoverTarget>
        <ActionIcon variant="light" size="lg">
          <Phone size={20} />
        </ActionIcon>
      </PopoverTarget>
      <PopoverDropdown p="xs">
        <ScrollArea h="250px" type="auto">
          <Stack gap="xs">
            {map(tel, (e) => (
              <Button component="a" href={`tel:${e}`} variant="subtle" key={e}>
                {e}
              </Button>
            ))}
          </Stack>
        </ScrollArea>
      </PopoverDropdown>
    </Popover>
  );
}

export default memo(TelephoneButton);
