document.addEventListener("DOMContentLoaded", function () {
    const genreSelect = document.getElementById('genreSelect');
    const recipeListContainer = document.getElementById('recipeList');

    // Google ドライブの URL を画像表示用の URL に変換する関数
    function convertGoogleDriveUrl(driveUrl) {
        const regex = /\/d\/([^/]+)/;  // ドライブ URL から FILE_ID を抽出
        const match = driveUrl.match(regex);
        if (match && match[1]) {
            return `https://drive.google.com/uc?id=${match[1]}`;  // 変換された画像 URL を返す
        }
        return driveUrl;  // 変換できない場合はそのまま URL を返す
    }

    // サーバー経由でレシピデータを取得
    function fetchRecipes() {
        fetch('/fetch-sheets-data')
            .then(response => response.json())
            .then(data => {
                const recipeList = data;
                const selectedGenre = genreSelect.value;  // 選択されたジャンル

                recipeListContainer.innerHTML = '';

                // ジャンルが "all" の場合はすべてのレシピを表示
                if (selectedGenre === 'all') {
                    recipeList.forEach((recipe, index) => {
                        displayRecipe(recipe, index);
                    });
                } else {
                    // 特定のジャンルが選択された場合はフィルタリング
                    recipeList.forEach((recipe, index) => {
                        const genre = recipe.genre;
                        if (parseInt(genre) === parseInt(selectedGenre)) {
                            displayRecipe(recipe, index);
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // レシピを表示するための関数を分離
    function displayRecipe(recipe, index) {
        const recipename = recipe.recipename;
        const recipeimage = convertGoogleDriveUrl(recipe.recipeimage);  // URL を変換
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
            <h3>${recipename}</h3>
            <img src="${recipeimage}" alt="Recipe Image" style="width: 100px; height: 100px;">
            <button onclick="window.location.href='recipepage.html?recipe=${index}'">詳細を見る</button>
        `;
        recipeListContainer.appendChild(recipeElement);
    }

    // 初期のレシピ取得
    fetchRecipes();

    // ジャンル変更時に再度レシピをフィルタリングして表示
    genreSelect.addEventListener('change', fetchRecipes);
});
