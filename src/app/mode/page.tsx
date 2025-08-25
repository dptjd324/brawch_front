'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

interface ModeEvent {
  startTime: string;
  endTime: string;
  slotId: number;
  event: { id: number; mode: string; map: string };
}

type ApiMapRow = { mode: string; id: number | string; name: string };
type MapItem = { id: number; name: string };
type ModeMapDict = Record<string, MapItem[]>;      // key(폴더키) -> 맵 리스트
type ModeLabelDict = Record<string, string>;       // key(폴더키) -> 표시명(라벨)


const toKey = (raw: string) => (raw || '').toLowerCase().replace(/[^a-z0-9]/g, '');


const withFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget as HTMLImageElement & { dataset: Record<string, string> };
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  img.src =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112">
         <rect width="100%" height="100%" fill="#e5e7eb"/>
         <g fill="#9ca3af" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
           <text x="56" y="56" font-size="12">No Image</text>
         </g>
       </svg>`
    );
};

export default function ModesPage() {
  const [ongoingModes, setOngoingModes] = useState<ModeEvent[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null); // 폴더키로 관리
  const [modeMaps, setModeMaps] = useState<ModeMapDict>({});
  const [modeLabels, setModeLabels] = useState<ModeLabelDict>({});
  const [loadingModes, setLoadingModes] = useState(true);
  const [loadingMaps, setLoadingMaps] = useState(true);

  // 진행 중 모드 로테이션
  useEffect(() => {
    (async () => {
      try {
        setLoadingModes(true);
        const res = await fetch('http://localhost:8081/api/modes/rotation');
        const data: ModeEvent[] = await res.json();
        setOngoingModes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error fetching modes/rotation:', e);
      } finally {
        setLoadingModes(false);
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      try {
        setLoadingMaps(true);

        let res = await fetch('http://localhost:8081/api/maps/all', { cache: 'no-store' });
        if (!res.ok) res = await fetch('http://localhost:8081/api/maps', { cache: 'no-store' });

        const raw: ApiMapRow[] = await res.json();
        const byKey: ModeMapDict = {};
        const labels: ModeLabelDict = {};

        (raw || []).forEach((m) => {
          const key = toKey(m.mode);
          const idNum =
            typeof m.id === 'string' ? parseInt(m.id, 10) : Number.isFinite(m.id) ? (m.id as number) : NaN;
          if (Number.isNaN(idNum)) return;

          if (!byKey[key]) byKey[key] = [];
          if (!labels[key]) labels[key] = m.mode; // 첫 항목의 표시명을 라벨로 사용

          byKey[key].push({ id: idNum, name: m.name });
        });


        Object.values(byKey).forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name)));

        setModeMaps(byKey);
        setModeLabels(labels);

        // 최초 선택 없으면 첫 키 자동 선택
        if (!selectedKey) {
          const first = Object.keys(byKey)[0];
          if (first) setSelectedKey(first);
        }
      } catch (e) {
        console.error('Error fetching maps:', e);
      } finally {
        setLoadingMaps(false);
      }
    })();

  }, []);


  const modeKeys = useMemo(() => Object.keys(modeMaps), [modeMaps]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans">
      {/* 진행 중인 모드 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold bg-gray-300 inline-block px-4 py-2 rounded mb-4">진행 중인 모드</h2>

        <div className="bg-orange-200 p-6 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingModes ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : ongoingModes.length > 0 ? (
            ongoingModes.map((m, i) => {
              const k = toKey(m.event.mode);
              return (
                <button
                  key={i}
                  className="flex items-center bg-blue-400 hover:bg-blue-500 transition p-4 rounded-lg shadow-md text-left"
                  onClick={() => setSelectedKey(k)} // key로 선택
                >
                  <div className="w-14 h-14 bg-green-300 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={`/mode/${k}_icon.png`}
                      alt={`${m.event.mode} 아이콘`}
                      className="w-12 h-12 object-contain"
                      onError={withFallback}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">모드: {m.event.mode}</p>
                    <p className="text-white">맵: {m.event.map}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-gray-500">진행 중인 모드가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 모드별 맵 */}
      <div>
        <h2 className="text-lg font-bold bg-gray-300 inline-block px-4 py-2 rounded mb-4">모드별 맵</h2>


        <div className="bg-orange-200 p-4 rounded-lg flex flex-wrap gap-4 mb-6">
          {modeKeys.length === 0 && <span className="text-gray-600">모드 로딩 중...</span>}
          {modeKeys.map((k) => {
            const isSelected = selectedKey === k;
            const label = modeLabels[k] ?? k; // 라벨 없으면 키 표시
            return (
              <button
                key={k}
                className={`w-24 h-24 bg-green-300 rounded-xl flex items-center justify-center overflow-hidden border-2 transition ${isSelected ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                title={label}
                onClick={() => setSelectedKey(k)}
              >
                <img
                  src={`/mode/${k}_icon.png`}
                  alt={`${label} 아이콘`}
                  className="w-16 h-16 object-contain"
                  onError={withFallback}
                />
              </button>
            );
          })}
        </div>

        {/* 선택된 모드의 맵 리스트 */}
        {selectedKey ? (
          <div className="bg-orange-200 p-6 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingMaps ? (
              <div className="col-span-3 text-center text-gray-600 py-8">맵 로딩 중...</div>
            ) : modeMaps[selectedKey]?.length ? (
              modeMaps[selectedKey].map((map) => (
                <Link
                  key={`${selectedKey}-${map.id}`}
                  href={`/mode/${selectedKey}/${map.id}`}
                  className="bg-blue-400 p-6 rounded-lg shadow-md text-white flex flex-col items-center"
                >
                  <img
                    src={`/map/${selectedKey}/${map.id}.png`}
                    alt={map.name}
                    className="w-40 h-40 object-contain mb-4 rounded bg-black/10"
                    onError={withFallback}
                  />
                  <div className="font-semibold text-center text-lg">{map.name}</div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-600 py-8">맵 정보가 없습니다.</div>
            )}
          </div>
        ) : (
          <div className="bg-orange-200 p-6 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-blue-400 p-4 rounded-lg shadow-md text-white flex items-center justify-center"
              >
                맵:
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
