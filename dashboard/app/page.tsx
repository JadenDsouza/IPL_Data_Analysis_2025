import { promises as fs } from "fs";
import path from "path";
import { StatTile } from "@/components/StatTile";
import { DataTable } from "@/components/DataTable";
import {
  SeasonMatchesChart,
  TeamWinsChart,
  TossTrendChart,
  PhaseRunRateChart,
  PhaseDotPctChart,
  RunDistributionChart,
  ResultTypeChart,
  PlayerOfMatchChart,
} from "@/components/Charts";
import type { IplStats } from "@/lib/types";

async function getStats(): Promise<IplStats> {
  const filePath = path.join(process.cwd(), "public", "data", "ipl_stats.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-[#52514e] dark:text-[#c3c2b7]">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default async function Home() {
  const stats = await getStats();
  const { overview } = stats;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">IPL Data Analysis Dashboard</h1>
        <p className="text-sm text-[#52514e] dark:text-[#c3c2b7]">
          Cleaned ball-by-ball and match data, {stats.seasonSummary[0].season}–
          {stats.seasonSummary[stats.seasonSummary.length - 1].season}.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatTile label="Matches" value={overview.totalMatches.toLocaleString()} />
        <StatTile label="Deliveries" value={overview.totalDeliveries.toLocaleString()} />
        <StatTile label="Seasons" value={overview.seasons} />
        <StatTile label="Teams" value={overview.teams} />
        <StatTile label="Venues" value={overview.venues} />
      </div>

      <Section title="Matches per season" subtitle="Number of matches played each IPL season">
        <div className="card p-4">
          <SeasonMatchesChart data={stats.seasonSummary} />
        </div>
      </Section>

      <Section title="Team performance" subtitle="Total wins by team, hover for win % of matches played">
        <div className="card p-4">
          <TeamWinsChart data={stats.teamPerformance} />
        </div>
      </Section>

      <Section
        title="Toss impact"
        subtitle={`Toss winners win the match ${stats.toss.tossWinnerMatchWinPct}% of the time · batting first wins ${stats.toss.batFirstWinPct}% · fielding first wins ${stats.toss.fieldFirstWinPct}%`}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Share of teams choosing to bat first, by season</h3>
            <TossTrendChart data={stats.toss.bySeason} />
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Top venues by matches hosted</h3>
            <DataTable
              columns={[
                { key: "venue", label: "Venue" },
                { key: "matches", label: "Matches", align: "right" },
                { key: "battingFirstWinPct", label: "Bat-first win %", align: "right" },
              ]}
              rows={stats.venues.slice(0, 8).map((v) => ({
                venue: v.venue,
                matches: v.matches,
                battingFirstWinPct: `${v.battingFirstWinPct}%`,
              }))}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Phase analysis"
        subtitle="Powerplay (1-6), Middle (7-15) and Death (16-20) overs"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Run rate by phase</h3>
            <PhaseRunRateChart data={stats.phaseAnalysis} />
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Dot-ball % by phase</h3>
            <PhaseDotPctChart data={stats.phaseAnalysis} />
          </div>
        </div>
      </Section>

      <Section title="Runs per ball" subtitle="Distribution of runs scored off a single delivery">
        <div className="card p-4">
          <RunDistributionChart data={stats.runDistribution} />
        </div>
      </Section>

      <Section
        title="Top run-scorers"
        subtitle="Minimum 200 balls faced, sorted by career runs"
      >
        <div className="card p-4">
          <DataTable
            columns={[
              { key: "player", label: "Player" },
              { key: "matches", label: "Matches", align: "right" },
              { key: "runs", label: "Runs", align: "right" },
              { key: "average", label: "Average", align: "right" },
              { key: "strikeRate", label: "Strike rate", align: "right" },
              { key: "fours", label: "4s", align: "right" },
              { key: "sixes", label: "6s", align: "right" },
            ]}
            rows={stats.topBatsmen.map((b) => ({
              player: b.player,
              matches: b.matches,
              runs: b.runs,
              average: b.average ?? "-",
              strikeRate: b.strikeRate,
              fours: b.fours,
              sixes: b.sixes,
            }))}
          />
        </div>
      </Section>

      <Section
        title="Top wicket-takers"
        subtitle="Minimum 120 balls bowled, sorted by career wickets"
      >
        <div className="card p-4">
          <DataTable
            columns={[
              { key: "player", label: "Player" },
              { key: "matches", label: "Matches", align: "right" },
              { key: "wickets", label: "Wickets", align: "right" },
              { key: "overs", label: "Overs", align: "right" },
              { key: "economy", label: "Economy", align: "right" },
            ]}
            rows={stats.topBowlers.map((b) => ({
              player: b.player,
              matches: b.matches,
              wickets: b.wickets,
              overs: b.overs,
              economy: b.economy,
            }))}
          />
        </div>
      </Section>

      <Section title="Player of the Match" subtitle="Most awards won, all seasons combined">
        <div className="card p-4">
          <PlayerOfMatchChart data={stats.playerOfMatch} />
        </div>
      </Section>

      <Section
        title="Match characteristics"
        subtitle={`Avg. margin when won by runs: ${stats.matchCharacteristics.avgRunMargin} runs · when won by wickets: ${stats.matchCharacteristics.avgWicketMargin} wickets`}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Result type</h3>
            <ResultTypeChart data={stats.matchCharacteristics.resultTypeCounts} />
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Closest wins by runs</h3>
            <DataTable
              columns={[
                { key: "season", label: "Season", align: "right" },
                { key: "teams", label: "Match" },
                { key: "winner", label: "Winner" },
                { key: "margin", label: "Margin", align: "right" },
              ]}
              rows={stats.matchCharacteristics.closestRunWins.map((r) => ({
                season: r.season,
                teams: r.teams,
                winner: r.winner,
                margin: `${r.margin} run${r.margin === 1 ? "" : "s"}`,
              }))}
            />
          </div>
        </div>
      </Section>

      <footer className="text-xs text-[#898781] pb-8">
        Data: ball-by-ball IPL matches 2008–2019. Cleaned and aggregated with{" "}
        <code>analysis/clean_and_analyze.py</code>.
      </footer>
    </main>
  );
}
