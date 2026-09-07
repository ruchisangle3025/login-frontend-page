// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");


// Get tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Current filter
let currentFilter = "all";


// Add Task
addTaskBtn.addEventListener("click", addTask);


// Add task when Enter key is pressed
taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Function to add task
function addTask() {

    const taskText = taskInput.value.trim();

    // Check empty input
    if (taskText === "") {

        alert("Please enter a task!");

        return;
    }


    // Create task object
    const task = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task to array
    tasks.push(task);


    // Save task
    saveTasks();


    // Clear input
    taskInput.value = "";


    // Display tasks
    displayTasks();

}


// Display Tasks
function displayTasks() {

    taskList.innerHTML = "";


    // Filter tasks
    let filteredTasks = tasks;

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.classList.remove("hidden");

    }

    else {

        emptyMessage.classList.add("hidden");

    }


    // Create task cards
    filteredTasks.forEach(task => {

        const taskDiv = document.createElement("div");

        taskDiv.className =
            "flex items-center justify-between gap-3 " +
            "border border-gray-200 rounded-lg p-4";


        // Task text
        const taskText = document.createElement("span");

        taskText.textContent = task.text;

        taskText.className =
            "flex-1 text-gray-700";


        // Completed style
        if (task.completed) {

            taskText.classList.add(
                "line-through",
                "text-gray-400"
            );

        }


        // Complete button
        const completeBtn = document.createElement("button");

        completeBtn.textContent =
            task.completed ? "Undo" : "Done";

        completeBtn.className =
            "bg-green-500 hover:bg-green-600 " +
            "text-white px-3 py-2 rounded-lg";


        completeBtn.addEventListener("click", function() {

            toggleTask(task.id);

        });


        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.className =
            "bg-red-500 hover:bg-red-600 " +
            "text-white px-3 py-2 rounded-lg";


        deleteBtn.addEventListener("click", function() {

            deleteTask(task.id);

        });


        // Buttons container
        const buttonDiv = document.createElement("div");

        buttonDiv.className = "flex gap-2";


        buttonDiv.appendChild(completeBtn);

        buttonDiv.appendChild(deleteBtn);


        // Add elements
        taskDiv.appendChild(taskText);

        taskDiv.appendChild(buttonDiv);


        taskList.appendChild(taskDiv);

    });


    updateStatistics();

}


// Complete / Undo Task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {

                ...task,

                completed: !task.completed

            };

        }

        return task;

    });


    saveTasks();

    displayTasks();

}


// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();

}


// Filter Tasks
function filterTasks(filter) {

    currentFilter = filter;

    displayTasks();

}


// Update Statistics
function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// Save tasks to localStorage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Initial display
displayTasks();