'use client';

import React from 'react';
import Link from "next/link";

export default function PlayerDetail({ player }: { player: any }) {
  return (
    <div className="p-8 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* 플레이어 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* 플레이어명 및 클럽명 */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center shadow-lg">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <img
              src={player.icon?.id
                ? `https://cdn.brawlify.com/profile/${player.icon.id}.png`
                : "/default-profile.png"}
              alt="Player Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <p className="text-4xl font-bold text-teal-400">{player.name || "플레이어 이름"}</p>
          <p className="text-lg text-gray-400 mt-2">{player.tag || "Tag"}</p>
          <p className="text-lg text-gray-400 mt-1">{player.club?.name || "클럽 없음"}</p>
        </div>

        {/* 추가 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <p className="text-lg text-gray-300">플레이어 레벨: <span className="font-bold text-white">{player.expLevel || 1}</span></p>
            <p className="text-lg text-gray-300">총 전투 횟수: <span className="font-bold text-white">{player.battleCount || 0}</span></p>
            <p className="text-lg text-gray-300">최근 접속: <span className="font-bold text-white">{player.lastLogin || "알 수 없음"}</span></p>
          </div>
        </div>
      </div>

      {/* 트로피, 경쟁전, 승리 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* 트로피 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-teal-400">트로피</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">시즌 최고</p>
              <p className="text-2xl font-bold text-white">{player.seasonHighestTrophies || "없음"}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">역대 최고</p>
              <p className="text-2xl font-bold text-white">{player.highestTrophies || "없음"}</p>
            </div>
          </div>
        </div>

        {/* 경쟁전 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-teal-400">경쟁전</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">현재</p>
              <p className="text-2xl font-bold text-white">{player.trophies || 1000}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">최고</p>
              <p className="text-2xl font-bold text-white">{player.highestPowerPlayPoints || "알 수 없음"}</p>
            </div>
          </div>
        </div>

        {/* 승리 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-teal-400">승리 정보</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">3vs3 승리</p>
              <p className="text-2xl font-bold text-white">{player.victories3v3 || 1000}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">솔로 승리</p>
              <p className="text-2xl font-bold text-white">{player.soloVictories || 1000}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">듀오 승리</p>
              <p className="text-2xl font-bold text-white">{player.duoVictories || 1000}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 전적 테이블 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold mb-4 text-teal-400">전적</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {player.battleLog?.slice(0, 10).map((battle: any, i: number) => {
            const battleInfo = battle.battle || {};
            const battleTime = battle.battleTime || "unknown";
            const shortDate = battleTime.split("T")[0] || "날짜 없음";
            const result = battleInfo.result || "결과 없음";
            const mode = battleInfo.mode || "모드 없음";
            const type = battleInfo.type || "타입 없음";
            const trophyChange = battleInfo.trophyChange || "정보 없음";
<<<<<<< HEAD
            
            const myBrawler = battleInfo.teams?.[0]?.[0]?.brawler?.name || "브롤러 없음";
=======


            // 플레이어가 사용한 브롤러 나오도록 수정  
            const myTag = (player.tag.startsWith("#") ? player.tag : `#${player.tag}`).toUpperCase();
            const myBrawler =
              battleInfo.teams?.flat()
                ?.find((p: any) => p?.tag?.toUpperCase() === myTag)
                ?.brawler?.name || "브롤러 없음";
>>>>>>> c866d40d8f5991e049ecedd6ddfa0b1ae0d4d075

            return (
              <Link
                key={i}
                href={`/battle/${encodeURIComponent(player.tag)}/index/${i}`}
                className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition duration-200 block"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold text-teal-400">{shortDate}</p>
                  <p className="text-lg text-gray-300">{mode}</p>
                </div>
                <div className="text-gray-300 text-lg mb-1">
                  타입: {type} / 결과: {result}
                </div>
                <div className="text-gray-300 text-lg mb-1">
                  사용 브롤러: {myBrawler}
                </div>
                <div className="text-gray-300 text-lg">
                  트로피 변화량: {trophyChange}
                </div>

              </Link>

            );
          })}
        </div>
      </div>
    </div>
  );
}