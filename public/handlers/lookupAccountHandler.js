let eloChart;
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const accountDetailsDiv = document.querySelector('.account-details');
    const eventsContainer = document.querySelector('.events-container');
    attachModalEventHandlers();

    searchButton.addEventListener('click', search);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            search();
        }
    });
    document.addEventListener('wheel', function(event) {
        if (!eventsContainer.contains(event.target)) {
          event.preventDefault();
        }
      },{ passive: false });

    async function search() {
        const searchTerm = searchInput.value.trim();
        accountDetailsDiv.innerHTML = '';
        
        updateAccountDetailsVisibility(true);
        if (searchTerm === "") {
            accountDetailsDiv.innerHTML = '<div class="no-results">⛔ Please enter a search term.</div>';
            accountDetailsDiv.style.display = 'block';
            return;
        }

        showSpinner("Finding profile...");

        try {
            const response = await fetch('/api/account-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchTerm })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const accountData = await response.json();

            if (!accountData) {
                accountDetailsDiv.innerHTML = '<div class="no-results">⛔ No results found.</div>';
            } else {
                hideSpinner();
                await displayAccountDetails(accountData);
                updateAccountDetailsVisibility(true);
            }
            
        } catch (error) {
            console.error('Error fetching account details:', error);
            accountDetailsDiv.innerHTML = '<div class="no-results">⛔ Error fetching account details.</div>';
        }
        accountDetailsDiv.style.display = 'block';
    }


    async function displayAccountDetails(accountData) {
        // Player Info Section
        const playerInfoSection = createCollapsibleSection('Player Info');
        fillPlayerInfo(playerInfoSection.querySelector('.collapsible-content'), accountData);
        accountDetailsDiv.appendChild(playerInfoSection);

        // Game Info Section
        const gameInfoSection = createCollapsibleSection('Game Info');
        await fillGameInfo(gameInfoSection.querySelector('.collapsible-content'), accountData);
        accountDetailsDiv.appendChild(gameInfoSection);

        // Seasonal Stats Section
        const seasonalStatsSection = createCollapsibleSection('Seasonal Stats');
        await fillSeasonalStats(seasonalStatsSection.querySelector('.collapsible-content'), accountData);
        accountDetailsDiv.appendChild(seasonalStatsSection);
        attachModalEventHandlers();
    }

    function createCollapsibleSection(title) {
        const section = document.createElement('div');
        section.classList.add('collapsible-section');

        const header = document.createElement('div');
        header.classList.add('collapsible-header');
        header.textContent = title;
        header.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });

        const content = document.createElement('div');
        content.classList.add('collapsible-content');
        content.style.display = 'none';

        section.appendChild(header);
        section.appendChild(content);

        return section;
    }

    function fillPlayerInfo(contentDiv, accountData) {
        const bannerHtml = accountData.discord.banner?.link
            ? `<img src="${accountData.discord.banner.link}" alt="Discord Banner" class="header-image"/>`
            : `<div class="header-image" style="background-color: ${accountData.discord.raw.banner_color}; height: 100px;"></div>`;
    
        const avatarHtml = accountData.discord.avatar?.link
            ? `<img src="${accountData.discord.avatar.link}" alt="Discord Avatar" class="profile-image"/>`
            : `<img src="./images/default_discord.jpg" alt="Discord Avatar" class="profile-image"/>`;
    
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card');

        const statusBanType = (accountData.banned && accountData.banned.duration === 'Permanent') ? "status-banned-perm" : 
        (accountData.banned && accountData.banned.duration !== 'Permanent') ? "status-banned-temp" :
        "";
        const statusTextType = (accountData.banned && accountData.banned.duration === 'Permanent') ? "status-text-perm" : 
        (accountData.banned && accountData.banned.duration !== 'Permanent') ? "status-text-temp" :
        "";
        const status = (accountData.banned && accountData.banned.duration === 'Permanent') ? "Permanently Banned" : 
             (accountData.banned && accountData.banned.duration !== 'Permanent') ? "Temporarily Banned" :
             "";
    
        cardContainer.innerHTML = `
            <div class="header">${bannerHtml}</div>
            <div class="profile">${avatarHtml}
                <h2 class="username">${accountData.discord.username}</h2>
            </div>
            <div class="status">
                <span class="${statusBanType}"></span>
                <p class="${statusTextType}">${status}</p>
            </div>
            <div class="info">
                <div class="info-item">
                    <span class="info-title">ID</span>
                    <span class="info-value"><code>${accountData.discord.id}</code></span>
                </div>
                <div class="info-item">
                    <span class="info-title">Discord Member Since</span>
                    <span class="info-value"><code>${new Date(accountData.discord.created_at).toLocaleDateString()}</code></span>
                </div>
            </div>`;
    
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');
    
        // Helper function to create and append buttons
        const createButton = (title, items) => {
            const button = document.createElement('button');
            button.classList.add('modal-button');
        
            if (Array.isArray(items) && items.length > 0 || (!Array.isArray(items) && typeof items === 'object' && items !== null)) {
                button.textContent = `View ${title}`;
                button.addEventListener('click', () => openModal(title, items));
            } else {
                button.textContent = `No Active ${title}`; // Set text content to indicate no items
                button.disabled = true; // Disable the button
                button.classList.add('disabled'); // Add a class for styling disabled buttons
            }
            return button;
        };
        
    
        // Create and append buttons to the buttons container
        buttonsContainer.appendChild(createButton('Past Names', accountData.past_names));
        buttonsContainer.appendChild(createButton('Past Accounts', accountData.past_accounts));
        buttonsContainer.appendChild(createButton('Reports', accountData.reports));
        buttonsContainer.appendChild(createButton('Bans', accountData.banned));
    
        // Append the buttons container to the info container inside the card
        const infoContainer = cardContainer.querySelector('.info');
        infoContainer.appendChild(buttonsContainer);
    
        // Append the card to the content div
        contentDiv.appendChild(cardContainer);
    }
    

    async function fillGameInfo(contentDiv, accountData) {
        // Assume contentDiv and accountData are already defined and populated
        const gameInfoContainer = document.createElement('div');
        gameInfoContainer.classList.add('game-info-container');
        const ranksResponse = await fetch('/JSONS/ranks.json');
        const ranks = await ranksResponse.json();
        
        const banReasonsResponse = await fetch('/JSONS/ban_reasons.json');
        const banReasons = await banReasonsResponse.json();
        console.log(accountData);
        const game = accountData.gameAccount[0];

        const ign = game.basicInfo.name
        const id = game.basicInfo.userID
        const level = game.basicInfo.playerLevel.level
        let status;
        let queueBan;
        let banReason;
        let banStatus;
        let customKills = 0;
        let customDeaths = 0;
        let customGamesPlayed = 0;
        let rankedKills = 0;
        let rankedDeaths = 0;
        let rankedGamesPlayed = 0;
        for (let stats of game.stats.seasonal_stats) {
            customKills += (stats.casual.k + stats.custom.k);
            customDeaths += (stats.casual.d + stats.custom.d);
            customGamesPlayed += (stats.casual.w + stats.custom.w + stats.casual.l + stats.custom.l);
            rankedKills += (stats.ranked.k);
            rankedDeaths += (stats.ranked.d);
            rankedGamesPlayed += (stats.ranked.w + stats.ranked.l);
        }
        const customKDR = Math.round((customKills / customDeaths) * 100) / 100;
        const rankedKDR = Math.round((rankedKills / rankedDeaths) * 100) / 100;
        const global = game.stats.ranked.rank == 9 ? game.stats.ranked.global_position : '';
        const rank = ranks[0][game.stats.ranked.rank] + " " + global
        const rating = game.stats.ranked.rating;

        if (game.ban) {
            if (game.ban?.Type == '1') {
                status = "Temporarily Banned";
                const endTime = moment(Math.floor((game.ban?.SecondsLeft * 1000) + Date.now()));
                const now = moment();
                const countdown = moment.duration(endTime.diff(now));
                
                queueBan = `${countdown.humanize()}`;
                banReason = banReasons[0][game.ban.Type][game.ban.Reason];
                banStatus = 'status-text-temp';
            } else {
                status = "Permanently Banned";
                queueBan = 'Permanent';
                banReason = banReasons[0][game.ban.Type][game.ban.Reason];
                banStatus = 'status-text-perm';
            }
        }
        const clan = game.clan ? `<p><span>Clan:</span> <code>[${game.clan.basicInfo.tag}] ${game.clan.basicInfo.name}</code></p>` : '';
        const region = accountData.region ? accountData.region : 'No Region Set';

        let banStatusHTML = '';
        if (status === "Permanently Banned" || status === 'Temporarily Banned') {
            banStatusHTML = `
            <div class="category" id="ban-info">
                <div class="category-header">
                    <span>Ban Status</span>
                    <span class="arrow">&#9660;</span>
                </div>
                <div class="category-content">
                    <p><span>Status:</span> <span class="${banStatus}">${status}</span></p>
                    <p><span>Duration:</span> <code>${queueBan}</code></p>
                    <p><span>Ban Reason:</span> <code>${banReason.split('-')[1]}</code></p>
                </div>
            </div>`;
        }

        gameInfoContainer.innerHTML = `
            <div class="category" id="basic-info">
                <div class="category-header">
                    <span>Basic Info</span>
                    <span class="arrow">&#9660;</span>
                </div>
                <div class="category-content">
                    <p><span>IGN:</span> <code>${ign}</code></p>
                    <p><span>ID:</span> <code>${id}</code></p>
                    <p><span>Level:</span> <code>${level}</code></p>
                    ${clan}
                    <p><span>Region:</span> <code>${region}</code></p>
                </div>
            </div>
            <div class="category" id="custom-stats">
                <div class="category-header">
                    <span>Custom Stats</span>
                    <span class="arrow">&#9660;</span>
                </div>
                <div class="category-content">
                    <p><span>Kills:</span> <code>${customKills}</code></p>
                    <p><span>Deaths:</span> <code>${customDeaths}</code></p>
                    <p><span>KDR:</span> <code>${customKDR}</code></p>
                    <p><span>Games Played:</span> <code>${customGamesPlayed}</code></p>
                </div>
            </div>
            <div class="category" id="ranked-stats">
                <div class="category-header">
                    <span>Ranked Stats</span>
                    <span class="arrow">&#9660;</span>
                </div>
                <div class="category-content">
                    <p><span>Rank:</span> <code>${rank}</code></p>
                    <p><span>Rating:</span> <code>${rating}</code></p>
                    <p><span>Kills:</span> <code>${rankedKills}</code></p>
                    <p><span>Deaths:</span> <code>${rankedDeaths}</code></p>
                    <p><span>KDR:</span> <code>${rankedKDR}</code></p>
                    <p><span>Games Played:</span> <code>${rankedGamesPlayed}</code></p>
                </div>
            </div>
            ${banStatusHTML}`;         

        contentDiv.appendChild(gameInfoContainer);
    }

    async function fillSeasonalStats(contentDiv, accountData) {
        const fillSeasonalStatsContainer = document.createElement('div');
        fillSeasonalStatsContainer.classList.add('seasonal-stats-container');

        const rank = accountData.rank.name;
        const elo = accountData.elo;
        const wins = accountData.wins;
        const losses = accountData.losses;
        const wlr = accountData.losses + accountData.wins == 0 ? '0%' : Math.round((accountData.wins / (accountData.wins + accountData.losses))*100) + '%';
        const pastElo = accountData.past_elo;

        const imageUrl = await fetchGraphAndDisplay(pastElo);

        fillSeasonalStatsContainer.innerHTML = `
            <div class="seasonal-info">
                <p><span>Rank:</span> <code>${rank}</code></p>
                <p><span>ELO:</span> <code>${elo}</code></p>
                <p><span>Wins:</span> <code>${wins}</code></p>
                <p><span>Losses:</span> <code>${losses}</code></p>
                <p><span>Win/Loss Rate:</span> <code>${wlr}</code></p>
            </div>
            <img src="${imageUrl}" alt="ELO Chart" id="eloChartImage">
        `;

        contentDiv.appendChild(fillSeasonalStatsContainer);
    }

    function showSpinner(message) {
        accountDetailsDiv.innerHTML = `
            <div class="spinner"></div>
            <p class="spinner-message">${message}</p>
        `;

        accountDetailsDiv.style.display = 'flex';
        accountDetailsDiv.style.justifyContent = 'center';
        accountDetailsDiv.style.alignItems = 'center';
        accountDetailsDiv.style.flexDirection = 'column';
        accountDetailsDiv.style.height = '150px'; // Adjust if necessary
        preventBodyScroll(true);
    } 

    function hideSpinner() {
        accountDetailsDiv.innerHTML = ''; // Remove spinner and message
        accountDetailsDiv.removeAttribute('style'); // Remove inline styles to revert back to the original layout
        preventBodyScroll(false);
    }

    function openModal(title, listItems) {
        const modal = document.getElementById('modal');
        const modalTitle = modal.querySelector('#modal-title');
        const modalList = modal.querySelector('#modal-list');
        
        if (!Array.isArray(listItems)) {
            const listItem = document.createElement('li');
            let queueBan;
            if (listItems.duration === 'Permanent') {
                queueBan = listItems.duration;
            } else {
                const time = listItems.duration;
                const endTime = moment(time);
                const now = moment();
                const countdown = moment.duration(endTime.diff(now));
                queueBan = `${countdown.humanize()} Left`;
                queueBan = queueBan.toLowerCase().split(' ');
                for (let i = 0; i < queueBan.length; i++) {
                    queueBan[i] = queueBan[i].charAt(0).toUpperCase() + queueBan[i].slice(1);
                }
                queueBan = queueBan.join(' ');
            }
            modalTitle.textContent = title;
            listItem.innerHTML = `<b>Duration:</b> <code>${queueBan}</code> <b>Reason:</b> <code>${listItems.reason}</code> <b>Enforced By:</b> <code>${listItems.enforced_by}</code>`;
            modalList.appendChild(listItem);
        } else {
            listItems.forEach(item => {
                const listItem = document.createElement('li');
                if (typeof item === 'object') {
                    modalTitle.textContent = title;
                    listItem.innerHTML = `<b>Reported By:</b> <code>${item.reported_by}</code> <b>Reason:</b> <code>${item.reason}</code> <b>Date:</b> <code>${new Date(item.date_reported_in_unix * 1000).toLocaleDateString()}</code>`;
                } else {
                    modalTitle.textContent = title;
                    listItem.textContent = item;
                }
                modalList.appendChild(listItem);
            });
        }
        

        modal.style.display = "block";
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.style.display = "none";
            modalList.innerHTML = '';
            preventBodyScroll(true);
        }
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
                modalList.innerHTML = '';
                preventBodyScroll(false);
            }
        }
    }
       
    function attachModalEventHandlers() {
        document.querySelectorAll('.modal-button').forEach(button => {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-modal-title');
                const items = JSON.parse(this.getAttribute('data-list-items'));
                openModal(title, items);
            });
        });

        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
                this.querySelector('.arrow').style.transform = content.style.display === 'block' ? 'rotate(-180deg)' : 'rotate(0deg)';
            });
        }); 
    }    

    async function fetchGraphAndDisplay(eloRatingsArray) {
        const response = await fetch('/api/create-graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eloRating: eloRatingsArray })
        });
        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
    }

    function preventBodyScroll(isPrevent) {
        if(isPrevent) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }

    function updateAccountDetailsVisibility(display) {
        const accountDetailsDiv = document.querySelector('.account-details');
        accountDetailsDiv.style.display = display ? 'block' : 'none';
    }
});