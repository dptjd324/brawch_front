'use client';

import Image from 'next/image';

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
const modeKoMap: { [key: string]: string } = {
    gemGrab: "젬 그랩",
    showdown: "솔로 쇼다운",
    duoShowdown: "듀오 쇼다운",
    brawlBall: "브롤볼",
    bounty: "바운티",
    heist: "하이스트",
    siege: "시즈",
    hotZone: "핫 존",
    knockout: "녹아웃",
    bossFight: "보스전",
    roboRumble: "로보 럼블",
    bigGame: "빅 게임",
    trophyThieves: "트로피 도둑",
    volleyBrawl: "발리 브롤",
    basketBrawl: "바스켓 브롤",
    wipeout: "와이프아웃",
    duels: "듀얼",
    hunters: "헌터",
    powerLeague: "파워 리그",
    friendly: "친선전",
};

function getBrawlerImagePath(name: string) {
    if (!name || name === "브롤러 없음") return "/brawler/default.png";
    const fileName = name.toLowerCase().replace(/[^a-z0-9]/g, "") + "_portrait.png";
    return `/brawler/${fileName}`;
}

export default function BattleDetail({ battle }: { battle: BattleDetailDto }) {
    const hasParticipants = Array.isArray(battle.participants) && battle.participants.length > 0;
    const hasTeams = Array.isArray(battle.teams) && battle.teams.length > 0;

    const isSoloShowdown = battle.gameMode === "showdown" && battle.participants?.length === 10;
    const isDuoShowdown = battle.gameMode === "showdown" && battle.participants?.length === 12;
    const isDuels = battle.gameMode === "duels" && battle.teams?.length === 2 && battle.teams[0].players.length === 3;

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
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white space-y-10">
            {/* 상단 요약 정보 */}
            <div className="flex flex-col items-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-teal-200 to-cyan-400 px-4 py-2 rounded-lg shadow mb-6 tracking-tight border-2 border-teal-400">
                    전투 상세 정보
                </h1>
                <div className="flex items-center gap-8">
                    <div className="w-28 h-28 bg-gray-700 rounded-xl flex items-center justify-center shadow-lg border-4 border-teal-300">
                        <img
                            src={`/mode/${battle.gameMode}_icon.png`}
                            alt={battle.gameMode}
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-bold text-teal-400 bg-white/90 px-4 py-1 rounded shadow border border-dotted border-teal-300">
                            모드 : {modeKoMap[battle.gameMode] || battle.gameMode}
                        </span>
                        <span className="text-lg font-semibold text-cyan-600 bg-white/90 px-4 py-1 rounded shadow border border-dotted border-cyan-300">
                            맵 : {battle.map}
                        </span>
                        <span className="text-base font-medium text-gray-700 bg-white/90 px-4 py-1 rounded shadow border border-dotted border-gray-300">
                            {battle.battleTime?.split("T")[0]?.replace(/-/g, "/")}
                        </span>
                    </div>
                </div>
            </div>

            {/* SOLO SHOWDOWN */}
            {isSoloShowdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.participants!.map((player, idx) => (
                        <div key={player.tag} className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-teal-700">
                            <div className="flex items-center gap-4">
                                <Image src={getBrawlerImagePath(player.brawlerName)} alt={player.brawlerName} width={56} height={56} className="rounded-full border-2 border-teal-400 bg-gray-700" />
                                <div>
                                    <p className="font-bold text-lg text-teal-300">{player.name}</p>
                                    <p className="text-sm text-gray-300">{player.brawlerName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isDuoShowdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {duoTeams.map((team, idx) => (
                        <div key={idx} className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-cyan-700">
                            <h2 className="text-xl font-bold mb-4 text-cyan-300">듀오 팀 {idx + 1}</h2>
                            <div className="space-y-4">
                                {team.map((player) => (
                                    <div key={player.tag} className="flex items-center gap-4 bg-gray-900 rounded-lg p-3 shadow">
                                        <Image src={getBrawlerImagePath(player.brawlerName)} alt={player.brawlerName} width={48} height={48} className="rounded-full border border-cyan-400 bg-gray-700" />
                                        <div>
                                            <p className="font-semibold text-cyan-200">{player.name}</p>
                                            <p className="text-sm text-gray-300">{player.brawlerName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isDuels && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.teams!.map((team, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl shadow-xl border-2 ${team.winner
                                ? "bg-gradient-to-br from-blue-700 via-blue-900 to-blue-800 border-blue-400"
                                : "bg-gradient-to-br from-red-700 via-red-900 to-red-800 border-red-400"
                                }`}
                        >
                            <h2 className={`text-xl font-bold mb-4 ${team.winner ? "text-blue-200" : "text-red-200"}`}>
                                팀 {idx + 1} {team.winner ? '(승리)' : '(패배)'}
                            </h2>
                            <div className="space-y-4">
                                {team.players.map((player) => (
                                    <div key={player.tag} className="flex items-center gap-4 bg-gray-900 rounded-lg p-3 shadow">
                                        <Image src={getBrawlerImagePath(player.brawlerName)} alt={player.brawlerName} width={48} height={48} className="rounded-full border border-white bg-gray-700" />
                                        <div>
                                            <p className="font-semibold text-white">{player.name}</p>
                                            <p className="text-sm text-gray-300">{player.brawlerName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isSoloShowdown && !isDuoShowdown && !isDuels && hasTeams && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.teams!.map((team, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl shadow-xl border-2 ${team.winner
                                ? "bg-gradient-to-br from-blue-700 via-blue-900 to-blue-800 border-blue-400"
                                : "bg-gradient-to-br from-red-700 via-red-900 to-red-800 border-red-400"
                                }`}
                        >
                            <h2 className={`text-xl font-bold mb-4 ${team.winner ? "text-blue-200" : "text-red-200"}`}>
                                팀 {idx + 1} {team.winner ? '(승리)' : '(패배)'}
                            </h2>
                            <div className="space-y-4">
                                {team.players.map((player) => (
                                    <div key={player.tag} className="flex items-center gap-4 bg-gray-900 rounded-lg p-3 shadow">
                                        <Image src={getBrawlerImagePath(player.brawlerName)} alt={player.brawlerName} width={48} height={48} className="rounded-full border border-white bg-gray-700" />
                                        <div>
                                            <p className="font-semibold text-white">{player.name}</p>
                                            <p className="text-sm text-gray-300">{player.brawlerName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 참가자/팀 정보 없음 */}
            {!hasParticipants && !hasTeams && (
                <div className="text-center text-red-400 text-lg mt-8">
                    전투에 대한 참가자 정보를 찾을 수 없습니다.
                </div>
            )}
        </div>
    );
}
