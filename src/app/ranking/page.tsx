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
    fetch(`http://localhost:8081/api/ranking/players?country=${country}`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error('Failed to fetch ranking data', err));
  }, [country]);

  return (
    <main className="p-6 min-h-screen bg-[#1A1A2E] text-white flex flex-row gap-4">
      {/* 왼쪽 광고 배너 */}
      <div className="w-1/6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">광고 배너</span>
      </div>

      {/* 중앙 콘텐츠 */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">플레이어 랭킹</h1>

        {/* 국가 필터 버튼 */}
        <div className="flex justify-center gap-2 mb-4">
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
      </div>

      {/* 오른쪽 광고 배너 */}
      <div className="w-1/6 bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">광고 배너</span>
      </div>
    </main>
  );
}