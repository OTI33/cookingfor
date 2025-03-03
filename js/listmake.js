document.addEventListener("DOMContentLoaded", function () {
  const recipeListContainer = document.getElementById("recipe-list-container");
  const recipeIngredientsContainer = document.getElementById("recipe-ingredients");
  const clearAllButton = document.getElementById("clear-all-button");

  let recipeList = JSON.parse(localStorage.getItem("recipeList")) || [];

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
            material.eq4n !== "0" ||
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
              eq4n: 0,
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
          if (material.eq4n && material.eq4n !== "0") {
            aggregatedMaterials[materialName].eq4n += parseFloat(material.eq4n);
          }
          if (material.guramu && material.guramu !== "0") {
            aggregatedMaterials[materialName].guramu += parseFloat(material.guramu);
          }
          if (material.ko && material.ko !== "0") {
            aggregatedMaterials[materialName].ko += parseFloat(material.ko);
          }
        }
      });
    });

    return aggregatedMaterials;
  }

  // 小数を最も近い分数に変換する関数
  function decimalToFraction(decimal) {
    const tolerance = 1e-6; // 許容誤差

    // 分母を2, 3, 4に限定して、最も近い分数を見つける
    const denominators = [2, 3, 4];
    let closestFraction = { numerator: 0, denominator: 1 };

    for (let denominator of denominators) {
      let numerator = Math.round(decimal * denominator);
      let fraction = numerator / denominator;

      if (Math.abs(fraction - decimal) < Math.abs(closestFraction.numerator / closestFraction.denominator - decimal)) {
        closestFraction = { numerator, denominator };
      }
    }

    // 最も近い分数を返す
    if (closestFraction.numerator === closestFraction.denominator) {
      return `${closestFraction.numerator}`; // 1以上の場合は整数
    } else {
      return `${closestFraction.numerator}/${closestFraction.denominator}`;
    }
  }

  function displayAggregatedMaterials() {
    recipeIngredientsContainer.innerHTML = ""; // 一度リセット
    const aggregatedMaterials = aggregateMaterials();

    // 集計した材料を表示
    for (const materialName in aggregatedMaterials) {
      const material = aggregatedMaterials[materialName];
      const materialText = `${materialName}: `;

      let materialDetails = "";

      // 合算処理: eq2n, eq3n, eq4n を分数として合算
      if (material.hon > 0) materialDetails += `${material.hon}本 `;

      // 合算した分数の処理
      let totalEq2n = material.eq2n + material.eq3n * (2 / 3) + material.eq4n * (2 / 4);
      let totalEq3n = material.eq3n + material.eq4n * (3 / 4);
      let totalEq4n = material.eq4n;

      // すべての分数部分を足し合わせた結果
      let totalFractionSum = totalEq2n + totalEq3n + totalEq4n;

      // 分数部分を1本の部分に加算
      if (totalFractionSum >= 1) {
        material.hon += Math.floor(totalFractionSum); // 合計された分数から1本に足す
        totalFractionSum = totalFractionSum % 1; // 余り部分
      }

      // 合算された小数部分を最も近い分数に変換
      if (totalFractionSum > 0) {
        materialDetails += `${decimalToFraction(totalFractionSum)}本 `;
      }

      // 他の材料の単位も表示
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

      // レシピ削除ボタンを作成
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";
      deleteButton.addEventListener("click", function () {
        // 該当のレシピを削除
        recipeList.splice(index, 1);
        localStorage.setItem("recipeList", JSON.stringify(recipeList));

        // レシピリストを再表示
        displayRecipeList();
        alert("レシピが削除されました");
      });

      recipeItem.appendChild(recipeName);
      recipeItem.appendChild(deleteButton);

      // メニュー名を recipe-list-container に追加
      recipeListContainer.appendChild(recipeItem);
    });
  } else {
    const noRecipesMessage = document.createElement("p");
    noRecipesMessage.textContent = "リストにはレシピがありません";
    recipeListContainer.appendChild(noRecipesMessage);
  }

  // レシピリストの再表示
  function displayRecipeList() {
    recipeListContainer.innerHTML = "";
    if (recipeList.length > 0) {
      recipeList.forEach((recipe, index) => {
        const recipeItem = document.createElement("div");
        recipeItem.classList.add("recipe-item");

        // メニュー名の表示
        const recipeName = document.createElement("h3");
        recipeName.textContent = recipe.name;

        // レシピ削除ボタンを作成
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click", function () {
          // 該当のレシピを削除
          recipeList.splice(index, 1);
          localStorage.setItem("recipeList", JSON.stringify(recipeList));

          // レシピリストを再表示
          displayRecipeList();
          alert("レシピが削除されました");
        });

        recipeItem.appendChild(recipeName);
        recipeItem.appendChild(deleteButton);

        // メニュー名を recipe-list-container に追加
        recipeListContainer.appendChild(recipeItem);
      });
    } else {
      const noRecipesMessage = document.createElement("p");
      noRecipesMessage.textContent = "リストにはレシピがありません";
      recipeListContainer.appendChild(noRecipesMessage);
    }
  }

  // 最初にお買い物リストを表示
  displayAggregatedMaterials();

  // 「すべてのレシピを削除」ボタンのクリックイベント
  clearAllButton.addEventListener("click", function () {
    // ローカルストレージをクリア
    localStorage.removeItem("recipeList");
してるのに
    // UIから全てのレシピを削除
    recipeListContainer.innerHTML = "";
    recipeIngredientsContainer.innerHTML = "";

    alert("全てのレシピが削除されました！");
  });
});
