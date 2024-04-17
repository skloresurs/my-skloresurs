import TitleBar from "@/components/TitleBar";
import NewOrder from "@/components/orders/NewOrder";

export default function NewOrderPage() {
  return (
    <>
      <TitleBar title="Нове замовлення" />
      <NewOrder />
    </>
  );
}
