import BattleDetail from "@/components/Player/BattleDetail";

async function getBattleDetail(tag: string, index: number) {
  const res = await fetch(`http://localhost:8081/api/players/${encodeURIComponent(tag)}/battle/index/${index}`);
  if (!res.ok) throw new Error("전투 정보를 불러올 수 없습니다.");
  return res.json();
}

export default async function BattlePage({ params }: { params: { tag: string; index: string } }) {
  const battle = await getBattleDetail(params.tag, parseInt(params.index));
  return <BattleDetail battle={battle} />;
}