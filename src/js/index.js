document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const taskTitleInput = document.getElementById("taskTitle");
  const inProgressTaskTitle = document.getElementById("progress-taskTitle");
  const startTimeDisplay = document.getElementById("StartTime");
  const elapsedTimeDisplay = document.getElementById("ElapsedTime");
  const completedTasksContainer = document.getElementById("tasks");

  let startTime;
  let timerInterval;

  // Function to start the timer
  function startTimer() {
    startTime = new Date();
    startTimeDisplay.textContent = formatTime(startTime);
    inProgressTaskTitle.textContent = `${taskTitleInput.value}`;
    timerInterval = setInterval(updateElapsedTime, 1000);
  }

  // Function to stop the timer
  function stopTimer() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const elapsedTime = endTime - startTime;
    const taskDetails = {
      title: taskTitleInput.value,
      startTime: startTime,
      endTime: endTime,
      elapsedTime: elapsedTime,
    };
    saveTask(taskDetails);
    displayCompletedTasks();
  }

  // Function to update the elapsed time display
  function updateElapsedTime() {
    const currentTime = new Date();
    const elapsedTime = currentTime - startTime;
    elapsedTimeDisplay.textContent = formatElapsedTime(elapsedTime);
  }

  // Function to format time in HH:MM format
  function formatTime(timestamp) {
    console.log("Timestamp:", timestamp);
    const hours = String(timestamp.getHours()).padStart(2, "0");
    console.log("Hours:", hours);
    const minutes = String(timestamp.getMinutes()).padStart(2, "0");
    console.log("Mins:", minutes);
    return `${hours}:${minutes}`;
}

  // Function to format elapsed time in HH:MM:SS format
  function formatElapsedTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Function to format date in dd MMM format
  function formatDate(timestamp) {
    const day = String(timestamp.getDate()).padStart(2, "0");
    const month = timestamp.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  }

  // Function to save task details to local storage
  function saveTask(taskDetails) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.unshift(taskDetails); // Add task to the beginning of the array
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1); // Remove task at the specified index
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayCompletedTasks(); // Re-display tasks after deletion
  }

  // Function to display completed tasks from local storage
  function displayCompletedTasks() {
    completedTasksContainer.innerHTML = ""; // Clear existing tasks
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task,index) => {
      const taskList = document.createElement("ul");
      const startDate = new Date(task.startTime);
      const endDate = new Date(task.endTime);
      
      taskList.innerHTML = `
        <li id="eachTask">
          <div id="completedtaskDetails-Container">
            <div id="taskDetails">
              <h2 id="taskTitle">${task.title}</h2>
              <h2 id="TotalTime">Time Spent: ${formatElapsedTime(task.elapsedTime)}</h2>
            </div>
            <div id="dateTime-Container">
              <h2 id="date">${formatDate(startDate)}</h2>
              <div id="Time-Container">
                <h2 id="StartTime">${formatTime(startTime)}</h2>
                <p>-</p>
                <h2 id="EndTime">${formatTime(endDate)}</h2>
              </div>
            </div>
          </div>
          <button class="deleteButton" data-index="${index}"><i class="fa fa-trash" aria-hidden="true"></i> DELETE</button>
        </li>
      `;
      completedTasksContainer.appendChild(taskList);
    });

    attachDeleteButtonListeners();
  }

  // Event listener for START button click
  startButton.addEventListener("click", function () {
    startTimer();
    startButton.disabled = true; // Disable the START button
    taskTitleInput.disabled = true; // Disable the task input field
  });

  // Event listener for STOP button click
  stopButton.addEventListener("click", function () {
    stopTimer();
    startButton.disabled = false; // Enable the START button
    taskTitleInput.disabled = false; // Enable the task input field
  });

  function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach(button => {
      button.addEventListener("click", function (e) {
        const index = parseInt(e.target.dataset.index); // Extract index from data-index attribute
        deleteTask(index);
      });
    });
  }

  attachDeleteButtonListeners();
  // Display completed tasks on page load 
  displayCompletedTasks();
});
