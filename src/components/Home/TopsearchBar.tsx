'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";


export function TopsearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tag = searchQuery.replace("#", "").toUpperCase();

    const res = await fetch(`http://localhost:8081/api/players/${tag}`);
    if (res.ok) {
      router.push(`/players/${tag}`);
    } else {
      alert("존재하지 않는 플레이어 태그입니다.");
    }
    setSearchQuery(""); // 입력값 초기화
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center h-10 rounded-xl overflow-hidden bg-gray-200 shadow"
      style={{ minWidth: 220 }}
      aria-label="Search form"
    >
      {/* 좌측 라임색 박스 */}
      <div className="bg-lime-400 h-full w-12 flex items-center justify-center font-bold text-white text-sm rounded-l-xl">
        <FontAwesomeIcon icon={faStar} />
      </div>
      {/* 가운데 입력창 */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 h-full px-4 bg-gray-200 outline-none text-black font-semibold"
        placeholder="태그를 입력하세요(# 제외)"
        aria-label="Search input"
      />
      {/* 우측 시안색 박스 */}
      <button
        type="submit"
        className="bg-cyan-300 h-full w-12 flex items-center justify-center font-bold text-white text-sm rounded-r-xl hover:bg-cyan-400 transition"
        aria-label="검색"
        
      >
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white text-lg" />
    
      </button>
    </form>
  );
}