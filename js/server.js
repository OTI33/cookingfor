const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/recipelist.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../recipelist.html'));
});

app.get('/listmake.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../listmake.html'));
});

app.get('/recipeinput.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../recipeinput.html'));
});

app.get('/recipepage.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../recipepage.html'));
});

app.get('/fetch-sheets-data', async (req, res) => {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/recipedata?key=${apiKey}`);

        if (response.data.error) {
            return res.status(400).json({ error: response.data.error });
        }

        const recipes = response.data.values.slice(1).map(recipe => ({
            genre: recipe[2],
            recipename: recipe[1],
            recipeimage: recipe[3],
        }));

        res.json(recipes);
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).json({ error: error.message });
    }
});

// Google Apps Scriptに送信
app.post('/your-endpoint', async (req, res) => {
    try {
        const gasUrl = 'https://script.google.com/macros/s/AKfycbwTSGLTVJsnvu3Tib7-1CPY2CQy-eozrU2JEYLdE5IvlCP6b4mwz-aoScHcVjDed9-_mA/exec';

        const response = await axios.post(gasUrl, req.body);

        res.json({ status: 'success', data: response.data });
    } catch (error) {
        console.error('Error sending data to GAS:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

const PORT = 8800;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
