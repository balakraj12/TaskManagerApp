const API_URL = "http://localhost:5000/tasks";
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let editTaskId = null;

// Load tasks on page load
window.onload = loadTasks;

// Add / Update Task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskData = {
    title: title.value,
    description: description.value,
    status: status.value
  };

  if (editTaskId) {
    // Update Task
    await fetch(`${API_URL}/${editTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
    editTaskId = null;
  } else {
    // Create Task
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });
  }

  taskForm.reset();
  loadTasks();
});

// Fetch Tasks
async function loadTasks() {
  taskList.innerHTML = "";
  const res = await fetch(API_URL);
  const tasks = await res.json();

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${task.title}</strong><br/>
      ${task.description}<br/>
      <small>Status: ${task.status}</small>
      <div class="task-actions">
        <button onclick="editTask('${task._id}', '${task.title}', '${task.description}', '${task.status}')">Edit</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Delete Task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

// Edit Task
function editTask(id, titleValue, descriptionValue, statusValue) {
  editTaskId = id;
  title.value = titleValue;
  description.value = descriptionValue;
  status.value = statusValue;
}
