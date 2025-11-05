'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RecentPlayer {
  tag: string;
  name: string;
  trophies: number;
  lastSearchedAt: string; // 추가
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentPlayers, setRecentPlayers] = useState<RecentPlayer[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // 최근 검색 플레이어 가져오기 (정렬된 검색 로그 API 사용)
  useEffect(() => {
    fetch("http://localhost:8081/api/players/search-log/page?page=0&size=10")
      .then((res) => res.json())
      .then((data) => setRecentPlayers(data))
      .catch((err) => console.error("Failed to fetch recent players", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/#/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    setSearchQuery(value);
    setShowDropdown(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tag = searchQuery.trim();
    if (!tag) {
      alert("태그를 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/api/players/${tag}`);
      if (res.ok) {
        router.push(`/players/${tag}`);
      } else {
        alert("존재하지 않는 플레이어 태그입니다.");
      }
    } catch (error) {
      alert("서버 오류가 발생했습니다.");
      console.error(error);
    }
  };

  const handleRecentClick = (tag: string) => {
    setSearchQuery(tag);
    setShowDropdown(false);
    router.push(`/players/${tag}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 w-full p-4 bg-gray-800 shadow-lg rounded-lg"
        aria-label="Search form"
      >
        <button
          type="button"
          className="bg-green-500 text-white px-6 py-3 font-semibold rounded-lg transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-md"
        >
          Player
        </button>

        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          className="flex-grow bg-transparent h-12 px-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600"
          placeholder="태그를 입력하세요(# 제외)"
          maxLength={12}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        <button
          type="submit"
          className="bg-teal-500 text-white px-6 py-3 font-semibold rounded-lg transition-all hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 shadow-md"
          aria-label="Search button"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      {showDropdown && recentPlayers.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-md max-h-64 overflow-y-auto">
          {recentPlayers.map((player) => (
            <li
              key={player.tag}
              onClick={() => handleRecentClick(player.tag)}
              className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
            >
              #{player.tag} - {player.name} ({player.trophies}🏆)
              <div className="text-xs text-gray-400">
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
