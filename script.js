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
        option.textContent = `${rank} (${config.ranks[rank]}+ to pass)`;
        rankSelect.appendChild(option);
    }

    // Create input fields for each category
    for (const category in config.eval_categories) {
        const label = document.createElement('label');
        label.textContent = `${category}:`;
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
    const adultNames = document.querySelectorAll('.adult-name');
    const adultRatings = document.querySelectorAll('.adult-rating');

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
            errors.push(`${cat} category is empty.`);
        } else {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 10) {
                errors.push(`${cat} must be a number between 0 and 10.`);
            }
        }
    });

    // Validate adult ratings
    let adultTotal = 0;
    let numAdults = 0;
    for (let i = 0; i < adultRatings.length; i++) {
        const name = adultNames[i].value.trim();
        const val = adultRatings[i].value.trim();

        if (name === '' || val === '') {
            errors.push(`Adult ${i + 1} is incomplete.`);
            continue;
        }

        const score = parseFloat(val);
        if (isNaN(score) || score < 0 || score > 10) {
            errors.push(`Adult ${i + 1} rating must be between 0 and 10.`);
            continue;
        }

        adultTotal += score;
        numAdults++;
    }

    if (numAdults === 0) {
        errors.push("At least one adult rating is required.");
    }

    // If any errors, show them in red
    if (errors.length > 0) {
        resultBox.classList.add("error");
        resultBox.textContent = "⚠️ Errors:\n" + errors.join('\n');
        return;
    }

    // All good — calculate category-based score
    let total = 0;
    inputs.forEach(input => {
        const cat = input.dataset.category;
        const score = parseFloat(input.value);
        const weight = config.eval_categories[cat];
        total += score * weight * 10; // category contribution
    });

    // Calculate adult weight contribution
    const adultWeightTotal = 1.38;
    const perAdultWeight = adultWeightTotal / numAdults;
    const weightedAdultScore = adultTotal * perAdultWeight;

    // Add adult contribution
    total += weightedAdultScore * 10;

    // Final pass/fail comparison
    const passScore = config.ranks[rank];
    const resultText = `${total >= passScore ? '✅' : '❌'} Scout: ${name}
Rank: ${rank}
Score: ${total.toFixed(2)} / ${passScore.toFixed(2)}
Result: ${total >= passScore ? 'PASS' : 'FAIL'}`;

    resultBox.classList.remove("error");
    resultBox.textContent = resultText;
}

function addAdult() {
    const container = document.getElementById('adultsContainer');
    const wrapper = document.createElement('div');
    wrapper.className = 'adult-entry';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Adult Name';
    nameInput.className = 'adult-name';

    const ratingInput = document.createElement('input');
    ratingInput.type = 'number';
    ratingInput.placeholder = 'Rating (1-10)';
    ratingInput.min = 1;
    ratingInput.max = 10;
    ratingInput.className = 'adult-rating';

    wrapper.appendChild(nameInput);
    wrapper.appendChild(ratingInput);
    container.appendChild(wrapper);
}


