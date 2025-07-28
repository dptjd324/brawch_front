'use client';

import React from "react";
import Link from "next/link";
import { TopsearchBar } from "@/components/Home/TopsearchBar";

export const Top = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 shadow-lg font-nougat relative">
      <div className="max-w-[1440px] mx-auto h-20 flex items-center px-10 relative">
        {/* 왼쪽 로고 */}
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
          />
        </Link>

        {/* 가운데 메뉴 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-12">
          <Link href="/">
            <div className="cursor-pointer text-xl font-bold text-gray-800 hover:text-white transition hover:scale-110">
              홈
            </div>
          </Link>
          <Link href="/brawlers">
            <div className="cursor-pointer text-xl font-bold text-gray-800 hover:text-white transition hover:scale-110">
              브롤러
            </div>
          </Link>
          <Link href="/mode">
            <div className="cursor-pointer text-xl font-bold text-gray-800 hover:text-white transition hover:scale-110">
              모드
            </div>
          </Link>
        </div>

        {/* 오른쪽 검색바 */}
        <div className="absolute right-0 flex items-center gap-4">
          <TopsearchBar />
        </div>
      </div>
    </div>
  );
};
