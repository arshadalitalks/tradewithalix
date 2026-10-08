const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(express.json());

// --- YOUR EXISTING API ROUTES & MIDDLEWARES HERE ---
// (Aapke baaki saare API endpoints jaise /api/pay/verify, /api/admin/data, etc. yahan rahenge)

// --- STATIC FILES & ROUTING FIX ---
// Root directory se saari static files (HTML, CSS, JS, images) serve karne ke liye
app.use(express.static(__dirname));

// Catch-all route: Kisi bhi URL request par index.html serve karega
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- DATABASE CONNECTION & SERVER START ---
const port = process.env.PORT || 3000;

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017')
.then(async c => {
    const db = c.db(process.env.DB_NAME || 'tradewithalix');
    
    // DB helper setup / Admin user logic...
    
    app.listen(port, () => {
        console.log('tradewithalix running on port ' + port);
    });
})
.catch(e => {
    console.error('Database connection failed:', e.message);
    process.exit(1);
});