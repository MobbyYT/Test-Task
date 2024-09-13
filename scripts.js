const debtList = document.getElementById("debt-list");
const addButton = document.getElementById("btn");
const debtForm = document.getElementById("debt-form");
const submitDebtButton = document.getElementById("submit-debt");
const themeSlider = document.getElementById("theme-slider");
let isFormVisible = false;
let editingDebt = null;

document.addEventListener("DOMContentLoaded", () => {
    loadDebts();
    const savedTheme = localStorage.getItem("theme");
    document.body.classList.toggle("night-mode", savedTheme === "dark");
    themeSlider.checked = savedTheme === "dark";
});

addButton.addEventListener("click", () => {
    isFormVisible = !isFormVisible;
    debtForm.classList.toggle("hidden", !isFormVisible);
    if (!isFormVisible) {
        editingDebt = null;
        clearFormFields();
    }
});

submitDebtButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const date = document.getElementById("date").value.trim();
    const debtor = document.getElementById("debtor").value.trim();
    if (name && validateDate(date) && debtor) {
        const id = editingDebt ? editingDebt.dataset.id : Date.now();
        const debtItem = document.createElement("div");
        debtItem.className = "debt-item";
        debtItem.dataset.id = id;
        debtItem.innerHTML = `
            <div>
                <p><strong>Назва:</strong> ${name}</p>
                <p><strong>Дата:</strong> ${date}</p>
                <p><strong>Боржник:</strong> ${debtor}</p>
            </div>
            <button class="options-button" onclick="toggleOptions(this)">&#x22EE;</button>
            <div class="options-menu">
                <button onclick="editDebt(this)">Редагувати</button>
                <button onclick="confirmDelete(this)">Видалити</button>
            </div>
        `;
        if (editingDebt) {
            debtList.replaceChild(debtItem, editingDebt);
            updateDebtInStorage(id, { name, date, debtor });
        } else {
            debtList.appendChild(debtItem);
            saveDebtToStorage(id, { name, date, debtor });
        }
        clearFormFields();
        debtForm.classList.add("hidden");
        isFormVisible = false;
    } else {
        alert("Будь ласка, заповніть всі поля");
    }
});

function toggleOptions(button) {
    button.nextElementSibling.style.display = button.nextElementSibling.style.display === "block" ? "none" : "block";
}

function confirmDelete(button) {
    const debtItem = button.closest(".debt-item");
    showDeleteModal(debtItem);
}

function showDeleteModal(debtItem) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal-content">
            <p>Ви впевнені, що хочете видалити цей борг?</p>
            <button id="confirm-delete">Так</button>
            <button id="cancel-delete">Ні</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("confirm-delete").addEventListener("click", () => {
        deleteDebt(debtItem);
        closeModal(modal);
    });
    document.getElementById("cancel-delete").addEventListener("click", () => closeModal(modal));
}

function closeModal(modal) {
    document.body.removeChild(modal);
}

function deleteDebt(debtItem) {
    const id = debtItem.dataset.id;
    debtList.removeChild(debtItem);
    removeDebtFromStorage(id);
}

function editDebt(button) {
    const debtItem = button.closest(".debt-item");
    const [name, date, debtor] = Array.from(debtItem.querySelectorAll("p")).map((p) => p.innerText.split(": ")[1]);
    document.getElementById("name").value = name;
    document.getElementById("date").value = date;
    document.getElementById("debtor").value = debtor;
    editingDebt = debtItem;
    debtForm.classList.remove("hidden");
    isFormVisible = true;
}

function clearFormFields() {
    document.getElementById("name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("debtor").value = "";
}

function validateDate(date) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

function saveDebtToStorage(id, debt) {
    const debts = getDebtsFromStorage();
    debts[id] = debt;
    localStorage.setItem("debts", JSON.stringify(debts));
}

function updateDebtInStorage(id, debt) {
    saveDebtToStorage(id, debt);
}

function removeDebtFromStorage(id) {
    const debts = getDebtsFromStorage();
    delete debts[id];
    localStorage.setItem("debts", JSON.stringify(debts));
}

function getDebtsFromStorage() {
    return JSON.parse(localStorage.getItem("debts") || "{}");
}

function loadDebts() {
    const debts = getDebtsFromStorage();
    debtList.innerHTML = Object.entries(debts)
        .map(
            ([id, debt]) => `
        <div class="debt-item" data-id="${id}">
            <div>
                <p><strong>Назва:</strong> ${debt.name}</p>
                <p><strong>Дата:</strong> ${debt.date}</p>
                <p><strong>Боржник:</strong> ${debt.debtor}</p>
            </div>
            <button class="options-button" onclick="toggleOptions(this)">&#x22EE;</button>
            <div class="options-menu">
                <button onclick="editDebt(this)">Редагувати</button>
                <button onclick="confirmDelete(this)">Видалити</button>
            </div>
        </div>
    `
        )
        .join("");
}

themeSlider.addEventListener("change", () => {
    const darkMode = themeSlider.checked;
    document.body.classList.toggle("night-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
});
