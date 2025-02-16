document.getElementById('add-row-button').addEventListener('click', function () {
	const tbody = document.querySelector('table tbody');
	const rowCount = tbody.rows.length;

	// 最大30行まで追加できる（デフォルト5行だから、25行追加可能）
	if (rowCount < 30) {
		const newRow = document.createElement('tr');
		const columns = ['materialname', 'hon', 'eq2', 'eq3', 'eq4', 'grams', 'ko'];

		columns.forEach((col) => {
			const newCell = document.createElement('td');

			if (col === 'eq2' || col === 'eq3' || col === 'eq4') {
				const newSelect = document.createElement('select');
				const options = [
					{ value: '0', text: '0' },
					{ value: '1', text: '1/2' },
					{ value: '2', text: '2/3' },
					{ value: '3', text: '3/4' }
				];

				options.forEach(option => {
					const optionElement = document.createElement('option');
					optionElement.value = option.value;
					optionElement.textContent = option.text;
					newSelect.appendChild(optionElement);
				});

				newCell.appendChild(newSelect);
			} else {
				const newInput = document.createElement('input');
				newInput.type = 'text';
				newInput.name = `${col}${rowCount + 1}`;
				newInput.id = `${col}${rowCount + 1}`;
				newCell.appendChild(newInput);
			}

			newRow.appendChild(newCell);
		});

		tbody.appendChild(newRow);
	} else {
		alert('テーブルの行数は最大30行までです！');
	}
});

document.getElementById('add-step-button').addEventListener('click', function () {
	const stepsDiv = document.getElementById('steps');
	const stepCount = stepsDiv.getElementsByTagName('h4').length;

	// 最大30個まで追加できる（デフォルト10個だから、20個追加可能）
	if (stepCount < 30) {
		const newH4 = document.createElement('h4');
		newH4.textContent = stepCount + 1;

		const newTextArea = document.createElement('textarea');
		newTextArea.name = `itineraryn${stepCount + 1}`;
		newTextArea.id = `itineraryn${stepCount + 1}`;

		const newInputFile = document.createElement('input');
		newInputFile.type = 'file';
		newInputFile.name = `stepimage${stepCount + 1}`;
		newInputFile.id = `stepimage${stepCount + 1}`;

		stepsDiv.appendChild(newH4);
		stepsDiv.appendChild(newTextArea);
		stepsDiv.appendChild(newInputFile);
	} else {
		alert('作り方は最大30個までです！');
	}
});
