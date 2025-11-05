'use client';

import { useEffect, useState } from 'react';
import PlayerRankingTable from '@/components/Player/PlayerRankingTable';

interface PlayerRanking {
  rank: number;
  name: string;
  clubName: string;
  trophies: number;
  iconId: number;
}

type CountryFilter = 'KR' | 'GLOBAL';

export default function RankingPage() {
  const [players, setPlayers] = useState<PlayerRanking[]>([]);
  const [country, setCountry] = useState<CountryFilter>('KR');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ranking/players?country=${country}`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error('Failed to fetch ranking data', err));
  }, [country]);

 return (
    <main className="p-6 min-h-screen bg-[#1A1A2E] text-white">
      <h1 className="text-3xl font-bold mb-6">플레이어 랭킹</h1>

      {/* 국가 필터 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setCountry('KR')}
          className={`px-4 py-2 rounded ${
            country === 'KR' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          한국
        </button>
        <button
          onClick={() => setCountry('GLOBAL')}
          className={`px-4 py-2 rounded ${
            country === 'GLOBAL' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          글로벌
        </button>
      </div>

      <PlayerRankingTable players={players} />
    </main>
  );
}