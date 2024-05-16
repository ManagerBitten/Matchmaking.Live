
# Matchmaking.Live

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img src="https://github.com/your-username/matchmaking.live/workflows/Node.js%20CI/badge.svg">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg">
</p>

## Overview
**<span style="color:#2ecc71">Matchmaking.Live</span>** is a comprehensive application designed for event management and matchmaking. This project includes functionalities for event searching, user authentication, and admin dashboard management.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Routes](#routes)
- [Middleware](#middleware)
- [Utilities](#utilities)
- [Public Files](#public-files)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation
To install and run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/matchmaking.live.git
    ```

2. Navigate to the project directory:
    ```bash
    cd matchmaking.live
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the required environment variables as specified in `test.env`.

5. Start the application:
    ```bash
    npm start
    ```

## Usage
To use the application, open your browser and navigate to `http://localhost:3000`. This will take you to the landing page where you can explore the various features of the application.

## File Structure
The main components of the project are structured as follows:

```plaintext
matchmaking.live/
├── test.env
├── adminRoutes.js
├── apiRoutes.js
├── mainRoutes.js
├── package.json
├── package-lock.json
├── README.md
├── server.js
├── config/
│   └── passportConfig.js
├── middleware/
│   └── authMiddleware.js
├── public/
│   ├── 401.html
│   ├── 403.html
│   ├── 404.html
│   ├── 500.html
│   ├── adminLogin.html
│   ├── dashboard.html
│   ├── eventViewer.html
│   ├── landingPage.html
│   ├── lookupAccount.html
│   ├── ticketLayout.html
│   ├── fonts/
│   │   ├── DrukTextWide-Medium-Trial.otf
│   │   └── metropolis-semi-bold.otf
│   ├── handlers/
│   │   ├── eventSearchHandler.js
│   │   └── lookupAccountHandler.js
│   ├── images/
│   │   └── default_discord.jpg
│   └── JSONS/
│       ├── ban_reasons.json
│       └── ranks.json
├── routes/
│   ├── accountSearch.js
│   ├── adminAuth.js
│   ├── adminChangePass.js
│   ├── adminHome.js
│   ├── adminLogin.js
│   ├── createGraph.js
│   ├── dashboard.js
│   ├── discordCallback.js
│   ├── eventViewer.js
│   ├── forbidden.js
│   ├── internalServerError.js
│   ├── landingPage.js
│   ├── login.js
│   ├── logout.js
│   ├── lookupAccount.js
│   ├── notFound.js
│   ├── searchEvents.js
│   ├── tickets.js
│   ├── unauthorized.js
│   └── uploadImage.js
└── utils/
    ├── authUtils.js
    └── routeUtils.js
```

## Routes
The application defines several routes for handling different functionalities. These routes are organized in the `routes` directory:

- `accountSearch.js`: Handles account search functionality.
- `adminAuth.js`: Manages admin authentication.
- `adminChangePass.js`: Allows admins to change passwords.
- `adminHome.js`: Admin home page route.
- `adminLogin.js`: Admin login route.
- `createGraph.js`: Route to create graphs.
- `dashboard.js`: Admin dashboard route.
- `discordCallback.js`: Handles Discord authentication callbacks.
- `eventViewer.js`: Displays event details.
- `forbidden.js`: Forbidden access route.
- `internalServerError.js`: Handles internal server errors.
- `landingPage.js`: Main landing page route.
- `login.js`: User login route.
- `logout.js`: User logout route.
- `lookupAccount.js`: Lookup account details.
- `notFound.js`: Handles 404 not found errors.
- `searchEvents.js`: Searches for events.
- `tickets.js`: Manages ticket functionalities.
- `unauthorized.js`: Handles unauthorized access.
- `uploadImage.js`: Manages image uploads.

## Middleware
The middleware functionalities are stored in the `middleware` directory:

- `authMiddleware.js`: Manages authentication middleware.

## Utilities
The utility functions are stored in the `utils` directory:

- `authUtils.js`: Provides authentication utilities.
- `routeUtils.js`: Provides route-related utilities.

## Public Files
The `public` directory contains static files served by the application:

- HTML files for various pages.
- Fonts used in the application.
- Handlers for event search and account lookup.
- Images and JSON configurations.

## Environment Variables
The application requires several environment variables to be set. These variables are defined in the `test.env` file. Below is an explanation of each variable:

- **<span style="color:#e74c3c">PORT</span>**: The port on which your application will run. Default is `3000`.
- **<span style="color:#e74c3c">MONGO_URI</span>**: The URI connection string for your MongoDB database. Replace `<YOUR_MONGO_URI>` with your actual MongoDB URI.
- **<span style="color:#e74c3c">JWT_SECRET</span>**: A secret key used for signing JSON Web Tokens (JWT). Replace `<YOUR_JWT_SECRET(random string)>` with a random string.
- **<span style="color:#e74c3c">DISCORD_CLIENT_ID</span>**: The client ID for your Discord application. Replace `<YOUR_CLIENT_ID>` with your actual Discord client ID.
- **<span style="color:#e74c3c">DISCORD_CLIENT_SECRET</span>**: The client secret for your Discord application. Replace `<YOUR_CLIENT_SECRET>` with your actual Discord client secret.
- **<span style="color:#e74c3c">DISCORD_CALLBACK_URL</span>**: The callback URL for Discord authentication. Default is `http://localhost:3000/api/discord`.
- **<span style="color:#e74c3c">SESSION_SECRET</span>**: A secret key used for session management. Replace `<YOUR_SESSION_SECRET(same as client secret)>` with a secret key, which can be the same as your Discord client secret.
- **<span style="color:#e74c3c">SECRET_TOKEN</span>**: Another secret token used for additional security. Replace `<YOUR_SECRET_TOKEN(random string)>` with a random string.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
