'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import MapTierListClient from './MapTierListClient';

type MapRow = { mode: string; id: string | number; name: string };

export default function MapDetailClient({
  modeKey,
  id,
}: {
  modeKey: string;
  id: string;
}) {
  const [mapItem, setMapItem] = useState<MapRow | null>(null);
  const [loading, setLoading] = useState(true);


  const exts = useMemo(() => ['png', 'webp', 'jpg', 'jpeg', 'PNG'], []);
  const [idx, setIdx] = useState(0);
  const imageSrc = useMemo(() => `/map/${modeKey}/${id}.${exts[idx]}`, [modeKey, id, exts, idx]);
  const iconSrc = useMemo(() => `/mode/${modeKey}_icon.png`, [modeKey]);

  const tryNextExt = () => setIdx((p) => (p + 1 < exts.length ? p + 1 : p));

  const bigFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement & { dataset: Record<string, string> };
    if (idx + 1 < exts.length) {
      tryNextExt();
      return;
    }
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = '1';
      img.src =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
             <rect width="100%" height="100%" fill="#e5e7eb"/>
             <g fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
               <text x="320" y="180" font-size="18">No Image</text>
             </g>
           </svg>`
        );
    }
  };

  const iconFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget as HTMLImageElement & { dataset: Record<string, string> };
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>`);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let res = await fetch(`http://localhost:8081/api/maps?modeKey=${modeKey}`, { cache: 'no-store' });
        if (!res.ok) res = await fetch('http://localhost:8081/api/maps', { cache: 'no-store' });
        const list: MapRow[] = await res.json();
        const found = list?.find((m) => String(m.id) === String(id)) ?? null;
        setMapItem(found);
      } catch (e) {
        console.error('Failed to load map detail:', e);
        setMapItem(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [modeKey, id]);

   return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2233] via-[#232b36] to-[#182133] p-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-16">
          {/* 상단 맵/모드 박스 */}
          <div className="flex flex-row gap-16 justify-center items-start">
            {/* 맵 박스 */}
            <div className="bg-[#232b36] rounded-3xl shadow-2xl p-0 w-[540px] flex flex-col items-center border border-[#2dd4bf]/30">
              {/* 모드 정보 + 아이콘 */}
              <div className="flex items-center w-full px-12 pt-10 pb-5 gap-5">
                <div className="bg-[#2dd4bf] rounded-2xl p-4 flex items-center justify-center shadow">
                  <img
                    src={iconSrc}
                    alt={`${modeKey} 아이콘`}
                    className="w-14 h-14"
                    onError={iconFallback}
                  />
                </div>
                <span className="text-3xl font-bold text-[#2dd4bf] capitalize tracking-wide drop-shadow">
                  {modeKey}
                </span>
              </div>
              {/* 맵 이름 */}
              <div className="bg-gray-700 rounded-t-3xl w-full px-12 py-6 text-2xl font-bold text-[#2dd4bf] flex items-center shadow">
                <span className="ml-5 text-white">{mapItem?.name ?? ''}</span>
              </div>
              {/* 맵 이미지 */}
              <div className="bg-[#4fd1ff] w-full flex-1 flex items-center justify-center rounded-b-3xl p-8 min-h-[600px]">
                <img
                  src={imageSrc}
                  alt={mapItem?.name}
                  className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/30"
                  onError={bigFallback}
                />
              </div>
            </div>
            {/* 티어 테이블 */}
            <div className="bg-[#232b36] rounded-3xl shadow-2xl flex-1 p-0 border border-[#2dd4bf]/20 min-w-[700px]">
              <MapTierListClient modeKey={modeKey} id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}