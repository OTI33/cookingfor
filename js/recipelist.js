document.addEventListener("DOMContentLoaded", function () {
  const genreSelect = document.getElementById("genreSelect");
  const recipeListContainer = document.getElementById("recipeList");
  const paginationContainer = document.getElementById("pagination"); // ページネーション用

  let currentPage = 1; // 現在のページ
  const recipesPerPage = 20; // 1ページあたりのレシピ数を20に設定

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
  function fetchRecipes() {
    fetch("/fetch-sheets-data")
      .then((response) => response.json())
      .then((data) => {
        const recipeList = data;
        const selectedGenre = genreSelect.value; // 選択されたジャンル

        // ジャンルフィルタリング
        const filteredRecipes = selectedGenre === "all" 
          ? recipeList 
          : recipeList.filter((recipe) => parseInt(recipe.genre) === parseInt(selectedGenre));

        // ページネーション用にレシピを分ける
        const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
        const startIndex = (currentPage - 1) * recipesPerPage;
        const paginatedRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

        recipeListContainer.innerHTML = "";
        paginatedRecipes.forEach((recipe, index) => {
          displayRecipe(recipe, index);
        });

        // ページネーションの更新
        updatePagination(totalPages);

        // ページが更新されたらトップにスクロール
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // レシピを表示
  function displayRecipe(recipe, index) {
    const recipename = recipe.recipename;
    const recipeimage = recipe.recipeimage === "0" ? "No Image" : convertGoogleDriveUrl(recipe.recipeimage);

    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe-item");
    recipeElement.innerHTML = `
      <h3>${recipename}</h3>
      <img src="${recipeimage}" alt="Recipe Image">
      <button onclick="window.location.href='recipepage.html?recipe=${index}'">レシピを見る</button>
    `;
    recipeListContainer.appendChild(recipeElement);
  }

  // ページネーションの更新
  function updatePagination(totalPages) {
    paginationContainer.innerHTML = "";

    const maxPagesToShow = 5; // 表示するページ番号の最大数
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2)); // 現在のページをセンターに配置

    // ページ番号が5を超えた場合、表示する最初のページ番号を調整
    if (startPage + maxPagesToShow - 1 > totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
    }

    // startPage が 1 より小さくならないように保証
    startPage = Math.max(1, startPage);

    // 「前へ」ボタン
    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "前へ";
      prevButton.addEventListener("click", () => {
        currentPage--;
        fetchRecipes();
      });
      paginationContainer.appendChild(prevButton);
    }

    // ページ番号の表示（最大5つ）
    for (let i = startPage; i < startPage + maxPagesToShow && i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        fetchRecipes();
      });
      if (i === currentPage) {
        pageButton.classList.add("current-page"); // 現在のページにクラスを追加
      }
      paginationContainer.appendChild(pageButton);
    }

    // 「次へ」ボタン
    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "次へ";
      nextButton.addEventListener("click", () => {
        currentPage++;
        fetchRecipes();
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  // 初期のレシピ取得
  fetchRecipes();

  // ジャンル変更時に再度レシピをフィルタリングして表示
  genreSelect.addEventListener("change", () => {
    currentPage = 1; // ジャンルが変更された場合は最初のページに戻る
    fetchRecipes();
  });
});
