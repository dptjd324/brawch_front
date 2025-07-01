'use client';

interface BattleDetailDto {
    battleTime: string;
    battleType: string;
    map: string;
    gameMode: string;
    teams?: {
        winner: boolean;
        players: {
            name: string;
            tag: string;
            brawlerName: string;
        }[];
    }[];
    participants?: {
        name: string;
        tag: string;
        brawlerName: string;
    }[];
}

export default function BattleDetail({ battle }: { battle: BattleDetailDto }) {
    const hasParticipants = Array.isArray(battle.participants) && battle.participants.length > 0;
    const hasTeams = Array.isArray(battle.teams) && battle.teams.length > 0;

    const isSoloShowdown = hasParticipants && battle.participants!.length % 2 === 1;
    const isDuoShowdown = hasParticipants && battle.participants!.length % 2 === 0;

    type Participant = {
        name: string;
        tag: string;
        brawlerName: string;
    };

    const duoTeams: Participant[][] = isDuoShowdown
        ? battle.participants!.reduce((acc: Participant[][], curr, idx) => {
            if (idx % 2 === 0) acc.push([curr]);
            else acc[acc.length - 1].push(curr);
            return acc;
        }, [])
        : [];

    return (
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-teal-400 mb-2">전투 상세 정보</h1>
                <p className="text-gray-300">맵: <span className="text-white">{battle.map}</span></p>
                <p className="text-gray-300">모드: <span className="text-white">{battle.gameMode}</span></p>
                <p className="text-gray-300">시간: <span className="text-white">{battle.battleTime}</span></p>
            </div>

            {isSoloShowdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.participants!.map((player, idx) => (
                        <div key={player.tag} className="p-6 rounded-xl shadow-lg bg-gray-800">
                            <h2 className="text-xl font-bold mb-4">참가자 {idx + 1}</h2>
                            <div className="flex items-center bg-gray-900 rounded-lg p-3">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300">
                                    {player.brawlerName}
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-white">{player.name}</p>
                                    <p className="text-sm text-gray-400">{player.brawlerName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isDuoShowdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {duoTeams.map((team, idx) => (
                        <div key={idx} className="p-6 rounded-xl shadow-lg bg-gray-800">
                            <h2 className="text-xl font-bold mb-4">듀오 팀 {idx + 1}</h2>
                            <div className="space-y-4">
                                {team.map((player) => (
                                    <div key={player.tag} className="flex items-center bg-gray-900 rounded-lg p-3">
                                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300">
                                            {player.brawlerName}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-white">{player.name}</p>
                                            <p className="text-sm text-gray-400">{player.brawlerName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!hasParticipants && hasTeams && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {battle.teams!.map((team, idx) => (
                        <div key={idx} className={`p-6 rounded-xl shadow-lg ${team.winner ? 'bg-blue-700' : 'bg-red-700'}`}>
                            <h2 className="text-xl font-bold mb-4">
                                팀 {idx + 1} {team.winner ? '(승리)' : '(패배)'}
                            </h2>
                            <div className="space-y-4">
                                {team.players.map((player) => (
                                    <div key={player.tag} className="flex items-center bg-gray-900 rounded-lg p-3">
                                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-300">
                                            {player.brawlerName}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-white">{player.name}</p>
                                            <p className="text-sm text-gray-400">{player.brawlerName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!hasParticipants && !hasTeams && (
                <div className="text-center text-red-400 text-lg mt-8">
                    전투에 대한 참가자 정보를 찾을 수 없습니다.
                </div>
            )}
        </div>
    );
}
