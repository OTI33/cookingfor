document.addEventListener("DOMContentLoaded", function () {
  const recipeListContainer = document.getElementById("recipe-list-container");
  const recipeIngredientsContainer =
    document.getElementById("recipe-ingredients");

  let recipeList = JSON.parse(localStorage.getItem("recipeList")) || [];

  // ローカルストレージの内容をコンソールに表示して確認
  console.log("Recipe List:", recipeList);

  function aggregateMaterials() {
    const aggregatedMaterials = {};

    // 材料の集計処理
    recipeList.forEach((recipe) => {
      const materials = recipe.materials || recipe.ingredients || [];
      materials.forEach((material) => {
        if (
          material.materialname &&
          (material.hon !== "0" ||
            material.eq2n !== "0" ||
            material.eq3n !== "0" ||
            material.guramu !== "0" ||
            material.ko !== "0")
        ) {
          const materialName = material.materialname;

          // 合計を計算する関数
          if (!aggregatedMaterials[materialName]) {
            aggregatedMaterials[materialName] = {
              hon: 0,
              eq2n: 0,
              eq3n: 0,
              guramu: 0,
              ko: 0,
            };
          }

          // 材料の単位ごとに合計
          if (material.hon && material.hon !== "0") {
            aggregatedMaterials[materialName].hon += parseFloat(material.hon);
          }
          if (material.eq2n && material.eq2n !== "0") {
            aggregatedMaterials[materialName].eq2n += parseFloat(material.eq2n);
          }
          if (material.eq3n && material.eq3n !== "0") {
            aggregatedMaterials[materialName].eq3n += parseFloat(material.eq3n);
          }
          if (material.guramu && material.guramu !== "0") {
            aggregatedMaterials[materialName].guramu += parseFloat(
              material.guramu
            );
          }
          if (material.ko && material.ko !== "0") {
            aggregatedMaterials[materialName].ko += parseFloat(material.ko);
          }
        }
      });
    });

    return aggregatedMaterials;
  }

  function displayAggregatedMaterials() {
    recipeIngredientsContainer.innerHTML = ""; // 一度リセット
    const aggregatedMaterials = aggregateMaterials();

    // 集計した材料を表示
    for (const materialName in aggregatedMaterials) {
      const material = aggregatedMaterials[materialName];
      const materialText = `${materialName}: `;

      let materialDetails = "";
      if (material.hon > 0) materialDetails += `${material.hon}本 `;
      if (material.eq2n > 0) materialDetails += `${material.eq2n}/2 `;
      if (material.eq3n > 0) materialDetails += `${material.eq3n}/3 `;
      if (material.guramu > 0) materialDetails += `${material.guramu}g `;
      if (material.ko > 0) materialDetails += `${material.ko}個 `;

      const materialItem = document.createElement("li");
      materialItem.textContent = materialText + materialDetails.trim();
      recipeIngredientsContainer.appendChild(materialItem);
    }
  }

  // レシピリストの表示
  if (recipeList.length > 0) {
    recipeList.forEach((recipe, index) => {
      const recipeItem = document.createElement("div");
      recipeItem.classList.add("recipe-item");

      // メニュー名の表示
      const recipeName = document.createElement("h3");
      recipeName.textContent = recipe.name;

      // 削除ボタンの作成
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";
      deleteButton.classList.add("delete-button");

      // 削除ボタンのクリックイベント
      deleteButton.addEventListener("click", function () {
        // クリックされたレシピをローカルストレージから削除
        recipeList.splice(index, 1); // 現在のレシピを削除
        localStorage.setItem("recipeList", JSON.stringify(recipeList)); // 更新されたレシピリストを保存

        // UIから削除
        recipeItem.remove();

        // お買い物リストの更新
        displayAggregatedMaterials();

        alert("レシピが削除されました！");
      });

      // メニュー名と削除ボタンを一緒に表示
      const recipeHeader = document.createElement("div");
      recipeHeader.classList.add("recipe-header");
      recipeHeader.appendChild(recipeName);
      recipeHeader.appendChild(deleteButton);

      recipeItem.appendChild(recipeHeader);

      // メニュー名を recipe-list-container に追加
      recipeListContainer.appendChild(recipeItem);
    });
  } else {
    const noRecipesMessage = document.createElement("p");
    noRecipesMessage.textContent = "リストにはレシピがありません";
    recipeListContainer.appendChild(noRecipesMessage);
  }

  // 最初にお買い物リストを表示
  displayAggregatedMaterials();
});
