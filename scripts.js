const debtList = document.getElementById("debt-list");
const addButton = document.getElementById("btn");
const debtForm = document.getElementById("debt-form");
const submitDebtButton = document.getElementById("submit-debt");
const themeSlider = document.getElementById("theme-slider");
let isFormVisible = false;
let editingDebt = null;

document.addEventListener("DOMContentLoaded", () => {
    loadDebts();
    initializeTheme();
    makeDebtItemsDraggable();
});

addButton.addEventListener("click", toggleFormVisibility);
submitDebtButton.addEventListener("click", handleDebtSubmission);
themeSlider.addEventListener("change", toggleTheme);

function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    document.body.classList.toggle("night-mode", savedTheme === "dark");
    themeSlider.checked = savedTheme === "dark";
}

function toggleFormVisibility() {
    isFormVisible = !isFormVisible;
    debtForm.classList.toggle("hidden", !isFormVisible);
    if (!isFormVisible) {
        editingDebt = null;
        clearFormFields();
    }
}

function handleDebtSubmission() {
    const name = document.getElementById("name").value.trim();
    const date = document.getElementById("date").value.trim();
    const debtor = document.getElementById("debtor").value.trim();

    if (name && validateDate(date) && debtor) {
        const id = editingDebt ? editingDebt.dataset.id : Date.now();
        const debtItem = createDebtItem(name, date, debtor, id);

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
}

function createDebtItem(name, date, debtor, id) {
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
    return debtItem;
}

function toggleOptions(button) {
    const optionsMenu = button.nextElementSibling;
    optionsMenu.style.display = optionsMenu.style.display === "block" ? "none" : "block";
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
    document.getElementById("confirm-delete").onclick = () => {
        deleteDebt(debtItem);
        closeModal(modal);
    };
    document.getElementById("cancel-delete").onclick = () => closeModal(modal);
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
        .map(([id, debt]) => createDebtItem(debt.name, debt.date, debt.debtor, id).outerHTML)
        .join("");
}

function toggleTheme() {
    const darkMode = themeSlider.checked;
    document.body.classList.toggle("night-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
}

function makeDebtItemsDraggable() {
    const debtItems = document.querySelectorAll(".debt-item");
    debtItems.forEach((item) => {
        item.setAttribute("draggable", true);
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("drop", handleDrop);
        item.addEventListener("dragend", handleDragEnd);
    });
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => this.classList.add("hidden"), 0);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedItem !== this) {
        const allItems = [...debtList.querySelectorAll(".debt-item")];
        const draggedIndex = allItems.indexOf(draggedItem);
        const droppedIndex = allItems.indexOf(this);

        draggedIndex < droppedIndex ? this.after(draggedItem) : this.before(draggedItem);
    }
}

function handleDragEnd() {
    this.classList.remove("hidden");
    saveOrderToStorage();
}

function saveOrderToStorage() {
    const debtItems = document.querySelectorAll(".debt-item");
    const debts = {};
    debtItems.forEach((item) => {
        const id = item.dataset.id;
        const name = item.querySelector("p:nth-child(1)").innerText.split(": ")[1];
        const date = item.querySelector("p:nth-child(2)").innerText.split(": ")[1];
        const debtor = item.querySelector("p:nth-child(3)").innerText.split(": ")[1];
        debts[id] = { name, date, debtor };
    });
    localStorage.setItem("debts", JSON.stringify(debts));
}

import React from "react";
import ReactDOM from "react-dom";
import App from ".App";

ReactDom.render(<App />, document.getElementsById("root"));

import { useTranslation } from "react-i18next";

const DebtForm = () => {
    const { t } = useTranslation();

    return (
        <div>
            <input type="text" id="name" placeholder={t("debt.name")} required />
            <input type="text" id="date" placeholder={t("debt.date")} required />
            <input type="text" id="debtor" placeholder={t("debt.debtor")} required />
            <button id="submit-debt">{t("debt.addDebt")}</button>
        </div>
    );
};

export default DebtForm;
