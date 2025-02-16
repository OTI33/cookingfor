document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit").addEventListener("click", function (event) {
        event.preventDefault();

        const formData = {};

        // 画像のBase64エンコード処理を完了させるために、Promiseを使う
        const promises = [];

        // recipeimageの処理
        const recipeImageInput = document.getElementById("recipeimage");
        if (recipeImageInput && recipeImageInput.files.length > 0) {
            const file = recipeImageInput.files[0];
            const reader = new FileReader();
            promises.push(new Promise((resolve) => {
                reader.onloadend = function () {
                    formData.recipeimage = reader.result.split(',')[1]; // Base64にエンコードされたデータを取得
                    resolve();
                };
                reader.readAsDataURL(file); // Base64エンコード
            }));
        } else {
            formData.recipeimage = "0";
        }

        // recipename の入力値が無ければ "0"
        const recipename = document.getElementById("recipename");
        formData.recipename = recipename && recipename.value.trim() !== "" ? recipename.value : "0";

        // genre のラジオボタンが選択されていれば、その値を取得。なければ "0"
        const genre = document.querySelector('input[name="genre"]:checked');
        formData.genre = genre ? genre.value : "0";

        // 材料やステップデータの収集
        for (let i = 1; i <= 30; i++) {
            const materialname = document.getElementById(`materialname${i}`);
            const hon = document.getElementById(`hon${i}`);
            const eq2n = document.getElementById(`eq2n${i}`);
            const eq3n = document.getElementById(`eq3n${i}`);
            const eq4n = document.getElementById(`eq4n${i}`);
            const guramu = document.getElementById(`guramu${i}`);
            const ko = document.getElementById(`ko${i}`);

            formData[`materialname${i}`] = materialname && materialname.value.trim() !== "" ? materialname.value : "0";
            formData[`hon${i}`] = hon && hon.value.trim() !== "" ? hon.value : "0";
            formData[`eq2n${i}`] = eq2n && eq2n.value.trim() !== "" ? eq2n.value : "0";
            formData[`eq3n${i}`] = eq3n && eq3n.value.trim() !== "" ? eq3n.value : "0";
            formData[`eq4n${i}`] = eq4n && eq4n.value.trim() !== "" ? eq4n.value : "0";
            formData[`guramu${i}`] = guramu && guramu.value.trim() !== "" ? guramu.value : "0";
            formData[`ko${i}`] = ko && ko.value.trim() !== "" ? ko.value : "0";
        }

        // ステップ画像とその他のデータの収集
        for (let i = 1; i <= 30; i++) {
            const stepImageInput = document.getElementById(`stepimage${i}`);
            const itinerary = document.getElementById(`itineraryn${i}`);
            
            promises.push(new Promise((resolve) => {
                if (stepImageInput && stepImageInput.files.length > 0) {
                    const stepReader = new FileReader();
                    stepReader.onloadend = function () {
                        formData[`stepimage${i}`] = stepReader.result.split(',')[1]; // Base64にエンコードされたデータ
                        resolve();
                    };
                    stepReader.readAsDataURL(stepImageInput.files[0]);
                } else {
                    formData[`stepimage${i}`] = "0";
                    resolve();
                }
            }));

            formData[`itineraryn${i}`] = itinerary && itinerary.value.trim() !== "" ? itinerary.value : "0";
        }

        // 全ての非同期処理が完了したらフォームデータを送信
        Promise.all(promises).then(() => {
            sendFormData(formData);
        }).catch((error) => {
            console.error('エラーが発生しました:', error);
            alert('データの送信中にエラーが発生しました');
        });
    });
});

function sendFormData(formData) {
    const url = "http://localhost:3000/your-endpoint"; // Node.jsサーバーのエンドポイント

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert("レシピの投稿が成功しました！");

        // レシピ送信後にindex.htmlにリダイレクト
        window.location.href = "index.html";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("レシピの投稿に失敗しました。");
    });
}
