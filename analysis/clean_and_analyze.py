"""
IPL data cleaning + analysis pipeline.

Reads the raw matches.csv / deliveries.csv (ball-by-ball IPL data, 2008-2019,
sourced from the public Kaggle "IPL Complete Dataset"), cleans them, computes
the metrics described in README.md, and writes the results to JSON files
that the dashboard (in ../dashboard) reads as static data.

Run: python3 analysis/clean_and_analyze.py
"""
import json
import os

import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUT_DIR = os.path.join(BASE_DIR, "..", "dashboard", "public", "data")


def load_and_clean():
    matches = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
    deliveries = pd.read_csv(os.path.join(DATA_DIR, "deliveries.csv"))

    # --- matches.csv cleanup ---
    matches["season"] = matches["Season"].str.replace("IPL-", "", regex=False).astype(int)
    matches["date"] = pd.to_datetime(matches["date"], format="mixed", dayfirst=False)
    matches["city"] = matches["city"].fillna("Unknown")
    matches["winner"] = matches["winner"].fillna("No Result")
    matches["player_of_match"] = matches["player_of_match"].fillna("Not Awarded")
    matches["umpire3"] = matches["umpire3"].fillna("None")
    # normalise a couple of team names that changed over the years
    rename_map = {
        "Delhi Daredevils": "Delhi Capitals",
        "Deccan Chargers": "Sunrisers Hyderabad",
        "Rising Pune Supergiant": "Rising Pune Supergiants",
    }
    for col in ["team1", "team2", "toss_winner", "winner"]:
        matches[col] = matches[col].replace(rename_map)

    # a single "win_margin_type"/"win_margin" pair, mirroring the newer
    # dataset's result/result_margin columns used elsewhere in the repo
    matches["result_margin"] = np.where(
        matches["win_by_runs"] > 0, matches["win_by_runs"], matches["win_by_wickets"]
    )

    # --- deliveries.csv cleanup ---
    for col in ["batsman_runs", "extra_runs", "total_runs", "over", "ball", "inning"]:
        deliveries[col] = deliveries[col].astype(int)
    deliveries["is_wicket"] = deliveries["player_dismissed"].notna().astype(int)
    deliveries["player_dismissed"] = deliveries["player_dismissed"].fillna("")
    deliveries["dismissal_kind"] = deliveries["dismissal_kind"].fillna("none")
    deliveries["fielder"] = deliveries["fielder"].fillna("")

    def extras_type(row):
        if row["wide_runs"] > 0:
            return "wides"
        if row["noball_runs"] > 0:
            return "noballs"
        if row["legbye_runs"] > 0:
            return "legbyes"
        if row["bye_runs"] > 0:
            return "byes"
        if row["penalty_runs"] > 0:
            return "penalty"
        return "none"

    deliveries["extras_type"] = deliveries.apply(extras_type, axis=1)
    deliveries["is_four"] = (deliveries["batsman_runs"] == 4).astype(int)
    deliveries["is_six"] = (deliveries["batsman_runs"] == 6).astype(int)
    deliveries["is_dot"] = (
        (deliveries["batsman_runs"] == 0) & (deliveries["extras_type"] == "none")
    ).astype(int)

    conditions = [
        deliveries["over"] <= 6,
        (deliveries["over"] > 6) & (deliveries["over"] <= 15),
        deliveries["over"] > 15,
    ]
    deliveries["phase"] = np.select(conditions, ["Powerplay", "Middle", "Death"], default="Unknown")

    # drop obviously broken rows: an over must be 1-20, a ball 1-9 (extras can push past 6)
    deliveries = deliveries[(deliveries["over"].between(1, 20)) & (deliveries["ball"].between(1, 9))]

    return matches, deliveries


def season_summary(matches):
    counts = matches["season"].value_counts().sort_index()
    return [{"season": int(s), "matches": int(c)} for s, c in counts.items()]


