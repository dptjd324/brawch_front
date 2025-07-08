'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

// 브롤러 영어-한글 매핑 전체 예시 (필요시 최신 브롤러 추가)
const brawlerNameMap: { [key: string]: string } = {
  "Shelly": "쉘리",
  "Colt": "콜트",
  "Bull": "불",
  "Brock": "브록",
  "Rico": "리코",
  "Spike": "스파이크",
  "Barley": "발리",
  "Jessie": "제시",
  "Nita": "니타",
  "Dynamike": "다이너마이크",
  "El primo": "엘 프리모",
  "Mortis": "모티스",
  "Crow": "크로우",
  "Poco": "포코",
  "Bo": "보",
  "Piper": "파이퍼",
  "Pam": "팸",
  "Tara": "타라",
  "Darryl": "대릴",
  "Penny": "페니",
  "Frank": "프랭크",
  "Gene": "진",
  "Tick": "틱",
  "Leon": "레온",
  "Rosa": "로사",
  "Carl": "칼",
  "Bibi": "비비",
  "8-bit": "8비트",
  "Sandy": "샌디",
  "Bea": "비",
  "Emz": "엠즈",
  "Mr. p": "미스터 P",
  "Max": "맥스",
  "Jacky": "재키",
  "Gale": "게일",
  "Nani": "나니",
  "Sprout": "스프라우트",
  "Surge": "서지",
  "Colette": "콜레트",
  "Amber": "앰버",
  "Lou": "루",
  "Byron": "바이런",
  "Edgar": "에드거",
  "Ruffs": "러프스",
  "Stu": "스튜",
  "Belle": "벨",
  "Squeak": "스퀴크",
  "Grom": "그롬",
  "Buzz": "버즈",
  "Griff": "그리프",
  "Ash": "애쉬",
  "Meg": "메그",
  "Lola": "롤라",
  "Fang": "팽",
  "Eve": "이브",
  "Janet": "자넷",
  "Bonnie": "보니",
  "Otis": "오티스",
  "Sam": "샘",
  "Gus": "거스",
  "Buster": "버스터",
  "Chester": "체스터",
  "Gray": "그레이",
  "Mandy": "맨디",
  "R-t": "R-T",
  "Willow": "윌로우",
  "Maisie": "메이지",
  "Hank": "행크",
  "Cordelius": "코델리우스",
  "Doug": "더그",
  "Pearl": "펄",
  "Chuck": "척",
  "Charlie": "찰리",
  "Mico": "미코",
  "Kit": "키트",
  "Larry & lawrie": "래리 & 로리",
  "Melodie": "멜로디",
  "Angelo": "안젤로",
  "Draco": "드라코",
  "Lily": "릴리",
  "Berry": "베리",
  "Clancy": "클랜시",
  "Moe": "모",
  "Kenji": "켄지",
  "Shade": "셰이드",
  "Juju": "주주",
  "Meeple": "미플",
  "Ollie": "올리",
  "Lumi": "루미",
  "Finx": "핑크스",
  "Jae-yong": "재용",
  "Kaze": "카제"
  "Trunk": "트렁크"
  "브롤러 없음": "브롤러 없음"
};
const modeKoMap: { [key: string]: string } = {
  gemGrab: "젬 그랩",
  showdown: "솔로 쇼다운",
  duoShowdown: "듀오 쇼다운",
  brawlBall: "브롤볼",
  bounty: "바운티",
  heist: "하이스트",
  siege: "시즈",
  hotZone: "핫 존",
  knockout: "녹아웃",
  bossFight: "보스전",
  roboRumble: "로보 럼블",
  bigGame: "빅 게임",
  trophyThieves: "트로피 도둑",
  volleyBrawl: "발리 브롤",
  basketBrawl: "바스켓 브롤",
  wipeout: "와이프아웃",
  duels: "듀얼",
  hunters: "헌터",
  powerLeague: "파워 리그",
  friendly: "친선전",
};


const resultKoMap: { [key: string]: string } = {
  victory: "승리",
  defeat: "패배",
  draw: "무승부",
  "결과 없음": "결과 없음"
};

function toBrawlerKey(name: string) {
  if (!name || name === "브롤러 없음") return name;
  if (name.includes("&")) return name.split("&").map(n => n.trim()).map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" & ");
  if (name === "8-BIT" || name === "8-bit" || name === "8-Bit") return "8-Bit";
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}
function getBrawlerImagePath(name: string) {
  if (!name || name === "브롤러 없음") return "/brawler/default.png"; // 기본값
  const fileName = name.toLowerCase().replace(/[^a-z0-9]/g, "") + "_portrait.png";
  return `/brawler/${fileName}`;
}

