const crypto = require('crypto');

const secret = process.env.JWT_SECRET || 'your-secret-key';

// Function to generate JWT
const generateJWT = (payload, expiresIn = '1h') => {
    // Create the header
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64').replace(/=+$/, '');
    
    // Add expiration time to the payload
    const expirationTime = Math.floor(Date.now() / 1000) + parseExpirationTime(expiresIn);
    const payloadWithExp = { ...payload, exp: expirationTime };
    
    const payloadBase64 = Buffer.from(JSON.stringify(payloadWithExp)).toString('base64').replace(/=+$/, '');

    // Create the signature
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${payloadBase64}`)
        .digest('base64')
        .replace(/=+$/, '');

    return `${header}.${payloadBase64}.${signature}`;
};

// Function to verify JWT
const verifyJWT = (token) => {
    const [header, payloadBase64, signature] = token.split('.');

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${payloadBase64}`)
        .digest('base64')
        .replace(/=+$/, '');

    if (signature !== expectedSignature) {
        throw new Error('Invalid token signature');
    }

    // Decode the payload
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));

    // Check expiration time
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token has expired');
    }

    return payload;
};

// Helper function to parse expiration time in seconds
const parseExpirationTime = (expiresIn) => {
    const timeUnit = expiresIn.slice(-1);
    const timeValue = parseInt(expiresIn.slice(0, -1), 10);

    switch (timeUnit) {
        case 's': return timeValue;              // Seconds
        case 'm': return timeValue * 60;         // Minutes
        case 'h': return timeValue * 60 * 60;    // Hours
        case 'd': return timeValue * 24 * 60 * 60; // Days
        default: throw new Error('Invalid expiration format');
    }
};

module.exports = { generateJWT, verifyJWT };
