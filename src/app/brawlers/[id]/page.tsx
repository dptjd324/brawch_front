import { notFound } from "next/navigation";
import BrawlerDetail from "./BrawlerDetail";

interface BrawlerDetailPageProps {
  params: { id: string };
}

// 동적 라우팅을 사용하여 브롤러의 상세 정보를 표시
export async function generateStaticParams() {
  // 서버에서 브롤러 목록 가져옴
  const res = await fetch("http://localhost:8081/api/brawlers");
  const brawlers = await res.json();

  return brawlers.map((brawler: { brawlerId: number }) => ({
    id: brawler.brawlerId.toString(),
  }));
}

export default async function BrawlerDetailPage({ params }: BrawlerDetailPageProps) {
  const res = await fetch(`http://localhost:8081/api/brawlers/${params.id}`, {
  next: { revalidate: 60 }, // 또는 3600 (1시간) 등
});
  if (!res.ok) return notFound();

  const brawler = await res.json();

  return <BrawlerDetail brawler={brawler} />;
}