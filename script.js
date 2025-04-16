let config = {};

window.onload = async () => {
    config = await fetch('config.json').then(res => res.json());
    createForm();
};

function createForm() {
    const form = document.getElementById('evaluationForm');
    const rankSelect = document.getElementById('scoutRank');

    // Load ranks into dropdown
    for (const rank in config.ranks) {
        const option = document.createElement('option');
        option.value = rank;
        option.textContent = rank;
        rankSelect.appendChild(option);
    }

    // Create input fields for each category
    for (const category in config.categories) {
        const label = document.createElement('label');
        label.textContent = `${category} (0-10):`;
        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.max = 10;
        input.required = true;
        input.dataset.category = category;
        label.appendChild(input);
        form.appendChild(label);
    }
}

function calculateScore() {
    const name = document.getElementById('scoutName').value;
    const rank = document.getElementById('scoutRank').value;
    const inputs = document.querySelectorAll('#evaluationForm input');
    let total = 0;

    inputs.forEach(input => {
        const cat = input.dataset.category;
        const score = parseFloat(input.value);
        const weight = config.categories[cat];
        total += score * weight * 10; // scale to 100
    });

    const passScore = config.ranks[rank];
    const resultText = `Scout: ${name}\nRank: ${rank}\nScore: ${total.toFixed(2)}\nResult: ${total >= passScore ? 'PASS' : 'FAIL'}`;

    document.getElementById('result').textContent = resultText;
}
