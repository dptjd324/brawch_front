'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { mapNameKoMap } from '@/utils/mapNameKoMap_UPDATED_ALL';

const COMPETITIVE_MODES = [
  { key: 'gemgrab', label: 'Gem Grab', match: 'Gem Grab' },
  { key: 'bounty', label: 'Bounty', match: 'Bounty' },
  { key: 'hotzone', label: 'Hot Zone', match: 'Hot Zone' },
  { key: 'heist', label: 'Heist', match: 'Heist' },
  { key: 'brawlball', label: 'Brawl Ball', match: 'Brawl Ball' },
  { key: 'knockout', label: 'Knockout', match: 'Knockout' },
];

interface MapItem {
  id: number;
  name: string;
  mode: string;
}
export function normalizeMode(raw: string): string {
  return raw.toLowerCase().replace(/\s/g, '');
}

export default function CompetitiveMapsPage() {
  const [selectedMode, setSelectedMode] = useState('gemgrab');
  const [maps, setMaps] = useState<MapItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/maps/all')
      .then((res) => res.json())
      .then((data: MapItem[]) => {
        setMaps(data);
      });
  }, []);

  const selectedMatch = COMPETITIVE_MODES.find((m) => m.key === selectedMode)?.match;
  const filteredMaps = maps.filter((m) => m.mode === selectedMatch);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <div className="p-6 bg-gray-900 text-white">
      {/* 탭 */}
      <div className="flex gap-4 mb-6 justify-center">
        {COMPETITIVE_MODES.map((mode) => (
          <button
            key={mode.key}
            className={`px-4 py-2 rounded-full flex items-center justify-center ${selectedMode === mode.key ? 'bg-yellow-400' : 'bg-gray-700'
              }`}
            onClick={() => setSelectedMode(mode.key)}
          >
            <img
              src={`/mode/${mode.key}_icon.png`}
              alt={`${mode.label} 아이콘`}
              className="w-8 h-8"
              onError={(e) => (e.currentTarget.src = '/placeholder.png')}
            />
          </button>
        ))}
      </div>

      {/* 슬라이더 */}
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 p-2 rounded-full z-10"
        >
          ◀
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-hidden px-10 w-[1200px]">
          {filteredMaps.map((map) => {
            const modeKey = normalizeMode(map.mode); 
            const koName = mapNameKoMap[modeKey]?.[map.name.toLowerCase()] ?? map.name;
            return (
              <Link
                key={map.id}
                href={`/mode/${selectedMode}/${map.id}`}
                className="flex-shrink-0 w-56 bg-blue-400 rounded-lg p-4 text-center flex flex-col items-center hover:scale-105 transition"
              >
                <img
                  src={`/mode/${selectedMode}_icon.png`}
                  alt={`${selectedMatch} 아이콘`}
                  className="w-10 h-10 mb-2 rounded"
                  onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                />
                <img
                  src={`/map/${selectedMode}/${map.id}.png`}
                  alt={map.name}
                  className="w-full h-32 object-contain mb-2 bg-black/20 rounded"
                  onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                />
                <p className="text-white">{koName}</p> 
              </Link>
            );
          })}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 p-2 rounded-full z-10"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
