'use client';

import Image from 'next/image';
import Link from "next/link";


const brawlerKoMap: { [key: string]: string } = {
    "shelly": "쉘리",
    "colt": "콜트",
    "bull": "불",
    "brock": "브록",
    "rico": "리코",
    "spike": "스파이크",
    "barley": "발리",
    "jessie": "제시",
    "nita": "니타",
    "dynamike": "다이너마이크",
    "elprimo": "엘 프리모",
    "mortis": "모티스",
    "crow": "크로우",
    "poco": "포코",
    "bo": "보",
    "piper": "파이퍼",
    "pam": "팸",
    "tara": "타라",
    "darryl": "대릴",
    "penny": "페니",
    "frank": "프랭크",
    "gene": "진",
    "tick": "틱",
    "leon": "레온",
    "rosa": "로사",
    "carl": "칼",
    "bibi": "비비",
    "8bit": "8비트",
    "sandy": "샌디",
    "bea": "비",
    "emz": "엠즈",
    "mrp": "미스터 P",
    "max": "맥스",
    "jacky": "재키",
    "gale": "게일",
    "nani": "나니",
    "sprout": "스프라우트",
    "surge": "서지",
    "colette": "콜레트",
    "amber": "앰버",
    "lou": "루",
    "byron": "바이런",
    "edgar": "에드거",
    "ruffs": "러프스",
    "stu": "스튜",
    "belle": "벨",
    "squeak": "스퀴크",
    "grom": "그롬",
    "buzz": "버즈",
    "griff": "그리프",
    "ash": "애쉬",
    "meg": "메그",
    "lola": "롤라",
    "fang": "팽",
    "eve": "이브",
    "janet": "자넷",
    "bonnie": "보니",
    "otis": "오티스",
    "sam": "샘",
    "gus": "거스",
    "buster": "버스터",
    "chester": "체스터",
    "gray": "그레이",
    "mandy": "맨디",
    "rt": "R-T",
    "willow": "윌로우",
    "maisie": "메이지",
    "hank": "행크",
    "cordelius": "코델리우스",
    "doug": "더그",
    "pearl": "펄",
    "chuck": "척",
    "charlie": "찰리",
    "mico": "미코",
    "kit": "키트",
    "larrylawrie": "래리 & 로리",
    "melodie": "멜로디",
    "angelo": "안젤로",
    "draco": "드라코",
    "lily": "릴리",
    "berry": "베리",
    "clancy": "클랜시",
    "moe": "모",
    "kenji": "켄지",
    "shade": "셰이드",
    "juju": "주주",
    "meeple": "미플",
    "ollie": "올리",
    "lumi": "루미",
    "finx": "핑크스",
    "jaeyong": "재용",
    "kaze": "카제",
    "trunk": "트렁크",
    "alli": "알리",
    "mina": "미나",
    "브롤러없음": "브롤러 없음"
};


function getBrawlerNameInKorean(name: string) {
    const normalizedName = normalizeBrawlerName(name);
    return brawlerKoMap[normalizedName] || name;
}

function normalizeBrawlerName(name: string): string {
    return name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}
