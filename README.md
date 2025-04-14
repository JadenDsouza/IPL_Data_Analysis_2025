# IPL_Data_Analysis_2025
# Cricket Data Analysis

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
