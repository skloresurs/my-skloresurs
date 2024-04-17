import type { MantineColor } from "@mantine/core";

import type { Permission } from "@/types/User";

const permissions: Map<Permission, string> = new Map();
permissions.set("SuperAdmin", "Супер-адмін");
permissions.set("Admin", "Адміністратор");
permissions.set("Manager", "Менеджер");
permissions.set("Driver", "Водій");
permissions.set("Beta", "Бета");

const permissionsColors: Map<Permission, MantineColor> = new Map();
permissionsColors.set("SuperAdmin", "violet");
permissionsColors.set("Admin", "yellow");
permissionsColors.set("Manager", "green");
permissionsColors.set("Driver", "red");
permissionsColors.set("Beta", "grape");

export { permissions, permissionsColors };