def team_performance(matches):
    wins = matches["winner"].value_counts()
    played = pd.concat([matches["team1"], matches["team2"]]).value_counts()
    win_pct = (wins / played * 100).fillna(0).sort_values(ascending=False)
    out = []
    for team in played.index:
        out.append(
            {
                "team": team,
                "played": int(played[team]),
                "wins": int(wins.get(team, 0)),
                "winPct": round(float(win_pct.get(team, 0)), 1),
            }
        )
    out.sort(key=lambda r: (-r["wins"], r["team"]))
    return out


def toss_analysis(matches):
    valid = matches[matches["winner"] != "No Result"]
    toss_wins_match = (valid["toss_winner"] == valid["winner"]).mean() * 100

    def decision_win_rate(decision):
        subset = valid[valid["toss_decision"] == decision]
        if len(subset) == 0:
            return 0.0
        return float((subset["toss_winner"] == subset["winner"]).mean() * 100)

    by_season = (
        valid.groupby(["season", "toss_decision"]).size().unstack(fill_value=0)
    )
    for col in ["bat", "field"]:
        if col not in by_season.columns:
            by_season[col] = 0
    by_season["bat_pct"] = by_season["bat"] / (by_season["bat"] + by_season["field"]) * 100

    return {
        "tossWinnerMatchWinPct": round(float(toss_wins_match), 1),
        "batFirstWinPct": round(decision_win_rate("bat"), 1),
        "fieldFirstWinPct": round(decision_win_rate("field"), 1),
        "bySeason": [
            {"season": int(s), "batFirstPct": round(float(r["bat_pct"]), 1)}
            for s, r in by_season.iterrows()
        ],
    }


def venue_analysis(matches):
    counts = matches["venue"].value_counts()
    out = []
    for venue, n in counts.items():
        if n < 5:
            continue
        subset = matches[matches["venue"] == venue]
        bat_first_wins = subset[
            ((subset["toss_decision"] == "bat") & (subset["toss_winner"] == subset["winner"]))
            | ((subset["toss_decision"] == "field") & (subset["toss_winner"] != subset["winner"]))
        ]
        bat_first_pct = len(bat_first_wins) / len(subset) * 100
        out.append(
            {
                "venue": venue,
                "matches": int(n),
                "battingFirstWinPct": round(float(bat_first_pct), 1),
            }
        )
    out.sort(key=lambda r: -r["matches"])
    return out[:15]


def player_of_match(matches):
    counts = matches["player_of_match"].value_counts()
    counts = counts[counts.index != "Not Awarded"].head(10)
    return [{"player": p, "awards": int(c)} for p, c in counts.items()]


def batting_leaders(deliveries):
    grouped = deliveries.groupby("batsman").agg(
        runs=("batsman_runs", "sum"),
        balls=("batsman_runs", "count"),
        fours=("is_four", "sum"),
        sixes=("is_six", "sum"),
        dismissals=("is_wicket", "sum"),
        matches=("match_id", "nunique"),
    )
    grouped = grouped[grouped["balls"] >= 200]
    grouped["strikeRate"] = (grouped["runs"] / grouped["balls"] * 100).round(1)
    grouped["average"] = (grouped["runs"] / grouped["dismissals"].replace(0, np.nan)).round(1)
    top = grouped.sort_values("runs", ascending=False).head(15).reset_index()
    return [
        {
            "player": r["batsman"],
            "runs": int(r["runs"]),
            "balls": int(r["balls"]),
            "matches": int(r["matches"]),
            "fours": int(r["fours"]),
            "sixes": int(r["sixes"]),
            "strikeRate": float(r["strikeRate"]),
            "average": None if pd.isna(r["average"]) else float(r["average"]),
        }
        for _, r in top.iterrows()
    ]


