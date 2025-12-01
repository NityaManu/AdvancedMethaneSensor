const ctx = document.getElementById('sensorChart').getContext('2d');
const sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Methane Concentration (ppm)',
            data: [],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            fill: true,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'PPM' }, beginAtZero: true }
        }
    }
});

// Fetch and Update Sensor Data
async function fetchSensorData() {
    try {
        let response = await fetch("http://192.168.182.124/data"); // Replace with ESP32 IP
        let ppmValue = await response.text();

        console.log("Fetched PPM Value:", ppmValue); // Debugging log

        if (!isNaN(parseFloat(ppmValue))) {
            updateDashboard(parseFloat(ppmValue));
        } else {
            console.error("Invalid PPM value received:", ppmValue);
        }
    } catch (error) {
        console.error("Error fetching sensor data:", error);
    }
}

// Update Table, Chart, and Grouped History with Seconds
// Update Table, Chart, and Grouped History with Seconds
// Function to update the table with new data
function updateTable(ppmValue, fullTime) {
    const tableBody = document.getElementById("sensorTableBody");

    // Check if the table body exists
    if (!tableBody) {
        console.error("❌ Table body not found!");
        return;
    }

    // Create a new table row
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${fullTime}</td>
        <td>${ppmValue}</td>
    `;

    // Add the new row to the table
    tableBody.appendChild(newRow);

    console.log("✅ Table updated with:", fullTime, ppmValue);
}

// Update Table, Chart, and Grouped History with Seconds
function updateDashboard(ppmValue) {
    const now = new Date();
    const minutesKey = now.getHours() + ":" + now.getMinutes(); // Example: "10:30"
    const fullTime = now.toLocaleTimeString(); // Example: "10:30:12 AM"

    // Fetch existing history
    let history = JSON.parse(localStorage.getItem("sensorHistory")) || {};

    // Ensure history is an object
    if (typeof history !== "object" || Array.isArray(history)) {
        history = {};
    }

    // Ensure `history[minutesKey]` is an array before adding data
    if (!Array.isArray(history[minutesKey])) {
        history[minutesKey] = [];
    }

    // Store the new value in the correct format
    history[minutesKey].push(`${fullTime} - ${ppmValue}`);

    // Save to localStorage
    localStorage.setItem("sensorHistory", JSON.stringify(history));

    // Update History & Table
    displayHistory();
    updateTable(ppmValue, fullTime);
}


// Load and Display Grouped History
// Load and Display Grouped History with Clickable Time
function displayHistory() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = ""; // Clear previous content

    let history = JSON.parse(localStorage.getItem("sensorHistory")) || {};

    Object.keys(history).forEach(minutesKey => {
        // Create the clickable time entry
        let historyEntry = document.createElement("div");
        historyEntry.className = "chat-message";
        historyEntry.innerHTML = `<strong class="clickable-time">${minutesKey}</strong>`;

        
        // Create a hidden div to hold the detailed timestamps
        let detailsDiv = document.createElement("div");
        detailsDiv.className = "history-details hidden"; // Initially hidden
        detailsDiv.innerHTML = history[minutesKey].join("<br>"); // Add values with line breaks
        
        // Toggle visibility when time is clicked
        historyEntry.addEventListener("click", () => {
            detailsDiv.classList.toggle("hidden");
        });

        chatContainer.appendChild(historyEntry);
        chatContainer.appendChild(detailsDiv);
    });

    console.log("Loaded history:", history);
}


// Toggle History Sidebar
function toggleHistory() {
    const sidebar = document.getElementById('historySidebar');
    sidebar.classList.toggle('show');
    
    if (sidebar.classList.contains('show')) {
        displayHistory(); // Force refresh
        console.log("History sidebar opened, refreshing data...");
    }
}

// Fetch sensor data every 2 seconds
setInterval(fetchSensorData, 2000);

// Load history when page loads
window.onload = displayHistory;
