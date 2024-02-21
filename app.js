document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const scoresContainer = document.getElementById('scoresContainer');
    const playerInfoContainer = document.getElementById('playerInfoContainer');

    // Handle the search form submission
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();

        // Assuming you have an endpoint to search for players or teams
        fetch(`/search_player`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `player_name=${query}`
        })
        .then(response => response.json())
        .then(data => {
            // Assuming the data contains player_name and player_id
            if (data.error) {
                playerInfoContainer.innerHTML = `<div class="playerCard">Player not found.</div>`;
            } else {
                playerInfoContainer.innerHTML = `<div class="playerCard">${data.player_name} - ID: ${data.player_id}</div>`;
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Function to load scores for a specified date
    function loadScores(date) {
        fetch(`/game_scores/${date}`)
            .then(response => response.json())
            .then(data => {
                scoresContainer.innerHTML = ''; // Clear previous scores
                data.forEach(game => {
                    const scoreCard = `<div class="scoreCard">${game.MATCHUP}: ${game.PTS} - ${game.PTS_AGAINST}</div>`;
                    scoresContainer.innerHTML += scoreCard;
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Example: Load today's scores on page load
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    loadScores(today);
});
