const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();  // .envを読み込む

const app = express();

app.use(cors());  // CORSの設定
app.use(express.json());  // JSONデータの処理
app.use(express.urlencoded({ extended: true }));  // URLエンコードされたデータの処理

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../')));

// HTMLファイルのルーティング
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

// Google Sheetsのデータを取得するエンドポイント
app.get('/fetch-sheets-data', async (req, res) => {
    const sheetId = process.env.GOOGLE_SHEET_ID;  // 環境変数からシートIDを取得
    const apiKey = process.env.GOOGLE_API_KEY;  // 環境変数からAPIキーを取得

    try {
        // Google Sheets APIへのリクエスト
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/recipedata?key=${apiKey}`);
        
        // エラーハンドリング
        if (response.data.error) {
            return res.status(400).json({ error: response.data.error });
        }

        // 取得したデータをフロントエンドに返す
        const recipes = response.data.values.slice(1).map(recipe => ({
            genre: recipe[2],  // 例: ジャンルのカラム
            recipename: recipe[1],  // 例: レシピ名のカラム
            recipeimage: recipe[3],  // 例: 画像URLのカラム
        }));

        res.json(recipes);  // フロントエンドにJSON形式で返す
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        res.status(500).json({ error: error.message });
    }
});

// クライアントからのPOSTリクエストを処理して、Google Apps Scriptに送信
app.post('/your-endpoint', async (req, res) => {
    try {
        const gasUrl = 'https://script.google.com/macros/s/AKfycbxREoaOi5i2q1_TYUNug75XBwmPjzFwbc8l--asLaMrRymA9U_T6Cx_y8S25T8BxUdEag/exec';

        // クライアントからのデータをGoogle Apps Scriptに転送
        const response = await axios.post(gasUrl, req.body);

        res.json({ status: 'success', data: response.data });
    } catch (error) {
        console.error('Error sending data to GAS:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// サーバーを3000ポートで起動
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
