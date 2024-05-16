
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test' );
const users = db.collection('Registered Users');
const { fetchDiscord } = require('../utils/routeUtils');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const Canvas = require('canvas');

router.post('/create-graph', async (req, res) => {
    try {
        Canvas.registerFont('./public/fonts/metropolis-semi-bold.otf', { family: "Metropolis-SemiBold"});
        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');
        
        const eloRating = req.body.eloRating;
        let maxValue;
        let minValue = 0;
        let numIntervals;
        let interval;
        
        if (Array.isArray(eloRating) && eloRating.length !== 0) {
            maxValue = Math.max(...eloRating);
            let roundedMaxValue = Math.ceil(maxValue / 100);
            if (maxValue == 0) {
                numIntervals = 10;
                interval = 100;
                maxValue = 1000;
            } else if (maxValue <= 10) {
                numIntervals = 10;
                interval = 1;
                maxValue = 10;
            } else if (maxValue > 10 && maxValue <= 50) {
                numIntervals = 20;
                interval = 5;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 50 && maxValue <= 100) {
                numIntervals = 10;
                interval = 10;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 100 && maxValue <= 1000) {
                maxValue = Math.ceil(maxValue / 100) * 100;
                if (maxValue <= 500) {
                    numIntervals = roundedMaxValue * 2;
                    interval = 50;
                } else {
                    numIntervals = roundedMaxValue;
                    interval = 100;
                }
            } else if (maxValue > 1000 && maxValue <= 2000) {
                numIntervals = roundedMaxValue;
                interval = 100;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 2000 && maxValue <= 3000) {
                numIntervals = roundedMaxValue;
                interval = 100;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 3000 && maxValue <= 4000) {
                numIntervals = roundedMaxValue;
                interval = 100;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 4000 && maxValue <= 5000) {
                numIntervals = roundedMaxValue;
                interval = 500;
                maxValue = Math.ceil(maxValue / 100) * 100;
            }  else if (maxValue > 5000 && maxValue <= 6000) {
                numIntervals = roundedMaxValue;
                interval = 500;
                maxValue = Math.ceil(maxValue / 100) * 100;
            }  else if (maxValue > 6000 && maxValue <= 7000) {
                numIntervals = roundedMaxValue;
                interval = 500;
                maxValue = Math.ceil(maxValue / 100) * 100;
            }  else if (maxValue > 7000 && maxValue <= 8000) {
                numIntervals = roundedMaxValue;
                interval = 500;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 8000 && maxValue <= 9000) {
                numIntervals = roundedMaxValue;
                interval = 500;
                maxValue = Math.ceil(maxValue / 100) * 100;
            } else if (maxValue > 9000 && maxValue <= 10000) {
                numIntervals = roundedMaxValue;
                interval = 500;
                maxValue = Math.ceil(maxValue / 100) * 100;
            }  else if (maxValue > 10000) {
                numIntervals = roundedMaxValue;
                interval = 1000;
                maxValue = Math.ceil(maxValue / 100) * 100;
            }
        }

        ctx.strokeStyle = '#e6233b';
        ctx.lineWidth = 3;
        
        //x-axis
        ctx.beginPath();
        ctx.moveTo(50, 450);
        ctx.lineTo(450, 450);
        ctx.stroke();

        //y-axis
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(50, 450);
        ctx.stroke();
        
        //title
        ctx.textAlign = 'center';
        ctx.fillStyle = '#e6233b';
        ctx.font = '20px Metropolis-SemiBold';
        ctx.fillText(`MATCHMAKING RATING`, 250, 25);

        //x-axis label
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = '18px DrukTextWide-Medium-Trial';
        ctx.fillText(`${eloRating.length - 1} MATCHES`, 250, 480);

        //y-axis gridlines and labels
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'white';
        ctx.font = '11px Arial';
        for (let i = 0; i <= numIntervals; i++) {
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.moveTo(50, 450 - (i * interval / maxValue) * 400);
            ctx.lineTo(450, 450 - (i * interval / maxValue) * 400);
            ctx.stroke();
            
            ctx.globalAlpha = 1;
            ctx.fillText(`${i * interval}`, 30, 450 - (i * interval / maxValue) * 400);
        }

        //points and lines
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.95;
        /*for (let i = 0; i < eloRating.length; i++) {
            ctx.beginPath();
            ctx.arc(50 + i * 400 / (eloRating.length - 1), 450 - (eloRating[i] - minValue) / (maxValue - minValue) * 400, 3, 0, 2 * Math.PI);
            ctx.fill();
        }*/
        ctx.strokeStyle = 'white';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(50, 450 - (eloRating[0] - minValue) / (maxValue - minValue) * 400);
        for (let i = 1; i < eloRating.length; i++) {
            ctx.lineTo(50 + i * 400 / (eloRating.length - 1), 450 - (eloRating[i] - minValue) / (maxValue - minValue) * 400);
        }
        ctx.stroke();

        // Convert the canvas to a src
        const sourceImage = new Canvas.Image();
        sourceImage.src = canvas.toDataURL();
        
        const imageBuffer = canvas.toBuffer((err, buffer) => {
            if (err) {
                res.status(500).send("Error generating image");
                return;
            }
            res.type('image/png').send(buffer);
        });
    } catch (err) {
        console.error('Failed to create graph:', err);
        res.redirect('/internal-server-error');
    }
});

module.exports = router;