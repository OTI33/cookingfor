document.addEventListener("DOMContentLoaded", function () {
  // URLパラメータからレシピのインデックスを取得
  const urlParams = new URLSearchParams(window.location.search);
  let recipeIndex = parseInt(urlParams.get('recipe'));

  if (isNaN(recipeIndex) || recipeIndex < 0) {
    console.error("Error: Invalid or missing recipe index in the URL.");
    return;
  }

  // Google ドライブの URL を画像表示用の URL に変換する関数
  function convertGoogleDriveUrl(driveUrl) {
    const regex = /\/d\/([^/]+)/; // ドライブ URL から FILE_ID を抽出
    const match = driveUrl.match(regex);
    if (match && match[1]) {
      return `/get-image/${match[1]}`; // サーバー経由で画像を取得するURLに変換
    }
    return driveUrl; // 変換できない場合はそのまま URL を返す
  }

  // 画像がない場合の「No Image」処理
  function handleNoImage(imageElement) {
    imageElement.style.display = "none"; // 画像を非表示

    // no-imageテキストをレシピ名の下に追加
    const noImageText = document.createElement("div");
    noImageText.classList.add("no-image");
    noImageText.textContent = "No Image"; // "No Image"と表示

    // レシピ名の下に追加
    const recipeNameElement = document.getElementById("recipe-name");
    recipeNameElement.insertAdjacentElement('afterend', noImageText);
    noImageText.classList.add("show"); // no-imageを表示
  }

  // 材料の表示処理
  function displayMaterials(materials) {
    const materialsElement = document.getElementById('recipe-ingredients');
    materialsElement.innerHTML = ''; // 既存の内容をクリア

    if (!materials || materials.length === 0) {
      console.log("材料データがありません");
    }

    materials.forEach(material => {
      let materialText = material.materialname;

      if (material.hon) materialText += ` (${material.hon}本)`;
      if (material.eq2n) materialText += ` (${material.eq2n}/2)`;
      if (material.eq3n) materialText += ` (${material.eq3n}/3)`;
      if (material.eq4n) materialText += ` (${material.eq4n}/4)`;
      if (material.guramu) materialText += ` (${material.guramu}g)`;
      if (material.ko) materialText += ` (${material.ko}個)`;

      const listItem = document.createElement("li");
      listItem.textContent = materialText;
      materialsElement.appendChild(listItem);
    });
  }

  // 工程の表示処理
  function displaySteps(steps) {
    const stepsElement = document.getElementById('recipe-steps');
    stepsElement.innerHTML = ''; // 既存の内容をクリア

    if (!steps || steps.length === 0) {
      console.log("工程データがありません");
    }

    steps.forEach(step => {
      const stepText = document.createElement("p");
      stepText.textContent = step.itineraryn;
      stepsElement.appendChild(stepText);

      // 工程画像があれば表示
      const stepImage = document.createElement("img");
      if (step.stepimage) {
        stepImage.src = convertGoogleDriveUrl(step.stepimage);
        stepImage.alt = `Step Image for ${step.itineraryn}`;
        stepsElement.appendChild(stepImage);
      } else {
        const noImageStep = document.createElement("div");
        noImageStep.classList.add("no-image");
        noImageStep.textContent = "No Image"; 
        stepsElement.appendChild(noImageStep);
      }
    });
  }

  // サーバーからレシピ情報を取得して表示
  fetch(`/get-recipe/${recipeIndex}`)
    .then(response => response.json())
    .then(data => {
      const recipeNameElement = document.getElementById('recipe-name');
      const recipeImageElement = document.getElementById('recipe-image');
      const recipeName = data.recipename;
      const recipeImage = data.recipeimage;

      recipeNameElement.textContent = recipeName;
      recipeImageElement.src = recipeImage ? convertGoogleDriveUrl(recipeImage) : '';

      // 画像がない場合は「No Image」を表示
      if (!recipeImage) {
        handleNoImage(recipeImageElement);
      }

      displayMaterials(data.materials);
      displaySteps(data.steps);
    })
    .catch(error => {
      console.error('Error fetching recipe:', error);
    });
});
