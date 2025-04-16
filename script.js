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
    const name = document.getElementById('scoutName').value.trim();
    const rank = document.getElementById('scoutRank').value;
    const inputs = document.querySelectorAll('#evaluationForm input');
    const resultBox = document.getElementById('result');
    let errors = [];

    // Error: Empty scout name
    if (name === '') {
        errors.push("Scout Name is empty.");
    }

    // Validate category inputs
    inputs.forEach(input => {
        const cat = input.dataset.category;
        const value = input.value.trim();

        if (value === '') {
            errors.push(`${cat} is empty.`);
        } else {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 10) {
                errors.push(`${cat} must be a number between 0 and 10.`);
            }
        }
    });

    // If any errors, show them in red
    if (errors.length > 0) {
        resultBox.classList.add("error");
        resultBox.textContent = "⚠️ Errors:\n" + errors.join('\n');
        return;
    }

    // All good — calculate score
    let total = 0;
    inputs.forEach(input => {
        const cat = input.dataset.category;
        const score = parseFloat(input.value);
        const weight = config.categories[cat];
        total += score * weight * 10; // scale to 100
    });

    const passScore = config.ranks[rank];
    const resultText = `✅ Scout: ${name}\nRank: ${rank}\nScore: ${total.toFixed(2)}\nResult: ${total >= passScore ? 'PASS' : 'FAIL'}`;

    resultBox.classList.remove("error");
    resultBox.textContent = resultText;
}

