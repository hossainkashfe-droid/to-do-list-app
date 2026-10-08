// ----- Grab elements from the page -----
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const emptyMessage = document.getElementById("emptyMessage");
const clearDoneBtn = document.getElementById("clearDone");
const filterButtons = document.querySelectorAll(".filter-btn");

// ----- App state -----
let tasks = loadTasks();
let currentFilter = "all";

// ----- Saving and loading (localStorage) -----
function loadTasks() {
    try {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ----- Task actions -----
function addTask(text) {
    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });
    saveTasks();
    render();
}

function toggleTask(id) {
    const task = tasks.find(function (t) {
        return t.id === id;
    });
    task.done = !task.done;
    saveTasks();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(function (t) {
        return t.id !== id;
    });
    saveTasks();
    render();
}

function editTask(id) {
    const task = tasks.find(function (t) {
        return t.id === id;
    });
    const newText = prompt("Edit your task:", task.text);

    if (newText === null) return;           // user pressed Cancel
    if (newText.trim() === "") return;      // empty text not allowed

    task.text = newText.trim();
    saveTasks();
    render();
}

function clearCompleted() {
    tasks = tasks.filter(function (t) {
        return !t.done;
    });
    saveTasks();
    render();
}

// ----- Drawing the list on the page -----
function render() {
    taskList.innerHTML = "";

    const visibleTasks = tasks.filter(function (t) {
        if (currentFilter === "done") return t.done;
        if (currentFilter === "pending") return !t.done;
        return true;
    });

    visibleTasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = task.done ? "task done" : "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        const text = document.createElement("span");
        text.textContent = task.text;

        const editBtn = document.createElement("button");
        editBtn.className = "btn-edit";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", function () {
            editTask(task.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    // Counter, empty message, and clear button
    const pendingCount = tasks.filter(function (t) {
        return !t.done;
    }).length;
    const doneCount = tasks.length - pendingCount;

    counter.textContent = pendingCount + " task" + (pendingCount === 1 ? "" : "s") + " left";
    emptyMessage.style.display = visibleTasks.length === 0 ? "block" : "none";
    clearDoneBtn.style.display = doneCount > 0 ? "block" : "none";
}

// ----- Events -----
form.addEventListener("submit", function (event) {
    event.preventDefault();                 // stops the page from reloading
    const text = input.value.trim();

    if (text === "") return;

    addTask(text);
    input.value = "";
    input.focus();
});

filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        currentFilter = btn.dataset.filter;

        filterButtons.forEach(function (b) {
            b.classList.remove("active");
        });
        btn.classList.add("active");

        render();
    });
});

clearDoneBtn.addEventListener("click", clearCompleted);

// ----- Start the app -----
render();