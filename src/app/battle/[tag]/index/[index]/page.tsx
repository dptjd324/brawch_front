

import BattleDetail from "@/components/Player/BattleDetail";
import { notFound } from "next/navigation";

//동적라우팅처리
export const dynamic = "force-dynamic";

async function getBattleDetail(tag: string, index: number) {
  const res = await fetch(
    `http://localhost:8081/api/players/${encodeURIComponent(tag)}/battle/index/${index}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error(`상태코드 ${res.status} - 전투 정보를 받아오지 못함`);
    throw new Error("전투 정보를 불러올 수 없습니다.");
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error(" 응답이 JSON이 아닙니다:", await res.text());
    throw new Error("잘못된 응답 형식");
  }

  return res.json();
}

export default async function BattlePage({
  params,
}: {
  params: { tag: string; index: string };
}) {
  try {
    const tag = decodeURIComponent(params.tag);
    const index = parseInt(params.index, 10);
    const battle = await getBattleDetail(tag, index);
    return <BattleDetail battle={battle} />;
  } catch (e) {
    console.error("전투 정보 로딩 실패:", e);
    return (
      <div className="text-red-500 p-4">
        전투 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }
}
