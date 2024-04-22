function retrieveTasks() {
  const tasksJSON = localStorage.getItem("tasks");
  if (tasksJSON) {
      return JSON.parse(tasksJSON);
  } else {
      return [];
  }
}

function formatDate(timestamp) {
  const day = String(timestamp.getDate()).padStart(2, "0");
  const month = timestamp.toLocaleString('default', { month: 'short' });
  return `${day} ${month}`;
}

function updateBarGraph(tasks,barGraphCanvas) {
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

document.addEventListener("DOMContentLoaded", function () {
  const barGraphCanvas = document.getElementById("barGraph");
  const tasks = retrieveTasks();
  console.log(tasks);
  updateBarGraph(tasks,barGraphCanvas);
})