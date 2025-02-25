document.addEventListener("DOMContentLoaded", function () {
    // クエリパラメータからレシピのインデックスを取得
    const urlParams = new URLSearchParams(window.location.search);
    const recipeIndex = urlParams.get('recipe');

    const sheetId = "YOUR_GOOGLE_SHEET_ID"; // ご自身のGoogleシートIDに置き換えてください
    const apiKey = "YOUR_GOOGLE_API_KEY"; // ご自身のAPIキーに置き換えてください

    // Google Sheets API からデータを取得
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const recipe = data.values[recipeIndex];

            // レシピの情報をページに表示
            document.getElementById('recipe-name').textContent = recipe[1];
            document.getElementById('recipe-image').src = recipe[3];
            document.getElementById('recipe-description').textContent = recipe.slice(4).join(', ');
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
