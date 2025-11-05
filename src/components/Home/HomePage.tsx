'use client'; 
import  CompetitiveMaps  from "./CompetitiveMaps";
import React from "react";
import { SearchBar } from "./SearchBar";

export function HomePage() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
   
  };
  return (
    <main className="bg-gray-900 flex flex-col items-center text-base text-white font-bold whitespace-nowrap pt-[60px] pb-100px] px-20 max-md:px-5 max-md:py-[100px]">
      <section className="flex w-[900px] max-w-full flex-col items-stretch">
        <img
          src="/logo.png"
          alt="Logo"
          className="aspect-[1] object-contain w-55 self-center max-w-full"
        />
        <div className="mt-[30px] max-md:mt-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      <CompetitiveMaps />
      <section className="mt-30 text-center max-w-2xl">
      </section>
    </main> 
  );
}
