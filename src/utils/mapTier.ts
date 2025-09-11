export interface MapBrawlerTier {
  eventId: number;
  eventMode?: string | null;
  battleType?: string | null;

  brawlerId: number;
  brawlerName: string | null;
  imageUrl: string | null;

  picks: number;
  wins: number;
  losses: number;

  winRate: number;   
  pickRate: number;  
  wilsonLower: number;

  score: number;     
  tier: string;      
  rank: number;  
}