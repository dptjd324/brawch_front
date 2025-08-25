'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

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

  // 여러 확장자 자동 재시도
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center gap-3">


          <div className="flex items-center gap-2 ml-auto opacity-80">
            <img src={iconSrc} alt="mode icon" className="w-6 h-6 object-contain" onError={iconFallback} />
            <span className="text-sm text-gray-600">{modeKey}</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">불러오는 중…</div>
        ) : !mapItem ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">해당 맵을 찾을 수 없습니다.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="w-full">
                <img
                  src={imageSrc}
                  alt={mapItem.name}
                  className="w-full max-w-2xl aspect-video object-contain rounded-xl bg-gray-200"
                  onError={bigFallback}
                />
                <div className="mt-2 text-xs text-gray-500 select-all">
                  trying: <code>{imageSrc}</code>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold">{mapItem.name}</h1>
                <div className="text-gray-600">
                  <div className="font-semibold">Mode</div>
                  <div>{mapItem.mode}</div>
                </div>
                <div className="text-gray-600">
                  <div className="font-semibold">Map ID</div>
                  <div>{String(mapItem.id)}</div>
                </div>
                <div className="pt-2 flex gap-2">

                </div>
              </div> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
