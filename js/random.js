document.addEventListener("DOMContentLoaded", function () {
  const randomRecipeContainer = document.getElementById("randomrecipe");

  // Google ドライブの URL を画像表示用の URL に変換する関数
  function convertGoogleDriveUrl(driveUrl) {
    const regex = /\/d\/([^/]+)/; // ドライブ URL から FILE_ID を抽出
    const match = driveUrl.match(regex);
    if (match && match[1]) {
      return `/get-image/${match[1]}`; // サーバー経由で画像を取得するURLに変換
    }
    return driveUrl; // 変換できない場合はそのまま URL を返す
  }

  // サーバー経由でレシピデータを取得
  function fetchRandomRecipes() {
    fetch("/fetch-sheets-data")
      .then((response) => response.json())
      .then((data) => {
        const randomRecipes = getRandomRecipes(data, 5); // ランダムに5つのレシピを取得

        randomRecipeContainer.innerHTML = ""; // 既存の内容をクリア

        randomRecipes.forEach((recipe) => {
          displayRandomRecipe(recipe);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // ランダムにレシピを取得する関数
  function getRandomRecipes(recipes, num) {
    const shuffled = recipes.sort(() => 0.5 - Math.random()); // シャッフル
    return shuffled.slice(0, num); // 先頭のnum個を返す
  }

  // レシピを表示
  function displayRandomRecipe(recipe) {
    const recipename = recipe.recipename;
    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe-item");

    // 画像があるかどうかで表示を切り替え
    if (recipe.recipeimage === "0") {
      recipeElement.innerHTML = `
        <h3>${recipename}</h3>
        <div class="no-image">No Image</div> <!-- .no-imageクラスを適用 -->
        <button onclick="window.location.href='recipepage.html?recipe=${recipe.newIndex}'">レシピを見る</button>
      `;
    } else {
      const recipeimage = convertGoogleDriveUrl(recipe.recipeimage);
      recipeElement.innerHTML = `
        <h3>${recipename}</h3>
        <img id="recipe-image" src="${recipeimage}" alt="Recipe Image"> <!-- #recipe-imageを適用 -->
        <button onclick="window.location.href='recipepage.html?recipe=${recipe.newIndex}'">レシピを見る</button>
      `;
    }

    randomRecipeContainer.appendChild(recipeElement);
  }

  // 初期のレシピ取得
  fetchRandomRecipes();
});
