require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const MongoStore = require('connect-mongo');
const mainRoutes = require('./mainRoutes');
const apiRoutes = require('./apiRoutes');
const adminRoutes = require('./adminRoutes');
const session = require('express-session');
const passport = require('./config/passportConfig');
const { verifyToken, sendHtml, validateToken } = require('./utils/authUtils');
const app = express();
const port = process.env.PORT || 3000;
const db = mongoose.connection;
const https = require('https') ;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.set('trust proxy', 1);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "https://trusted.cdn.com",
            "https://cdn.jsdelivr.net",
            "https://code.jquery.com",
            "https://cdnjs.cloudflare.com",
            "'nonce-8+JPzd3fbyhtGSMXa+SvyA=='",
            "'sha256-yt9iFshaVn1tQRS8WnYnIZtTSOYmZrrjV5A4x35BY9E='",
            "'sha256-50GYkwJ5RTqzHgwb53diuaxFI04YZnNfIg5lMylF3SE='",
            "'sha256-psmvraRPtuqekqwMfmM1H0pqZDfr45Z1qURdnFu+cjM='",
        ],
        imgSrc: ["'self'", "data:", "blob:", "https://cdn.discordapp.com"],
    },
}));


db.on('error', console.log.bind(console, 'MongoDB Connection Error'));
db.once('open', () => {
    console.log('Connected')
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    store: new MongoStore({ 
        mongoUrl: process.env.MONGO_URI, 
        mongooseConnection: mongoose.connection, 
        collectionName: 'Sessions', 
        ttl: 60 * 60 * 24 
    })
}));

app.use(passport.initialize());
app.use(passport.session());

loadMainRoutes(mainRoutes);
loadApiRoutes(apiRoutes);
loadAdminRoutes(adminRoutes);

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'landingPage.html');
    sendHtml(res, indexPath);
});

app.get('/api', validateToken, (req, res) => {
    const forbiddenPath = path.join(__dirname, 'public', '404.html');
    sendHtml(res, forbiddenPath);
})

app.get('/admin', verifyToken, (req, res) => {
	res.status(200).send({ message: 'Admin Endpoint: No Data'});
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

function loadMainRoutes(routeObj) {
    for (const route in routeObj) {
        app.use(routeObj[route]);
    }
}
function loadApiRoutes(routeObj) {
    for (const route in routeObj) {
        app.use('/api', routeObj[route]);
    }
}
function loadAdminRoutes(routeObj) {
    for (const route in routeObj) {
        app.use('/admin', routeObj[route]);
    }
}