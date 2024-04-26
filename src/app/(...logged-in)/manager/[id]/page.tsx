import TitleBar from "@/components/TitleBar";
import OrderClient from "@/components/manager/order/OrderClient";

export default async function ManagerOrderPage({ params }: { params: { id: string } }) {
  return (
    <>
      <TitleBar title={`Замовлення #${params.id}`} enableBackButton={true} />
      <OrderClient id={params.id} />
    </>
  );
}
