    'use client';

import React, { useEffect, useState } from 'react';
import { getBrawlerImageUrlById } from '@/utils/brawlerData'; 
import Link from 'next/link';

const TIER_COLORS: Record<string, string> = {
  'S+': 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-700 text-white shadow-lg border-2 border-cyan-300', // 짙은 하늘색
  'S': 'bg-cyan-700 text-white',
  'A+': 'bg-green-400 text-white', // 밝은 녹색
  'A': 'bg-green-400 text-white',
  'B+': 'bg-yellow-300 text-black', // 노란색
  'B': 'bg-yellow-300 text-black',
  'C+': 'bg-gray-300 text-black',   // 은색
  'C': 'bg-gray-300 text-black',
  'D+': 'bg-orange-700 text-white', // 동색
  'D': 'bg-orange-700 text-white',
};
export interface MapBrawlerTier {
  brawlerId: number;
  brawlerName: string;
  winRate: number;
  pickRate: number;
  tierScore: number;
  tier: string;
}

export default function MapTierListClient({ modeKey, id }: { modeKey: string; id: string }) {
  const [tiers, setTiers] = useState<MapBrawlerTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const url = `http://localhost:8081/api/maps/${id}/tiers?mode=${modeKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch tiers');
        const json = await res.json();
        setTiers(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
        setTiers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [modeKey, id]);

  if (loading) {
      return <div className="text-center text-gray-600 py-4">티어리스트 로딩 중...</div>;
    }
    
  return (
    <div className="mt-8">
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-white text-lg">
          <thead className="bg-yellow-500 text-black text-xl">
            <tr>
              <th className="p-3">순위</th>
              <th className="p-3">티어</th>
              <th className="p-3">브롤러</th>
              <th className="p-3">승률</th>
              <th className="p-3">픽률</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => (
              <tr key={t.brawlerId} className="text-center border-b border-gray-700 h-16">
                <td className="p-3 font-bold text-yellow-400">{i + 1}</td>
                <td className="p-3">
                  <span className={`px-5 py-2 rounded-lg font-bold text-lg ${TIER_COLORS[t.tier] ?? 'bg-gray-500 text-white'}`}>
                    {t.tier}
                  </span>
                </td>
                <td className="p-3 flex items-center gap-3 justify-center">
                  <Link href={`/brawlers/${t.brawlerId}`}>
                    <img
                      src={getBrawlerImageUrlById(t.brawlerId)}
                      alt={t.brawlerName}
                      className="w-10 h-10 object-contain rounded cursor-pointer hover:scale-110 transition"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.src = '/fallback.png';
                      }}
                    />
                  </Link>
                  <Link href={`/brawlers/${t.brawlerId}`}>
                    <span className="font-bold text-lg cursor-pointer hover:underline">{t.brawlerName}</span>
                  </Link>
                </td>
                <td className="p-3">{(t.winRate).toFixed(1)}%</td>
                <td className="p-3">{(t.pickRate).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
