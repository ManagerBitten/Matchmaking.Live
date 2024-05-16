// searchHandler.js (client-side)

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const eventsContainer = document.querySelector('.events-container');
    const noResults = document.querySelector('.no-results');

    document.addEventListener('wheel', function(event) {
        if (!eventsContainer.contains(event.target)) {
          event.preventDefault();
        }
      },{ passive: false });

    const search = async () => {
        const searchTerm = searchInput.value.trim();
        eventsContainer.innerHTML = '';

        if (searchTerm === "") {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            // Send the search term to the server
            try {
                const response = await fetch('/api/search-events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchTerm }),
                });
                const searchResults = await response.json();
                
                if (searchResults.length === 0) {
                    const noResultsDiv = document.createElement('div');
                    noResultsDiv.classList.add('no-results');
                    noResultsDiv.textContent = '⛔ No results found.';
                    eventsContainer.appendChild(noResultsDiv);
                } else {
                    searchResults.forEach(result => {
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event');
                    
                        // Apply formatting to result.event
                        let formattedEvent = result.event.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold text between **
                        formattedEvent = formattedEvent.replace(/`([^`]+)`/g, '<span style="color: gray;">$1</span>'); // Gray-highlighted text between literals
                        eventDiv.innerHTML = formattedEvent;
                    
                        // Create div for timestamp text
                        const timestampDiv = document.createElement('div');
                        timestampDiv.textContent = humanizeTimestamp(result.date, 2);
                        eventDiv.appendChild(timestampDiv);
                    
                        eventsContainer.appendChild(eventDiv);
                    });                    
                }
                updateEventContainer(searchResults);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    }

    searchButton.addEventListener('click', search);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            search();
        }
    });
});

const humanizeTimestamp = (timestamp, maxUnits = 2) => {
    const now = new Date();
    const elapsed = now.getTime() - timestamp; // elapsed time in milliseconds
    const units = [
        { label: 'year', milliseconds: 31536000000 },
        { label: 'month', milliseconds: 2592000000 },
        { label: 'day', milliseconds: 86400000 },
        { label: 'hour', milliseconds: 3600000 },
        { label: 'minute', milliseconds: 60000 },
        { label: 'second', milliseconds: 1000 },
        { label: 'millisecond', milliseconds: 1 }
    ];
    let remaining = elapsed;
    let result = '';
    let count = 0;
    for (const unit of units) {
        if (remaining >= unit.milliseconds) {
            const value = Math.floor(remaining / unit.milliseconds);
            remaining -= value * unit.milliseconds;
            result += `${value} ${unit.label}${value !== 1 ? 's' : ''}`;
            count++;
            if (count === maxUnits) {
                break;
            }
            result += ', ';
        }
    }
    return result + ' ago';
};

function updateEventContainer(events) {
    const eventsContainer = document.querySelector('.events-container');
    const noResults = document.querySelector('.no-results');

    // If there are events to show, make the container visible and hide the no-results message
    if (events.length > 0) {
        eventsContainer.style.display = 'block'; // Show the container
        noResults.style.display = 'none'; // Hide the no-results message
    } else {
        eventsContainer.style.display = 'none'; // Hide the container
        noResults.style.display = 'block'; // Show the no-results message
    }
}
