const addButton = document.getElementById("add");
const listTasks = document.getElementById("task-list");
const clearButton = document.getElementById("clear");
const p = document.getElementById("ptag");
//load old tasks from the local storage
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (!savedTasks) {
    return [];
  }
  try {
    return JSON.parse(savedTasks);
  } catch {
    console.error("Error parsing tasks from localStorage");
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask(title) {
  const taskObject = {
    id: crypto.randomUUID(),
    title: title,
    completed: false,
  };
  return taskObject;
}
function addTask(task) {
  tasks.push(task);
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
}

function clearAll() {
  tasks.length = 0;
}

function renderTask(taskObj) {
  const listItem = document.createElement("div");
  listItem.classList.add("task-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  //when the page loads, if the task is completed, the checkbox will be checked
  checkbox.checked = taskObj.completed;

  const taskText = document.createElement("span");
  taskText.textContent = taskObj.title;
  taskText.classList.add("task-text");
  //when the page loads, if the task is completed, it will be shown as completed
  if (taskObj.completed) {
    taskText.style.textDecoration = "line-through";
    taskText.style.color = "#6b7280";
  }

  p.textContent = "";

  checkbox.addEventListener("change", () => {
    taskObj.completed = checkbox.checked;
    saveTasks();
    taskText.style.textDecoration = checkbox.checked ? "line-through" : "none";
    taskText.style.color = checkbox.checked ? "#6b7280" : "#000000";
    console.log(
      `Task "${taskObj.title}" completed status: ${taskObj.completed}`,
    );
    console.log(taskObj);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.textContent = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskObj.id);
    saveTasks();
    listTasks.removeChild(listItem);
    if (tasks.length === 0) {
      p.textContent = "No tasks yet. Add one above.";
    }
    console.log(`Task "${taskObj.title}" deleted`);
    console.log(taskObj);
  });

  listItem.append(checkbox, taskText, deleteBtn);
  listTasks.appendChild(listItem);
}

if (tasks.length === 0) {
  p.textContent = "No tasks yet. Add one above.";
} else {
  p.textContent = "";
  tasks.forEach(renderTask);
}

addButton.addEventListener("click", () => {
  const taskInput = document.getElementById("todo");
  const taskTitle = taskInput.value.trim();
  //3.validate the input
  if (taskTitle === "") {
    alert("Please enter a task");
    return;
  }

  const newTask = createTask(taskTitle);
  addTask(newTask);
  saveTasks();
  renderTask(newTask);
  taskInput.value = "";
  //view the data storage in the console section
  console.log(tasks);
  console.log(newTask);
  console.log("Add button clicked");
});

clearButton.addEventListener("click", () => {
  console.log("Clear button clicked");
  if (confirm("Are you sure, you want to clear all task?")) {
    clearAll();
    saveTasks();
    listTasks.textContent = "";
    p.textContent = "No tasks yet. Add one above.";
  }
});
