'use client';

import React, { useEffect, useState } from "react";
import { getBrawlerImageUrlById } from "@/utils/brawlerData";


interface Brawler {
  brawlerId: number;
  nameKr: string;
  nameEn: string;
  imageUrl: string;
  roleKr: string;
  rarityKr: string;
  releaseDate: string;
  baseHp: number;
  finalHp: number;
  baseDamage: number;
  finalDamage: number;
  baseSuperdamage: number;
  finalSuperdamage: number;
  attackDescKr: string;
  superDescKr: string;
  movespdValue: number;
  attackNameKr: string;
  superNameKr: string;
  lvPerDamage: number;
  lvPerSuperdamage: number;
  lvPerHp: number;
}
interface Gadget {
  nameKr: string;
  imageUrl: string;
  descriptionKr: string;
}

interface StarPower {
  nameKr: string;
  imageUrl: string;
  descriptionKr: string;
}
interface HyperCharge {
  nameKr: string;
  imageUrl: string;
  descriptionKr: string;
}

interface SynergyInfo {
  teammateId: number;
  teammateName: string;
  teammateImageUrl: string;
  pairWinrate: number;
  pairWins: number;
  pairTotal: number;
}

export default function BrawlerDetail({ brawler }: { brawler: Brawler }) {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [starPowers, setStarPowers] = useState<StarPower[]>([]);
  const [hypercharge, setHyercharge] = useState<HyperCharge[]>([]);
  const [extendedSynergies, setExtendedSynergies] = useState<SynergyInfo[]>([]);

  useEffect(() => {
    // 가젯, 스타파워, 하이퍼차지 데이터 불러오기
    const endpoints = [
      { key: "gadgets", url: `http://localhost:8081/api/brawlers/${brawler.brawlerId}/gadgets` },
      { key: "starpowers", url: `http://localhost:8081/api/brawlers/${brawler.brawlerId}/starpowers` },
      { key: "hypercharges", url: `http://localhost:8081/api/brawlers/${brawler.brawlerId}/hypercharges` },
    ];

    endpoints.forEach(({ key, url }) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            if (key === "gadgets") setGadgets(data);
            else if (key === "starpowers") setStarPowers(data);
            else setHyercharge(data);
          }
        })
        .catch((err) => console.error(` Failed to fetch ${key}:`, err));
    });
    // 시너지 데이터 불러오기 (트로피전 기준)
    fetch(`http://localhost:8081/api/synergy/full?patchVersion=2025-11-01&brawlerId=${brawler.brawlerId}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => b.pairWinrate - a.pairWinrate);
        setExtendedSynergies(sorted);
      })
      .catch((err) => console.error("❌ Failed to fetch full synergy list:", err));
  }, [brawler.brawlerId]);


  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-screen-lg mx-auto p-8 space-y-8">
        {/* 상단 정보 */}
        <div className="flex items-center justify-between bg-gray-800 p-6 rounded-lg shadow-md">
          {/* 브롤러 정보 */}
          <div className="flex items-center gap-6">
            <img
              src={getBrawlerImageUrlById(brawler.brawlerId)}
              alt={brawler.nameKr}
              className="w-32 h-32 rounded-xl shadow-md"
            />
            <div>
              <h2 className="text-3xl font-bold">{brawler.nameKr}</h2>
              <p className="text-gray-400">{brawler.roleKr} | {brawler.rarityKr}</p>
            </div>
          </div>

          {/* 가젯, 스타파워*/}
          <div className="flex gap-4">
            {/* 가젯 */}
            <div className="flex flex-col items-start bg-gray-700 p-4 rounded-lg shadow gap-4">
              <span className="font-bold text-lg mb-2 self-center">가젯</span>
              {gadgets.length > 0 ? (
                <div className="flex flex-row gap-4">
                  {gadgets.map((gadget, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={gadget.imageUrl}
                        alt={gadget.nameKr}
                        className="w-16 h-16 rounded-lg object-cover mb-2"
                      />
                      <span className="text-sm text-gray-300">{gadget.nameKr}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">가젯 없음</span>
              )}
            </div>

            {/* 스타파워 */}
            <div className="flex flex-col items-start bg-gray-700 p-4 rounded-lg shadow gap-4">
              <span className="font-bold text-lg mb-2 self-center">스타파워</span>
              {starPowers.length > 0 ? (
                <div className="flex flex-row gap-4">
                  {starPowers.map((starPower, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={starPower.imageUrl}
                        alt={starPower.nameKr}
                        className="w-16 h-16 rounded-lg object-cover mb-2"
                      />
                      <span className="text-sm text-gray-300">{starPower.nameKr}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">스타파워 없음</span>
              )}
            </div>
            {/* 하이퍼차지 */}
            <div className="flex flex-col items-start bg-gray-700 p-4 rounded-lg shadow gap-4">
              <span className="font-bold text-lg mb-2 self-center">하이퍼차지</span>
              {hypercharge.length > 0 ? (
                <div className="flex flex-row gap-4">
                  {hypercharge.map((hypercharge, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={`/hypercharge/${brawler.nameEn}_hypercharge.png`}
                        alt={hypercharge.nameKr}
                        className="w-16 h-16 rounded-lg object-cover mb-2"
                      />
                      <span className="text-sm text-gray-300">{hypercharge.nameKr}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">하이퍼차지 없음</span>
              )}
            </div>
          </div>
        </div>
        {/* 🟦 시너지 상세 리스트 */}
        <div className="grid grid-cols-2 gap-6 mt-10">
          {/*  함께하면 좋은 브롤러 */}
          <div className="bg-gray-800 rounded-xl shadow-md">
            <div className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-t-xl border-b border-gray-600">
              <h3 className="text-lg font-bold text-green-400">함께하면 좋은 브롤러</h3>
              <span className="text-xs text-gray-400">승률 높은 순</span>
            </div>

            <table className="w-full text-sm text-gray-200">
              <thead className="bg-gray-750 text-gray-400">
                <tr>
                  <th className="text-left px-4 py-2">브롤러</th>
                  <th className="text-right px-4 py-2">게임수</th>
                  <th className="text-right px-4 py-2">승수</th>
                  <th className="text-right px-4 py-2">승률</th>
                </tr>
              </thead>
              <tbody>
                {extendedSynergies
                  .filter((s) => s.pairWinrate >= 0.5)
                  .sort((a, b) => b.pairWinrate - a.pairWinrate)
                  .slice(0, 10)
                  .map((s, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-700 transition border-b border-gray-700"
                    >
                      <td className="px-4 py-2 flex items-center gap-3">
                        <img
                          src={s.teammateImageUrl}
                          alt={s.teammateName}
                          className="w-8 h-8 rounded-lg border border-gray-600"
                        />
                        <span className="font-medium">{s.teammateName}</span>
                      </td>
                      <td className="px-4 py-2 text-right text-gray-300">
                        {s.pairTotal?.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        {s.pairWins?.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-green-400">
                        {(s.pairWinrate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* 함께하면 안좋은 브롤러 */}
          <div className="bg-gray-800 rounded-xl shadow-md">
            <div className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-t-xl border-b border-gray-600">
              <h3 className="text-lg font-bold text-red-400">함께하면 안좋은 브롤러</h3>
              <span className="text-xs text-gray-400">승률 낮은 순</span>
            </div>

            <table className="w-full text-sm text-gray-200">
              <thead className="bg-gray-750 text-gray-400">
                <tr>
                  <th className="text-left px-4 py-2">브롤러</th>
                  <th className="text-right px-4 py-2">게임수</th>
                  <th className="text-right px-4 py-2">승수</th>
                  <th className="text-right px-4 py-2">승률</th>
                </tr>
              </thead>
              <tbody>
                {extendedSynergies
                  .sort((a, b) => a.pairWinrate - b.pairWinrate) // 낮은 승률순
                  .slice(0, 10)
                  .map((s, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-700 transition border-b border-gray-700"
                    >
                      <td className="px-4 py-2 flex items-center gap-3">
                        <img
                          src={s.teammateImageUrl}
                          alt={s.teammateName}
                          className="w-8 h-8 rounded-lg border border-gray-600"
                        />
                        <span className="font-medium">{s.teammateName}</span>
                      </td>
                      <td className="px-4 py-2 text-right text-gray-300">
                        {s.pairTotal?.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-400">
                        {s.pairWins?.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-red-400">
                        {(s.pairWinrate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 스킬 상세설명 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          <h3 className="font-bold text-lg mb-4">스킬 상세설명</h3>
          <div className="space-y-6">
            {/* 기본공격 */}
            <div className="flex items-center gap-4">
              <img
                src="/attack/button_aim.png"
                alt="기본공격 이미지"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-300">기본공격 (Attack)</h4>
                <p className="text-gray-600 whitespace-pre-line">{brawler.attackNameKr}</p>
                <p className="text-gray-400 whitespace-pre-line">{brawler.attackDescKr || "설명이 없습니다."}</p>
              </div>
            </div>

            {/* 슈퍼공격 */}
            <div className="flex items-center gap-4">
              <img
                src="/attack/button_super.png"
                alt="특수공격 이미지"
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-300">특수공격 (Super)</h4>
                <p className="text-gray-400 whitespace-pre-line">{brawler.superNameKr}</p>
                <p className="text-gray-400 whitespace-pre-line">{brawler.superDescKr || "설명이 없습니다."}</p>
              </div>
            </div>

            {/* 가젯 */}
            {Array.isArray(gadgets) && gadgets.map((gadget, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={gadget.imageUrl}
                  alt={`가젯 이미지 ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-300">{gadget.nameKr} (Gadget)</h4>
                  <p className="text-gray-400 whitespace-pre-line">{gadget.descriptionKr || "설명이 없습니다."}</p>
                </div>
              </div>
            ))}

            {/* 스타파워 */}
            {Array.isArray(starPowers) && starPowers.map((starPower, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={starPower.imageUrl}
                  alt={`스타파워 이미지 ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-300">{starPower.nameKr} (Star Power)</h4>
                  <p className="text-gray-400 whitespace-pre-line">{starPower.descriptionKr || "설명이 없습니다."}</p>
                </div>
              </div>
            ))}

            {/*하이퍼차지*/}
            {Array.isArray(hypercharge) && hypercharge.map((hypercharge, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={`/hypercharge/${brawler.nameEn}_hypercharge.png`}
                  alt={`하이퍼차지 이미지 ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-300">{hypercharge.nameKr} (Hypercharge)</h4>
                  <p className="text-gray-400 whitespace-pre-line">{hypercharge.descriptionKr || "설명이 없습니다."}</p>
                  <p className="text-blue-400 whitespace-pre-line">스피드:20% 데미지:5% 방어막:5%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}