'use client';

interface PlayerRanking {
  rank: number;
  name: string;
  clubName: string;
  trophies: number;
  iconId: number;
}

export default function PlayerRankingTable({ players }: { players: PlayerRanking[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border border-gray-700 rounded-lg">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-2">순위</th>
            <th className="p-2">플레이어</th>
            <th className="p-2">클럽</th>
            <th className="p-2">트로피</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900">
          {players.map((player, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="p-2">{player.rank}</td>
              <td className="p-2 flex items-center gap-2">
                <img
                  src={`/player/icon/${player.iconId}.png`}
                  alt="icon"
                  className="w-6 h-6 rounded"
                  onError={(e) => (e.currentTarget.src = '/player/icon/default.png')}
                />
                {player.name}
              </td>
              <td className="p-2">{player.clubName || '-'}</td>
              <td className="p-2">{player.trophies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}