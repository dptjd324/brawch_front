'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

const MODE_BG_COLORS: Record<string, string> = {
  soloshowdown: 'bg-lime-400',
  duoshowdown: 'bg-lime-400',
  trioshowdown: 'bg-lime-400',
  gemgrab: 'bg-purple-400',
  hotzone: 'bg-red-400',
  bounty: 'bg-blue-400',
  heist: 'bg-yellow-400',
  brawlball: 'bg-green-400',
  knockout: 'bg-pink-400',
};

interface ModeEvent {
  startTime: string;
  endTime: string;
  slotId: number;
  event: { id: number; mode: string; map: string };
}

type ApiMapRow = { mode: string; id: number | string; name: string };
type MapItem = { id: number; name: string };
type ModeMapDict = Record<string, MapItem[]>;
type ModeLabelDict = Record<string, string>;


const toKey = (raw: string) => (raw || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const normalize = (s: string) => (s || '').toLowerCase().replace(/\s+/g, '').trim();


const findMapId = (k: string, mapName: string, dict: ModeMapDict) => {
  const list = dict[k] || [];
  const target = normalize(mapName);
  const hit = list.find(m => normalize(m.name) === target);
  return hit?.id;
};

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
  //진행중인 모드 슬라이드 
  const [sliceStart, setSliceStart] = useState(0);
  const sliceCount = 4; // 한 번에 보여줄 카드 개수

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
          if (!labels[key]) labels[key] = m.mode;

          byKey[key].push({ id: idNum, name: m.name });
        });


        Object.values(byKey).forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name)));

        setModeMaps(byKey);
        setModeLabels(labels);


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
    <div className="bg-[#182133] min-h-screen p-6 font-sans">
      {/* 진행 중인 모드 */}
      <div className="mb-10 flex flex-col  items-center">
        <h2 className="text-2xl font-bold bg-[#2dd4bf] text-white px-6 py-3 rounded-2xl mb-8 w-fit shadow-lg">
          LIVE 모드
        </h2>
        <div className="bg-[#263248] p-10 rounded-3xl flex flex-col items-center shadow-2xl w-full max-w-[1400px] mx-auto">
          {loadingModes ? (
            <p className="text-gray-500">로딩 중...</p>
          ) : ongoingModes.length > 0 ? (
            <div className="relative w-full flex items-center justify-center min-h-[520px]">
              <button
                onClick={() => setSliceStart(Math.max(sliceStart - 1, 0))}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 bg-gray-700 text-white p-5 rounded-full z-20 shadow-lg hover:bg-gray-800 transition"
                disabled={sliceStart === 0}
                style={{ boxShadow: '0 4px 16px #0003' }}
              >
                ◀
              </button>
              <div className="flex flex-row gap-10 w-full justify-center px-10">
                {ongoingModes
                  .slice(sliceStart, sliceStart + sliceCount)
                  .map((m, i) => {
                    const k = toKey(m.event.mode);
                    const mapId = findMapId(k, m.event.map, modeMaps);
                    const Wrapper: any = mapId ? Link : 'button';
                    const wrapperProps = mapId
                      ? { href: `/mode/${k}/${mapId}`, className: 'block' }
                      : { onClick: () => setSelectedKey(k) };

                    const modeBg = MODE_BG_COLORS[k] || 'bg-gray-300';

                    return (
                      <Wrapper key={i} {...wrapperProps}>
                        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-black/30 flex flex-col w-[320px] h-[520px] bg-white/10 mx-auto">

                          {/* 모드 영역 */}
                          <div className={`${modeBg} flex items-center gap-4 px-6 py-4`}>
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={`/mode/${k}_icon.png`}
                                alt={`${m.event.mode} 아이콘`}
                                className="w-12 h-12 object-contain"
                                onError={withFallback}
                              />
                            </div>
                            <div className="flex flex-col justify-center items-start">
                              <span className="text-white text-xl font-bold">{m.event.mode}</span>
                              <span className="text-white text-base">{m.event.map}</span>
                            </div>
                          </div>
                          {/* 맵 이미지 영역 */}
                          <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-b-2xl h-[200px] overflow-hidden">
                            {mapId ? (
                              <img
                                src={`/map/${k}/${mapId}.png`}
                                alt={m.event.map}
                                className="object-contain max-h-full max-w-full"
                                onError={withFallback}
                              />
                            ) : (
                              <img
                                src="/placeholder.png"
                                alt="no image"
                                className="w-20 h-5 object-contain opacity-70"
                                onError={withFallback}
                              />
                            )}
                          </div>

                        </div>
                      </Wrapper>
                    );
                  })}
              </div>
              <button
                onClick={() => setSliceStart(Math.min(sliceStart + 1, Math.max(ongoingModes.length - sliceCount, 0)))}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 bg-gray-700 text-white p-5 rounded-full z-20 shadow-lg hover:bg-gray-800 transition"
                disabled={sliceStart + sliceCount >= ongoingModes.length}
                style={{ boxShadow: '0 4px 16px #0003' }}
              >
                ▶
              </button>
            </div>
          ) : (
            <p className="text-gray-500">진행 중인 모드가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 모드별 맵 */}
      <div className='Items-center w-full max-w-[1400px] mx-auto'>
        <h2 className="text-lg font-bold bg-[#2dd4bf]-300 inline-block px-4 py-2 rounded mb-4">모든 맵</h2>
        <div className="bg-orange-200 p-4 rounded-lg flex flex-wrap gap-4 mb-6">
          {modeKeys.length === 0 && <span className="text-gray-600">모드 로딩 중...</span>}
          {modeKeys.map((k) => {
            const isSelected = selectedKey === k;
            const label = modeLabels[k] ?? k;
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