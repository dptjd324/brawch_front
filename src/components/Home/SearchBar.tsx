'use client';
import React, { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center gap-4 w-full max-w-lg mx-auto p-4 bg-gray-800 shadow-lg rounded-lg"
      aria-label="Search form"
    >
      {/* Player 버튼 */}
      <button
        type="button"
        className="bg-green-500 text-white px-6 py-3 font-semibold rounded-lg transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-md"
        aria-label="Player ranking"
      >
        Player
      </button>

      {/* 검색 입력 필드 */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow bg-transparent h-12 px-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 border border-gray-600"
        placeholder="태그를 입력하세요 (#)"
        aria-label="Search input"
      />

      {/* Search 버튼 */}
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