function normalizeMode(mode: string): string {
    if (!mode) return "";
    const m = mode.toLowerCase().replace(/[^a-z]/g, ""); // 특수문자/대문자 제거
    if (m.includes("duo") && m.includes("showdown")) return "duoShowdown";
    if (m.includes("trio") && m.includes("showdown")) return "trioShowdown";
    if (m === "showdown") return "soloShowdown";
    return mode;
}
interface BattleDetailDto {
    battleTime: string;
    battleType: string;
    map: string;
    gameMode: string;
    teams?: {
        winner: boolean;
        rank: number;
        players: {
            name: string;
            tag: string;
            brawler: {
                id: number;
                name: string;
                power: number;
                trophies: number;
            };
            rank?: number;
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
        rank?: number;
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
function toNum(v: unknown, fallback = Infinity) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function getTeamRank(team: { rank?: number; players?: { rank?: number }[] }, fallback: number) {
    // 1순위: 팀 레벨 rank
    if (team.rank != null) return toNum(team.rank, fallback);
    // 2순위: 플레이어 레벨 rank(듀오/트리오면 팀원들이 같은 값)
    const pr = team.players?.[0]?.rank;
    if (pr != null) return toNum(pr, fallback);
    // 3순위: 인덱스 기반
    return fallback;
}

function formatBattleDate(dateString: string) {
    if (!dateString) return "날짜 정보 없음";

    if (dateString.includes("T")) {
        return dateString.split("T")[0].replace(/-/g, "/");
    }

    const match = dateString.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (match) {
        const [, year, month, day] = match;
        return `${year}/${month}/${day}`;
    }
    return dateString;
}

export default function BattleDetail({ battle }: { battle: BattleDetailDto }) {
    const hasParticipants = Array.isArray(battle.players) && battle.players.length > 0;
    const hasTeams = Array.isArray(battle.teams) && battle.teams.length > 0;
    const gameMode = normalizeMode(battle.gameMode);

    const isSoloShowdown = gameMode === "soloShowdown";
    const isDuoShowdown = gameMode === "duoShowdown";
    const isTrioShowdown = gameMode === "trioShowdown";
    const isDuels = gameMode === "duels" && battle.teams?.length === 2 && battle.teams[0].players.length === 3;
    console.log("DUO/TRIO teams:", battle.teams?.map(t => ({ rank: t.rank, players: t.players?.map(p => p.rank) })));

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
                            {modeKoMap[battle.gameMode] || battle.gameMode}
                        </span>
                        <span className="text-lg font-semibold text-cyan-600 bg-white/90 px-4 py-1 rounded shadow border border-dotted border-cyan-300">
                            {battle.map}
                        </span>
                        <span className="text-base font-medium text-gray-700 bg-white/90 px-4 py-1 rounded shadow border border-dotted border-gray-300">
                            {formatBattleDate(battle.battleTime)}
                        </span>

                    </div>
                </div>
            </div>

            {/*  스타 플레이어 */}
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
                            <span className="text-sm">{getBrawlerNameInKorean(battle.starPlayer.brawler.name)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* 3v3 팀 기반 모드 (듀오/트리오/듀얼 제외) */}
            {hasTeams && !(isDuoShowdown || isTrioShowdown || isDuels || isSoloShowdown) && (
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
                                팀 {idx + 1} {team.winner ? "(승리)" : "(패배)"}
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
                                            <p className="text-sm text-gray-300">{getBrawlerNameInKorean(player.brawler.name)}</p>
                                            <p className="text-sm text-gray-400">🏆: {player.brawler.trophies ?? "정보 없음"}</p>
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
                    {battle.players
                        .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                        .map((player, idx) => (
                            <div
                                key={player.tag}
                                className="p-6 rounded-2xl shadow-xl border-2 bg-gradient-to-br from-lime-700 via-lime-900 to-lime-800 border-lime-400"
                            >
                                <h2 className="text-xl font-bold mb-4 text-lime-200 text-center">
                                    {player.rank ?? idx + 1}위
                                </h2>

                                <div className="flex flex-col items-center">
                                    <Image
                                        src={getBrawlerImagePath(player.brawler.name)}
                                        alt={player.brawler.name}
                                        width={100}   // 크게 조정 (60→100)
                                        height={100}
                                        className="rounded-full border-4 border-white bg-gray-700 shadow-lg"
                                    />
                                    <Link
                                        href={`/players/${player.tag.replace('#', '')}`}
                                        className="text-white text-lg font-bold mt-3 hover:underline"
                                    >
                                        {player.name}
                                    </Link>
                                    <p className="text-base text-gray-200">{getBrawlerNameInKorean(player.brawler.name)}</p>
                                    <p className="text-sm text-gray-400 mt-0.5">🏆 {player.brawler.trophies}</p>
                                    <p className="text-sm text-gray-400 mt-0.5">파워: {player.brawler.power}</p>
                                </div>
                            </div>
                        ))}
                </div>
            )}





            {/* 듀오 쇼다운 */}
            {isDuoShowdown && battle.teams && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.teams
                        // 플레이어 레벨 rank 기준으로 팀 정렬
                        .sort((a, b) => (a.players?.[0]?.rank ?? 99) - (b.players?.[0]?.rank ?? 99))
                        .map((team, idx) => {
                            const rank = team.players?.[0]?.rank ?? idx + 1;
                            return (
                                <div
                                    key={idx}
                                    className="p-6 rounded-2xl shadow-xl border-2 bg-gradient-to-br from-lime-700 via-lime-900 to-lime-800 border-lime-400"
                                >
                                    <h2 className="text-xl font-bold mb-3 text-lime-200">
                                        {rank}위
                                    </h2>
                                    <div className="flex items-center justify-center gap-10"> {/* gap 6 → 10 으로 간격 확대 */}
                                        {team.players.map((player) => (
                                            <div key={player.tag} className="flex flex-col items-center">
                                                <Image
                                                    src={getBrawlerImagePath(player.brawler.name)}
                                                    alt={player.brawler.name}
                                                    width={90}  // 60 → 90
                                                    height={90} // 60 → 90
                                                    className="rounded-full border-4 border-white bg-gray-700 shadow-lg" // border 두께 + 그림자 추가
                                                />
                                                <Link
                                                    href={`/players/${player.tag.replace('#', '')}`}
                                                    className="text-white text-base font-bold mt-2 hover:underline" // text-sm → text-base, font-semibold → font-bold
                                                >
                                                    {player.name}
                                                </Link>
                                                <p className="text-sm text-gray-200">{getBrawlerNameInKorean(player.brawler.name)}</p> {/* text-xs → text-sm */}
                                                <p className="text-sm text-gray-400 mt-0.5">🏆 {player.brawler.trophies}</p> {/* text-xs → text-sm */}
                                                <p className="text-sm text-gray-400 mt-0.5">파워: {player.brawler.power}</p> {/* text-xs → text-sm */}

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            );
                        })}
                </div>
            )}
            {/* 트리오 쇼다운 */}
            {isTrioShowdown && battle.teams && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.teams
                        // 플레이어 레벨 rank 기준으로 팀 정렬
                        .sort((a, b) => (a.players?.[0]?.rank ?? 99) - (b.players?.[0]?.rank ?? 99))
                        .map((team, idx) => {
                            const rank = team.players?.[0]?.rank ?? idx + 1;
                            return (
                                <div
                                    key={idx}
                                    className="p-6 rounded-2xl shadow-xl border-2 bg-gradient-to-br from-indigo-700 via-indigo-900 to-indigo-800 border-indigo-400"
                                >
                                    <h2 className="text-xl font-bold mb-3 text-indigo-200">
                                        🥇 트리오 팀 — {rank}위
                                    </h2>
                                    <div className="flex flex-wrap justify-center gap-5">
                                        {team.players.map((player) => (
                                            <div key={player.tag} className="flex flex-col items-center">
                                                <Image
                                                    src={getBrawlerImagePath(player.brawler.name)}
                                                    alt={player.brawler.name}
                                                    width={56}
                                                    height={56}
                                                    className="rounded-full border-2 border-white bg-gray-700"
                                                />
                                                <Link
                                                    href={`/players/${player.tag.replace('#', '')}`}
                                                    className="text-white text-sm font-semibold mt-1 hover:underline"
                                                >
                                                    {player.name}
                                                </Link>
                                                <p className="text-xs text-gray-300">{getBrawlerNameInKorean(player.brawler.name)}</p>
                                                <p className="text-xs text-gray-400">🏆 {player.brawler.trophies}</p>
                                                <p className="text-xs text-gray-400">파워: {player.brawler.power}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}




            {/* 듀얼 모드  */}
            {isDuels && battle.teams && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {battle.teams.map((team, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl shadow-xl border-2 ${team.winner
                                ? "bg-gradient-to-br from-red-700 via-red-900 to-red-800 border-red-400"
                                : "bg-gradient-to-br from-gray-700 via-gray-900 to-gray-800 border-gray-600"
                                }`}
                        >
                            <h2 className={`text-xl font-bold mb-3 ${team.winner ? "text-red-200" : "text-gray-300"}`}>
                                듀얼 팀 {idx + 1} {team.winner ? "(승리)" : "(패배)"}
                            </h2>
                            <div className="flex flex-col gap-4">
                                {team.players.map((player, playerIdx) => (
                                    <div key={player.tag} className="flex items-center gap-4 bg-gray-900 rounded-lg p-3">
                                        <div className="w-8 text-center font-bold text-sm text-gray-400">{playerIdx + 1}번</div>
                                        <Image
                                            src={getBrawlerImagePath(player.brawler.name)}
                                            alt={player.brawler.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full border border-white bg-gray-700"
                                        />
                                        <div>
                                            <Link href={`/players/${player.tag.replace('#', '')}`} className="text-white font-semibold hover:underline">
                                                {player.name}
                                            </Link>
                                            <p className="text-sm text-gray-300">{getBrawlerNameInKorean(player.brawler.name)}</p>
                                            <p className="text-xs text-gray-400">🏆 {player.brawler.trophies} | Power {player.brawler.power}</p>
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
