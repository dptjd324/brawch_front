'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PlayerRanking {
  rank: number;
  name: string;
  clubName: string;
  trophies: number;
  iconId: number;
  tag?: string; // tag를 optional로 설정
}

export default function PlayerRankingTable({ players }: { players: PlayerRanking[] }) {
  if (!players || players.length === 0)
    return <p className="text-gray-400 text-center mt-10">랭킹 데이터가 없습니다.</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
      <table className="min-w-full text-center text-white">
        <thead className="bg-[#16213E] text-gray-300 uppercase text-sm">
          <tr>
            <th className="py-3 px-4">순위</th>
            <th className="py-3 px-4">플레이어</th>
            <th className="py-3 px-4">클럽</th>
            <th className="py-3 px-4">트로피</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr
              key={p.rank}
              className="border-b border-gray-700 hover:bg-[#1E2A47] transition"
            >
              <td className="py-3 px-4 font-semibold">{p.rank}</td>
              <td className="py-3 px-4 font-medium">
                {/* 플레이어 이름에 링크 추가 */}
                <Link
                  href={`/players/${p.tag?.replace('#', '') || ''}`} // tag가 없을 경우 빈 문자열로 처리
                  className="text-teal-400 hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-300">{p.clubName || '-'}</td>
              <td className="py-3 px-4 font-bold text-yellow-400">
                🏆 {p.trophies.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}