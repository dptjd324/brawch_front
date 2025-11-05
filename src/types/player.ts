// types/player.ts

export type PlayerDto = {
  tag: string;
  name: string;
  nameColor: string;
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  expPoints: number;
  isQualifiedFromChampionshipChallenge: boolean;
  bestRoboRumbleTime: number;
  bestTimeAsBigBrawler: number;
  soloVictories: number;
  duoVictories: number;
  threeVsThreeVictories: number;

  icon: {
    id: number;
  };

  club?: {
    tag: string;
    name: string;
  };

  brawlers: {
    id: number;
    name: string;
    power: number;
    rank: number;
    trophies: number;
    highestTrophies: number;
    gears: {
      id: number;
      name: string;
      level: number;
    }[];
    starPowers: {
      id: number;
      name: string;
    }[];
    gadgets: {
      id: number;
      name: string;
    }[];
  }[];

  powerLeague?: {
    solo?: {
      trophies: number;
      rank: string;
    };
    team?: {
      trophies: number;
      rank: string;
    };
    season?: {
      id: string;
      startTime: string;
      endTime: string;
    };
  };
};
