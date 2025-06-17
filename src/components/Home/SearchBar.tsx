'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tag = searchQuery.replace("#", "").toUpperCase();

    // API 확인
    const res = await fetch(`http://localhost:8081/api/players/${tag}`);
    if (res.ok) {
      router.push(`/players/${tag}`);
    } else {
      alert("존재하지 않는 플레이어 태그입니다.");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center gap-4 w-full max-w-lg mx-auto p-4 bg-gray-800 shadow-lg rounded-lg"
      aria-label="Search form"
    >
      <button
        type="button"
        className="bg-green-500 text-white px-6 py-3 font-semibold rounded-lg transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-md"
        aria-label="Player ranking"
      >
        Player
      </button>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow bg-transparent h-12 px-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600"
        placeholder="태그를 입력하세요 (#)"
        aria-label="Search input"
      />

      <button
        type="submit"
        className="bg-teal-500 text-white px-6 py-3 font-semibold rounded-lg transition-all hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 shadow-md"
        aria-label="Search button"
      >
        Search
      </button>
    </form>
  );
}
