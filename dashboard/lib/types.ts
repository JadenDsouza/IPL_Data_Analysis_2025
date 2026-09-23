export interface IplStats {
  overview: {
    totalMatches: number;
    totalDeliveries: number;
    seasons: number;
    teams: number;
    venues: number;
  };
  seasonSummary: { season: number; matches: number }[];
  teamPerformance: { team: string; played: number; wins: number; winPct: number }[];
  toss: {
    tossWinnerMatchWinPct: number;
    batFirstWinPct: number;
    fieldFirstWinPct: number;
    bySeason: { season: number; batFirstPct: number }[];
  };
  venues: { venue: string; matches: number; battingFirstWinPct: number }[];
  playerOfMatch: { player: string; awards: number }[];
  topBatsmen: {
    player: string;
    runs: number;
    balls: number;
    matches: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    average: number | null;
  }[];
  topBowlers: {
    player: string;
    wickets: number;
    matches: number;
    overs: number;
    runsConceded: number;
    economy: number;
  }[];
  phaseAnalysis: { phase: string; runRate: number; wickets: number; dotPct: number; boundaries: number }[];
  runDistribution: { runs: number; count: number }[];
  matchCharacteristics: {
    avgRunMargin: number;
    avgWicketMargin: number;
    closestRunWins: { season: number; teams: string; winner: string; margin: number }[];
    resultTypeCounts: { runs: number; wickets: number; noResult: number };
  };
}
