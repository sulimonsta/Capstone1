from flask import Flask, jsonify, request
from nba_api.stats.endpoints import playercareerstats, leaguegamefinder, commonallplayers
import datetime

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/player_stats/<player_id>')
def get_player_stats(player_id):
    # Retrieve career stats for the specified player
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    player_stats = career.get_data_frames()[0].to_dict(orient='records')
    return jsonify(player_stats)

@app.route('/search_player', methods=['POST'])
def search_player():
    player_name = request.form['player_name']
    
    # Search for the player's ID based on their name
    players = commonallplayers.CommonAllPlayers(is_only_current_season=1)
    players_data = players.get_data_frames()[0]
    player = players_data[players_data['DISPLAY_FIRST_LAST'].str.lower() == player_name.lower()]

    if not player.empty:
        player_id = player.iloc[0]['PERSON_ID']
        return jsonify({'player_name': player_name, 'player_id': player_id})
    else:
        return jsonify({'error': 'Player not found'})

@app.route('/game_scores/<date>')
def get_game_scores(date):
    # Convert date to datetime object
    date_obj = datetime.datetime.strptime(date, '%Y-%m-%d').date()
    # Use LeagueGameFinder to query games on the specified date
    games = leaguegamefinder.LeagueGameFinder(date_from_nullable=date_obj, date_to_nullable=date_obj)
    games_data = games.get_data_frames()[0]
    # Filter out games that have not yet played
    completed_games = games_data[games_data['WL'].notnull()]
    game_scores = completed_games[['GAME_DATE', 'MATCHUP', 'WL', 'PTS', 'PTS_AGAINST']].to_dict(orient='records')
    return jsonify(game_scores)

if __name__ == '__main__':
    app.run(debug=True)
