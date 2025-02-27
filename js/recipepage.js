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
  function displayMaterials(recipe) {
    const materialsElement = document.getElementById('recipe-ingredients');
    materialsElement.innerHTML = ''; // 既存の内容をクリア

    // 材料の見出しを追加
    const materialsHeading = document.createElement('h3');
    materialsHeading.textContent = '材料';
    materialsElement.appendChild(materialsHeading);

    for (let i = 1; i <= 30; i++) {
      const materialName = recipe[`materialname${i}`];
      const hon = recipe[`hon${i}`];
      const eq2n = recipe[`eq2n${i}`];
      const eq3n = recipe[`eq3n${i}`];
      const eq4n = recipe[`eq4n${i}`];
      const guramu = recipe[`guramu${i}`];
      const ko = recipe[`ko${i}`];

      // 材料名が存在する場合のみ表示
      if (materialName && materialName !== '0') {
        let materialText = materialName;

        if (hon && hon !== '0') materialText += ` (${hon}本)`;
        if (eq2n && eq2n !== '0') materialText += ` (${eq2n}/2)`;
        if (eq3n && eq3n !== '0') materialText += ` (${eq3n}/3)`;
        if (eq4n && eq4n !== '0') materialText += ` (${eq4n}/4)`;
        if (guramu && guramu !== '0') materialText += ` (${guramu}g)`;
        if (ko && ko !== '0') materialText += ` (${ko}個)`;

        const materialElement = document.createElement('li');
        materialElement.textContent = materialText;
        materialsElement.appendChild(materialElement);
      }
    }
  }

  // 工程の表示処理
  function displaySteps(recipe) {
    const stepsElement = document.getElementById('recipe-steps');
    stepsElement.innerHTML = ''; // 既存の内容をクリア

    // 工程の見出しを追加
    const stepsHeading = document.createElement('h3');
    stepsHeading.textContent = '工程';
    stepsElement.appendChild(stepsHeading);

    for (let i = 1; i <= 30; i++) {
      const stepText = recipe[`itineraryn${i}`];
      const stepImage = recipe[`stepimage${i}`];

      if (stepText && stepText !== '0') {
        const stepElement = document.createElement('li');
        stepElement.textContent = stepText;

        // 画像の表示
        if (stepImage && stepImage !== '0') {
          const imageElement = document.createElement('img');
          imageElement.src = convertGoogleDriveUrl(stepImage);
          imageElement.alt = "Step Image";
          stepElement.appendChild(imageElement);
        } else {
          const noImageElement = document.createElement('div');
          noImageElement.classList.add('no-image');
          noImageElement.textContent = "No Image";
          stepElement.appendChild(noImageElement);
        }

        stepsElement.appendChild(stepElement);
      }
    }
  }

  // サーバーからレシピの詳細を取得
  fetch(`/get-recipe/${recipeIndex}`)  // 正しいインデックスでレシピデータを取得
    .then(response => response.json())
    .then(recipe => {
      document.getElementById('recipe-name').textContent = recipe.recipename || 'レシピ名がありません';

      const recipeImage = document.getElementById('recipe-image');
      const stepImage = document.getElementById('step-image'); // 工程画像要素

      // recipeimageの処理
      if (recipe.recipeimage && recipe.recipeimage !== '0') {
        const imageUrl = convertGoogleDriveUrl(recipe.recipeimage);  // 画像URLを変換
        recipeImage.src = imageUrl || '/images/no-image.png';
        recipeImage.style.display = "block"; // 画像を表示
        recipeImage.textContent = ""; // no-imageのテキストを消す
      } else {
        handleNoImage(recipeImage); // No Image処理
      }

      // 材料と工程を表示
      displayMaterials(recipe);
      displaySteps(recipe);

      document.getElementById('recipe-description').textContent = recipe.recipedescription || 'レシピの詳細説明がありません';
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
