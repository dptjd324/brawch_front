'use client';

import React, { useEffect, useState } from 'react';
import { getBrawlerImageUrlById } from '@/utils/brawlerData';
import Link from 'next/link';

const TIER_COLORS: Record<string, string> = {
  'S+': 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-700 text-white shadow-lg border-2 border-cyan-300',
  'S': 'bg-cyan-700 text-white',
  'A+': 'bg-green-400 text-white',
  'A': 'bg-green-400 text-white',
  'B+': 'bg-yellow-300 text-black',
  'B': 'bg-yellow-300 text-black',
  'C+': 'bg-gray-300 text-black',
  'C': 'bg-gray-300 text-black',
  'D+': 'bg-orange-700 text-white',
  'D': 'bg-orange-700 text-white',
  'F': 'bg-gray-600 text-white',
};
export interface SynergyDto {
  brawlerId: number;
  brawlerName: string;
  imageUrl: string;
  winRate: number;
}
export interface MapBrawlerTier {
  brawlerId: number;
  brawlerName: string;
  winRate: number;
  picks: number;
  pickRate: number;
  score: number;
  tier: string;
  synergyTop3?: SynergyDto[];
}

export default function MapTierListClient({ modeKey, id }: { modeKey: string; id: string }) {
  const [tiers, setTiers] = useState<MapBrawlerTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [patchVersions, setPatchVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/maps/patchVersions`);
        if (res.ok) {
          const json = await res.json();
          setPatchVersions(json);

          if (json.length > 0) setSelectedVersion(json[0]);
        }
      } catch (err) {
        console.error('Failed to fetch patch versions:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedVersion) return;
    (async () => {
      try {
        setLoading(true);
        const url = `http://localhost:8081/api/maps/${id}/tiers?mode=${modeKey}&patchVersion=${selectedVersion}&battleType=ranked`;
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
  }, [modeKey, id, selectedVersion]);

  if (loading) {
    return <div className="text-center text-gray-600 py-4">티어리스트 로딩 중...</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-end mb-3">
        <label className="text-gray-300 mr-2">패치 버전:</label>
        <select
          className="bg-gray-700 text-white px-3 py-1 rounded"
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
        >
          {patchVersions.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <table className="min-w-full text-white text-lg">
          <thead className="bg-yellow-500 text-black text-lg sticky top-0 z-10">
            <tr>
              <th className="p-3 whitespace-nowrap">순위</th>
              <th className="p-3 whitespace-nowrap">티어</th>
              <th className="p-3 whitespace-nowrap">브롤러</th>
              <th className="p-3 whitespace-nowrap">승률</th>
              <th className="p-3 whitespace-nowrap">픽률</th>
              <th className="p-3 whitespace-nowrap">brawch score</th>
              <th className="p-3 whitespace-nowrap">표본수</th>
              <th className="p-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                같이하면 좋은 브롤러
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => (
              <tr key={`${t.brawlerId}-${i}`} className="text-center border-b border-gray-700 h-16">
                <td className="p-3 font-bold text-yellow-400">{i + 1}</td>
                <td className="p-3">
                  <span className={`px-5 py-2 rounded-lg font-bold text-lg ${TIER_COLORS[t.tier] ?? 'bg-gray-500 text-white'}`}>
                    {t.tier}
                  </span>
                </td>
                <td className="p-3 flex items-center gap-3 justify-center min-w-[150px]">
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
                    <span className="font-bold text-lg cursor-pointer hover:underline break-keep">
                      {t.brawlerName}
                    </span>
                  </Link>
                </td>
                <td className="p-3">{t.winRate.toFixed(1)}%</td>
                <td className="p-3">{t.pickRate.toFixed(1)}%</td>
                <td className="p-3">{t.score.toFixed(1)}점</td>
                <td className="p-3">{t.picks.toLocaleString()}</td>
                <td className="p-3">
                  {t.synergyTop3 && t.synergyTop3.length > 0 ? (
                    <div className="flex gap-3 justify-center items-center">
                      {t.synergyTop3.map((s, j) => (
                        <div key={j} className="flex flex-col items-center text-center">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-400 shadow-md">
                            <img
                              src={s.imageUrl || getBrawlerImageUrlById(s.brawlerId)}
                              alt={s.brawlerName}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.src = '/fallback.png';
                              }}
                            />
                          </div>
                          <span className="text-xs mt-1 text-gray-300">{s.brawlerName}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
