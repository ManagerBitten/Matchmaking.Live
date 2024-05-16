
# Matchmaking.Live

## Overview
Matchmaking.Live is a comprehensive application designed for event management and matchmaking. This project includes functionalities for event searching, user authentication, and admin dashboard management.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Routes](#routes)
- [Middleware](#middleware)
- [Utilities](#utilities)
- [Public Files](#public-files)
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

```
matchmaking.live/
├── adminRoutes.js
├── apiRoutes.js
├── mainRoutes.js
├── package.json
├── package-lock.json
├── server.js
├── test.env
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

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
