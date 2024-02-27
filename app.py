from flask import Flask, render_template, request, jsonify
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats
from nba_api.live.nba.endpoints import scoreboard

app = Flask(__name__)

# Function to find player ID by name
def find_player_id_by_name(player_name):
    all_players = players.get_players()
    player = [player for player in all_players if player['full_name'].lower() == player_name.lower()]
    return player[0]['id'] if player else None

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle player search and display career stats
@app.route('/search', methods=['POST'])
def search():
    player_name = request.form['playerName']
    player_id = find_player_id_by_name(player_name)
    
    if player_id:
        career_stats = playercareerstats.PlayerCareerStats(player_id=player_id)
        career_data = career_stats.get_data_frames()[0]  # pandas data frame
        return render_template('results.html', player_name=player_name, career_data=career_data.to_dict('records'))
    else:
        error_message = f"No player found with the name {player_name}. Please try again."
        return render_template('index.html', error_message=error_message)

# Route to display live NBA game scores
@app.route('/live_scores')
def live_scores():
    live_games = scoreboard.ScoreBoard()
    live_scores_data = live_games.get_dict()
    return render_template('live_scores.html', live_scores=live_scores_data['gameHeader'])

if __name__ == '__main__':
    app.run(debug=True)
