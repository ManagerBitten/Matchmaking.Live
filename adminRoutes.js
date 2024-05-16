const express = require('express');
const router = express.Router();

// Import route handlers from separate files
const adminAuthRouter = require('./routes/adminAuth');
const adminChangePassRouter = require('./routes/adminChangePass');
const adminHomeRouter = require('./routes/adminHome');
const adminLoginRouter = require('./routes/adminLogin');

module.exports = {
    adminAuthRouter,
    adminChangePassRouter,
    adminHomeRouter,
    adminLoginRouter,
};
