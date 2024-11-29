// Initialize salary and balance
let salary = 0;
let balance = 0;

// Load data from local storage if available
function loadData() {
    const storedSalary = localStorage.getItem('salary');
    const storedBalance = localStorage.getItem('balance');
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    if (storedSalary) {
        salary = parseFloat(storedSalary);
    }
    if (storedBalance) {
        balance = parseFloat(storedBalance);
    }

    // Update salary and balance on page load
    document.getElementById('salary-display').textContent = salary;
    document.getElementById('balance-display').textContent = balance;

    // Load expenses list from local storage
    storedExpenses.forEach(expense => {
        addExpenseToList(expense.name, expense.amount);
    });
}

// Save data to local storage
function saveData() {
    localStorage.setItem('salary', salary);
    localStorage.setItem('balance', balance);
    const expenses = [];
    document.querySelectorAll('#expense-list li').forEach(item => {
        const name = item.querySelector('.expense-name').textContent.split(':')[1].trim();
        const amount = parseFloat(item.querySelector('.expense-amount').textContent.split('$')[1].trim());
        expenses.push({ name, amount });
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Update salary button click handler
document.getElementById('update-salary-btn').addEventListener('click', function() {
    const newSalary = prompt("Enter your new salary:", salary);
    if (newSalary && !isNaN(newSalary)) {
        salary = parseFloat(newSalary);
        balance = salary;  // Balance starts as the salary
        document.getElementById('salary-display').textContent = salary;
        document.getElementById('balance-display').textContent = balance;
        saveData(); // Save updated salary and balance
    } else {
        alert("Invalid salary value");
    }
});

// Add expense button click handler
document.getElementById('add-expense-btn').addEventListener('click', function() {
    const expenseName = prompt("Enter expense name:");
    const expenseAmount = prompt("Enter expense amount:");

    if (expenseName && expenseAmount && !isNaN(expenseAmount)) {
        addExpenseToList(expenseName, expenseAmount);
        balance -= parseFloat(expenseAmount);
        document.getElementById('balance-display').textContent = balance;
        saveData(); // Save updated expenses and balance
    } else {
        alert("Invalid expense input");
    }
});

// Add expense to the list (helper function)
function addExpenseToList(expenseName, expenseAmount) {
    const expenseList = document.getElementById('expense-list');
    const expenseItem = document.createElement('li');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `<span class="expense-name">${expenseName}: $${expenseAmount}</span>
                             <button onclick="editExpense(this)" class="edit-btn"><i class="fas fa-edit"></i></button>
                             <button onclick="deleteExpense(this)" class="delete-btn"><i class="fas fa-trash-alt"></i></button>`;
    expenseList.appendChild(expenseItem);
}

// Edit expense function
function editExpense(button) {
    const expenseItem = button.parentNode;
    const expenseName = prompt("Edit expense name:", expenseItem.querySelector('.expense-name').textContent.split(':')[0].trim());
    const expenseAmount = prompt("Edit expense amount:", expenseItem.querySelector('.expense-name').textContent.split('$')[1].trim());

    if (expenseName && expenseAmount && !isNaN(expenseAmount)) {
        expenseItem.querySelector('.expense-name').textContent = `${expenseName}: $${expenseAmount}`;
        balance += parseFloat(expenseItem.querySelector('.expense-name').textContent.split('$')[1].trim()) - parseFloat(expenseAmount);
        document.getElementById('balance-display').textContent = balance;
        saveData(); // Save updated expenses and balance
    } else {
        alert("Invalid expense input");
    }
}

// Delete expense function
function deleteExpense(button) {
    const expenseItem = button.parentNode;
    const expenseAmount = parseFloat(expenseItem.querySelector('.expense-name').textContent.split('$')[1].trim());
    balance += expenseAmount;
    document.getElementById('balance-display').textContent = balance;
    expenseItem.remove();
    saveData(); // Save updated expenses and balance
}

// Load data on page load
window.onload = function() {
    loadData();
};
