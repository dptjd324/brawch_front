import { notFound } from "next/navigation";
import PlayerDetail from "@/components/Player/PlayerDetail";

interface Props {
  params: Promise<{ tag: string }>;
}

export default async function PlayerPage({ params }: Props) {
  const { tag } = await params; 
  const decodedTag = decodeURIComponent(tag);
  const encodedTag = encodeURIComponent(decodedTag);

  try {
    // 플레이어 정보 요청
    const playerRes = await fetch(`http://localhost:8081/api/players/detail?tag=${encodedTag}`, {
      cache: "no-store",
    });
    if (!playerRes.ok) return notFound();
    const playerData = await playerRes.json();

    // 진행도 요청
    const progressRes = await fetch(`http://localhost:8081/api/players/${encodedTag}/progress`, {
      cache: "no-store",
    });
    const progressData = progressRes.ok ? await progressRes.json() : null;

    //  컴포넌트로 전달
    return (
      <PlayerDetail
        player={{
          ...playerData.player,
          battleLog: playerData.battleLogs,
          progress: progressData,
        }}
      />
    );
  } catch (err) {
    console.error("PlayerPage fetch error:", err);
    return notFound();
  }
}
