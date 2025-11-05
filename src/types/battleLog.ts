// types/battleLog.ts

export type BattleLogSimpleDto = {
  battleTime: string;
  map: string;
  gameMode: string;
  battleType: string;
  trophyChange: number;
  result: string;
  rank?: number;

  starPlayer?: {
    name: string;
    tag: string;
    brawlerName: string;
  };

  teams?: {
    winner: boolean;
    players: {
      name: string;
      tag: string;
      brawlerName: string;
      trophies: number;
      power: number;
    }[];
  }[];

  players?: {
    name: string;
    tag: string;
    brawlerName: string;
    trophies: number;
    power: number;
  }[];
};
