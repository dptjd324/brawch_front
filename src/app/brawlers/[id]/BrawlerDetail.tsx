'use client';

import React, { useEffect, useState } from "react";

interface Brawler {
  brawlerId: number;
  nameKr: string;
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

export default function BrawlerDetail({ brawler }: { brawler: Brawler }) {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [starPowers, setStarPowers] = useState<StarPower[]>([]);

  useEffect(() => {
    // 가젯 데이터 가져오기
    fetch(`http://localhost:8081/api/brawlers/${brawler.brawlerId}/gadgets`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Gadgets API Response:", data); // 데이터 확인
        setGadgets(Array.isArray(data) ? data : []); // 배열인지 확인 후 설정
      })
      .catch((err) => console.error("Failed to fetch gadgets:", err));

    // 스타파워 데이터 가져오기
    fetch(`http://localhost:8081/api/brawlers/${brawler.brawlerId}/starpowers`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Star Powers API Response:", data); // 데이터 확인
        setStarPowers(Array.isArray(data) ? data : []); // 배열인지 확인 후 설정
      })
      .catch((err) => console.error("Failed to fetch star powers:", err));
  }, [brawler.brawlerId]);


  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-screen-lg mx-auto p-8 space-y-8">
        {/* 상단 정보 */}
        <div className="flex items-center justify-between bg-gray-800 p-6 rounded-lg shadow-md">
          {/* 브롤러 정보 */}
          <div className="flex items-center gap-6">
            {brawler.imageUrl ? (
              <img
                src={brawler.imageUrl}
                alt={brawler.nameKr}
                className="w-32 h-32 rounded-xl shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold">{brawler.nameKr}</h2>
              <p className="text-gray-400">{brawler.roleKr} | {brawler.rarityKr}</p>
            </div>
          </div>

          {/* 가젯, 스타파워, 카운터 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow">
              <span className="font-bold text-lg">가젯</span>
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              <p className="text-sm text-gray-300 mt-2">승률: 50%</p>
              <p className="text-sm text-gray-300">픽률: 30%</p>
              <p className="text-sm text-gray-300">표본수: 1000</p>
            </div>
            <div className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow">
              <span className="font-bold text-lg">스타파워</span>
              <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
              <p className="text-sm text-gray-300 mt-2">승률: 50%</p>
              <p className="text-sm text-gray-300">픽률: 30%</p>
              <p className="text-sm text-gray-300">표본수: 1000</p>
            </div>
            <div className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow">
              <span className="font-bold text-lg">카운터</span>
              <div className="flex gap-2 mt-2">
                <div className="w-8 h-8 bg-red-400 rounded-full"></div>
                <div className="w-8 h-8 bg-red-400 rounded-full"></div>
                <div className="w-8 h-8 bg-red-400 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">승률: 9%, 11%, 15%</p>
            </div>
          </div>
        </div>

        {/* 조합 및 카운터 */}
        <div className="grid grid-cols-2 gap-8">
          {/* 조합 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">조합</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
                    <div className="w-8 h-8 bg-purple-300 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-300">승률: 50%</div>
                  <div className="text-sm text-gray-300">픽률: 30%</div>
                  <div className="text-sm text-gray-300">표본수: 1000</div>
                </div>
              ))}
            </div>
          </div>

          {/* 카운터 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">카운터</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-300 rounded-full"></div>
                    <span className="text-sm text-gray-300">브롤러</span>
                  </div>
                  <div className="text-sm text-gray-300">판수: </div>
                  <div className="text-sm text-gray-300">승률: </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 기본정보 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
          <h3 className="font-bold text-lg mb-4">기본정보</h3>
          <table className="w-full text-sm text-left text-gray-300">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2">능력치</th>
                <th className="py-2">기본 능력치 (레벨 당 상승)</th>
                <th className="py-2">최종 수치</th>
                <th className="py-2">브롤러 순위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">체력</td>
                <td className="py-2">
                  {brawler.baseHp} <span className="text-gray-400">(+{brawler.lvPerHp})</span>
                </td>
                <td className="py-2">{brawler.finalHp}</td>
                <td className="py-2">1/91</td>
              </tr>
              <tr>
                <td className="py-2">피해량</td>
                <td className="py-2">
                  {brawler.baseDamage} <span className="text-gray-400">(+{brawler.lvPerDamage})</span>
                </td>
                <td className="py-2">{brawler.finalDamage}</td>
                <td className="py-2">1/91</td>
              </tr>
              <tr>
                <td className="py-2">슈퍼 공격</td>
                <td className="py-2">
                  {brawler.baseSuperdamage} <span className="text-gray-400">(+{brawler.lvPerSuperdamage})</span>
                </td>
                <td className="py-2">{brawler.finalSuperdamage}</td>
                <td className="py-2">1/91</td>
              </tr>
              <tr>
                <td className="py-2">이동속도</td>
                <td className="py-2">{brawler.movespdValue}</td>
                <td className="py-2">{brawler.movespdValue}</td>
                <td className="py-2">5/91</td>
              </tr>
            </tbody>
          </table>
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
          </div>
        </div>

      </div>
    </div>
  );
}