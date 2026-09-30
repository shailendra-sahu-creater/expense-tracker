const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");
const transactionList = document.getElementById("transactionList");

let transactions = [];


form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const description = descriptionInput.value;
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    const response = await fetch("/api/transactions/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description: description,
            amount: amount,
            type: type
        })
    });

    if (response.ok) {
        const transaction = await response.json();

        transactions.push(transaction);

        updateSummary();
        displayTransactions();

        form.reset();
    } else {
        alert("Failed to save transaction");
    }
});


function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function (transaction) {
        if (transaction.type === "income") {
            income += Number(transaction.amount);
        } else {
            expense += Number(transaction.amount);
        }
    });

    const balance = income - expense;

    incomeElement.textContent = `₹${income}`;
    expenseElement.textContent = `₹${expense}`;
    balanceElement.textContent = `₹${balance}`;
}

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
        const li = document.createElement("li");

        li.innerHTML = `
            ${transaction.description} - ₹${transaction.amount} (${transaction.type})

            <button onclick="editTransaction(${transaction.id})">
                Edit
            </button>


            <button onclick="deleteTransaction(${transaction.id})">
                Delete
            </button>
        `;

        transactionList.appendChild(li);
    });
}

async function deleteTransaction(id) {
    const response = await fetch(`/api/transactions/${id}/`, {
        method: "DELETE"
    });

    if (response.ok) {
        transactions = transactions.filter(function (transaction) {
            return transaction.id !== id;
        });

        updateSummary();
        displayTransactions();
    } else {
        alert("Failed to delete transaction");
    }
}

async function editTransaction(id) {
    const transaction = transactions.find(function (transaction) {
        return transaction.id === id;
    });

    const newDescription = prompt(
        "Enter new description:",
        transaction.description
    );

    if (newDescription === null) {
        return;
    }

    const newAmount = prompt(
        "Enter new amount:",
        transaction.amount
    );

    if (newAmount === null) {
        return;
    }

    const newType = prompt(
        "Enter type (income or expense):",
        transaction.type
    );

    if (newType === null) {
        return;
    }

    const response = await fetch(
        `/api/transactions/${id}/update/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: newDescription,
                amount: Number(newAmount),
                type: newType
            })
        }
    );

    if (response.ok) {
        const updatedTransaction = await response.json();

        transactions = transactions.map(function (transaction) {
            if (transaction.id === id) {
                return updatedTransaction;
            }

            return transaction;
        });

        updateSummary();
        displayTransactions();
    } else {
        alert("Failed to update transaction");
    }
}

async function loadTransactions() {
    const response = await fetch("/api/transactions/list/");

    if (response.ok) {
        transactions = await response.json();

        updateSummary();
        displayTransactions();
    }
}

loadTransactions();

