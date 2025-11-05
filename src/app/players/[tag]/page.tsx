import { notFound } from "next/navigation";
import PlayerDetail from "@/components/Player/PlayerDetail";

interface Props {
  params: { tag: string };
}

export default async function PlayerPage({ params }: { params: { tag: string } }) {
  const tagParam = params.tag;
  const tag = decodeURIComponent(tagParam);
  const encodedTag = encodeURIComponent(tag);
  try {
    const res = await fetch(`http://localhost:8081/api/players/detail?tag=${encodedTag}`, {
      cache: "no-store",
    });

    if (!res.ok) return notFound();

    const data = await res.json();

    return <PlayerDetail player={{ ...data.player, battleLog: data.battleLogs }} />;
  } catch (err) {
    console.error("PlayerPage fetch error:", err);
    return notFound();
  }
}

