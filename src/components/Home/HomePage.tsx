'use client'; 
import  CompetitiveMaps  from "./CompetitiveMaps";
import React from "react";
import { SearchBar } from "./SearchBar";

export function HomePage() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
   
  };

  return (
    <main className="bg-gray-900 flex flex-col items-center text-base text-white font-bold whitespace-nowrap pt-[169px] pb-[274px] px-20 max-md:px-5 max-md:py-[100px]">
      <section className="flex w-[900px] max-w-full flex-col items-stretch">
        <img
          src="/logo.png"
          alt="Logo"
          className="aspect-[1] object-contain w-55 self-center max-w-full"
        />
        <CompetitiveMaps />
        <div className="mt-[133px] max-md:mt-10">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
    </main>
  );
}
