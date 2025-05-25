'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


interface BrawlerData {
  brawlerId: number;
  nameKr: string;
  roleKr: string;
  rarityKr: string;
  imageUrl: string;
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

export default function BrawlersPage() {
  const [brawlers, setBrawlers] = useState<BrawlerData[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const roleImages: { [key: string]: string } = {
    "탱커": "/role/icon_class_tank.png",
    "어쌔신": "/role/icon_class_assassin.png",
    "서포터": "/role/icon_class_support.png",
    "컨트롤러": "/role/icon_class_controller.png",
    "대미지 딜러": "/role/icon_class_damage.png",
    "저격수": "/role/icon_class_marksmen.png",
    "투척수": "/role/icon_class_artillery.png",
  };

  const roles = Object.keys(roleImages);

  useEffect(() => {
    fetch("http://localhost:8081/api/brawlers")
      .then((res) => res.json())
      .then((data) => {
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

  const handleRoleClick = (role: string) => {
    setSelectedRole(prev => (prev === role ? null : role));
  };

  const filteredBrawlers = brawlers.filter(b => {
    const matchesRole = selectedRole ? b.roleKr === selectedRole : true;
    const matchesSearch = b.nameKr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex p-10 gap-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen font-sans text-white">
      {/* 좌측 브롤러 영역 */}
      <div className="w-[420px] bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        {/* 상단 바 */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm text-gray-300">VER.</span>
          <span className="bg-teal-300 w-8 h-8 flex items-center justify-center font-bold rounded-full text-white shadow">Q</span>
        </div>
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
              <img
                src={roleImages[role]}
                alt={role}
                className="w-8 h-8 object-contain"
              />
              <span>{role}</span>
            </button>
          ))}
        </div>
        {/* 브롤러 리스트 */}
        <div className="grid grid-cols-5 gap-4 mt-2">
          {filteredBrawlers.length === 0 ? (
            <span className="col-span-5 text-center text-red-400 font-semibold">브롤러가 없습니다.</span>
          ) : (
            filteredBrawlers.map((b) => (
              <Link href={`/brawlers/${b.brawlerId}`} key={b.brawlerId}>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform duration-150">
                  <img
                    src={b.imageUrl}
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

      {/* 우측 티어표 영역 */}
      <div className="flex-1 flex flex-col gap-6">
        {/* 헤더 */}
        <div className="grid grid-cols-7 items-center px-6 py-3 font-bold text-base text-gray-300 bg-gray-800 rounded-xl shadow mb-2">
          <span className="text-center">순위</span>
          <span className="text-center">티어</span>
          <span className="text-center">브롤러</span>
          <span className="text-center">조합</span>
          <span className="text-center">승률</span>
          <span className="text-center">픽률</span>
          <span className="text-center">카운터</span>
        </div>
        {/* 티어 리스트 */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((tier, i) => {
            const tierNumStyle = [
              "bg-yellow-400 text-white shadow-lg border-4 border-yellow-200 scale-110",
              "bg-green-300 text-white shadow-md border-4 border-green-100",
              "bg-blue-300 text-white shadow border-4 border-blue-100",
              "bg-gray-300 text-gray-600 border-4 border-gray-200",
              "bg-gray-500 text-gray-200 border-4 border-gray-400 opacity-70"
            ];
            const tierLabelStyle = [
              "bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 font-extrabold drop-shadow",
              "bg-gradient-to-br from-lime-200 to-green-300 text-green-900 font-bold",
              "bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 font-bold",
              "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-700 font-semibold",
              "bg-gradient-to-br from-gray-400 to-gray-600 text-gray-500 font-semibold"
            ];
            return (
              <div
                key={i}
                className="grid grid-cols-7 items-center px-6 py-4 rounded-2xl bg-gray-800 shadow-md gap-2 hover:scale-[1.01] transition-transform duration-150"
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg border-4 ${tierNumStyle[i]}`}>
                  {tier}
                </span>
                <span className={`mx-auto w-16 h-10 flex items-center justify-center rounded-xl shadow-md text-lg ${tierLabelStyle[i]}`}>
                  {["S+", "S", "A", "B", "C"][i]}
                </span>
                <div className="flex gap-1 justify-center">
                  <div className="w-9 h-9 rounded-xl bg-rose-300 shadow" />
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="w-9 h-9 rounded-xl bg-yellow-300 shadow" />
                  <div className="w-9 h-9 rounded-xl bg-purple-300 shadow" />
                </div>
                <span className="text-center font-bold text-gray-300">50%</span>
                <span className="text-center font-bold text-gray-300">0.2%</span>
                <div className="flex gap-2 justify-center">
                  <div className="w-9 h-9 rounded-xl bg-rose-300 shadow" />
                  <div className="w-9 h-9 rounded-xl bg-rose-300 shadow" />
                  <div className="w-9 h-9 rounded-xl bg-rose-300 shadow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}