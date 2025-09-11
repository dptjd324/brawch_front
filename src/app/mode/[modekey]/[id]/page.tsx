import MapDetailClient from './MapDetailClient';

export default function Page({
  params,
}: {
  params: { modeKey?: string; modekey?: string; id?: string };
}) {
  const modeKey = params.modeKey ?? params.modekey ?? '';
  const id = params.id ?? '';

  return <MapDetailClient modeKey={modeKey} id={id} />;
}