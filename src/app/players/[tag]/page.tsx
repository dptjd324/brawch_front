
import { notFound } from "next/navigation";
import PlayerDetail from "@/components/Player/PlayerDetail";

export default async function PlayerPage({ params }: { params: { tag: string } }) {
  const encodedTag = encodeURIComponent(params.tag);

  try {
    const [playerRes, battleLogRes] = await Promise.all([
      fetch(`http://localhost:8081/api/players/${encodedTag}`, { cache: "no-store" }),
      fetch(`http://localhost:8081/api/players/${encodedTag}/battlelog`, { cache: "no-store" }),
    ]);

    if (!playerRes.ok || !battleLogRes.ok) return notFound();

    const player = await playerRes.json();
    const battleLog = await battleLogRes.json();

    return <PlayerDetail player={{ ...player, battleLog: battleLog?.items || [] }} />;
  } catch (err) {
    console.error("PlayerPage fetch error:", err);
    return notFound();
  }
}
