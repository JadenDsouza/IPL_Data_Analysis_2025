# IPL_Deliveries_Data_Analysis_2025


## Project Overview
This project provides a comprehensive framework for analyzing cricket match data. It breaks down the process of cricket data analysis into distinct steps, focusing on different aspects of the game such as match progression, batting and bowling statistics, partnerships, and team performance.

## Data Format
The analysis expects ball-by-ball cricket match data in the following format:

| Column | Description |
|--------|-------------|
| `match_id` | Unique identifier for the match |
| `inning` | Batting inning number |
| `batting_team` | Name of the team batting |
| `bowling_team` | Name of the team bowling |
| `over` | Over number |
| `ball` | Ball number within the over |
| `batter` | Name of the batsman |
| `bowler` | Name of the bowler |
| `non_striker` | Name of the non-striking batsman |
| `batsman_runs` | Runs scored by the batsman |
| `extra_runs` | Additional runs from extras |
| `total_runs` | Total runs from the delivery |
| `extras_type` | Type of extra (wides, legbyes, etc.) |
| `is_wicket` | Boolean indicating if a wicket fell (1=yes, 0=no) |
| `player_dismissed` | Name of the dismissed player, if any |
| `dismissal_kind` | Type of dismissal (bowled, caught, etc.) |
| `fielder` | Name of the fielder involved in the dismissal, if any |

## Analysis Components

### 1. Match Progression Analysis
- Analyzes how runs accumulate over the course of a match
- Tracks the progression of runs and wickets by over
- Visualizes the run rate trajectory for different innings

### 2. Wicket Analysis
- Examines the distribution of wickets across overs
- Analyzes different types of dismissals
- Identifies when wickets are most likely to fall

### 3. Partnership Analysis
- Tracks batting partnerships throughout the match
- Calculates partnership runs, balls, and run rates
- Identifies key partnerships that influenced match outcomes

### 4. Run Distribution Analysis
- Analyzes the frequency of different run outcomes
- Creates Manhattan charts showing runs by over
- Calculates dot ball and boundary percentages

### 5. Player Performance Analysis
- Evaluates batting performances (average, strike rate, boundaries)
- Assesses bowling performances (economy, average, strike rate)
- Visualizes player performance comparisons

### 6. Match-up Analysis
- Examines specific batsman vs. bowler encounters
- Identifies dominant matchups in either direction
- Calculates head-to-head statistics

### 7. Team Performance Analysis
- Compares batting and bowling metrics across teams
- Evaluates team strategies through run rates and boundary percentages
- Identifies team strengths and weaknesses

## Usage Instructions

1. **Setup Environment**:
   - Install Python 3.x and required packages:
     ```
     pip install pandas numpy matplotlib seaborn
     ```

2. **Data Preparation**:
   - Ensure your data follows the format described above
   - Load your data into a pandas DataFrame named `cricket_df`

3. **Running the Analysis**:
   - Execute each analysis module independently
   - Adjust parameters as needed for your specific dataset
   - Visualize results through the included plotting functions

4. **Interpreting Results**:
   - Match Progression: Identify key phases where momentum shifted
   - Wicket Analysis: Understand when teams are most vulnerable
   - Partnership Analysis: Evaluate which partnerships were most impactful
   - Player Analysis: Identify top performers and their specific strengths
   - Team Analysis: Compare team strategies and effectiveness

## Example Workflow

```python
# Load data
import pandas as pd
cricket_df = pd.read_csv('deliveries.csv')

# Run match progression analysis
# [Copy code from Match Progression Analysis section]

# Run player performance analysis
# [Copy code from Player Performance Analysis section]

# And so on for other analysis components...
```

## Extending the Analysis

This framework can be extended in several ways:
- Add win probability modeling
- Incorporate fielding performance metrics
- Implement predictive models for match outcomes
- Add player career progression tracking
- Develop optimal team composition suggestions

## Notes
- The analysis is designed to work with IPL (Indian Premier League) data but can be adapted for other cricket formats
- For T20 cricket, some metrics may need adjustment for longer formats like ODIs or Test matches
- Visualizations can be saved to files by adding `plt.savefig('filename.png')` before `plt.show()`

# IPL_Matches_Data_Analysis

## Overview

This repository contains a comprehensive analysis of the Indian Premier League (IPL) cricket matches. The analysis covers team performance, venue statistics, player achievements, and various strategic aspects of the game like toss impact and batting order advantages.

## Dataset

The dataset contains detailed information about IPL matches including:

- Match identifiers and seasons
- Teams, venues, and cities
- Match results and margins
- Toss details (winner and decision)
- Player of the match awards
- Umpire information

## Analysis Components

### 1. Basic Statistics

- Season-wise match distribution
- Result types (runs vs. wickets)
- City and venue analysis

### 2. Team Performance Analysis

- Win counts and percentages for all teams
- Season-by-season team performance tracking
- Home vs. away performance patterns

### 3. Toss Analysis

- Impact of winning the toss on match outcome
- Effectiveness of batting vs. fielding first decisions
- Evolution of toss strategies across seasons

### 4. Venue Analysis

- High-scoring vs. low-scoring venues
- Venue-specific advantages (batting/fielding first)
- Clustering of venues with similar characteristics

### 5. Player Analysis

- Top performers based on Player of the Match awards
- Consistency metrics across seasons
- Specialized performance by role

### 6. Match Characteristics

- Analysis of winning margins
- Close matches and last-ball finishes
- High-scoring games

### 7. Time Series Analysis

- Scoring trend evolution
- Strategic shifts over different IPL eras
- Team performance trajectories

### 8. Advanced Analysis

- Venue clustering using K-means
- Predictive modeling for match outcomes
- Feature importance ranking

## Requirements

- Python 3.7+
- pandas
- numpy
- matplotlib
- seaborn
- scikit-learn

## Installation

```bash
pip install pandas numpy matplotlib seaborn scikit-learn
```

## Usage

```python
import pandas as pd
from ipl_analysis import run_complete_analysis

# Load your IPL dataset
df = pd.read_csv('matches.csv')

# Run the analysis
results = run_complete_analysis(df)

# Access specific results
team_performance = results["team_performance"]
venue_analysis = results["venue_analysis"]
```

## Key Functions

- `basic_stats(df)`: Generates foundational dataset statistics
- `team_performance_analysis(df)`: Analyzes win patterns by team
- `toss_analysis(df)`: Examines the impact of the coin toss
- `venue_analysis(df)`: Studies ground characteristics and advantages
- `player_analysis(df)`: Identifies top-performing players
- `match_characteristics(df)`: Analyzes match result patterns
- `time_series_analysis(df)`: Tracks trends over multiple seasons
- `cluster_venues(df)`: Groups similar venues using machine learning
- `build_predictive_model(df)`: Creates a match outcome prediction model
- `create_visualizations(df, ...)`: Generates key data visualizations

## Visualizations

The analysis produces several visualizations:

1. Team performance charts
2. Toss impact analysis
3. Venue characteristic plots
4. Player performance graphs
5. Season trend analysis
6. Predictive feature importance

## Extending the Analysis

This framework can be extended in several ways:

1. Incorporate ball-by-ball data for deeper analysis
2. Add player statistics beyond Player of the Match awards
3. Include external factors like weather conditions
4. Implement more advanced predictive models
5. Create an interactive dashboard using tools like Dash or Streamlit

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

