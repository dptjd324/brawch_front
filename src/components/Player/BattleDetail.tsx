'use client';

import Image from 'next/image';
import Link from "next/link";

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
            brawler: {
                id: number;
                name: string;
                power: number;
                trophies: number;
            };
        }[];
    }[];
    players?: {
        name: string;
        tag: string;
        brawler: {
            id: number;
            name: string;
            power: number;
            trophies: number;
        };
    }[];
    starPlayer?: {
        name: string;
        tag: string;
        brawler: {
            id: number;
            name: string;
            power: number;
            trophies: number;
        };
    };
    event?: {
        map: string;
        mode: string;
    };
}

const modeKoMap: { [key: string]: string } = {
    gemGrab: "젬 그랩",
    showdown: "솔로 쇼다운",
    duoShowdown: "듀오 쇼다운",
    trioShowdown: "트리오 쇼다운",
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
    const hasParticipants = Array.isArray(battle.players) && battle.players.length > 0;
    const hasTeams = Array.isArray(battle.teams) && battle.teams.length > 0;

    const isSoloShowdown = battle.gameMode === "soloShowdown" && Array.isArray(battle.players) && battle.players.length === 10;
    const isDuoShowdown = battle.gameMode === "duoShowdown" && battle.teams?.length === 6;
    const isDuels = battle.gameMode === "duels" && battle.teams?.length === 2 && battle.teams[0].players.length === 3;

    return (
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white space-y-10">
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

            {/* ⭐ 스타 플레이어 */}
            {battle.starPlayer && (
                <div className="mt-6 flex flex-col items-center bg-yellow-400/90 text-gray-900 p-4 rounded-xl shadow-lg border-2 border-yellow-500 w-fit mx-auto">
                    <h2 className="text-xl font-extrabold mb-2">⭐ 스타 플레이어</h2>
                    <div className="flex items-center gap-4">
                        <Image
                            src={getBrawlerImagePath(battle.starPlayer.brawler.name)}
                            alt={battle.starPlayer.brawler.name}
                            width={64}
                            height={64}
                            className="rounded-full border-4 border-yellow-600 bg-gray-700"
                        />
                        <div className="flex flex-col text-center">
                            <Link
                                href={`/players/${battle.starPlayer.tag.replace('#', '')}`}
                                className="font-bold text-lg hover:underline"
                            >
                                {battle.starPlayer.name}
                            </Link>
                            <span className="text-sm">{battle.starPlayer.brawler.name}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 팀 기반 모드 */}
            {hasTeams && (
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
                                        <Image
                                            src={getBrawlerImagePath(player.brawler.name)}
                                            alt={player.brawler.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full border border-white bg-gray-700"
                                        />
                                        <div>
                                            <p className="font-semibold text-white">
                                                <Link href={`/players/${player.tag.replace('#', '')}`} className="hover:underline cursor-pointer">
                                                    {player.name}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-300">{player.brawler.name}</p>
                                            <p className="text-sm text-gray-400">트로피: {player.brawler.trophies ?? "정보 없음"}</p>
                                            <p className="text-sm text-gray-400">파워: {player.brawler.power ?? "정보 없음"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 솔로 쇼다운 */}
            {isSoloShowdown && battle.players && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.players.map((player, idx) => (
                        <div key={player.tag} className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-teal-700">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={getBrawlerImagePath(player.brawler.name)}
                                    alt={player.brawler.name}
                                    width={56}
                                    height={56}
                                    className="rounded-full border-2 border-teal-400 bg-gray-700"
                                />
                                <div>
                                    <p className="font-bold text-lg text-teal-300">
                                        <Link href={`/players/${player.tag.replace('#', '')}`} className="hover:underline">
                                            {player.name}
                                        </Link>
                                        <span className="text-sm text-gray-400"> ({idx + 1}위)</span>
                                    </p>
                                    <p className="text-sm text-gray-300">{player.brawler.name}</p>
                                    <p className="text-sm text-gray-400">🏆 {player.brawler.trophies}</p>
                                    <p className="text-sm text-gray-400">Power {player.brawler.power}</p>
                                </div>
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
