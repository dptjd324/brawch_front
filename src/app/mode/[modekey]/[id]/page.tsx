// app/mode/[modeKey]/[id]/page.tsx
import MapDetailClient from './MapDetailClient';

export default function Page({
  params,
}: {
  params: { modeKey: string; id: string };
}) {
  // 서버에서 params가 항상 안정적으로 들어옵니다.
  return <MapDetailClient modeKey={params.modeKey} id={params.id} />;
}