document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const playerResultsContainer = document.getElementById('playerResults');
    const liveScoresButton = document.getElementById('liveScoresButton');
    const liveScoresContainer = document.getElementById('liveScores');

    // Handle the search form submission to search for players
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const playerName = searchInput.value.trim();
        if (playerName) {
            
            // Note: Flask route '/search' expects a POST request with form data
            fetch(`/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `playerName=${encodeURIComponent(playerName)}`
            })
            .then(response => response.text()) // Assuming the response to be HTML
            .then(html => {
                // Update your DOM accordingly. This example assumes you're replacing the innerHTML of a container.
                playerResultsContainer.innerHTML = html; // Directly insert the HTML response
            })
            .catch(error => {
                console.error('Error:', error);
                playerResultsContainer.innerHTML = '<p>Error loading player information.</p>';
            });
        }
    });

    // Event listener to load live scores
    liveScoresButton.addEventListener('click', function() {
        // Adjusted to match Flask route for live scores
        fetch('/live_scores')
        .then(response => response.text()) // Assuming the response to be HTML
        .then(html => {
            liveScoresContainer.innerHTML = html; // Directly insert the HTML response
        })
        .catch(error => {
            console.error('Error:', error);
            liveScoresContainer.innerHTML = '<p>Error loading live scores.</p>';
        });
    });
});