export default function PlayerDetail({ player }: { player: any }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const battleLog = player.battleLog || [];

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, battleLog.length));
  };

  return (
    <div className="p-8 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* 플레이어 정보 */}
      <div className="mb-12">
        {/* 플레이어명 및 클럽명 */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center shadow-lg">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <img
              src={`https://cdn.brawlify.com/profile-icons/regular/${player.icon?.id}.png`}
              alt="Player Profile"
              className="w-32 h-32 rounded-full object-cover"

            />
          </div>
          <p className="text-4xl font-bold text-teal-400">
            {player.name || "플레이어 이름"}
          </p>
          <p className="text-lg text-gray-400 mt-2">
            태그 : {player.tag || "Tag"}
          </p>
          <p className="text-lg text-gray-400 mt-1">
            클럽명 : {player.club?.name || "클럽 없음"}
          </p>
          <p className="text-lg text-gray-400 mt-1">
            플레이어 레벨 : {player.expLevel || 1}
          </p>
        </div>

      </div>
      {/* 트로피, 경쟁전, 승리 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* 트로피 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-teal-400">트로피</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">현재 트로피</p>
              <p className="text-2xl font-bold text-white">{player.trophies ?? "없음"}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">역대 최고</p>
              <p className="text-2xl font-bold text-white">{player.highestTrophies ?? "없음"}</p>
            </div>
          </div>
        </div>


        {/* 경쟁전 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-teal-400">경쟁전</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* 파워플레이 최고 점수 */}
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">파워플레이 최고</p>
              <p className="text-2xl font-bold text-white">
                {player.highestPowerPlayPoints ?? "없음"}
              </p>
            </div>

            {/* 파워플레이 현재 점수 + 솔로 랭크 */}
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">파워플레이 현재</p>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-white">
                  {player.powerPlayPoints ?? "없음"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  솔로 랭크: {player.powerLeague?.solo?.rank ?? "정보 없음"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  팀 랭크: {player.powerLeague?.team?.rank ?? "정보 없음"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 승리 정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-teal-400">승리 정보</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">3vs3 승리</p>
              <p className="text-2xl font-bold text-white">{player['3vs3Victories'] ?? player.victories3v3 ?? 0}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">솔로 승리</p>
              <p className="text-2xl font-bold text-white">{player.soloVictories ?? 0}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-gray-300">듀오 승리</p>
              <p className="text-2xl font-bold text-white">{player.duoVictories ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 전적 테이블 */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 w-full">
        <h3 className="text-2xl font-bold mb-6 text-teal-400">전적</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {battleLog.slice(0, visibleCount).map((battle: any, i: number) => {
            const battleInfo = battle.battle || {};
            const battleTime = battle.battleTime || "unknown";
            const shortDate = battleTime.split("T")[0] || "날짜 없음";
            const result = battleInfo.result || "결과 없음";
            const mode = battleInfo.mode || "모드 없음";
            const trophyChange = battleInfo.trophyChange ?? "정보 없음";
            const iconPath = `/mode/${mode}_icon.png`;

            const myTag = (player.tag.startsWith("#") ? player.tag : `#${player.tag}`).toUpperCase();
            let myBrawlerEn = "브롤러 없음";
            if (battleInfo.teams) {
              outer: for (const team of battleInfo.teams) {
                for (const p of team) {
                  const pTag = p.tag ? p.tag.toUpperCase() : "";
                  if (pTag === myTag) {
                    myBrawlerEn = p.brawler?.name || "브롤러 없음";
                    break outer;
                  }
                }
              }
            }
            const myBrawlerKey = toBrawlerKey(myBrawlerEn);
            const myBrawler = brawlerNameMap[myBrawlerKey] || myBrawlerEn;

            const boxBg =
              result === "victory"
                ? "bg-blue-600 border-2 border-blue-400"
                : result === "defeat"
                  ? "bg-red-700/90 border-2 border-red-600"
                  : "bg-blue-600/80 border-2 border-blue-500";

            return (
              <Link
                key={i}
                href={`/battle/${encodeURIComponent(player.tag)}/index/${i}`}
                className={`rounded-xl p-4 shadow-lg text-white flex flex-col justify-between min-h-[140px] ${boxBg}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-base font-bold">{shortDate}</p>
                    <p className="text-sm text-gray-100 mt-1">{battleInfo.type === "ranked" ? "랭크" : "일반"}</p>
                  </div>
                  <div className="flex flex-col items-end">

                    <span
                      className={`text-sm font-bold px-2 py-1 rounded 
                        ${result === "victory" ? "bg-green-500" : result === "defeat" ? "bg-red-500" : "bg-gray-400"}
                      `}
                    >
                      {resultKoMap[result] || result}
                    </span>
                    <Image src={iconPath} alt="mode" width={32} height={32} className="rounded mb-1" />
                    <span className="text-xs font-semibold mt-1">
                      {modeKoMap[mode] || mode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {/* 브롤러 이미지 */}
                  <div className="w-12 h-12 rounded overflow-hidden bg-white/20 flex items-center justify-center">
                    <Image
                      src={getBrawlerImagePath(myBrawlerKey)}
                      alt={`${myBrawler} 이미지`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-semibold">{myBrawler}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {visibleCount < battleLog.length && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded"
            >
              더 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}