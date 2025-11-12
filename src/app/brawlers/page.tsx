'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getBrawlerImageUrlById } from "@/utils/brawlerData";

interface BrawlerData {
  brawlerId: number;
  nameKr: string;
  roleKr: string;
  rarityKr: string;
  imageUrl: string;
}

type SynergyInfo = {
  teammateId?: number;
  teammateName: string;
  teammateImageUrl?: string;
  pairWinrate?: number;
};

interface BrawlerTier {
  brawlerId: number;
  brawlerName: string;
  winRate: number;
  pickRate: number;
  score: number;
  rank: number;
  picks: number;
  imageUrl?: string;
  topSynergies?: SynergyInfo[];
}

function getChosung(str: string | undefined) {
  const CHOSUNG = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ",
    "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ",
    "ㅌ", "ㅍ", "ㅎ"
  ];
  if (!str || str.length === 0) return "";
  const code = str.charCodeAt(0) - 44032;
  if (code >= 0 && code <= 11171) {
    return CHOSUNG[Math.floor(code / 588)];
  }
  return str[0];
}

// ✅ 티어 계산 함수 (프론트 전용)
function getTier(score: number, picks: number): string {
  if (picks < 100) return "F";
  if (score >= 3.5) return "S+";
  if (score >= 3.0) return "S";
  if (score >= 2.5) return "A";
  if (score >= 2.0) return "B";
  if (score >= 1.7) return "C";
  if (score > 1.2) return "D";
  return "F";
}

