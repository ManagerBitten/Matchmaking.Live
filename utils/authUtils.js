const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const useragent = require('useragent');
const { MongoClient } = require('mongodb-legacy');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('test');
const user = db.collection('Web Users');
const crypto = require('crypto');
const jwtSecret = process.env.JWT_SECRET;

exports.getIpAddress = (req) => {
	let ipAddress;
  const forwardedIps = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',').map(ip => ip.trim()) : [];
	
	if (forwardedIps.length > 0) {
		const clientIp = forwardedIps[0];
		if (/^\d{1,3}(\.\d{1,3}){3}$/.test(clientIp)) {
			return clientIp;
		}
	} else {
		return req.connection.remoteAddress;
	}
};

exports.getDeviceDetails = (req) => {
	const ua = req.headers['user-agent'];
	const agent = useragent.parse(ua);
	
	return { browser: agent.toAgent(), os: agent.os.toString(), device: agent.device.toString() };
}

exports.getDeviceId = (req) => {
  return this.generateUUID(req);
};

exports.generateUUID = (req) => {
  const ip = this.getIpAddress(req);
  const deviceDetails = this.getDeviceDetails(req);

  const identifierString = `${ip}${deviceDetails.browser}${deviceDetails.os}${deviceDetails.device}`;
  const hash = crypto.createHash('sha256');
  hash.update(identifierString);
  return hash.digest('hex');
};

exports.sendHtml = (res, filePath, data) => {
  fs.readFile(filePath, { encoding: 'utf8' }, (err, html) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.redirect('/internal-server-error');
    }

    const regex = /<%=\s*([^%\s]+)\s*%>/g;

    if (!regex.test(html)) {
      return res.send(html);
    }

    const modifiedContent = html.replace(regex, (match, group) => {
      if (typeof data[group] === 'object') {
        return JSON.stringify(data[group])
                    .replace(/\\/g, '\\\\') 
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, '\\n') 
                    .replace(/\r/g, '\\r') 
                    .replace(/\t/g, '\\t'); 
      }
      return data[group] || match; 
    });

    res.send(modifiedContent);
  });
};

exports.validateToken = (req, res, next) => {
  const token = req.headers['x-secret-token'];
  if (!token || token !== process.env.SECRET_TOKEN) {
      return res.redirect('/unauthorized');
  }
  next();
}

exports.generateToken = (req, res, next) => {
  try {
    const expiresIn = '1h';
    const payload = {
        discordId: req.user.id,
        username: req.user.username,
        accessToken: req.user.accessToken,
        expiresIn: expiresIn,
        iat: Math.floor(Date.now() / 1000) - 30, 
        exp: Math.floor(Date.now() / 1000) + (60 * 60) 
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    res.cookie('token', token, { httpOnly: true });
    
    next();
  } catch (error) {
    console.error('Error generating token:', error);
    res.redirect('/internal-server-error');
  }
}

exports.verifyToken = (options = {}) => {
  return function(req, res, next) {
    const token = req.headers['x-access-token'] || req.query.token;

    if (!token) {
      return res.status(403).redirect('/forbidden');
    }

    try {
      const decoded = jwt.verify(token, options.secret || process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(401).redirect('/unauthorized');
    }
  };
};
