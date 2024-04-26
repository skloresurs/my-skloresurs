import TitleBar from "@/components/TitleBar";
import RouteClient from "@/components/routes/route/RouteClient";

export default function RoutePage({ params }: { params: { id: string } }) {
  return (
    <>
      <TitleBar title={`Маршрут #${params.id}`} enableBackButton={true} />
      <RouteClient id={params.id} />
    </>
  );
}
