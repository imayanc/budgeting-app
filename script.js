// Get DOM elements
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const transactionsList = document.getElementById('transactionsList');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');

// Initialize transactions array from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Display transactions on load
displayTransactions();
updateSummary();

// Form submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeSelect.value,
        category: categorySelect.value,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Reset form
    transactionForm.reset();
    
    // Update display
    displayTransactions();
    updateSummary();
});

// Update category options based on type
typeSelect.addEventListener('change', () => {
    updateCategoryOptions();
});

function updateCategoryOptions() {
    const type = typeSelect.value;
    const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Freelance', 'Other Income'];
    const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'];

    categorySelect.innerHTML = '';

    if (type === 'income') {
        incomeCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.toLowerCase().replace(' ', '-');
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    } else {
        expenseCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.toLowerCase().replace(' ', '-');
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }
}

function displayTransactions() {
    transactionsList.innerHTML = '';

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="empty-state">No transactions yet. Add one to get started!</p>';
        return;
    }

    transactions.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.className = `transaction-item ${transaction.type}`;
        
        const amount = transaction.type === 'income' ? '+' : '-';
        const symbol = transaction.type === 'income' ? '+' : '';

        transactionEl.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-category">${transaction.category} • ${transaction.date}</div>
            </div>
            <div class="transaction-amount">${symbol}$${transaction.amount.toFixed(2)}</div>
            <button class="btn-delete" data-id="${transaction.id}">Delete</button>
        `;

        transactionsList.appendChild(transactionEl);
    });

    // Add delete event listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            transactions = transactions.filter(t => t.id !== id);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            displayTransactions();
            updateSummary();
        });
    });
}

function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpenseEl.textContent = `$${totalExpense.toFixed(2)}`;
    balanceEl.textContent = `$${balance.toFixed(2)}`;

    // Update balance color based on positive/negative
    if (balance >= 0) {
        balanceEl.style.color = '#4caf50';
    } else {
        balanceEl.style.color = '#f44336';
    }
}

// Initialize category options on load
updateCategoryOptions();
