// 'use client';

// import React from 'react';

// interface BattleDetailModalProps {
//   battle: any;
//   onClose: () => void;
//   useNextImage?: boolean;
// }

// export default function Modal({ battle, onClose, useNextImage = false }: BattleDetailModalProps)  {
//   const { battleTime, event, battle: battleInfo } = battle;
//   const date = battleTime?.split('T')[0];
//   const map = event?.map || '알 수 없음';
//   const mode = event?.mode || '모드 없음';
//   const result = battleInfo?.result || 'unknown';
//   const type = battleInfo?.type || '타입 없음';

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
//       <div className="bg-gray-900 p-6 rounded-xl w-full max-w-2xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl"
//         >
//           ✕
//         </button>
//         <h2 className="text-2xl font-bold text-teal-400 mb-4">전투 상세 정보</h2>
//         <p className="text-white mb-2">날짜: {date}</p>
//         <p className="text-white mb-2">모드: {mode}</p>
//         <p className="text-white mb-2">맵: {map}</p>
//         <p className="text-white mb-2">결과: {result}</p>
//         <p className="text-white mb-4">타입: {type}</p>

//         {battleInfo?.teams?.map((team: any[], i: number) => (
//           <div key={i} className="mb-4">
//             <h3 className="text-lg text-teal-300 font-semibold mb-2">{i === 0 ? '우리 팀' : '상대 팀'}</h3>
//             <div className="flex flex-wrap gap-3">
//               {team.map((player: any, j: number) => (
//                 <div
//                   key={j}
//                   className="bg-gray-800 p-3 rounded-lg flex items-center space-x-3 shadow-md"
//                 >
//                   <img
//                     src={`/brawlers/${player.brawler?.name?.toLowerCase() || 'unknown'}_portrait.png`}
//                     alt={player.brawler?.name || '브롤러'}
//                     className="w-10 h-10 rounded"
//                   />
//                   <div>
//                     <p className="text-white text-sm font-semibold">{player.name}</p>
//                     <p className="text-gray-400 text-sm">Lv. {player.brawler?.power || '?'}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
