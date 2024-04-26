import TitleBar from "@/components/TitleBar";
import UsersList from "@/components/admin/users/list/UsersList";

export default function UsersPage() {
  return (
    <>
      <TitleBar title="Користувачі" />
      <UsersList />
    </>
  );
}
