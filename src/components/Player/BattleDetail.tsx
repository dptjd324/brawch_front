'use client';
interface BattleDetailDto {
  battleTime: string;
  battleType: string;
  map: string;
  gameMode: string;
  teams: {
    winner: boolean;
    players: {
      name: string;
      tag: string;
      brawlerName: string;
    }[];
  }[];
}

export default function BattleDetail({ battle }: { battle: BattleDetailDto }) {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teal-400 mb-2">전투 상세 정보</h1>
        <p className="text-gray-300">맵: <span className="text-white">{battle.map}</span></p>
        <p className="text-gray-300">모드: <span className="text-white">{battle.gameMode}</span></p>
        <p className="text-gray-300">시간: <span className="text-white">{battle.battleTime}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {battle.teams.map((team, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl shadow-lg ${team.winner ? 'bg-green-700' : 'bg-red-700'}`}
          >
            <h2 className="text-xl font-bold mb-4">
              Team {idx + 1} {team.winner && '(승리)'}
            </h2>
            <div className="space-y-4">
              {team.players.map((player) => (
                <div
                  key={player.tag}
                  className="flex items-center bg-gray-900 rounded-lg p-3"
                >
                  {/* 이미지 제거 */}
                  <div className="ml-2">
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="text-sm text-gray-400">{player.brawlerName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
