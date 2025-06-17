// 'use client';

// import React from 'react';


// interface BattleCardProps {
//   battleItem: any;
//   useNextImage?: boolean;
// }

// export default function BattleCard({ battleItem, useNextImage = false }: BattleCardProps) {
//   const { battleTime, event, battle } = battleItem;
//   const battleDate = battleTime?.split('T')[0];
//   const map = event?.map || '알 수 없음';
//   const mode = event?.mode || '모드 없음';
//   const result = battle?.result || 'unknown';
//   const trophyChange = battle?.trophyChange ?? null;
//   const teams = battle?.teams || [];
//   const type = battle?.type || '타입 없음';

//   const bgColor =
//     result === 'victory' ? 'bg-green-700' :
//     result === 'defeat' ? 'bg-red-700' :
//     result === 'draw' ? 'bg-yellow-600' :
//     'bg-gray-700';

//   return (
//     <div className={`rounded-lg p-4 mb-4 shadow-md ${bgColor}`}>
//       <div className="flex justify-between mb-2">
//         <span className="text-lg font-bold text-white">{battleDate}</span>
//         <span className="text-md text-white">{mode} / {map}</span>
//       </div>
//       <p className="text-sm text-gray-300 mb-2">결과: {result} | 타입: {type}</p>
//       <div className="grid grid-cols-2 gap-2">
//         {teams.map((team: any[], i: number) => (
//           <div key={i} className="flex flex-wrap gap-2">
//             {team.map((player: any, j: number) => (
//               <div key={j} className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
//                 <img
//                   src={`/brawler/${player.brawler?.name?.toLowerCase() || 'unknown'}_portrait.png`}
//                   alt={player.brawler?.name || '브롤러'}
//                   className="w-8 h-8 rounded"
//                 />
//                 <div className="flex flex-col">
//                   <span className="text-sm text-white">{player.name}</span>
//                   <span className="text-xs text-gray-400">Lv.{player.brawler?.power}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//       {trophyChange !== null && (
//         <p className="mt-2 text-sm text-white">트로피 변화량: {trophyChange}</p>
//       )}
//     </div>
//   );
// }