def bowling_leaders(deliveries):
    grouped = deliveries.groupby("bowler").agg(
        runsConceded=("total_runs", "sum"),
        wickets=("is_wicket", "sum"),
        balls=("total_runs", "count"),
        matches=("match_id", "nunique"),
    )
    grouped = grouped[grouped["balls"] >= 120]
    grouped["overs"] = grouped["balls"] / 6
    grouped["economy"] = (grouped["runsConceded"] / grouped["overs"]).round(2)
    top = grouped.sort_values("wickets", ascending=False).head(15).reset_index()
    return [
        {
            "player": r["bowler"],
            "wickets": int(r["wickets"]),
            "matches": int(r["matches"]),
            "overs": round(float(r["overs"]), 1),
            "runsConceded": int(r["runsConceded"]),
            "economy": float(r["economy"]),
        }
        for _, r in top.iterrows()
    ]


def phase_analysis(deliveries):
    grouped = deliveries.groupby("phase").agg(
        runs=("total_runs", "sum"),
        balls=("total_runs", "count"),
        wickets=("is_wicket", "sum"),
        dots=("is_dot", "sum"),
        boundaries=("is_four", "sum"),
    )
    grouped["sixes"] = deliveries.groupby("phase")["is_six"].sum()
    grouped["boundaries"] = grouped["boundaries"] + grouped["sixes"]
    grouped["runRate"] = (grouped["runs"] / grouped["balls"] * 6).round(2)
    grouped["dotPct"] = (grouped["dots"] / grouped["balls"] * 100).round(1)
    order = ["Powerplay", "Middle", "Death"]
    return [
        {
            "phase": phase,
            "runRate": float(grouped.loc[phase, "runRate"]),
            "wickets": int(grouped.loc[phase, "wickets"]),
            "dotPct": float(grouped.loc[phase, "dotPct"]),
            "boundaries": int(grouped.loc[phase, "boundaries"]),
        }
        for phase in order
        if phase in grouped.index
    ]


def run_distribution(deliveries):
    counts = deliveries["total_runs"].value_counts().sort_index()
    return [{"runs": int(r), "count": int(c)} for r, c in counts.items() if r <= 7]


def match_characteristics(matches):
    runs_wins = matches[matches["win_by_runs"] > 0]
    wicket_wins = matches[matches["win_by_wickets"] > 0]
    return {
        "avgRunMargin": round(float(runs_wins["win_by_runs"].mean()), 1),
        "avgWicketMargin": round(float(wicket_wins["win_by_wickets"].mean()), 1),
        "closestRunWins": [
            {
                "season": int(r["season"]),
                "teams": f"{r['team1']} vs {r['team2']}",
                "winner": r["winner"],
                "margin": int(r["win_by_runs"]),
            }
            for _, r in runs_wins.sort_values("win_by_runs").head(5).iterrows()
        ],
        "resultTypeCounts": {
            "runs": int((matches["win_by_runs"] > 0).sum()),
            "wickets": int((matches["win_by_wickets"] > 0).sum()),
            "noResult": int((matches["winner"] == "No Result").sum()),
        },
    }


def main():
    matches, deliveries = load_and_clean()
    os.makedirs(OUT_DIR, exist_ok=True)

    payload = {
        "overview": {
            "totalMatches": int(len(matches)),
            "totalDeliveries": int(len(deliveries)),
            "seasons": int(matches["season"].nunique()),
            "teams": int(pd.concat([matches["team1"], matches["team2"]]).nunique()),
            "venues": int(matches["venue"].nunique()),
        },
        "seasonSummary": season_summary(matches),
        "teamPerformance": team_performance(matches),
        "toss": toss_analysis(matches),
        "venues": venue_analysis(matches),
        "playerOfMatch": player_of_match(matches),
        "topBatsmen": batting_leaders(deliveries),
        "topBowlers": bowling_leaders(deliveries),
        "phaseAnalysis": phase_analysis(deliveries),
        "runDistribution": run_distribution(deliveries),
        "matchCharacteristics": match_characteristics(matches),
    }

    out_path = os.path.join(OUT_DIR, "ipl_stats.json")
    with open(out_path, "w") as f:
        json.dump(payload, f, indent=2)
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
