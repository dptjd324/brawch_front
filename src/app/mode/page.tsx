'use client';

import React from 'react';

export default function ModesPage() {
  const ongoingModes = Array(6).fill(null); // 진행 중인 모드 6개
  const competitiveMaps = Array(8).fill(null); // 경쟁전 맵 8개
  const mapList = Array(9).fill(null); // 맵 리스트 9개

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans">
      {/* 진행 중인 모드 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold bg-gray-300 inline-block px-4 py-2 rounded mb-4">
          진행 중인 모드
        </h2>
        <div className="bg-orange-200 p-6 rounded-lg grid grid-cols-3 gap-6">
          {ongoingModes.map((_, i) => (
            <div
              key={i}
              className="flex items-center bg-blue-400 p-4 rounded-lg shadow-md"
            >
              <div className="w-14 h-14 bg-green-300 rounded-md mr-4"></div>
              <div>
                <p className="font-semibold text-white">신규 이벤트명:</p>
                <p className="text-white">맵: </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 경쟁전 맵 */}
      <div>
        <h2 className="text-lg font-bold bg-gray-300 inline-block px-4 py-2 rounded mb-4">
          경쟁전 맵
        </h2>

        {/* 상단 아이콘 리스트 */}
        <div className="bg-orange-200 p-4 rounded-lg flex gap-4 mb-6">
          {competitiveMaps.map((_, i) => (
            <div key={i} className="w-14 h-14 bg-green-300 rounded-md"></div>
          ))}
        </div>

        {/* 맵 카드 리스트 */}
        <div className="bg-orange-200 p-6 rounded-lg grid grid-cols-3 gap-6">
          {mapList.map((_, i) => (
            <div
              key={i}
              className="bg-blue-400 p-4 rounded-lg shadow-md text-white"
            >
              맵: 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
