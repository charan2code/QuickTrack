document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const taskTitleInput = document.getElementById("taskTitle");
  const inProgressTaskTitle = document.getElementById("progress-taskTitle");
  const startTimeDisplay = document.getElementById("StartTime");
  const elapsedTimeDisplay = document.getElementById("ElapsedTime");
  const completedTasksContainer = document.getElementById("tasks");
  const manualTaskTitleInput = document.getElementById("manualtaskTitle");
  const fromTimeInput = document.getElementById("FromTime");
  const toTimeInput = document.getElementById("ToTime");
  const dateInput = document.getElementById("date");
  const inProgressSection = document.getElementById("InProgresTab");
  const inProgressText = document.getElementById("Inprogress-text");
  const userMessage = document.getElementById("userMessage");
  const addTaskButton = document.getElementById("addtaskButton");
  const manualTaskSection = document.getElementById("manualtask");
  const barGraphCanvas = document.getElementById("barGraph");



  let startTime;
  let timerInterval;
  let currentTaskTitle;

  //hiding Add Task Manually Section Display
  manualTaskSection.style.display = "none";

  //Displaying and Clearing User Error Message
  function displayUserMessage(message) {
    userMessage.textContent = message;
    userMessage.style.display = "block";
  }

  function clearUserMessage() {
    userMessage.textContent = "";
    userMessage.style.display = "none";
  }

  // Function to start the timer
  function startTimer() {
    startTime = new Date();
    startTimeDisplay.textContent = formatTime(startTime);
    currentTaskTitle = taskTitleInput.value; 
    inProgressTaskTitle.textContent = currentTaskTitle;
    timerInterval = setInterval(updateElapsedTime, 1000);

    // Show In-Progress Section
    inProgressText.style.display = "block";
    inProgressSection.style.display = "block";
  }

  // Function to stop the timer
  function stopTimer() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const elapsedTime = endTime - startTime;
    const taskTitle = taskTitleInput.value;
    const taskDetails = {
      title: currentTaskTitle,
      startTime: startTime,
      endTime: endTime,
      elapsedTime: elapsedTime,
    };
    saveTask(taskDetails);
    displayCompletedTasks();

    // Hide the in-progress section
    inProgressSection.style.display = "none";
    inProgressText.style.display = "none";

    // Clear contents of the in-progress section
    inProgressTaskTitle.textContent = "";
    startTimeDisplay.textContent = "";
    elapsedTimeDisplay.textContent = "";
  }

  // Function to update the elapsed time display
  function updateElapsedTime() {
    const currentTime = new Date();
    const elapsedTime = currentTime - startTime;
    elapsedTimeDisplay.textContent = formatElapsedTime(elapsedTime);
  }

  // Function to format time in HH:MM format
  function formatTime(timestamp) {
    const hours = String(timestamp.getHours()).padStart(2, "0");
    const minutes = String(timestamp.getMinutes()).padStart(2, "0");
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

  // Function to add a manual task
  function addManualTask() {
    const title = manualTaskTitleInput.value;
    const fromTime = fromTimeInput.value;
    const toTime = toTimeInput.value;
    const date = dateInput.value;

    if (!title || !fromTime || !toTime || !date) {
      displayUserMessage("All fields are required to add a manual task.");
      return;
    }
    clearUserMessage();

    const startDate = new Date(`${date}T${fromTime}`);
    const endDate = new Date(`${date}T${toTime}`);

    const elapsedTime = endDate - startDate;

    const taskDetails = {
      title: title,
      startTime: startDate,
      endTime: endDate,
      elapsedTime: elapsedTime,
    };

    saveTask(taskDetails);
    displayCompletedTasks();
  }

  //Delete Function
  function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1); // Remove task at the specified index
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayCompletedTasks(); // Re-display tasks after deletion
  }

  //Sorting Function
  function sortTasks(tasks) {
  tasks.sort((a, b) => {
    //Setting time to 00:00:00:00 of both A and B to compare dates first 
    const startDateA = new Date(a.startTime).setHours(0, 0, 0, 0); 
    const startDateB = new Date(b.startTime).setHours(0, 0, 0, 0); 
    const startTimeA = new Date(a.startTime).getTime();
    const startTimeB = new Date(b.startTime).getTime();
    const endTimeA = new Date(a.endTime).getTime();
    const endTimeB = new Date(b.endTime).getTime();

    // First compare start dates
    if (startDateA !== startDateB) {
      return startDateB - startDateA;
    }

    // If start dates are equal, compare start times
    if (startTimeA !== startTimeB) {
      return startTimeB - startTimeA;
    }

    // If start times are equal, compare end times
    return endTimeB - endTimeA;
  });
  }

  // Function to display completed tasks from local storage
  function displayCompletedTasks() {
    completedTasksContainer.innerHTML = ""; // Clear existing tasks
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    sortTasks(tasks);
    
    // Sort tasks by completion time in descending order
    tasks.forEach((task, index) => {
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
                <h2 id="StartTime">${formatTime(startDate)}</h2>
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
    // Update the bar graph
    updateBarGraph(tasks);

  }

  function updateBarGraph(tasks) {
    // Check if window.barGraph is defined and is an instance of Chart
    if (window.barGraph instanceof Chart) {
      // Destroy existing chart
      window.barGraph.destroy();
    }
  
    // Get today's date
    const today = new Date();
  
    // Set time to 00:00:00
    today.setHours(0, 0, 0, 0);
  
    // Subtract 6 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
  
    // Initialize an array to store total time spent for each day
    const data = Array(7).fill(0);
  
    // Loop through tasks and sum up time spent for each day
    tasks.forEach((task) => {
      const taskDate = new Date(task.startTime);
      if (taskDate >= sevenDaysAgo && taskDate <= today) {
        const dayIndex = Math.floor((taskDate - sevenDaysAgo) / (24 * 60 * 60 * 1000));
        data[dayIndex] += task.elapsedTime / (60 * 60 * 1000); // Convert time to hours
      }
      if (taskDate > today){
        data[6] += task.elapsedTime / (60 * 60 * 1000);
      }
    });
  
    // Prepare labels for the bar graph (last 7 days)
    const labels = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sevenDaysAgo);
      day.setDate(sevenDaysAgo.getDate() + i);
      labels.push(formatDate(day));
    }
  
    // Create the bar graph
    window.barGraph = new Chart(barGraphCanvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Time Spent (in hours)",
            data: data,
            backgroundColor: "#3e95cd",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Time Spent (hours)",
            },
            ticks: {
              stepSize: 1, // Display ticks in steps of 1 hour
            },
          },
        },
      },
    });
    }

  // Event listener for START button click
  startButton.addEventListener("click", function () {
    if (!taskTitleInput.value) {
      displayUserMessage("Please enter a task title.");
      return; // Exit the function if title is not entered
    }
    clearUserMessage();
    startTimer();
    // Disable the START button and Tast Tiltle Input
    startButton.disabled = true; 
    startButton.style.backgroundColor = "#222"; 
    startButton.style.pointerEvents = "none"; 
    taskTitleInput.disabled = true; // Disable the task input field
    taskTitleInput.value = ""; 
  });

  // Event listener for STOP button click
  stopButton.addEventListener("click", function () {
    stopTimer();
    // Enable the START button and Tast Tiltle Input
    startButton.disabled = false; 
    startButton.style.backgroundColor = ""; 
    startButton.style.pointerEvents = "";
    taskTitleInput.disabled = false; 
  });

  // Event listener for ADD button click for manual task addition
  document.getElementById("addButton").addEventListener("click", function () {
    addManualTask();
    manualTaskTitleInput.value= "";
    fromTimeInput.value= "";
    toTimeInput.value= "";
    dateInput.value= "";
  });

  // Event listener for the "ADD TASK" button click
  addTaskButton.addEventListener("click", function () {
    // Toggle the visibility of the manual task section
    if (manualTaskSection.style.display === "none") {
      manualTaskSection.style.display = "flex";
    } else {
      manualTaskSection.style.display = "none";
    }
  });

  // Adding index to all delete buttons
  function attachDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach(button => {
      button.addEventListener("click", function (e) {
        const index = parseInt(e.target.dataset.index); 
        deleteTask(index);
      });
    });
  }

  attachDeleteButtonListeners();

  // Display completed tasks on page load
  displayCompletedTasks();
});
