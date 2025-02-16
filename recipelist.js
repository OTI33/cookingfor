document.addEventListener("DOMContentLoaded", function () {
    const genreSelect = document.getElementById('genreSelect');
    const recipeListContainer = document.getElementById('recipeList');

    // サーバー経由でレシピデータを取得
    function fetchRecipes() {
        fetch('/fetch-sheets-data')  // サーバーのエンドポイントを呼び出す
            .then(response => response.json())
            .then(data => {
                const recipeList = data;  // サーバーから受け取ったレシピデータ
                const selectedGenre = genreSelect.value;

                recipeListContainer.innerHTML = ''; // 初期化

                // レシピをジャンルでフィルタリング
                recipeList.forEach((recipe, index) => {
                    const genre = recipe.genre;
                    const recipename = recipe.recipename;
                    const recipeimage = recipe.recipeimage;

                    // ジャンルが一致する場合、レシピを表示
                    if (selectedGenre === 'all' || genre === selectedGenre) {
                        const recipeElement = document.createElement('div');
                        recipeElement.classList.add('recipe');
                        recipeElement.innerHTML = `
                            <h3>${recipename}</h3>
                            <img src="${recipeimage}" alt="Recipe Image" style="width: 100px; height: 100px;">
                            <button onclick="window.location.href='recipepage.html?recipe=${index}'">詳細を見る</button>
                        `;
                        recipeListContainer.appendChild(recipeElement);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // 初期のレシピ取得
    fetchRecipes();

    // ジャンル変更時に再度レシピをフィルタリングして表示
    genreSelect.addEventListener('change', fetchRecipes);
});
