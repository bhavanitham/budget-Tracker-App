// Select elements
const form = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const entriesList = document.getElementById('entries-list');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const netBalanceDisplay = document.getElementById('net-balance');
const resetButton = document.getElementById('reset-button');

// Data array for entries
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Event listeners
form.addEventListener('submit', addEntry);
resetButton.addEventListener('click', resetForm);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', filterEntries);
});

// Functions
function addEntry(e) {
    e.preventDefault();
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (description && amount) {
        entries.push({ description, amount, type });
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries(entries);
        updateTotals();
        resetForm();
    }
}

function renderEntries(filteredEntries = entries) {
    entriesList.innerHTML = '';
    filteredEntries.forEach((entry, index) => {
        const entryElement = document.createElement('li');
        entryElement.classList.add('entry', entry.type === 'income' ? 'entry-income' : 'entry-expense');
        entryElement.innerHTML = `
            <span>${entry.description} - $${entry.amount.toFixed(2)}</span>
            <span>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </span>
        `;
        entriesList.appendChild(entryElement);
    });
}

function updateTotals() {
    const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
    netBalanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2);
}

function resetForm() {
    descriptionInput.value = '';
    amountInput.value = '';
    typeSelect.value = 'income';
}

function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    deleteEntry(index);
}

function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries(entries);
    updateTotals();
}

function filterEntries() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = filter === 'all' ? entries : entries.filter(e => e.type === filter);
    renderEntries(filteredEntries);
}

// Initialize display
renderEntries();
updateTotals();
