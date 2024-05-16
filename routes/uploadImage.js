const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test' );
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const path = require('path');
const formidable = require(formidable)

app.post('/images', ensureAuthenticated, (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '..', 'images');
    form.keepExtensions = true;
    form.maxFileSize = 25 * 1024 * 1024;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send('Failed to upload file.');
        }
        const file = files.file;
        const oldPath = file.filepath;
        const newPath = path.join(form.uploadDir, file.originalFilename);

        fs.move(oldPath, newPath, err => {
            if (err) return res.status(500).send('Failed to process file.');
            res.status(200).send(`File uploaded successfully: ${newPath}`);
        });
    });
});