export default function BrawlersPage() {
  const [brawlers, setBrawlers] = useState<BrawlerData[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tierList, setTierList] = useState<BrawlerTier[]>([]);
  const [patchVersions, setPatchVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [battleType, setBattleType] = useState<"normal" | "ranked">("normal");

  const roleImages: Record<string, string> = {
    "탱커": "/role/icon_class_tank.png",
    "어쌔신": "/role/icon_class_assassin.png",
    "서포터": "/role/icon_class_support.png",
    "컨트롤러": "/role/icon_class_controller.png",
    "대미지 딜러": "/role/icon_class_damage.png",
    "저격수": "/role/icon_class_marksmen.png",
    "투척수": "/role/icon_class_artillery.png",
  };

  const roles = Object.keys(roleImages);

  // ✅ 브롤러 목록 로드
  useEffect(() => {
    fetch("http://localhost:8081/api/brawlers")
      .then(res => res.json())
      .then(data => {
        const sorted = [...data]
          .filter(b => b.nameKr)
          .sort((a, b) => {
            const aChosung = getChosung(a.nameKr);
            const bChosung = getChosung(b.nameKr);
            return aChosung.localeCompare(bChosung, "ko-KR");
          });
        setBrawlers(sorted);
      });
  }, []);

  // ✅ 패치버전 목록
  useEffect(() => {
    fetch("http://localhost:8081/api/brawlers/patchVersions")
      .then(res => res.json())
      .then(json => {
        setPatchVersions(json);
        if (json.length > 0) setSelectedVersion(json[0]);
      });
  }, []);

  // ✅ 티어리스트 + 시너지 병합 + 프론트 정렬
  useEffect(() => {
    if (!selectedVersion) return;

    const fetchTierAndSynergy = async () => {
      try {
        console.log(`🔍 Fetching tiers + synergy: ${selectedVersion}, ${battleType}`);

        // 티어리스트
        const tierRes = await fetch(
          `http://localhost:8081/api/brawlers/tiers?patchVersion=${selectedVersion}&battleType=${battleType}`,
          { cache: "no-store" }
        );
        if (!tierRes.ok) throw new Error("티어 데이터 요청 실패");
        const tierData: BrawlerTier[] = await tierRes.json();

        // 시너지
        const synergyRes = await fetch(
          `http://localhost:8081/api/synergy?patchVersion=${selectedVersion}&battleType=${battleType}`,
          { cache: "no-store" }
        );
        if (!synergyRes.ok) throw new Error("시너지 데이터 요청 실패");
        const synergyData = await synergyRes.json();

        // 병합
        const merged = tierData.map(tier => {
          const synergy = synergyData.find(
            (s: any) =>
              s.brawlerId === tier.brawlerId ||
              s.brawlerA === tier.brawlerId ||
              s.brawlerAName === tier.brawlerName
          );
          return {
            ...tier,
            topSynergies: synergy?.topSynergies || [],
          };
        });

        // ✅ 정렬: 티어 순 → 점수 순
        const tierOrder = ["S+", "S", "A", "B", "C", "D", "F"];
        const sorted = [...merged].sort((a, b) => {
          const tierA = getTier(a.score, a.picks);
          const tierB = getTier(b.score, b.picks);
          const idxA = tierOrder.indexOf(tierA);
          const idxB = tierOrder.indexOf(tierB);
          if (idxA !== idxB) return idxA - idxB;
          return b.score - a.score;
        });

        setTierList(sorted);
        console.log("✅ 병합 및 정렬 완료:", sorted);
      } catch (err) {
        console.error("❌ Fetch 실패:", err);
        setTierList([]);
      }
    };

    fetchTierAndSynergy();
  }, [selectedVersion, battleType]);

  const handleRoleClick = (role: string) => {
    setSelectedRole(prev => (prev === role ? null : role));
  };

  const filteredBrawlers = brawlers.filter(b => {
    const matchesRole = selectedRole ? b.roleKr === selectedRole : true;
    const matchesSearch = b.nameKr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const TIER_COLORS: Record<string, string> = {
    "S+": "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-extrabold border-2 border-yellow-300",
    "S": "bg-green-400 text-white font-bold",
    "A": "bg-blue-400 text-white font-bold",
    "B": "bg-gray-300 text-gray-700 font-semibold",
    "C": "bg-gray-600 text-white opacity-80",
    "D": "bg-orange-600 text-white",
    "F": "bg-gray-700 text-white",
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white p-10">
      <div className="max-w-[1400px] mx-auto flex gap-12">
        {/* 좌측 브롤러 목록 */}
        <div className="flex-[3] bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          {/* 검색창 */}
          <div className="flex items-center gap-2 bg-gray-700 rounded-xl px-3 py-2 shadow-inner">
            <input
              type="text"
              placeholder="브롤러 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-base px-2 text-white"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-teal-400 hover:text-teal-300 transition"
            />
          </div>

          {/* 역할 버튼 */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setSelectedRole(null)}
              className={`w-28 h-12 flex items-center justify-center rounded-lg font-semibold shadow transition-all
              ${selectedRole === null ? "bg-teal-400 text-white" : "bg-gray-700 text-gray-300 border border-teal-500"}`}
            >
              전체
            </button>
            {roles.map((role, i) => (
              <button
                key={i}
                onClick={() => handleRoleClick(role)}
                className={`w-28 h-12 flex items-center justify-center gap-2 rounded-lg font-semibold shadow transition-all
                ${selectedRole === role ? "bg-pink-400 text-white" : "bg-gray-700 text-gray-300 border border-pink-500"}`}
              >
                <img src={roleImages[role]} alt={role} className="w-8 h-8 object-contain" />
                <span>{role}</span>
              </button>
            ))}
          </div>

          {/* 브롤러 목록 */}
          <div className="grid grid-cols-5 gap-4 mt-2">
            {filteredBrawlers.length === 0 ? (
              <span className="col-span-5 text-center text-red-400 font-semibold">브롤러가 없습니다.</span>
            ) : (
              filteredBrawlers.map((b) => (
                <Link href={`/brawlers/${b.brawlerId}`} key={b.brawlerId}>
                  <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform duration-150">
                    <img
                      src={getBrawlerImageUrlById(b.brawlerId)}
                      alt={b.nameKr}
                      loading="lazy"
                      className="w-14 h-14 object-contain rounded-xl border-2 border-gray-700 shadow hover:shadow-lg bg-gray-800"
                    />
                    <span className="text-xs font-semibold text-gray-300 text-center">{b.nameKr}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 우측 티어리스트 테이블 */}
        <div className="flex-[7] bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          {/* 전투 유형 선택 + 패치버전 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              {/* 트로피전 */}
              <button
                onClick={() => setBattleType("normal")}
                className={`p-4 rounded-2xl shadow-lg transition border-4 ${
                  battleType === "normal"
                    ? "border-amber-400 bg-amber-400/20 scale-110"
                    : "border-transparent bg-gray-700 hover:scale-105"
                }`}
                title="트로피전"
              >
                <img src="/icon/icon_trophy2.png" alt="트로피전" className="w-12 h-12 object-contain" />
              </button>

              {/* 경쟁전 */}
              <button
                onClick={() => setBattleType("ranked")}
                className={`p-4 rounded-2xl shadow-lg transition border-4 ${
                  battleType === "ranked"
                    ? "border-purple-500 bg-purple-500/20 scale-110"
                    : "border-transparent bg-gray-700 hover:scale-105"
                }`}
                title="경쟁전"
              >
                <img src="/icon/soloranked_icon.png" alt="경쟁전" className="w-12 h-12 object-contain" />
              </button>
            </div>

            <select
              className="bg-gray-700 text-white px-3 py-1 rounded"
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
            >
              {patchVersions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* 티어리스트 테이블 */}
          <div className="bg-gray-800 rounded-xl overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <table className="min-w-full text-white text-lg">
              <thead className="bg-yellow-500 text-black text-lg sticky top-0 z-10">
                <tr>
                  <th className="p-3 whitespace-nowrap">순위</th>
                  <th className="p-3 whitespace-nowrap">티어</th>
                  <th className="p-3 whitespace-nowrap">브롤러</th>
                  <th className="p-3 whitespace-nowrap">승률</th>
                  <th className="p-3 whitespace-nowrap">픽률</th>
                  <th className="p-3 whitespace-nowrap">Brawch 점수</th>
                  <th className="p-3 whitespace-nowrap">표본수</th>
                  <th className="p-3 whitespace-nowrap">같이하면 좋은 브롤러</th>
                </tr>
              </thead>
              <tbody>
                {tierList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  tierList.map((b, index) => {
                    const tier = getTier(b.score, b.picks);
                    return (
                      <tr
                        key={b.brawlerId}
                        className="text-center border-b border-gray-700 h-16 hover:bg-gray-700/40 transition"
                      >
                        <td className="p-3 font-bold text-yellow-400">{index + 1}</td>
                        <td className="p-3">
                          <span
                            className={`px-5 py-2 rounded-lg font-bold text-lg ${
                              TIER_COLORS[tier] ?? "bg-gray-500 text-white"
                            }`}
                          >
                            {tier}
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-3 justify-center min-w-[150px]">
                          <Link href={`/brawlers/${b.brawlerId}`}>
                            <img
                              src={b.imageUrl || getBrawlerImageUrlById(b.brawlerId)}
                              alt={b.brawlerName}
                              className="w-10 h-10 object-contain rounded cursor-pointer hover:scale-110 transition"
                            />
                          </Link>
                          <Link href={`/brawlers/${b.brawlerId}`}>
                            <span className="font-bold text-lg cursor-pointer hover:underline break-keep">
                              {b.brawlerName}
                            </span>
                          </Link>
                        </td>
                        <td className="p-3">{b.winRate.toFixed(1)}%</td>
                        <td className="p-3">{b.pickRate.toFixed(1)}%</td>
                        <td className="p-3">{b.score.toFixed(1)}점</td>
                        <td className="p-3">{b.picks.toLocaleString()}</td>
                        <td className="p-3">
                          {(b.topSynergies?.length ?? 0) > 0 ? (
                            <div className="flex justify-center gap-3">
                              {b.topSynergies!.slice(0, 3).map((synergy, idx) => {
                                const imgSrc =
                                  synergy.teammateImageUrl ??
                                  (synergy.teammateId
                                    ? getBrawlerImageUrlById(synergy.teammateId)
                                    : "/brawler/unknown.png");
                                return (
                                  <div key={idx} className="flex flex-col items-center w-16">
                                    <img
                                      src={imgSrc}
                                      alt={synergy.teammateName}
                                      className="w-10 h-10 rounded-lg border border-gray-600 object-contain bg-gray-800"
                                    />
                                    <span className="text-xs mt-1 text-gray-300 font-semibold text-center break-keep">
                                      {synergy.teammateName}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
