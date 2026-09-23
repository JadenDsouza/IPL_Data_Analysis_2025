"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { IplStats } from "@/lib/types";

const INK_SECONDARY = "#52514e";
const GRID = "#e1e0d9";
const BASELINE = "#c3c2b7";
const SERIES = {
  1: "#2a78d6",
  2: "#eb6834",
  3: "#1baf7a",
  4: "#eda100",
  5: "#e87ba4",
  6: "#008300",
  7: "#4a3aa7",
  8: "#e34948",
};

const tooltipStyle = {
  background: "#fcfcfb",
  border: "1px solid rgba(11,11,11,0.1)",
  borderRadius: 8,
  fontSize: 12,
  color: "#0b0b0b",
};

const axisTick = { fill: INK_SECONDARY, fontSize: 12 };

export function SeasonMatchesChart({ data }: { data: IplStats["seasonSummary"] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="season" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={32} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(42,120,214,0.08)" }} />
        <Bar dataKey="matches" name="Matches" fill={SERIES[1]} radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TeamWinsChart({ data }: { data: IplStats["teamPerformance"] }) {
  const top = [...data].sort((a, b) => b.wins - a.wins).slice(0, 10);
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={top} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="team"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          width={170}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(42,120,214,0.08)" }}
          formatter={(value: number, name, props) => {
            if (name === "wins") {
              const pct = props.payload.winPct;
              return [`${value} wins (${pct}% of ${props.payload.played})`, "Wins"];
            }
            return [value, name];
          }}
        />
        <Bar dataKey="wins" name="wins" fill={SERIES[1]} radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TossTrendChart({ data }: { data: IplStats["toss"]["bySeason"] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="season" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          width={40}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number) => [`${value}%`, "Chose to bat first"]}
        />
        <Line
          type="monotone"
          dataKey="batFirstPct"
          name="Chose to bat first"
          stroke={SERIES[1]}
          strokeWidth={2}
          dot={{ r: 4, fill: SERIES[1] }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PhaseRunRateChart({ data }: { data: IplStats["phaseAnalysis"] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="phase" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={32} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toFixed(2), "Run rate"]} />
        <Bar dataKey="runRate" name="Run rate" radius={[4, 4, 0, 0]} maxBarSize={64}>
          {data.map((entry, i) => (
            <Cell key={entry.phase} fill={[SERIES[1], SERIES[3], SERIES[2]][i % 3]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PhaseDotPctChart({ data }: { data: IplStats["phaseAnalysis"] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="phase" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Dot balls"]} />
        <Bar dataKey="dotPct" name="Dot ball %" radius={[4, 4, 0, 0]} maxBarSize={64}>
          {data.map((entry, i) => (
            <Cell key={entry.phase} fill={[SERIES[1], SERIES[3], SERIES[2]][i % 3]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RunDistributionChart({ data }: { data: IplStats["runDistribution"] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="runs" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toLocaleString(), "Balls"]} />
        <Bar dataKey="count" name="Balls" fill={SERIES[3]} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ResultTypeChart({
  data,
}: {
  data: IplStats["matchCharacteristics"]["resultTypeCounts"];
}) {
  const rows = [
    { type: "Won by runs", value: data.runs },
    { type: "Won by wickets", value: data.wickets },
    { type: "No result", value: data.noResult },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="type" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={32} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" name="Matches" radius={[4, 4, 0, 0]} maxBarSize={64}>
          {rows.map((r, i) => (
            <Cell key={r.type} fill={[SERIES[1], SERIES[3], SERIES[4]][i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlayerOfMatchChart({ data }: { data: IplStats["playerOfMatch"] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
        <YAxis
          type="category"
          dataKey="player"
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, "Awards"]} />
        <Bar dataKey="awards" name="awards" fill={SERIES[7]} radius={[0, 4, 4, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
