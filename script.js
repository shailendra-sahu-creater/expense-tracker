const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");

let transactions = [];

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value;
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    const transaction = {
        description: description,
        amount: amount,
        type: type
    };

    transactions.push(transaction);

    updateSummary();
    displayTransactions();

    form.reset();
});


function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;

    incomeElement.textContent = `₹${income}`;
    expenseElement.textContent = `₹${expense}`;
    balanceElement.textContent = `₹${balance}`;
}


function displayTransactions() {

    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {

        const li = document.createElement("li");

        li.textContent =
            `${transaction.description} - ₹${transaction.amount} (${transaction.type})`;

        transactionList.appendChild(li);
    });
}